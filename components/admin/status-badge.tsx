import { cn } from "@/lib/utils"

type StatusBadgeProps = {
  children: React.ReactNode
  tone?: "green" | "amber" | "red" | "blue" | "neutral"
}

const tones = {
  green: "border-primary/30 bg-primary/10 text-primary",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  red: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
  blue: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  neutral: "border-border bg-muted text-muted-foreground",
}

export function StatusBadge({
  children,
  tone = "neutral",
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone]
      )}
    >
      {children}
    </span>
  )
}
