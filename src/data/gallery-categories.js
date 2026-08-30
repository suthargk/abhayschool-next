export const GALLERY_CATEGORIES = [
  { value: "CAMPUS", label: "Campus" },
  { value: "EVENTS", label: "Events" },
  { value: "SPORTS", label: "Sports" },
  { value: "ACADEMICS", label: "Academics" },
  { value: "ACTIVITIES", label: "Activities" },
  { value: "CELEBRATIONS", label: "Celebrations" },
  { value: "TRIPS", label: "Trips" },
];

export function galleryCategoryLabel(value) {
  return GALLERY_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

// value -> message key, for locale-aware display via the "gallery.categories" namespace.
export const GALLERY_CATEGORY_LABEL_KEYS = {
  CAMPUS: "campus",
  EVENTS: "events",
  SPORTS: "sports",
  ACADEMICS: "academics",
  ACTIVITIES: "activities",
  CELEBRATIONS: "celebrations",
  TRIPS: "trips",
};
