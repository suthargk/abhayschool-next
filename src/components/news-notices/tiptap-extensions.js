import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

/**
 * Shared with the editor so stored JSON always renders the same way.
 * StarterKit bundles Link itself (v3) — configure it there instead of
 * adding a second Link extension, which Tiptap would warn about as a
 * duplicate.
 */
export const tiptapExtensions = [
  StarterKit.configure({ link: { openOnClick: false } }),
  Image,
];
