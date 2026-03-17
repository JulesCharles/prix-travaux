/**
 * SEO fixes for blog-posts.json:
 * 1. Internal links (trades + cities)
 * 2. Convert <li><strong>Label</strong> long content to <h3>Label</h3><p>content</p>
 * 3. Convert <ul> to <ol> for sequential steps
 */

import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const filePath = resolve(__dirname, "../data/blog-posts.json")

const posts = JSON.parse(readFileSync(filePath, "utf8"))

// ── Trade links (first mention only) ──
const tradeLinks = [
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)travaux de toiture/i, href: "/prix/toiture", text: "travaux de toiture" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)rénovation de toiture/i, href: "/prix/toiture", text: "rénovation de toiture" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)(l'|d')isolation thermique/i, href: "/prix/isolation", text: "$1isolation thermique" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)travaux d'isolation/i, href: "/prix/isolation", text: "travaux d'isolation" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)plomberie/i, href: "/prix/plomberie", text: "plomberie" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)(l'|d')électricité/i, href: "/prix/electricite", text: "$1électricité" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)peinture intérieure/i, href: "/prix/peinture", text: "peinture intérieure" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)carrelage/i, href: "/prix/carrelage", text: "carrelage" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)menuiseries extérieures/i, href: "/prix/menuiserie", text: "menuiseries extérieures" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)ravalement de façade/i, href: "/prix/facade", text: "ravalement de façade" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)salle de bain/i, href: "/prix/salle-de-bain", text: "salle de bain" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)pompe à chaleur/i, href: "/prix/chauffage", text: "pompe à chaleur" },
]

// ── City links (first mention only) ──
const cityLinks = [
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)Chartres(?![\w-])/i, href: "/ville/chartres" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)Dreux(?![\w-])/i, href: "/ville/dreux" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)Nogent-le-Rotrou/i, href: "/ville/nogent-le-rotrou" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)Châteaudun/i, href: "/ville/chateaudun" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)Lucé(?![\w-])/i, href: "/ville/luce" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)La Loupe/i, href: "/ville/la-loupe" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)Bonneval(?![\w-])/i, href: "/ville/bonneval" },
  { pattern: /(?<!<[^>]*)(?<!"[^"]*)Senonches/i, href: "/ville/senonches" },
]

function addLinks(html) {
  // Add trade links (first occurrence only per trade)
  for (const { pattern, href, text } of tradeLinks) {
    if (pattern.test(html)) {
      if (text) {
        html = html.replace(pattern, `<a href="${href}">${text}</a>`)
      } else {
        html = html.replace(pattern, (match) => `<a href="${href}">${match}</a>`)
      }
    }
  }
  // Add city links (first occurrence only)
  for (const { pattern, href } of cityLinks) {
    if (pattern.test(html)) {
      html = html.replace(pattern, (match) => `<a href="${href}">${match}</a>`)
    }
  }
  return html
}

// ── Convert <li><strong>Label</strong> long_text to <h3> ──
function convertFakeHeadings(html) {
  // Match <li><strong>Label</strong> : content</li> or <li><strong>Label</strong> — content</li>
  const liStrongRegex = /<li>\s*<strong>([^<]+)<\/strong>\s*([::—–\-]\s*)([\s\S]*?)<\/li>/g

  let result = html
  const replacements = []

  let match
  while ((match = liStrongRegex.exec(html)) !== null) {
    const [fullMatch, label, separator, content] = match
    const cleanContent = content.replace(/<[^>]*>/g, "").trim()

    // Only convert if content is substantial (> 120 chars)
    if (cleanContent.length > 120) {
      const replacement = `</ul><h3>${label.trim()}</h3><p>${content.trim()}</p><ul>`
      replacements.push({ from: fullMatch, to: replacement })
    }
  }

  for (const { from, to } of replacements) {
    result = result.replace(from, to)
  }

  // Clean up empty <ul></ul> tags that may result
  result = result.replace(/<ul>\s*<\/ul>/g, "")
  // Clean up </ul><ul> (consecutive list close/open)
  result = result.replace(/<\/ul>\s*<ul>/g, "")
  // Fix </ul><h3> that comes after a non-list
  result = result.replace(/<\/ul><h3>/g, "<h3>")

  return result
}

// ── Convert <ul> to <ol> for sequential steps ──
function convertSequentialToOl(html) {
  // Pattern: <ul> containing <li> starting with Étape/Mois/Phase + number
  const ulRegex = /<ul>([\s\S]*?)<\/ul>/g

  return html.replace(ulRegex, (fullMatch, content) => {
    // Check if list items start with sequential patterns
    const items = content.match(/<li>/g)?.length || 0
    if (items < 3) return fullMatch

    const hasSequential = /(?:Étape|Mois|Phase)\s*\d/i.test(content) ||
      /(?:Janvier|Février|Mars|Avril|Mai|Juin|Juillet|Août|Septembre|Octobre|Novembre|Décembre)/i.test(content)

    if (hasSequential) {
      return `<ol>${content}</ol>`
    }
    return fullMatch
  })
}

// ── Process each post ──
for (let i = 0; i < posts.length; i++) {
  let content = posts[i].content

  // 1. Convert fake headings first (before adding links)
  content = convertFakeHeadings(content)

  // 2. Convert sequential <ul> to <ol>
  content = convertSequentialToOl(content)

  // 3. Add internal links
  content = addLinks(content)

  posts[i].content = content
  console.log(`✓ Post ${i + 1}: ${posts[i].slug}`)
}

writeFileSync(filePath, JSON.stringify(posts, null, 2), "utf8")
console.log("\n✓ blog-posts.json updated successfully")
