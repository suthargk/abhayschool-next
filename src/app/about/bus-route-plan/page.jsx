import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";

import { BusRouteTable } from "./components/bus-route-table";

export const revalidate = 60;

export default async function BusRoutePlanPage() {
  const t = await getTranslations("busRoutePlan");
  const routes = await prisma.busRoute.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ position: "asc" }],
  });

  const routeNumbers = [...new Set(routes.map((route) => route.routeNo))].sort(
    (a, b) => a - b,
  );

  return (
    <div className="min-h-screen px-4 pb-16 pt-[100px] md:px-10 md:pt-[102px] lg:px-20">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {t("heading")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>
              <span className="font-medium text-foreground">{routes.length}</span>{" "}
              {t("stopWord", { count: routes.length })}
            </span>
            {routeNumbers.length > 0 ? (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  <span className="font-medium text-foreground">{routeNumbers.length}</span>{" "}
                  {t("routeWord", { count: routeNumbers.length })}
                </span>
              </>
            ) : null}
          </div>
        </div>

        <BusRouteTable routes={routes} routeNumbers={routeNumbers} />
      </div>
    </div>
  );
}
