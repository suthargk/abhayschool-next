import {
  BookOpen,
  Building2,
  CalendarClock,
  Images,
  LayoutGrid,
  Megaphone,
  MessageSquareQuote,
  Newspaper,
  SquareUserRound,
  Trophy,
  UserCircle,
} from "lucide-react";

export const TEACHER_FEATURES = [
  { key: "FAQ", label: "FAQ", href: "/teacher/faq", icon: MessageSquareQuote },
  { key: "TESTIMONIALS", label: "Testimonials", href: "/teacher/testimonials", icon: Megaphone },
  {
    key: "PRINCIPAL_MESSAGE",
    label: "Principal's Message",
    href: "/teacher/principal-message",
    icon: UserCircle,
  },
  { key: "FACULTY", label: "Faculty", href: "/teacher/faculty", icon: SquareUserRound },
  { key: "FACILITIES", label: "Facilities", href: "/teacher/facilities", icon: Building2 },
  { key: "GALLERY", label: "Gallery", href: "/teacher/gallery", icon: Images },
  { key: "NEWS_NOTICES", label: "News & Notices", href: "/teacher/news-notices", icon: Newspaper },
  { key: "CLASSES", label: "Classes", href: "/teacher/classes", icon: LayoutGrid },
  { key: "LIBRARY", label: "Library", href: "/teacher/library", icon: BookOpen },
  { key: "TIME_TABLE", label: "Time Table", href: "/teacher/time-table", icon: CalendarClock },
  { key: "BLOG", label: "Blog", href: "/teacher/blog", icon: Newspaper },
  { key: "TOPPERS", label: "Toppers", href: "/teacher/toppers", icon: Trophy },
];

export const TEACHER_FEATURE_KEYS = TEACHER_FEATURES.map((f) => f.key);

export function teacherFeatureLabel(key) {
  return TEACHER_FEATURES.find((f) => f.key === key)?.label ?? key;
}

// Groups the 12 permissionable areas the way they already appear across the
// public site, so the admin grant dialog reads as a scannable checklist
// instead of one flat list of 12 unrelated checkboxes.
export const TEACHER_FEATURE_GROUPS = [
  { label: "Homepage", keys: ["FAQ", "TESTIMONIALS"] },
  { label: "About the school", keys: ["PRINCIPAL_MESSAGE", "FACULTY", "FACILITIES"] },
  { label: "Academics", keys: ["CLASSES", "LIBRARY", "TIME_TABLE", "BLOG"] },
  { label: "Media & updates", keys: ["GALLERY", "NEWS_NOTICES"] },
  { label: "Achievements", keys: ["TOPPERS"] },
];
