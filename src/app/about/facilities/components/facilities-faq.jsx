import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FacilitiesFaq({ items }) {
  const t = useTranslations("facilities.facilitiesFaq");

  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("heading")}
        </h2>
      </div>

      <Accordion type="single" collapsible className="divide-y">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">{item.summary}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
