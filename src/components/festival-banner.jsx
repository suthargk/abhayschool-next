import { getActiveFestival } from "@/lib/festival";
import { cn } from "@/lib/utils";

export function FestivalBanner({ className }) {
  const festival = getActiveFestival();

  if (!festival) return null;

  const [primary, secondary] = festival.blobColors;

  return (
    <div
      className={cn(
        "mx-auto flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur",
        className,
      )}
      style={{
        borderColor: `${primary}55`,
        background: `linear-gradient(90deg, ${primary}1a, ${secondary}1a)`,
      }}
    >
      <span aria-hidden="true">{festival.emoji}</span>
      <span>{festival.greeting}</span>
    </div>
  );
}
