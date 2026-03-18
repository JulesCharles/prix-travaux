"use client"

import { useState, useEffect, useMemo } from "react"
import { Activity, TrendingUp, Clock, type LucideIcon } from "lucide-react"

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

/** Handle French elision: "de isolation" → "d'isolation" */
function elide(prefix: string, word: string): string {
  const vowels = "aeiouyàâäéèêëïîôùûüœæ"
  if (vowels.includes(word.charAt(0).toLowerCase())) {
    return prefix.replace(/e$/, "'") + word
  }
  return `${prefix} ${word}`
}

interface Message {
  icon: LucideIcon
  text: string
}

function buildMessages(cityName?: string, tradeTitle?: string, seed = ""): Message[] {
  const now = new Date()
  const daySeed = `${seed}-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
  const hourSeed = `${daySeed}-${Math.floor(now.getHours() / 2)}`
  const globalDaySeed = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`

  const timeAgo = seededRand(hourSeed, 2, 47)
  const weeklyCount = seededRand(`week-${globalDaySeed}`, 145, 380)
  const surface = seededRand(`surf-${daySeed}`, 35, 200)

  return [
    {
      icon: Clock,
      text: cityName && tradeTitle
        ? `Dernière estimation ${elide("de", tradeTitle.toLowerCase())} à ${cityName} il y a ${timeAgo} min`
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
            text: `${surface} m² ${elide("de", tradeTitle.toLowerCase())} estimés aujourd'hui à ${cityName}`,
          },
        ]
      : []),
  ]
}

export function RecentActivity({ cityName, tradeTitle, seed = "" }: RecentActivityProps) {
  const [mounted, setMounted] = useState(false)
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  const messages = useMemo(
    () => (mounted ? buildMessages(cityName, tradeTitle, seed) : []),
    [mounted, cityName, tradeTitle, seed]
  )

  useEffect(() => {
    if (!mounted || messages.length === 0) return
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length)
        setVisible(true)
      }, 400)
    }, 5000)
    return () => clearInterval(interval)
  }, [mounted, messages.length])

  if (!mounted || messages.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2.5 rounded-lg bg-primary/5 px-4 py-2.5 text-sm text-foreground">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-green-500" />
        </span>
        <Clock className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
        <span>Estimations en cours en Eure-et-Loir…</span>
      </div>
    )
  }

  const current = messages[index]
  const Icon = current.icon

  return (
    <div className="flex items-center justify-center gap-2.5 rounded-lg bg-primary/5 px-4 py-2.5 text-sm text-foreground">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-green-500" />
      </span>
      <Icon className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
      <span
        className="transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {current.text}
      </span>
    </div>
  )
}
