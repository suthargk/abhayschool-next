import Image from "next/image";

import { ContentRenderer } from "@/components/news-notices/content-renderer";

export function PrincipalMessageSection({ item }) {
  return (
    <section className="mx-auto max-w-3xl space-y-10">
      <ContentRenderer content={item.content} />

      {item.signatureUrl || item.principalName ? (
        <div className="space-y-3 border-t pt-8">
          <p className="text-sm text-muted-foreground">With warm regards,</p>
          {item.signatureUrl ? (
            <Image
              src={item.signatureUrl}
              alt={
                item.principalName ? `${item.principalName}'s signature` : "Signature"
              }
              width={200}
              height={75}
              className="h-auto w-40 object-contain"
              unoptimized
            />
          ) : null}
          <div>
            {item.principalName ? (
              <p className="font-semibold">{item.principalName}</p>
            ) : null}
            <p className="text-sm text-muted-foreground">
              {item.designation ||
                "Principal, Shri Abhay Nobles Senior Secondary School"}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
