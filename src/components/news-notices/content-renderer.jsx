import { renderToHTMLString } from "@tiptap/static-renderer";

import { tiptapExtensions } from "@/components/news-notices/tiptap-extensions";

/** Renders stored Tiptap JSON content as read-only HTML. Server-safe. */
export function ContentRenderer({ content }) {
  if (!content) return null;

  const html = renderToHTMLString({
    content,
    extensions: tiptapExtensions,
  });

  return (
    <div
      className="prose prose-base max-w-none leading-relaxed dark:prose-invert prose-p:my-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
