import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { prisma } from "@/lib/prisma";

function FaqColumn({ items }) {
  return (
    <Accordion type="multiple" collapsible="true" className="w-full lg:w-1/2">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="bg-zinc-100 mb-4 py-2.5 px-5 rounded-lg dark:bg-zinc-800 [&[data-state=open]]:bg-violet-100 [&[data-state=open]]:dark:bg-zinc-700"
        >
          <AccordionTrigger className="text-lg sm:text-xl lg:text-2xl text-left [&[data-state=open]]:text-violet-900 [&[data-state=open]]:dark:text-zinc-50">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-base sm:text-lg text-violet-800 dark:text-zinc-200 animate-fade-up-from-top whitespace-pre-line">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

const FrequentlyAskQuestions = async () => {
  const faqs = await prisma.faq.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { position: "asc" },
  });

  if (faqs.length === 0) return null;

  const leftColumn = faqs.filter((_, index) => index % 2 === 0);
  const rightColumn = faqs.filter((_, index) => index % 2 === 1);

  return (
    <section className="flex flex-col gap-10 items-center px-4">
      <div>
        <h4 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
          <span>Frequently Asked Questions</span>
        </h4>
        <div className="text-zinc-700 text-center dark:text-zinc-500 max-w-md mx-auto">
          Find answers to common queries about our school, including admissions,
          academics, facilities, and more.
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 sm:px-10 md:px-20 lg:px-36 w-full">
        <FaqColumn items={leftColumn} />
        {rightColumn.length > 0 ? <FaqColumn items={rightColumn} /> : null}
      </div>
    </section>
  );
};

export default FrequentlyAskQuestions;
