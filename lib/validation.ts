import { z } from "zod/v4"

export const leadSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().regex(/^(?:(?:\+33|0)[1-9])(?:[\s.-]?\d{2}){4}$/, "Numéro de téléphone invalide"),
  email: z.email("Adresse email invalide"),
  zip: z.string().regex(/^\d{5}$/, "Code postal invalide"),
  trade: z.string().min(1, "Corps de métier requis"),
  surface: z.number().min(1, "Surface minimale de 1 m²").max(10000, "Surface maximale de 10 000 m²"),
  message: z.string().max(1000).optional(),
  website: z.string().max(0).optional(),

  // New fields
  budget: z.enum(["<5000", "5000-15000", "15000-30000", "30000+"]).optional(),
  urgency: z.enum(["urgent", "1-3mois", "3-6mois", "info"]).optional(),
  propertyType: z.enum(["maison", "appartement", "local"]).optional(),

  // Auto-captured tracking
  sourceUrl: z.string().max(500).optional(),
  utmSource: z.string().max(200).optional(),
  utmMedium: z.string().max(200).optional(),
  utmCampaign: z.string().max(200).optional(),
  device: z.string().max(50).optional(),
})

export type LeadInput = z.infer<typeof leadSchema>

export const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.email("Adresse email invalide"),
  subject: z.string().min(3, "Sujet requis"),
  message: z.string().min(10, "Message trop court").max(2000, "Message trop long"),
  website: z.string().max(0).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
