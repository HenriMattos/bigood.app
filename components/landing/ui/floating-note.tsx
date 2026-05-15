import { HugeiconsIcon } from "@hugeicons/react"

import { IconBubble } from "@/components/landing/ui/icon-bubble"
import { cn } from "@/lib/utils"

export function FloatingNote({
  icon,
  title,
  text,
  className,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  title: string
  text: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-white/60 bg-white/92 p-3 text-[var(--landing-primary-dark)] shadow-[var(--landing-shadow-card)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-[var(--landing-accent)] md:rounded-[22px] md:p-4",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <IconBubble icon={icon} className="size-8 shrink-0 md:size-9" />
        <div className="min-w-0">
          <p className="text-xs leading-4 font-black text-balance md:text-sm md:leading-5">
            {title}
          </p>
          <p className="mt-1 text-xs leading-5 text-pretty text-[var(--landing-muted)] md:text-sm">
            {text}
          </p>
        </div>
      </div>
    </div>
  )
}
