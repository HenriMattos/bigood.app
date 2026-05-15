import { cn } from "@/lib/utils"

export function SectionEyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "text-xs font-black tracking-[0.18em] text-[var(--landing-muted)] uppercase",
        className
      )}
    >
      {children}
    </p>
  )
}

export function SectionPill({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-[var(--landing-border)] bg-[var(--landing-primary-soft)] px-4 py-2 text-sm font-black text-[var(--landing-primary-dark)]",
        className
      )}
    >
      {children}
    </span>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  text,
  dark = false,
}: {
  eyebrow: string
  title: React.ReactNode
  text: string
  dark?: boolean
}) {
  return (
    <div>
      <SectionEyebrow className={dark ? "text-white/54" : ""}>
        {eyebrow}
      </SectionEyebrow>
      <h2
        className={cn(
          "mt-5 max-w-[760px] text-[clamp(30px,3.8vw,50px)] leading-[1] font-black",
          dark ? "text-white" : "text-[var(--landing-primary-dark)]"
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "mt-4 max-w-[520px] text-[15px] leading-7",
          dark ? "text-white/68" : "text-[var(--landing-muted)]"
        )}
      >
        {text}
      </p>
    </div>
  )
}
