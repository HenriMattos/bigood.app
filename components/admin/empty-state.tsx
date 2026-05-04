import React from "react"
import Link from "next/link"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: IconSvgElement
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  href?: string
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  href,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-8 text-center animate-in fade-in zoom-in duration-500 ${className}`}
    >
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <HugeiconsIcon icon={icon} size={32} />
      </div>
      <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mx-auto mb-6 max-w-[280px] text-sm text-muted-foreground">
        {description}
      </p>
      {actionLabel && (
        <>
          {href ? (
            <Button size="sm" className="gap-2" asChild>
              <Link href={href}>{actionLabel}</Link>
            </Button>
          ) : (
            onAction && (
              <Button onClick={onAction} size="sm" className="gap-2">
                {actionLabel}
              </Button>
            )
          )}
        </>
      )}
    </div>
  )
}
