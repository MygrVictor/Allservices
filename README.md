# All Services Montagne — Refonte

Stack: Next.js 14 (App Router) + TypeScript + Tailwind + Prisma + PostgreSQL (Supabase) + Stripe + Resend.

## 1) Installation

```bash
npm install
cp .env.example .env
```

Renseigner dans `.env`:

- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_TO_MANAGER`
- `ADMIN_USER` / `ADMIN_PASSWORD`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SITE_STATUS=active|veille`

## 2) Base de données

```bash
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed
```

## 3) Développement

```bash
npm run dev
```

## 4) Stripe webhook (local)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copier la clé webhook reçue dans `STRIPE_WEBHOOK_SECRET`.

## 5) Parcours livré

### Réservation

- Aiguillage initial propriétaire/vacancier
- Formulaire multi-étapes dynamique
- Calcul du total en direct
- Checkout Stripe
- Confirmation `/reservation/success`

### Back-office minimal

- `/admin` protégé par Basic Auth (`ADMIN_USER`/`ADMIN_PASSWORD`)
- Liste des réservations payées
- Filtres: date, résidence, public

## 6) Pages

- `/`
- `/proprietaires`
- `/vacanciers`
- `/reservation`
- `/laverie-conciergerie`
- `/bons-plans`
- `/contact`
- `/mentions-legales`
- `/admin`

## 7) Point métier à confirmer

Produit ambigu **non injecté au checkout**:

- Service de blanchisserie à domicile (4€ à 8€ selon variante)

Décision attendue client:

- commandé par propriétaire en amont,
- ou par vacancier pendant le séjour.
