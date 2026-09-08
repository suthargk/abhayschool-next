"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  UserPlus,
  X,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
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
import { displayPhone } from "@/lib/phone";
import { getInitials, teacherFullName } from "@/lib/teacher";
import { TEACHER_FEATURE_GROUPS, TEACHER_FEATURES } from "@/lib/teacher-features";
import { toTitleCase } from "@/lib/text-case";
import { cn } from "@/lib/utils";

// Groups a teacher's flat list of {class, subject} assignment rows by class,
// so the table can show "Class II · 5 subjects" instead of one badge per row
// — a teacher registering with several classes/subjects selected can easily
// end up with 20+ rows, which made the table cell (and the assign dialog's
// list) unbounded and messy.
//
// Groups and subjects-within-a-group are ordered to match `classes`/
// `subjects` (the admin-configured order from the Classes/Subjects pages,
// already sorted by position) rather than alphabetically, so this list
// reads the same order an admin sees everywhere else. A class/subject that
// no longer exists in the current list (renamed/deleted) sorts last instead
// of throwing.
function groupAssignmentsByClass(assignments, classes, subjects = []) {
  const classOrder = new Map(classes.map((c, i) => [c.value, i]));
  const subjectOrder = new Map(subjects.map((s, i) => [s.label, i]));
  const orderOf = (map, key) => map.get(key) ?? Number.MAX_SAFE_INTEGER;

  const byClass = new Map();
  for (const a of assignments) {
    if (!byClass.has(a.class)) byClass.set(a.class, []);
    byClass.get(a.class).push(a);
  }
  return [...byClass.entries()]
    .map(([classValue, items]) => ({
      classValue,
      label: classLabel(classes, classValue),
      items: items.sort((a, b) => orderOf(subjectOrder, a.subject) - orderOf(subjectOrder, b.subject)),
    }))
    .sort((a, b) => orderOf(classOrder, a.classValue) - orderOf(classOrder, b.classValue));
}

const STATUS_VARIANTS = {
  ACTIVE: "success",
  INVITED: "outline",
  PENDING: "warning",
  REJECTED: "destructive",
};

// Maps the group labels defined in @/lib/teacher-features (English text) to
// the matching key in common.teacherFeatureGroups, since that file can't be
// edited to carry translation keys directly.
const GROUP_LABEL_KEYS = {
  Homepage: "homepage",
  "About the school": "aboutSchool",
  Academics: "academics",
  "Media & updates": "mediaUpdates",
  Achievements: "achievements",
};

function TeacherActionsMenu({
  teacher,
  pending,
  onAssign,
  onPermissions,
  onSetStatus,
  onResendInvite,
  onCancelInvite,
  onDelete,
}) {
  const t = useTranslations("superAdminDashboard.teachers.table");
  const tCommon = useTranslations("common.actions");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" disabled={pending}>
          <MoreHorizontal className="size-4" />
          <span className="sr-only">{tCommon("openMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onAssign}>{t("assign")}</DropdownMenuItem>
        <DropdownMenuItem onSelect={onPermissions}>{t("permissions")}</DropdownMenuItem>
        <DropdownMenuSeparator />
        {teacher.status === "INVITED" ? (
          <>
            <DropdownMenuItem onSelect={onResendInvite}>{t("resendInvite")}</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={onCancelInvite}
            >
              {t("cancelInvite")}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {teacher.status === "PENDING" ? (
              <>
                <DropdownMenuItem onSelect={() => onSetStatus("ACTIVE")}>{t("approve")}</DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => onSetStatus("REJECTED")}
                >
                  {t("reject")}
                </DropdownMenuItem>
              </>
            ) : teacher.status === "ACTIVE" ? (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => onSetStatus("REJECTED")}
              >
                {t("revoke")}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onSelect={() => onSetStatus("ACTIVE")}>{t("reApprove")}</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={onDelete}>
              {tCommon("delete")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AssignedSummary({ assignments, classes, subjects, max = 3 }) {
  const t = useTranslations("superAdminDashboard.teachers.table");
  if (assignments.length === 0) {
    return <span className="text-xs text-muted-foreground">{t("noneAssigned")}</span>;
  }
  const groups = groupAssignmentsByClass(assignments, classes, subjects);
  const shown = groups.slice(0, max);
  const hiddenCount = groups.length - shown.length;
  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((g) => (
        <Badge
          key={g.classValue}
          variant="outline"
          title={g.items.map((a) => a.subject).join(", ")}
        >
          {g.label} · {t("subjectCount", { count: g.items.length })}
        </Badge>
      ))}
      {hiddenCount > 0 ? (
        <Badge variant="secondary">{t("moreClasses", { count: hiddenCount })}</Badge>
      ) : null}
    </div>
  );
}

const STATUS_LABEL_KEYS = {
  ACTIVE: "statusActive",
  INVITED: "statusInvited",
  PENDING: "statusPending",
  REJECTED: "statusRejected",
};

function buildHref(params) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    usp.set(key, String(value));
  });
  const qs = usp.toString();
  return qs ? `/super-admin/teachers?${qs}` : "/super-admin/teachers";
}

export function TeachersTable({
  items,
  classes,
  subjects = [],
  search,
  status,
  page,
  totalPages,
  total,
  pageSize,
  defaultPageSize,
}) {
  const t = useTranslations("superAdminDashboard.teachers.table");
  const tTable = useTranslations("common.table");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [teachers, setTeachers] = useState(items);
  const [searchValue, setSearchValue] = useState(search);
  const [assigningTeacher, setAssigningTeacher] = useState(null);
  const [permissioningTeacher, setPermissioningTeacher] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [resendingTeacher, setResendingTeacher] = useState(null);
  const [deletingTeacher, setDeletingTeacher] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [paginationPending, setPaginationPending] = useState(false);

  // The source of truth for which teachers are on this page/filter/search is
  // always the server (`items`) — re-sync whenever it changes (pagination,
  // filtering, or a router.refresh() below). Assign/permission edits still
  // patch this local copy directly (see updateAssignments/updatePermissions)
  // since those never change list membership or ordering.
  useEffect(() => {
    setTeachers(items);
  }, [items]);

  function navigate(overrides) {
    startTransition(() => {
      router.push(
        buildHref({
          q: search || undefined,
          status: status || undefined,
          pageSize: pageSize !== defaultPageSize ? pageSize : undefined,
          ...overrides,
        }),
      );
    });
  }

  function refreshList() {
    startTransition(() => {
      router.refresh();
    });
  }

  // Status changes, deletes, and invites change which page/row a teacher
  // belongs on, so they refetch from the server rather than patching local
  // state. If a removal empties the current page (and it isn't page 1),
  // step back a page instead of refreshing into a page with nothing on it.
  function refreshAfterRemoval() {
    if (teachers.length <= 1 && page > 1) {
      navigate({ page: page - 1 > 1 ? page - 1 : undefined });
    } else {
      refreshList();
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    navigate({ q: searchValue.trim() || undefined, page: undefined });
  }

  function handleStatusChangeFilter(value) {
    navigate({ status: value === "ALL" ? undefined : value, page: undefined });
  }

  async function setStatus(teacher, newStatus) {
    setPendingId(teacher.id);
    try {
      const res = await fetch(`/api/super-admin/teachers/${teacher.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("statusUpdateFailed"));
      toast.success(
        newStatus === "ACTIVE"
          ? t("toastApproved")
          : newStatus === "REJECTED"
            ? t("toastRevoked")
            : t("toastStatusUpdated"),
      );
      refreshList();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPendingId(null);
    }
  }

  function updateAssignments(teacherId, assignments) {
    setTeachers((prev) =>
      prev.map((item) => (item.id === teacherId ? { ...item, teacherAssignments: assignments } : item)),
    );
    setAssigningTeacher((prev) =>
      prev && prev.id === teacherId ? { ...prev, teacherAssignments: assignments } : prev,
    );
  }

  function updatePermissions(teacherId, permissions) {
    setTeachers((prev) =>
      prev.map((item) =>
        item.id === teacherId ? { ...item, teacherFeaturePermissions: permissions } : item,
      ),
    );
    setPermissioningTeacher((prev) =>
      prev && prev.id === teacherId ? { ...prev, teacherFeaturePermissions: permissions } : prev,
    );
  }

  function handleInvited() {
    refreshList();
  }

  function handleResent() {
    refreshList();
  }

  async function deleteTeacher(teacher, { successMessage, failMessage }) {
    const res = await fetch(`/api/super-admin/teachers/${teacher.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || failMessage);
    toast.success(successMessage);
    refreshAfterRemoval();
  }

  async function cancelInvite(teacher) {
    setPendingId(teacher.id);
    try {
      await deleteTeacher(teacher, {
        successMessage: t("toastInviteCancelled"),
        failMessage: t("cancelInviteFailed"),
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPendingId(null);
    }
  }

  async function confirmDelete() {
    if (!deletingTeacher) return;
    setDeleting(true);
    try {
      await deleteTeacher(deletingTeacher, {
        successMessage: t("toastDeleted"),
        failMessage: t("deleteFailed"),
      });
      setDeletingTeacher(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <form onSubmit={handleSearchSubmit} className="relative w-full min-w-[200px] flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pl-8"
            disabled={isPending}
          />
        </form>

        <div className="flex items-center gap-2">
          <Select value={status || "ALL"} onValueChange={handleStatusChangeFilter} disabled={isPending}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("allStatuses")}</SelectItem>
              <SelectItem value="ACTIVE">{t("statusActive")}</SelectItem>
              <SelectItem value="INVITED">{t("statusInvited")}</SelectItem>
              <SelectItem value="PENDING">{t("statusPending")}</SelectItem>
              <SelectItem value="REJECTED">{t("statusRejected")}</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" size="sm" onClick={() => setAddOpen(true)}>
            <UserPlus className="size-4" />
            {t("addTeacher")}
          </Button>
        </div>
      </div>

      {teachers.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          {total === 0 ? t("empty") : tTable("noResults")}
        </p>
      ) : (
        <div className="relative">
          {isPending || paginationPending ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/60">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : null}

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
                    onPermissions={() => setPermissioningTeacher(teacher)}
                    onSetStatus={(newStatus) => setStatus(teacher, newStatus)}
                    onResendInvite={() => setResendingTeacher(teacher)}
                    onCancelInvite={() => cancelInvite(teacher)}
                    onDelete={() => setDeletingTeacher(teacher)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pl-11 text-sm text-muted-foreground">
                  <span>{teacher.phone ? displayPhone(teacher.phone) : "—"}</span>
                  <span>·</span>
                  <Badge variant={STATUS_VARIANTS[teacher.status]}>
                    {t(STATUS_LABEL_KEYS[teacher.status])}
                  </Badge>
                </div>
                <div className="pl-11">
                  <AssignedSummary assignments={teacher.teacherAssignments} classes={classes} subjects={subjects} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/tablet: full table. */}
          <div className="hidden rounded-xl border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("columnTeacher")}</TableHead>
                  <TableHead>{t("columnPhone")}</TableHead>
                  <TableHead>{t("columnStatus")}</TableHead>
                  <TableHead>{t("columnAssigned")}</TableHead>
                  <TableHead className="w-0">{t("columnActions")}</TableHead>
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
                    <TableCell>{teacher.phone ? displayPhone(teacher.phone) : "—"}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[teacher.status]}>
                        {t(STATUS_LABEL_KEYS[teacher.status])}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <AssignedSummary assignments={teacher.teacherAssignments} classes={classes} subjects={subjects} />
                    </TableCell>
                    <TableCell>
                      <TeacherActionsMenu
                        teacher={teacher}
                        pending={pendingId === teacher.id}
                        onAssign={() => setAssigningTeacher(teacher)}
                        onPermissions={() => setPermissioningTeacher(teacher)}
                        onSetStatus={(newStatus) => setStatus(teacher, newStatus)}
                        onResendInvite={() => setResendingTeacher(teacher)}
                        onCancelInvite={() => cancelInvite(teacher)}
                        onDelete={() => setDeletingTeacher(teacher)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <DataTablePagination
        basePath="/super-admin/teachers"
        onPendingChange={setPaginationPending}
        search={search}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        defaultPageSize={defaultPageSize}
        extraParams={{ status: status || undefined }}
      />

      <AssignmentsDialog
        teacher={assigningTeacher}
        classes={classes}
        subjects={subjects}
        onClose={() => setAssigningTeacher(null)}
        onChange={updateAssignments}
      />

      <PermissionsDialog
        teacher={permissioningTeacher}
        onClose={() => setPermissioningTeacher(null)}
        onChange={updatePermissions}
      />

      <AddTeacherDialog open={addOpen} onOpenChange={setAddOpen} onCreated={handleInvited} />

      <ResendInviteDialog
        teacher={resendingTeacher}
        onClose={() => setResendingTeacher(null)}
        onSent={handleResent}
      />

      <TeacherDeleteDialog
        teacher={deletingTeacher}
        deleting={deleting}
        onOpenChange={(open) => !open && !deleting && setDeletingTeacher(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}

function TeacherDeleteDialog({ teacher, deleting, onOpenChange, onConfirm }) {
  const t = useTranslations("superAdminDashboard.teachers.table");
  const tCommon = useTranslations("common.actions");
  const tTable = useTranslations("common.table");

  return (
    <AlertDialog open={teacher !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {tTable("deleteConfirmTitle", { label: teacher ? teacherFullName(teacher) || teacher.email : "" })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {tTable("deleteConfirmDescription")} {t("deleteTeacherDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>{tCommon("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleting}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            className={buttonVariants({ variant: "destructive" })}
          >
            {deleting ? tCommon("deleting") : tCommon("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AssignmentsDialog({ teacher, classes, subjects, onClose, onChange }) {
  const t = useTranslations("superAdminDashboard.teachers.table");
  const [addClasses, setAddClasses] = useState([]);
  const [addSubjects, setAddSubjects] = useState([]);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [removingClass, setRemovingClass] = useState(null);

  const anyPending = saving || removingId !== null || removingClass !== null;

  function reset() {
    setAddClasses([]);
    setAddSubjects([]);
  }

  async function addAssignments() {
    if (!teacher || addClasses.length === 0 || addSubjects.length === 0) return;
    const existing = new Set(teacher.teacherAssignments.map((a) => `${a.class}::${a.subject}`));
    const pairs = addClasses
      .flatMap((classValue) => addSubjects.map((subject) => ({ class: classValue, subject })))
      .filter((p) => !existing.has(`${p.class}::${p.subject}`));
    if (pairs.length === 0) {
      reset();
      return;
    }

    setSaving(true);
    try {
      const results = await Promise.all(
        pairs.map((pair) =>
          fetch(`/api/super-admin/teachers/${teacher.id}/assignments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pair),
          }).then(async (res) => ({ ok: res.ok, item: (await res.json().catch(() => ({}))).item })),
        ),
      );
      const addedIds = new Set(teacher.teacherAssignments.map((a) => a.id));
      const added = results.filter((r) => r.ok && r.item && !addedIds.has(r.item.id)).map((r) => r.item);
      if (added.length > 0) {
        onChange(teacher.id, [...teacher.teacherAssignments, ...added]);
      }
      const failed = pairs.length - results.filter((r) => r.ok).length;
      if (failed > 0) toast.error(t("assignmentAddFailedCount", { count: failed }));
      reset();
    } finally {
      setSaving(false);
    }
  }

  async function removeAssignment(assignmentId) {
    if (!teacher) return;
    setRemovingId(assignmentId);
    try {
      const res = await fetch(
        `/api/super-admin/teachers/${teacher.id}/assignments/${assignmentId}`,
        { method: "DELETE" },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t("assignmentRemoveFailed"));
      onChange(
        teacher.id,
        teacher.teacherAssignments.filter((a) => a.id !== assignmentId),
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRemovingId(null);
    }
  }

  async function removeClassGroup(group) {
    if (!teacher) return;
    setRemovingClass(group.classValue);
    try {
      const results = await Promise.all(
        group.items.map((a) =>
          fetch(`/api/super-admin/teachers/${teacher.id}/assignments/${a.id}`, {
            method: "DELETE",
          }).then((res) => ({ ok: res.ok, id: a.id })),
        ),
      );
      const removedIds = new Set(results.filter((r) => r.ok).map((r) => r.id));
      onChange(
        teacher.id,
        teacher.teacherAssignments.filter((a) => !removedIds.has(a.id)),
      );
      const failed = group.items.length - removedIds.size;
      if (failed > 0) toast.error(t("assignmentRemoveFailed"));
    } finally {
      setRemovingClass(null);
    }
  }

  const groups = teacher ? groupAssignmentsByClass(teacher.teacherAssignments, classes, subjects) : [];

  return (
    <Dialog
      open={Boolean(teacher)}
      onOpenChange={(open) => {
        if (!open && !anyPending) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("assignDialogTitle")}</DialogTitle>
        </DialogHeader>
        {teacher ? (
          <div className="flex min-h-0 flex-1 flex-col gap-4">
            <p className="shrink-0 text-sm text-muted-foreground">
              {teacherFullName(teacher) || teacher.email}
            </p>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-md border p-3">
              {groups.length > 0 ? (
                groups.map((group) => (
                  <div key={group.classValue} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{group.label}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                        disabled={anyPending}
                        onClick={() => removeClassGroup(group)}
                        title={t("removeClass")}
                      >
                        {removingClass === group.classValue ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <X className="size-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((a) => (
                        <Badge key={a.id} variant="secondary" className="gap-1">
                          {a.subject}
                          <button
                            type="button"
                            disabled={anyPending}
                            onClick={() => removeAssignment(a.id)}
                            className="rounded-full hover:text-destructive disabled:opacity-50"
                          >
                            {removingId === a.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <X className="size-3" />
                            )}
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t("noAssignmentsYet")}</p>
              )}
            </div>

            <div className="shrink-0 space-y-3 rounded-md border p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("addAssignmentsHeading")}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="assign-classes">{t("classesLabel")}</Label>
                  <MultiSelect
                    id="assign-classes"
                    options={classes.map((c) => ({ value: c.value, label: c.label }))}
                    values={addClasses}
                    onChange={setAddClasses}
                    placeholder={t("classesPlaceholder")}
                    emptyText={t("classesEmpty")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="assign-subjects">{t("subjectsLabel")}</Label>
                  <MultiSelect
                    id="assign-subjects"
                    options={subjects.map((s) => ({ value: s.label, label: s.label }))}
                    values={addSubjects}
                    onChange={setAddSubjects}
                    placeholder={t("subjectsPlaceholder")}
                    emptyText={t("subjectsEmpty")}
                  />
                </div>
              </div>
              <Button
                type="button"
                className="w-full sm:w-auto"
                disabled={anyPending || addClasses.length === 0 || addSubjects.length === 0}
                onClick={addAssignments}
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                {t("addAssignments")}
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function PermissionsDialog({ teacher, onClose, onChange }) {
  const t = useTranslations("superAdminDashboard.teachers.table");
  const tFeatures = useTranslations("common.teacherFeatures");
  const tGroups = useTranslations("common.teacherFeatureGroups");
  const [pendingFeature, setPendingFeature] = useState(null);
  const [bulkPending, setBulkPending] = useState(false);

  const grantedKeys = teacher
    ? new Set(teacher.teacherFeaturePermissions.map((p) => p.feature))
    : new Set();
  const grantedCount = grantedKeys.size;
  const totalCount = TEACHER_FEATURES.length;
  const anyPending = bulkPending || pendingFeature !== null;

  async function toggleFeature(feature, granted) {
    if (!teacher) return;
    setPendingFeature(feature);
    try {
      if (granted) {
        const res = await fetch(`/api/super-admin/teachers/${teacher.id}/permissions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feature }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t("grantFailed"));
        const exists = teacher.teacherFeaturePermissions.some((p) => p.id === data.item.id);
        onChange(
          teacher.id,
          exists
            ? teacher.teacherFeaturePermissions
            : [...teacher.teacherFeaturePermissions, data.item],
        );
      } else {
        const res = await fetch(
          `/api/super-admin/teachers/${teacher.id}/permissions/${feature}`,
          { method: "DELETE" },
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || t("revokeFailed"));
        onChange(
          teacher.id,
          teacher.teacherFeaturePermissions.filter((p) => p.feature !== feature),
        );
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPendingFeature(null);
    }
  }

  async function setAllFeatures(grant) {
    if (!teacher) return;
    const targets = TEACHER_FEATURES.map((f) => f.key).filter((key) =>
      grant ? !grantedKeys.has(key) : grantedKeys.has(key),
    );
    if (targets.length === 0) return;

    setBulkPending(true);
    try {
      if (grant) {
        const results = await Promise.all(
          targets.map((feature) =>
            fetch(`/api/super-admin/teachers/${teacher.id}/permissions`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ feature }),
            }).then(async (res) => ({ ok: res.ok, item: (await res.json().catch(() => ({}))).item })),
          ),
        );
        const granted = results.filter((r) => r.ok && r.item).map((r) => r.item);
        onChange(teacher.id, [...teacher.teacherFeaturePermissions, ...granted]);
        const failed = targets.length - granted.length;
        if (failed) toast.error(t("grantFailedCount", { count: failed }));
      } else {
        const results = await Promise.all(
          targets.map((feature) =>
            fetch(`/api/super-admin/teachers/${teacher.id}/permissions/${feature}`, {
              method: "DELETE",
            }).then((res) => ({ ok: res.ok, feature })),
          ),
        );
        const removedKeys = new Set(results.filter((r) => r.ok).map((r) => r.feature));
        onChange(
          teacher.id,
          teacher.teacherFeaturePermissions.filter((p) => !removedKeys.has(p.feature)),
        );
        const failed = targets.length - removedKeys.size;
        if (failed) toast.error(t("revokeFailedCount", { count: failed }));
      }
    } finally {
      setBulkPending(false);
    }
  }

  return (
    <Dialog open={Boolean(teacher)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("permissionsDialogTitle")}</DialogTitle>
        </DialogHeader>
        {teacher ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">
                {t("permissionsDescription", {
                  name: teacherFullName(teacher) || teacher.email,
                })}
              </p>
              <Badge variant="outline" className="shrink-0">
                {grantedCount}/{totalCount}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={anyPending || grantedCount === totalCount}
                onClick={() => setAllFeatures(true)}
              >
                {bulkPending ? <Loader2 className="size-3.5 animate-spin" /> : null}
                {t("selectAll")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={anyPending || grantedCount === 0}
                onClick={() => setAllFeatures(false)}
              >
                {t("clearAll")}
              </Button>
            </div>

            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              {TEACHER_FEATURE_GROUPS.map((group) => (
                <div key={group.label} className="space-y-1.5">
                  <p className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {tGroups(GROUP_LABEL_KEYS[group.label] ?? group.label)}
                  </p>
                  <div className="grid gap-1 sm:grid-cols-2">
                    {group.keys.map((key) => {
                      const feature = TEACHER_FEATURES.find((f) => f.key === key);
                      const Icon = feature.icon;
                      const checked = grantedKeys.has(key);
                      const isPending = pendingFeature === key;
                      return (
                        <label
                          key={key}
                          htmlFor={`permission-${key}`}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 text-sm transition-colors hover:bg-muted/50",
                            checked ? "border-primary/30 bg-primary/5" : "border-transparent",
                          )}
                        >
                          <Icon className="size-4 shrink-0 text-muted-foreground" />
                          <span className="flex-1">{tFeatures(key)}</span>
                          {isPending ? (
                            <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
                          ) : (
                            <Checkbox
                              id={`permission-${key}`}
                              checked={checked}
                              disabled={anyPending}
                              onCheckedChange={(next) => toggleFeature(key, Boolean(next))}
                            />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function AddTeacherDialog({ open, onOpenChange, onCreated }) {
  const t = useTranslations("superAdminDashboard.teachers.table");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  function reset() {
    setFirstName("");
    setLastName("");
    setEmail("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/super-admin/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("inviteFailed"));
      onCreated(data.item);
      toast.success(t("toastInvited"));
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !saving && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addDialogTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("addDialogDescription")}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="add-teacher-first-name">{t("firstNameLabel")}</Label>
              <Input
                id="add-teacher-first-name"
                value={firstName}
                onChange={(e) => setFirstName(toTitleCase(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-teacher-last-name">{t("lastNameLabel")}</Label>
              <Input
                id="add-teacher-last-name"
                value={lastName}
                onChange={(e) => setLastName(toTitleCase(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-teacher-email">{t("emailLabel")}</Label>
            <Input
              id="add-teacher-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? t("sending") : t("sendInvite")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ResendInviteDialog({ teacher, onClose, onSent }) {
  const t = useTranslations("superAdminDashboard.teachers.table");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!teacher) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/super-admin/teachers/${teacher.id}/resend-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || teacher.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("inviteFailed"));
      onSent(data.item);
      toast.success(t("toastInviteSent"));
      setEmail("");
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={Boolean(teacher)} onOpenChange={(open) => !open && !saving && onClose()}>
      <DialogContent key={teacher?.id ?? "closed"}>
        <DialogHeader>
          <DialogTitle>{t("resendDialogTitle")}</DialogTitle>
        </DialogHeader>
        {teacher ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">{t("resendDialogDescription")}</p>
            <div className="space-y-1.5">
              <Label htmlFor="resend-invite-email">{t("emailLabel")}</Label>
              <Input
                id="resend-invite-email"
                type="email"
                defaultValue={teacher.email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? t("sending") : t("resendInvite")}
            </Button>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
