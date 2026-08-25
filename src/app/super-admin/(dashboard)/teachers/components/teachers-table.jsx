"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Plus, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { classLabel } from "@/lib/classes";
import { SUBJECTS } from "@/lib/homework/subjects";
import { getInitials, teacherFullName } from "@/lib/teacher";

const STATUS_META = {
  ACTIVE: { label: "Active", variant: "success" },
  PENDING: { label: "Pending", variant: "warning" },
  REJECTED: { label: "Rejected", variant: "destructive" },
};

function TeacherActionsMenu({ teacher, pending, onAssign, onSetStatus }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" disabled={pending}>
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onAssign}>Assign</DropdownMenuItem>
        <DropdownMenuSeparator />
        {teacher.status === "PENDING" ? (
          <>
            <DropdownMenuItem onSelect={() => onSetStatus("ACTIVE")}>Approve</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => onSetStatus("REJECTED")}
            >
              Reject
            </DropdownMenuItem>
          </>
        ) : teacher.status === "ACTIVE" ? (
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => onSetStatus("REJECTED")}
          >
            Revoke
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={() => onSetStatus("ACTIVE")}>Re-approve</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TeachersTable({ initialTeachers, classes }) {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [assigningTeacher, setAssigningTeacher] = useState(null);
  const [pendingId, setPendingId] = useState(null);

  async function setStatus(teacher, status) {
    setPendingId(teacher.id);
    try {
      const res = await fetch(`/api/super-admin/teachers/${teacher.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setTeachers((prev) => prev.map((t) => (t.id === teacher.id ? data.item : t)));
      toast.success(
        status === "ACTIVE"
          ? "Teacher approved"
          : status === "REJECTED"
            ? "Access revoked"
            : "Status updated",
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPendingId(null);
    }
  }

  function updateAssignments(teacherId, assignments) {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, teacherAssignments: assignments } : t)),
    );
    setAssigningTeacher((prev) =>
      prev && prev.id === teacherId ? { ...prev, teacherAssignments: assignments } : prev,
    );
  }

  if (teachers.length === 0) {
    return <p className="text-sm text-muted-foreground">No teacher accounts yet.</p>;
  }

  return (
    <>
      {/* Mobile: stacked cards — a table can't shrink to fit a phone
          screen without either clipping columns or forcing horizontal
          scroll, so below md we switch to one card per item instead. */}
      <div className="space-y-3 md:hidden">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="space-y-3 rounded-xl border p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-8">
                  {teacher.photoUrl ? <AvatarImage src={teacher.photoUrl} alt="" /> : null}
                  <AvatarFallback>
                    {getInitials(teacher.firstName, teacher.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{teacherFullName(teacher) || "—"}</p>
                  <p className="truncate text-xs text-muted-foreground">{teacher.email}</p>
                </div>
              </div>
              <TeacherActionsMenu
                teacher={teacher}
                pending={pendingId === teacher.id}
                onAssign={() => setAssigningTeacher(teacher)}
                onSetStatus={(status) => setStatus(teacher, status)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pl-11 text-sm text-muted-foreground">
              <span>{teacher.phone ?? "—"}</span>
              <span>·</span>
              <Badge variant={STATUS_META[teacher.status].variant}>
                {STATUS_META[teacher.status].label}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1 pl-11">
              {teacher.teacherAssignments.length === 0 ? (
                <span className="text-xs text-muted-foreground">No assignments</span>
              ) : (
                teacher.teacherAssignments.map((a) => (
                  <Badge key={a.id} variant="outline">
                    {classLabel(classes, a.class)} · {a.subject}
                  </Badge>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/tablet: full table. */}
      <div className="hidden rounded-xl border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead className="w-0">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      {teacher.photoUrl ? <AvatarImage src={teacher.photoUrl} alt="" /> : null}
                      <AvatarFallback>
                        {getInitials(teacher.firstName, teacher.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {teacherFullName(teacher) || "—"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{teacher.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{teacher.phone ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_META[teacher.status].variant}>
                    {STATUS_META[teacher.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {teacher.teacherAssignments.length === 0 ? (
                    <span className="text-xs text-muted-foreground">None</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {teacher.teacherAssignments.map((a) => (
                        <Badge key={a.id} variant="outline">
                          {classLabel(classes, a.class)} · {a.subject}
                        </Badge>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <TeacherActionsMenu
                    teacher={teacher}
                    pending={pendingId === teacher.id}
                    onAssign={() => setAssigningTeacher(teacher)}
                    onSetStatus={(status) => setStatus(teacher, status)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AssignmentsDialog
        teacher={assigningTeacher}
        classes={classes}
        onClose={() => setAssigningTeacher(null)}
        onChange={updateAssignments}
      />
    </>
  );
}

function AssignmentsDialog({ teacher, classes, onClose, onChange }) {
  const [classValue, setClassValue] = useState(classes[0]?.value ?? "");
  const [subject, setSubject] = useState(SUBJECTS[0]?.value ?? "");
  const [saving, setSaving] = useState(false);

  async function addAssignment() {
    if (!teacher || !classValue || !subject) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/super-admin/teachers/${teacher.id}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ class: classValue, subject }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't add assignment");
      const exists = teacher.teacherAssignments.some((a) => a.id === data.item.id);
      onChange(
        teacher.id,
        exists
          ? teacher.teacherAssignments
          : [...teacher.teacherAssignments, data.item],
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeAssignment(assignmentId) {
    if (!teacher) return;
    try {
      const res = await fetch(
        `/api/super-admin/teachers/${teacher.id}/assignments/${assignmentId}`,
        { method: "DELETE" },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't remove assignment");
      onChange(
        teacher.id,
        teacher.teacherAssignments.filter((a) => a.id !== assignmentId),
      );
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <Dialog open={Boolean(teacher)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign classes/subjects</DialogTitle>
        </DialogHeader>
        {teacher ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {teacherFullName(teacher) || teacher.email}
            </p>

            {teacher.teacherAssignments.length > 0 ? (
              <ul className="space-y-2">
                {teacher.teacherAssignments.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <span>
                      {classLabel(classes, a.class)} · {a.subject}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => removeAssignment(a.id)}
                    >
                      <X className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No assignments yet.</p>
            )}

            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-1">
                <Select value={classValue} onValueChange={setClassValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-1">
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" size="icon" disabled={saving} onClick={addAssignment}>
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
