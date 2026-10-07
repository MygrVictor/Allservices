# Plan design — All Services Montagne

## Palette nommée (montagne réelle, non SaaS)

- **Neige** — `#F7FAFC` (fond principal)
- **Ardoise** — `#2C3E50` (titres, CTA secondaire)
- **Sapin** — `#2E4A3D` (CTA principal, accents confiance)
- **Pierre** — `#8A96A3` (texte secondaire)
- **Bois** — `#A67C52` (accent ponctuel chaleureux)
- **Glacier** — `#D9E7F2` (hero de fond)

## Typographies

- Titres: **Merriweather** (`--font-heading`) — donne une présence éditoriale locale.
- Texte courant: **Source Sans 3** (`--font-body`) — lisible sur mobile en déplacement.

### Rôles

- `H1`: 40–52px selon breakpoint, ligne courte, promesse claire.
- `H2`: 28–34px.
- Corps: 16–18px.
- Métadonnées/form labels: 14px.

## Wireframe ASCII — Accueil

```text
┌──────────────────────────────────────────────────────────────┐
│ Header: logo | nav | bouton Réserver                        │
├──────────────────────────────────────────────────────────────┤
│ HERO (élément fort unique)                                  │
│ Les Arcs 1800 & 2000                                        │
│ [Titre promesse métier]                                     │
│ [2 lignes de contexte réel: clés, linge, séjour]            │
│                                                              │
│ [Carte: Propriétaire] [Carte: Vacancier] [CTA Réserver]     │
├──────────────────────────────────────────────────────────────┤
│ 3 blocs sobres: Propriétaires | Vacanciers | Infos pratiques│
├──────────────────────────────────────────────────────────────┤
│ Footer: adresses Arc 1800/2000, contact, mentions légales   │
└──────────────────────────────────────────────────────────────┘
```

## Wireframe ASCII — /reservation

```text
┌──────────────────────────────────────────────────────────────┐
│ Stepper + Total                                              │
├──────────────────────────────────────────────────────────────┤
│ Étape 0: Aiguillage                                          │
│ [Propriétaire] [Vacancier]                                   │
├──────────────────────────────────────────────────────────────┤
│ Propriétaire:                                                 │
│ 1 Service -> 2 Bien & dates -> 3 Coordonnées -> 4 Récap      │
│                                                              │
│ Vacancier:                                                    │
│ 1 Résidence & dates -> 2 Produits (quantités)               │
│ -> 3 Créneau + Coordonnées -> 4 Récap                        │
├──────────────────────────────────────────────────────────────┤
│ Boutons: Retour / Continuer / Payer                          │
└──────────────────────────────────────────────────────────────┘
```

## Différenciation vs rendu générique IA

- Pas de beige/terracotta par défaut.
- Pas d'esthétique dashboard SaaS.
- Pas de labels forcés en caps.
- Contenu métier réel dès la première version.
- Une hiérarchie orientée décision rapide mobile en station.
