import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FrequentlyAskQuestions = () => {
  return (
    <section className="flex flex-col gap-10 items-center">
      <div>
        <h4 className="text-3xl font-semibold mb-2 text-center">
          <span>Frequently Asked Questions</span>
        </h4>
        <div className="text-zinc-700 text-center dark:text-zinc-500">
          Find answers to common queries about our school, including admissions,
          academics, facilities, and more.
        </div>
      </div>
      <div className="flex gap-4 px-36 w-full">
        <Accordion type="multiple" collapsible="true" className="w-1/2">
          <AccordionItem
            value="item-1"
            className="bg-zinc-100 mb-4 py-2.5 px-5 rounded-lg dark:bg-zinc-800 [&[data-state=open]]:bg-violet-100 [&[data-state=open]]:dark:bg-zinc-700"
          >
            <AccordionTrigger className="text-2xl [&[data-state=open]]:text-violet-900 [&[data-state=open]]:dark:text-zinc-50">
              Is it accessible?
            </AccordionTrigger>
            <AccordionContent className="text-lg text-violet-800 dark:text-zinc-200 animate-fade-up-from-top">
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-2"
            className="bg-zinc-100 mb-4 py-2.5 px-5 rounded-lg dark:bg-zinc-800 [&[data-state=open]]:bg-violet-100 [&[data-state=open]]:dark:bg-zinc-700"
          >
            <AccordionTrigger className="text-2xl [&[data-state=open]]:text-violet-900 [&[data-state=open]]:dark:text-zinc-50">
              Is it styled?
            </AccordionTrigger>
            <AccordionContent className="text-lg text-violet-800 dark:text-zinc-200 animate-fade-up-from-top">
              Yes. It comes with default styles that matches the other
              components&apos; aesthetic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-3"
            className="bg-zinc-100 mb-4 py-2.5 px-5 rounded-lg dark:bg-zinc-800 [&[data-state=open]]:bg-violet-100 [&[data-state=open]]:dark:bg-zinc-700"
          >
            <AccordionTrigger className="text-2xl [&[data-state=open]]:text-violet-900 [&[data-state=open]]:dark:text-zinc-50">
              Is it animated?
            </AccordionTrigger>
            <AccordionContent className="text-lg text-violet-800 dark:text-zinc-200 animate-fade-up-from-top">
              Yes. It&apos;s animated by default, but you can disable it if you
              prefer. Yes. It&apos;s animated by default, but you can disable it
              if you prefer. Yes. It&apos;s animated by default, but you can
              disable it if you prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="multiple" collapsible="true" className="w-1/2">
          <AccordionItem
            value="item-1"
            className="bg-zinc-100 mb-4 py-2.5 px-5 rounded-lg dark:bg-zinc-800 [&[data-state=open]]:bg-violet-100 [&[data-state=open]]:dark:bg-zinc-700"
          >
            <AccordionTrigger className="text-2xl [&[data-state=open]]:text-violet-900 [&[data-state=open]]:dark:text-zinc-50">
              Is it accessible?
            </AccordionTrigger>
            <AccordionContent className="text-lg text-violet-800 dark:text-zinc-200 animate-fade-up-from-top">
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-2"
            className="bg-zinc-100 mb-4 py-2.5 px-5 rounded-lg dark:bg-zinc-800 [&[data-state=open]]:bg-violet-100 [&[data-state=open]]:dark:bg-zinc-700"
          >
            <AccordionTrigger className="text-2xl [&[data-state=open]]:text-violet-900 [&[data-state=open]]:dark:text-zinc-50">
              Is it styled?
            </AccordionTrigger>
            <AccordionContent className="text-lg text-violet-800 dark:text-zinc-200 animate-fade-up-from-top">
              Yes. It comes with default styles that matches the other
              components&apos; aesthetic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-3"
            className="bg-zinc-100 mb-4 py-2.5 px-5 rounded-lg dark:bg-zinc-800 [&[data-state=open]]:bg-violet-100 [&[data-state=open]]:dark:bg-zinc-700"
          >
            <AccordionTrigger className="text-2xl [&[data-state=open]]:text-violet-900 [&[data-state=open]]:dark:text-zinc-50">
              Is it animated?
            </AccordionTrigger>
            <AccordionContent className="text-lg text-violet-800 dark:text-zinc-200 animate-fade-up-from-top">
              Yes. It&apos;s animated by default, but you can disable it if you
              prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default FrequentlyAskQuestions;
