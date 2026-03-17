import { ShieldCheck, FileText, HeartHandshake } from "lucide-react"

const trustItems = [
  { icon: ShieldCheck, label: "Artisans vérifiés" },
  { icon: FileText, label: "Devis gratuits" },
  { icon: HeartHandshake, label: "Sans engagement" },
]

export function TrustBar() {
  return (
    <div className="border-b border-border/40 bg-muted/20 py-2">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-6 px-4 sm:gap-10">
        {trustItems.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground sm:text-sm">
            <Icon className="size-4 text-primary" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
