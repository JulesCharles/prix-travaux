# Stratégie Affiliation — Prix Travaux 28

## Plateformes retenues (par ordre de priorité)

### 1. Travaux.com — Priorité immédiate
- **Type** : Achat de leads travaux tous métiers
- **CPA estimé** : 8-15€/lead qualifié
- **Acceptation** : Facile, pas besoin de gros trafic
- **Action** : S'inscrire dès maintenant
- **URL** : https://www.travaux.com (programme partenaire)

### 2. Effy / QuelleEnergie — En parallèle
- **Type** : Leads rénovation énergétique (isolation, chauffage, PAC, façade ITE)
- **CPA estimé** : 15-30€/lead énergie
- **Acceptation** : Accessible pour sites thématiques rénovation
- **Action** : S'inscrire en même temps que Travaux.com
- **URL** : https://www.effy.fr (programme affiliation)

### 3. Casaneo — Dans 2-3 mois
- **Type** : Réseau affilié spécialisé habitat/énergie
- **CPA estimé** : Variable selon annonceurs
- **Acceptation** : Plus sélectif, veulent voir du trafic (~500-1000 vis/mois)
- **Action** : Postuler quand on a des positions SEO et du trafic organique
- **URL** : https://www.casaneo.io

### 4. Awin — Non retenu
- Trop généraliste, pas pertinent pour du lead travaux en France

## Architecture technique du dispatch

```
Lead entrant (formulaire PriceCalculator)
  │
  ├─ Si métier = isolation | chauffage | facade (ITE)
  │   → Effy / QuelleEnergie (meilleur CPA sur leads énergie)
  │   → Fallback: Travaux.com
  │
  ├─ Tous les autres métiers
  │   → Travaux.com
  │
  └─ Si rejeté par tous
      → Stockage BDD interne (relance email ultérieure)
```

## Fichier à modifier pour l'intégration
- `app/api/leads/route.ts` — Ajouter le waterfall avec les endpoints API de chaque plateforme
- Clés API à stocker dans `.env.local`

## Checklist avant de postuler
- [x] Site en ligne avec design pro
- [x] 394 pages indexables avec contenu 1500+ mots
- [x] Formulaire de lead fonctionnel
- [x] Mentions légales, contact, à propos
- [x] Google Search Console configuré
- [x] GA4 configuré
- [ ] Premières impressions dans Google Search Console
- [ ] ~100-200 visites/mois minimum
- [ ] Postuler Travaux.com + Effy
- [ ] (2-3 mois plus tard) Postuler Casaneo
