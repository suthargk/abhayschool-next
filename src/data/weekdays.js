export const WEEKDAYS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
];

export const WEEKDAY_VALUES = WEEKDAYS.map((d) => d.value);

// value -> message key, for locale-aware display. Reuses the labels already
// translated under "academics.timeTable.weekdays".
export const WEEKDAY_LABEL_KEYS = {
  MONDAY: "monday",
  TUESDAY: "tuesday",
  WEDNESDAY: "wednesday",
  THURSDAY: "thursday",
  FRIDAY: "friday",
  SATURDAY: "saturday",
};

export function weekdayLabel(value) {
  return WEEKDAYS.find((d) => d.value === value)?.label ?? value;
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

const WEEKDAY_LOOKUP = new Map();
WEEKDAYS.forEach((d) => {
  [d.value, d.label, d.label.slice(0, 3)].forEach((key) => {
    WEEKDAY_LOOKUP.set(normalize(key), d.value);
  });
});

/** Resolves free-text spreadsheet input ("Mon", "monday", "TUESDAY"...) to a Weekday enum value, or null. */
export function parseWeekday(input) {
  return WEEKDAY_LOOKUP.get(normalize(input)) ?? null;
}
