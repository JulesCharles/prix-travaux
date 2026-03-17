"use client"

import { useState, useEffect } from "react"
import { Activity, TrendingUp, Clock } from "lucide-react"

interface RecentActivityProps {
  cityName?: string
  tradeTitle?: string
  seed?: string
}

/** Simple deterministic hash from string to number */
function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/** Seeded pseudo-random between min and max (inclusive) */
function seededRand(seed: string, min: number, max: number): number {
  return min + (hash(seed) % (max - min + 1))
}

export function RecentActivity({ cityName, tradeTitle, seed = "" }: RecentActivityProps) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  const now = new Date()
  const daySeed = `${seed}-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
  const hourSeed = `${daySeed}-${Math.floor(now.getHours() / 2)}`

  const timeAgo = seededRand(hourSeed, 2, 47)
  const weeklyCount = seededRand(`week-${daySeed}`, 145, 380)
  const surface = seededRand(`surf-${daySeed}`, 35, 200)

  const messages = [
    {
      icon: Clock,
      text: cityName && tradeTitle
        ? `Dernière estimation de ${tradeTitle.toLowerCase()} à ${cityName} il y a ${timeAgo} min`
        : `Dernière estimation réalisée il y a ${timeAgo} min en Eure-et-Loir`,
    },
    {
      icon: TrendingUp,
      text: `${weeklyCount} estimations réalisées cette semaine en Eure-et-Loir`,
    },
    ...(cityName && tradeTitle
      ? [
          {
            icon: Activity,
            text: `${surface} m² de ${tradeTitle.toLowerCase()} estimés aujourd'hui à ${cityName}`,
          },
        ]
      : []),
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length)
        setVisible(true)
      }, 400)
    }, 5000)
    return () => clearInterval(interval)
  }, [messages.length])

  const current = messages[index]
  const Icon = current.icon

  return (
    <div className="flex items-center justify-center gap-2.5 rounded-lg bg-primary/5 px-4 py-2.5 text-sm text-foreground">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-green-500" />
      </span>
      <Icon className="size-3.5 shrink-0 text-primary" />
      <span
        className="transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {current.text}
      </span>
    </div>
  )
}
