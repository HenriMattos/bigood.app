import Link from "next/link"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LandingLinkButton({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Button size="lg" className={cn("w-full sm:w-auto justify-center rounded-full", className)} asChild>
      <Link href={href} className="flex items-center justify-center gap-2">
        {children}
        <HugeiconsIcon icon={ArrowRight01Icon} size={18} aria-hidden="true" />
      </Link>
    </Button>
  )
}
