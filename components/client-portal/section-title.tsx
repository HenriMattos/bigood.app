export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <header className="mb-6 sm:mb-8">
      <p className="text-xs font-medium uppercase tracking-widest text-primary">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  )
}
