import { Container } from "@/components/landing/ui/container"
import { testimonials } from "@/components/landing/landing-data"

export function SocialProofSection() {
  return (
    <section className="section-space bg-white" id="resultados" aria-labelledby="social-heading">
      <Container>
        <div className="mx-auto max-w-[640px] text-center">
          <h2 id="social-heading" className="text-[clamp(24px,3vw,36px)] leading-[1.15] font-bold text-[var(--landing-primary-dark)]">
            Quem usa, aprova
          </h2>
          <p className="mt-3 text-[15px] leading-6 text-[var(--landing-muted)]">
            Barbeiros que já trocaram o improviso pelo Bigood.
          </p>
        </div>

        <div className="stagger-grid mx-auto mt-10 grid max-w-[960px] gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="shadow-card rounded-xl border border-[var(--landing-border)]/50 bg-white p-6"
            >
              <div className="flex gap-1 text-[var(--landing-accent)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="size-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mt-3 text-[14px] leading-6 text-[var(--landing-foreground-soft)]">
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="mt-5 border-t border-[var(--landing-border)]/50 pt-4">
                <p className="text-sm font-bold text-[var(--landing-primary-dark)]">{item.name}</p>
                <p className="mt-0.5 text-xs text-[var(--landing-muted)]">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
