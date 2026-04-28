import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

type MetricCardProps = {
  title: string
  value: string
  change: string
  icon: IconSvgElement
  tone?: "green" | "blue" | "amber" | "red"
}

const tones = {
  green: "bg-primary/15 text-primary",
  blue: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  red: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  tone = "green",
}: MetricCardProps) {
  return (
    <article className="premium-card motion-rise min-w-0 rounded-lg border bg-card p-3 text-card-foreground shadow-sm sm:p-4">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground sm:text-sm">{title}</p>
          <strong className="mt-1.5 block text-xl font-semibold tracking-normal sm:mt-2 sm:text-2xl">
            {value}
          </strong>
        </div>
        <span className={cn("rounded-md p-2", tones[tone])}>
          <HugeiconsIcon icon={icon} size={20} />
        </span>
      </div>
      <p className="mt-3 text-xs font-medium text-muted-foreground sm:mt-4">
        {change}
      </p>
    </article>
  )
}
