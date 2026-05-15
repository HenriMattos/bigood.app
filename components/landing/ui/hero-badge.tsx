import { HugeiconsIcon } from "@hugeicons/react"

import { IconBubble } from "@/components/landing/ui/icon-bubble"

export function HeroBadge({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  label: string
}) {
  return (
    <div className="flex items-center gap-3">
      <IconBubble icon={icon} className="size-12" />
      <span className="text-sm font-black text-[var(--landing-primary-dark)]">
        {label}
      </span>
    </div>
  )
}
