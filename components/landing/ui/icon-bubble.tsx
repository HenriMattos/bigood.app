import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"

export function IconBubble({
  icon,
  className,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  className?: string
}) {
  return (
    <span
      className={cn(
        "grid size-10 place-items-center rounded-full bg-[var(--landing-accent)] text-[var(--landing-primary-dark)]",
        className
      )}
    >
      <HugeiconsIcon icon={icon} size={20} aria-hidden="true" />
    </span>
  )
}
