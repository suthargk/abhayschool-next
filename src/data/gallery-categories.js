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
