"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function BusRouteTable({ routes, routeNumbers }) {
  const t = useTranslations("busRoutePlan");
  const [search, setSearch] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("all");

  const hasActiveFilters = search.trim() !== "" || selectedRoute !== "all";

  function clearFilters() {
    setSearch("");
    setSelectedRoute("all");
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return routes.filter((route) => {
      if (selectedRoute !== "all" && String(route.routeNo) !== selectedRoute) return false;
      if (!q) return true;
      return (
        route.place.toLowerCase().includes(q) || String(route.routeNo).includes(q)
      );
    });
  }, [routes, search, selectedRoute]);

  const emptyMessage = hasActiveFilters ? t("noStopsMatchFilters") : t("noStopsYet");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 border-zinc-200 bg-white pl-9 dark:border-zinc-800 dark:bg-zinc-900"
          />
        </div>
        {routeNumbers.length > 0 ? (
          <Select value={selectedRoute} onValueChange={setSelectedRoute}>
            <SelectTrigger className="h-11 w-full border-zinc-200 bg-white sm:w-48 dark:border-zinc-800 dark:bg-zinc-900">
              <SelectValue placeholder={t("allRoutes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allRoutes")}</SelectItem>
              {routeNumbers.map((routeNo) => (
                <SelectItem key={routeNo} value={String(routeNo)}>
                  {t("routeOption", { routeNo })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1 text-zinc-500 dark:text-zinc-400"
          >
            <X className="size-3.5" />
            {t("clearFilters")}
          </Button>
        ) : null}
      </div>

      <div className="hidden overflow-hidden rounded-md border border-zinc-200 md:block dark:border-zinc-800">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-100 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-800">
              <TableHead className="w-16 text-zinc-900 dark:text-zinc-50">
                {t("columnSrNo")}
              </TableHead>
              <TableHead className="text-zinc-900 dark:text-zinc-50">
                {t("columnPlace")}
              </TableHead>
              <TableHead className="text-zinc-900 dark:text-zinc-50">
                {t("columnDistance")}
              </TableHead>
              <TableHead className="text-zinc-900 dark:text-zinc-50">
                {t("columnRent")}
              </TableHead>
              <TableHead className="text-zinc-900 dark:text-zinc-50">
                {t("columnRoute")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((route, index) => (
                <TableRow key={route.id} className="bg-white dark:bg-zinc-900">
                  <TableCell className="text-zinc-700 dark:text-zinc-300">{index + 1}</TableCell>
                  <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                    {route.place}
                  </TableCell>
                  <TableCell className="text-zinc-700 dark:text-zinc-300">
                    {route.distanceKm != null ? route.distanceKm : "—"}
                  </TableCell>
                  <TableCell className="text-zinc-700 dark:text-zinc-300">
                    ₹{route.rentPerYear.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-zinc-700 dark:text-zinc-300">{route.routeNo}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-zinc-500 dark:text-zinc-400"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {filtered.length > 0 ? (
          filtered.map((route) => (
            <div
              key={route.id}
              className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{route.place}</p>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-zinc-500 dark:text-zinc-400">{t("columnRoute")}</dt>
                  <dd className="text-right text-zinc-700 dark:text-zinc-300">{route.routeNo}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-zinc-500 dark:text-zinc-400">{t("columnDistance")}</dt>
                  <dd className="text-right text-zinc-700 dark:text-zinc-300">
                    {route.distanceKm != null ? route.distanceKm : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-zinc-500 dark:text-zinc-400">{t("columnRent")}</dt>
                  <dd className="text-right text-zinc-700 dark:text-zinc-300">
                    ₹{route.rentPerYear.toLocaleString("en-IN")}
                  </dd>
                </div>
              </dl>
            </div>
          ))
        ) : (
          <p className="rounded-md border border-dashed border-zinc-200 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
}
