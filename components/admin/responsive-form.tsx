import type { ReactNode } from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function FormGrid({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("grid min-w-0 gap-4 sm:grid-cols-2", className)}>
      {children}
    </div>
  )
}

export function FormField({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("grid min-w-0 gap-1.5", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export function ResponsiveActions({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "grid min-w-0 gap-2 sm:flex sm:flex-wrap sm:justify-end [&_[data-slot=button]]:w-full sm:[&_[data-slot=button]]:w-auto",
        className
      )}
    >
      {children}
    </div>
  )
}
