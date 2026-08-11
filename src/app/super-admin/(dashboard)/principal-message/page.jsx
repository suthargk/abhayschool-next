import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { PrincipalMessageForm } from "./components/principal-message-form";

export default async function SuperAdminPrincipalMessagePage() {
  const [item, profile] = await Promise.all([
    prisma.principalMessage.findFirst({ orderBy: { createdAt: "desc" } }),
    getCurrentProfile(),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Principal&apos;s Message
        </h1>
        <p className="text-muted-foreground">
          Manage the content and photo shown on the public Principal&apos;s
          Message page.
        </p>
      </div>

      <PrincipalMessageForm
        initialItem={item}
        canPublish={profile?.role === "ADMIN"}
      />
    </div>
  );
}
