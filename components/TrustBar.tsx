import { ShieldCheck, FileText, HeartHandshake } from "lucide-react"

const trustItems = [
  { icon: ShieldCheck, label: "Artisans vérifiés" },
  { icon: FileText, label: "Devis gratuits" },
  { icon: HeartHandshake, label: "Sans engagement" },
]

export function TrustBar() {
  return (
    <div className="border-y bg-muted/30 py-5">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-10 px-4">
        {trustItems.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 text-sm font-semibold text-foreground">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Icon className="size-5 text-primary" />
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
