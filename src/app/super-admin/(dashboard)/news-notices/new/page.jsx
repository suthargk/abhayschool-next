import { NewsNoticeForm } from "../components/news-notice-form";

export default function NewNewsNoticePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create news / notice
        </h1>
      </div>
      <NewsNoticeForm />
    </div>
  );
}
