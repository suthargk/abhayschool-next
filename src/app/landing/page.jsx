import CampusHighlights from "./campus-highlights";
import FrequentlyAskQuestions from "./frequently-ask-questions";
import Hero from "./hero";
import NewsNotices from "./news-notices";
import Testinomials from "./testinomials";

export default function LandingPage() {
  return (
    <div className="py-2.5 px-10 space-y-20">
      <Hero />
      <div className="space-y-40">
        <NewsNotices />
        <CampusHighlights />
        <Testinomials />
        <FrequentlyAskQuestions />
      </div>
    </div>
  );
}
