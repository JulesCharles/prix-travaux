import {
  Home,
  Thermometer,
  Droplets,
  Zap,
  Flame,
  Bath,
  DoorOpen,
  Paintbrush,
  Grid3x3,
  Building,
} from "lucide-react"

export const tradeIcons: Record<string, typeof Home> = {
  toiture: Home,
  isolation: Thermometer,
  plomberie: Droplets,
  electricite: Zap,
  chauffage: Flame,
  "salle-de-bain": Bath,
  menuiserie: DoorOpen,
  peinture: Paintbrush,
  carrelage: Grid3x3,
  facade: Building,
}
