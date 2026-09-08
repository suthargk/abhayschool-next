"use client";

import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

// Live pass/fail list for password strength rules — re-evaluates each rule's
// `test(password)` on every keystroke so the user sees exactly which
// requirement they're still missing.
export function PasswordChecklist({ password, rules }) {
  return (
    <ul className="space-y-1 text-xs">
      {rules.map((rule) => {
        const met = rule.test(password);
        return (
          <li
            key={rule.key}
            className={cn(
              "flex items-center gap-1.5",
              met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
            )}
          >
            {met ? (
              <Check className="size-3.5 shrink-0" />
            ) : (
              <X className="size-3.5 shrink-0" />
            )}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
