import { cn } from "@/lib/utils"

type SectionCardProps = {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "premium-card motion-rise min-w-0 rounded-lg border bg-card shadow-sm",
        className
      )}
    >
      <div className="flex min-w-0 flex-col gap-3 border-b p-3 sm:p-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h2 className="break-words text-base font-semibold">{title}</h2>
          {description ? (
            <p className="mt-1 break-words text-sm leading-snug text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action ? (
          <div className="min-w-0 shrink-0 [&_[data-slot=button]]:w-full md:[&_[data-slot=button]]:w-auto">
            {action}
          </div>
        ) : null}
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </section>
  )
}
