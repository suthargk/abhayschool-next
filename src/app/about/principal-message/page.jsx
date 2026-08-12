import Image from "next/image";

import { prisma } from "@/lib/prisma";
import { ContentRenderer } from "@/components/news-notices/content-renderer";

export const revalidate = 60;

export default async function PrincipalMessagePage() {
  const item = await prisma.principalMessage.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        Principal&apos;s Message
      </h1>

      {item ? (
        <div className="space-y-8">
          {item.photoUrl ? (
            <Image
              src={item.photoUrl}
              alt={item.principalName || "Principal"}
              width={320}
              height={320}
              className="h-48 w-48 rounded-full border object-cover"
              unoptimized
            />
          ) : null}

          <ContentRenderer content={item.content} />

          {item.signatureUrl || item.principalName ? (
            <div className="space-y-1 pt-2">
              {item.signatureUrl ? (
                <Image
                  src={item.signatureUrl}
                  alt={item.principalName ? `${item.principalName}'s signature` : "Signature"}
                  width={200}
                  height={75}
                  className="h-auto w-40 object-contain"
                  unoptimized
                />
              ) : null}
              {item.principalName ? (
                <p className="text-lg font-medium">— {item.principalName}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-muted-foreground">
          The Principal&apos;s message will be published here soon.
        </p>
      )}
    </div>
  );
}
