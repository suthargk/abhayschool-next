/**
 * Festival theme definitions.
 *
 * Fixed-date festivals (`monthDay`) recur automatically every year.
 * Movable festivals (`windows`) follow the lunar/solar calendar and only
 * light up within the explicitly listed date ranges — extend the `windows`
 * array with real dates once 2030 has passed.
 *
 * Dates verified against public panchang/holiday sources as of Aug 2026:
 * - Holi: drikpanchang.com, whenisfestivals.com
 * - Raksha Bandhan: publicholidays.in, drikpanchang.com
 * - Diwali: diwali.info, hinduplace.com
 */
export const FESTIVALS = [
  {
    id: "republic-day",
    name: "Republic Day",
    greeting: "Happy Republic Day!",
    emoji: "🇮🇳",
    blobColors: ["#FF9933", "#1E3A8A", "#138808"],
    sparkleColors: ["#FF9933", "#138808", "#1E3A8A", "#f8fafc"],
    monthDay: { month: 1, day: 26 },
  },
  {
    id: "makar-sankranti",
    name: "Makar Sankranti",
    greeting: "Happy Makar Sankranti!",
    emoji: "🪁",
    blobColors: ["#f7b100", "#38bdf8", "#fb7185"],
    sparkleColors: ["#f7b100", "#38bdf8", "#fb7185", "#facc15"],
    monthDay: { month: 1, day: 14 },
  },
  {
    id: "holi",
    name: "Holi",
    greeting: "Happy Holi!",
    emoji: "🎨",
    blobColors: ["#ec4899", "#22c55e", "#f59e0b"],
    sparkleColors: ["#ec4899", "#22c55e", "#f59e0b", "#3b82f6"],
    windows: [
      { start: "2026-03-03", end: "2026-03-04" },
      { start: "2027-03-21", end: "2027-03-22" },
      { start: "2028-03-10", end: "2028-03-11" },
      { start: "2029-02-28", end: "2029-03-01" },
      { start: "2030-03-19", end: "2030-03-20" },
    ],
  },
  {
    id: "independence-day",
    name: "Independence Day",
    greeting: "Happy Independence Day!",
    emoji: "🇮🇳",
    blobColors: ["#FF9933", "#1E3A8A", "#138808"],
    sparkleColors: ["#FF9933", "#138808", "#1E3A8A", "#f8fafc"],
    monthDay: { month: 8, day: 15 },
  },
  {
    id: "raksha-bandhan",
    name: "Raksha Bandhan",
    greeting: "Happy Raksha Bandhan!",
    emoji: "🎀",
    blobColors: ["#f43f5e", "#f7b100", "#fb923c"],
    sparkleColors: ["#f43f5e", "#f7b100", "#fb923c", "#fde68a"],
    windows: [
      { start: "2026-08-28", end: "2026-08-28" },
      { start: "2027-08-17", end: "2027-08-17" },
      { start: "2028-08-04", end: "2028-08-04" },
      { start: "2029-08-23", end: "2029-08-23" },
      { start: "2030-08-12", end: "2030-08-12" },
    ],
  },
  {
    id: "diwali",
    name: "Diwali",
    greeting: "Happy Diwali!",
    emoji: "🪔",
    blobColors: ["#f7b100", "#f97316", "#facc15"],
    sparkleColors: ["#f7b100", "#facc15", "#f97316", "#fde68a"],
    windows: [
      { start: "2026-11-06", end: "2026-11-10" },
      { start: "2027-10-27", end: "2027-10-31" },
      { start: "2028-10-15", end: "2028-10-19" },
      { start: "2029-11-03", end: "2029-11-07" },
      { start: "2030-10-24", end: "2030-10-28" },
    ],
  },
];
