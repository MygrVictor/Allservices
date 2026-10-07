"use client";

import { FormEvent, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  AMBIGUOUS_PRODUCT,
  AMBIGUOUS_PRODUCT_EN,
  DELIVERY_PRODUCT_CODE,
  PRODUCTS,
  formatEuros,
  isOrderable,
  localizeProduct,
  productsForAudience,
  residenceOptions,
  type CatalogProduct,
  type Residence,
} from "@/lib/catalog";
import { isSiteInStandby, siteText } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/locale-provider";
import { makeT, type Translate } from "@/lib/i18n";

type PickupMode = "retrait" | "livraison";

type ReservationData = {
  residence?: Residence;
  dateArrivee: string;
  dateDepart: string;
  modeRecuperation: PickupMode;
  adresseLivraison: string;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  notes: string;
  quantities: Record<string, number>;
};

const baseState: ReservationData = {
  dateArrivee: "",
  dateDepart: "",
  modeRecuperation: "retrait",
  adresseLivraison: "",
  clientNom: "",
  clientEmail: "",
  clientTelephone: "",
  notes: "",
  quantities: {},
};

const getSteps = (t: Translate) => [
  t("Station & dates", "Resort & dates"),
  t("Mes produits", "My products"),
  t("Récupération & coordonnées", "Collection & details"),
  t("Récapitulatif", "Summary"),
];
const STEP_COUNT = 4;

const getGroups = (
  t: Translate,
): { title: string; filter: (p: CatalogProduct) => boolean }[] => [
  {
    title: t("Linge & literie", "Linen & bedding"),
    filter: (p) => p.category === "linge",
  },
  {
    title: t("Bébé & ménage", "Baby & cleaning"),
    filter: (p) => p.category === "equipement_bebe" || p.category === "menage",
  },
  {
    title: t("Livraison", "Delivery"),
    filter: (p) => p.category === "livraison",
  },
];

const inputClass =
  "w-full rounded-lg border border-slate-400 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

export function ReservationForm({
  cart,
  onCartChange,
}: {
  cart?: Record<string, number>;
  onCartChange?: (quantities: Record<string, number>) => void;
} = {}) {
  const standby = isSiteInStandby();
  const locale = useLocale();
  const t = makeT(locale);
  const site = siteText(locale);
  const steps = getSteps(t);
  const groups = getGroups(t);
  const eur = (cents: number) => formatEuros(cents, locale);
  const fmtDate = (value: string) =>
    format(new Date(value), locale === "en" ? "d MMM yyyy" : "dd/MM/yyyy");
  const cartMode = Boolean(onCartChange);
  const [data, setData] = useState<ReservationData>(baseState);
  const quantities = cart ?? data.quantities;
  const setQuantities = (next: Record<string, number>) =>
    onCartChange
      ? onCartChange(next)
      : setData((previous) => ({ ...previous, quantities: next }));
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const rawDelivery = PRODUCTS.find((p) => p.code === DELIVERY_PRODUCT_CODE);
  const deliveryProduct = rawDelivery
    ? localizeProduct(rawDelivery, locale)
    : undefined;
  const products = useMemo(
    () =>
      productsForAudience("vacancier")
        .filter(
          (p) =>
            p.category !== "livraison" &&
            (!p.residence || p.residence === data.residence),
        )
        .map((p) => localizeProduct(p, locale)),
    [data.residence, locale],
  );

  const update = <K extends keyof ReservationData>(
    key: K,
    value: ReservationData[K],
  ) => setData((previous) => ({ ...previous, [key]: value }));

  const selectedItems = useMemo(
    () =>
      products
        .filter(isOrderable)
        .map((product) => ({
          ...product,
          quantity: quantities[product.code] ?? 0,
        }))
        .filter((item) => item.quantity > 0),
    [products, quantities],
  );

  const deliveryCents =
    data.modeRecuperation === "livraison"
      ? (deliveryProduct?.priceCents ?? 0)
      : 0;
  const totalCents =
    selectedItems.reduce(
      (sum, item) => sum + item.priceCents * item.quantity,
      0,
    ) + deliveryCents;

  const validateStep = (target = step) => {
    setError(null);
    if (target === 0) {
      if (!data.residence || !data.dateArrivee || !data.dateDepart) {
        setError(
          t(
            "Choisissez la station et vos dates de séjour.",
            "Choose your resort and your dates.",
          ),
        );
        return false;
      }
      if (new Date(data.dateDepart) <= new Date(data.dateArrivee)) {
        setError(
          t(
            "La date de départ doit être après la date d'arrivée.",
            "Departure date must be after arrival date.",
          ),
        );
        return false;
      }
    }
    if (target === 1 && selectedItems.length === 0) {
      setError(
        t(
          "Ajoutez au moins un article à votre commande.",
          "Add at least one item to your order.",
        ),
      );
      return false;
    }
    if (target === 2) {
      if (
        data.modeRecuperation === "livraison" &&
        !data.adresseLivraison.trim()
      ) {
        setError(
          t(
            "Indiquez l'adresse de livraison (résidence, n° d'appartement).",
            "Enter the delivery address (residence, apartment number).",
          ),
        );
        return false;
      }
      if (data.clientNom.trim().length < 2) {
        setError(t("Indiquez votre nom.", "Enter your name."));
        return false;
      }
      if (!/^\S+@\S+\.\S+$/.test(data.clientEmail.trim())) {
        setError(
          t(
            "Adresse email invalide : le bon de commande vous sera envoyé par mail.",
            "Invalid email address: your order form will be sent by email.",
          ),
        );
        return false;
      }
      if (!/^[+0-9 ().-]{8,20}$/.test(data.clientTelephone.trim())) {
        setError(t("Numéro de téléphone invalide.", "Invalid phone number."));
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (validateStep())
      setStep((current) => Math.min(current + 1, STEP_COUNT - 1));
  };

  const prev = () => {
    setError(null);
    setStep((current) => Math.max(current - 1, 0));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (step < STEP_COUNT - 1) {
      next();
      return;
    }
    if (standby) {
      setError(
        t(
          "Le site est en veille hors saison. Merci d'utiliser la page contact.",
          "The site is in off-season mode. Please use the contact page.",
        ),
      );
      return;
    }
    if (![0, 1, 2].every((s) => validateStep(s))) return;

    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetAudience: "vacancier",
          residence: data.residence,
          dateArrivee: data.dateArrivee,
          dateDepart: data.dateDepart,
          modeRecuperation: data.modeRecuperation,
          adresseLivraison:
            data.modeRecuperation === "livraison"
              ? data.adresseLivraison
              : undefined,
          clientNom: data.clientNom,
          clientEmail: data.clientEmail,
          clientTelephone: data.clientTelephone,
          notes: data.notes || undefined,
          items: selectedItems.map((item) => ({
            productCode: item.code,
            quantity: item.quantity,
          })),
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        url?: string;
      };
      if (!response.ok || !payload.url) {
        setError(
          payload.error ??
            t("Impossible de lancer le paiement.", "Unable to start payment."),
        );
        return;
      }
      window.location.href = payload.url;
    } catch {
      setError(
        t("Une erreur réseau est survenue.", "A network error occurred."),
      );
    } finally {
      setPending(false);
    }
  };

  const stationLabel = residenceOptions.find(
    (o) => o.value === data.residence,
  )?.label;

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-panel border border-slate-200 bg-white p-4 shadow-soft sm:p-6"
    >
      <ol
        className="mb-6 flex flex-wrap gap-2 text-xs"
        aria-label={t("Étapes", "Steps")}
      >
        {steps.map((label, index) => (
          <li
            key={label}
            aria-current={index === step ? "step" : undefined}
            className={cn(
              "rounded-full px-3 py-1",
              index === step
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-700",
            )}
          >
            {index + 1}.{" "}
            {cartMode && index === 1 ? t("Mon panier", "My basket") : label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset className="sm:col-span-2">
            <legend className="mb-2 block text-sm font-medium text-slate-800">
              Station
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {residenceOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-center justify-center rounded-panel border-2 p-4 text-lg font-semibold",
                    data.residence === option.value
                      ? "border-primary bg-primary-light text-ardoise"
                      : "border-slate-300 text-slate-700",
                  )}
                >
                  <input
                    type="radio"
                    name="residence"
                    value={option.value}
                    className="sr-only"
                    checked={data.residence === option.value}
                    onChange={() => {
                      update("residence", option.value);
                      // les packs ski dépendent de la station
                      setQuantities(
                        Object.fromEntries(
                          Object.entries(quantities).filter(
                            ([code]) =>
                              PRODUCTS.find((p) => p.code === code)
                                ?.category !== "ski",
                          ),
                        ),
                      );
                    }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-800">
              {t("Arrivée", "Arrival")}
            </span>
            <input
              type="date"
              required
              value={data.dateArrivee}
              onChange={(e) => update("dateArrivee", e.target.value)}
              className={inputClass}
            />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-800">
              {t("Départ", "Departure")}
            </span>
            <input
              type="date"
              required
              min={data.dateArrivee || undefined}
              value={data.dateDepart}
              onChange={(e) => update("dateDepart", e.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      )}

      {step === 1 && cartMode && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-ardoise">
            {t("Mon panier", "My basket")}
          </h3>
          {selectedItems.length === 0 ? (
            <p className="rounded-panel border border-slate-200 p-4 text-sm text-slate-600">
              {t("Votre panier est vide.", "Your basket is empty.")}
            </p>
          ) : (
            <ul className="space-y-2">
              {selectedItems.map((item) => {
                const setQty = (value: number) =>
                  setQuantities({
                    ...quantities,
                    [item.code]: Math.max(0, Math.min(20, value)),
                  });
                return (
                  <li
                    key={item.code}
                    className="flex items-center justify-between gap-3 rounded-panel border border-slate-200 p-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-ardoise">{item.name}</p>
                      <p className="text-sm font-semibold text-primary">
                        {eur(item.priceCents)} × {item.quantity} ={" "}
                        {eur(item.priceCents * item.quantity)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setQty(item.quantity - 1)}
                        className="h-9 w-9 rounded-full border border-slate-400 text-lg"
                        aria-label={t(
                          `Retirer un ${item.name}`,
                          `Remove one ${item.name}`,
                        )}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(item.quantity + 1)}
                        className="h-9 w-9 rounded-full bg-primary text-lg text-white"
                        aria-label={t(
                          `Ajouter un ${item.name}`,
                          `Add one ${item.name}`,
                        )}
                      >
                        +
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="flex flex-wrap gap-4">
            <a
              href="/vacanciers#produits"
              className="inline-flex text-sm font-semibold text-primary underline"
            >
              + {t("Ajouter du linge", "Add linen")}
            </a>
            <a
              href="/packs-ski"
              className="inline-flex text-sm font-semibold text-primary underline"
            >
              + {t("Ajouter une location de ski", "Add ski rental")}
            </a>
          </div>
        </div>
      )}

      {step === 1 && !cartMode && (
        <div className="space-y-6">
          {groups.map((group) => {
            const groupProducts = products.filter(group.filter);
            if (groupProducts.length === 0) return null;
            return (
              <section key={group.title} aria-label={group.title}>
                <h3 className="mb-2 text-lg font-semibold text-ardoise">
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {groupProducts.map((product) => {
                    const orderable = isOrderable(product);
                    const isSkiPack = product.category === "ski";
                    const qty = quantities[product.code] ?? 0;
                    const setQty = (value: number) =>
                      setQuantities({
                        ...quantities,
                        [product.code]: Math.max(0, Math.min(20, value)),
                      });
                    return (
                      <div
                        key={product.code}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-panel border border-slate-200 p-3",
                          isSkiPack ? "opacity-50" : "",
                        )}
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-ardoise">
                            {product.name}
                          </p>
                          <p className="text-sm text-slate-600">
                            {product.description}
                          </p>
                          <p
                            className={cn(
                              "text-sm font-semibold",
                              orderable ? "text-primary" : "text-amber-800",
                            )}
                          >
                            {orderable
                              ? eur(product.priceCents)
                              : product.pricePending}
                          </p>
                        </div>
                        {orderable && !isSkiPack ? (
                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setQty(qty - 1)}
                              className="h-10 w-10 rounded-full border border-slate-400 text-lg"
                              aria-label={`Retirer un ${product.name}`}
                            >
                              −
                            </button>
                            <span
                              className="w-8 text-center font-semibold"
                              aria-live="polite"
                            >
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(qty + 1)}
                              className="h-10 w-10 rounded-full bg-primary text-lg text-white"
                              aria-label={`Ajouter un ${product.name}`}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                            {t("Bientôt disponible", "Coming soon")}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <div className="rounded-panel border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            {t("Sur demande :", "On request:")}{" "}
            <strong>
              {locale === "en"
                ? AMBIGUOUS_PRODUCT_EN.name
                : AMBIGUOUS_PRODUCT.name}
            </strong>{" "}
            (
            {AMBIGUOUS_PRODUCT.variants
              .map((v) => eur(v.priceCents))
              .join(t(" à ", " to "))}
            ) — {t("contactez-nous.", "contact us.")}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset className="sm:col-span-2">
            <legend className="mb-2 block text-sm font-medium text-slate-800">
              {t("Récupération du linge", "Linen collection")}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={cn(
                  "cursor-pointer rounded-panel border-2 p-3",
                  data.modeRecuperation === "retrait"
                    ? "border-primary bg-primary-light"
                    : "border-slate-300",
                )}
              >
                <input
                  type="radio"
                  name="modeRecuperation"
                  className="mr-2"
                  checked={data.modeRecuperation === "retrait"}
                  onChange={() => update("modeRecuperation", "retrait")}
                />
                <span className="font-semibold text-ardoise">
                  {t("Retrait en magasin", "In-store collection")}
                </span>
                <span className="block text-sm text-slate-700">
                  {t("Gratuit", "Free")}
                </span>
              </label>
              <label
                className={cn(
                  "cursor-pointer rounded-panel border-2 p-3",
                  data.modeRecuperation === "livraison"
                    ? "border-primary bg-primary-light"
                    : "border-slate-300",
                )}
              >
                <input
                  type="radio"
                  name="modeRecuperation"
                  className="mr-2"
                  checked={data.modeRecuperation === "livraison"}
                  onChange={() => update("modeRecuperation", "livraison")}
                />
                <span className="font-semibold text-ardoise">
                  {t(
                    "Livraison à l'hébergement",
                    "Delivery to your accommodation",
                  )}
                </span>
                <span className="block text-sm text-slate-700">
                  {deliveryProduct ? eur(deliveryProduct.priceCents) : ""}
                </span>
              </label>
            </div>
            <div
              id="info-recuperation"
              role="note"
              className="mt-3 rounded-2xl border border-primary/30 bg-primary-light p-4 text-sm text-ardoise"
            >
              {data.modeRecuperation === "retrait" ? (
                <>
                  <p className="font-bold">
                    🏪 {t("Retrait en agence", "Collection at our office")}
                    {stationLabel ? ` · ${stationLabel}` : ""}
                  </p>
                  <p className="mt-1 text-slate-700">
                    {t(
                      "Votre commande vous attend toute la journée, aux horaires d'ouverture.",
                      "Your order is ready all day, during opening hours.",
                    )}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-sapin px-4 py-3 text-white">
                    <span className="text-2xl" aria-hidden>
                      ❄️
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                        {t("Hiver · 7j/7", "Winter · 7 days a week")}
                      </p>
                      <p className="text-lg font-bold">
                        {t(
                          "9h – 12h  ·  15h – 19h",
                          "9am – 12pm  ·  3pm – 7pm",
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">
                    ☀️{" "}
                    {t(
                      "Été : du mardi au dimanche, 9h30 – 12h et 15h30 – 18h30 (fermé le lundi).",
                      "Summer: Tuesday to Sunday, 9:30am – 12pm and 3:30pm – 6:30pm (closed Mondays).",
                    )}
                  </p>
                  <p className="mt-3 flex items-center gap-2 font-semibold">
                    📱{" "}
                    {t(
                      "Présentez votre bon de commande (papier ou sur téléphone).",
                      "Show your order form (printed or on your phone).",
                    )}
                  </p>
                </>
              ) : (
                <>
                  <strong>{t("Livraison :", "Delivery:")}</strong>{" "}
                  {t(
                    `les livraisons ont lieu le jour de votre arrivée entre ${site.deliveryWindow}.`,
                    `deliveries take place on your arrival day between ${site.deliveryWindow}. `,
                  )}
                </>
              )}
            </div>
          </fieldset>

          {data.modeRecuperation === "livraison" && (
            <label className="sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-800">
                {t(
                  "Adresse de livraison (résidence, bâtiment, n° d'appartement)",
                  "Delivery address (residence, building, apartment number)",
                )}
              </span>
              <input
                required
                autoComplete="street-address"
                value={data.adresseLivraison}
                onChange={(e) => update("adresseLivraison", e.target.value)}
                className={inputClass}
              />
            </label>
          )}
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-800">
              {t("Nom complet", "Full name")}
            </span>
            <input
              required
              autoComplete="name"
              value={data.clientNom}
              onChange={(e) => update("clientNom", e.target.value)}
              className={inputClass}
            />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-800">
              {t("Téléphone", "Phone")}
            </span>
            <input
              required
              type="tel"
              autoComplete="tel"
              value={data.clientTelephone}
              onChange={(e) => update("clientTelephone", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              {t(
                "Email (pour recevoir votre bon de commande)",
                "Email (to receive your order form)",
              )}
            </span>
            <input
              required
              type="email"
              autoComplete="email"
              value={data.clientEmail}
              onChange={(e) => update("clientEmail", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              {t("Notes (optionnel)", "Notes (optional)")}
            </span>
            <textarea
              rows={3}
              value={data.notes}
              onChange={(e) => update("notes", e.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 rounded-panel border border-slate-200 bg-neige p-4">
          <div>
            <p className="font-semibold text-ardoise">
              {t("Résumé de la commande", "Order summary")}
            </p>
            <p className="text-sm text-slate-700">
              {stationLabel} ·{" "}
              {data.dateArrivee ? fmtDate(data.dateArrivee) : "…"} →{" "}
              {data.dateDepart ? fmtDate(data.dateDepart) : "…"}
            </p>
            <p className="text-sm text-slate-700">
              {data.modeRecuperation === "livraison"
                ? t(
                    `Livraison entre ${site.deliveryWindow} — ${data.adresseLivraison}`,
                    `Delivery between ${site.deliveryWindow} — ${data.adresseLivraison}`,
                  )
                : t(
                    "Retrait en magasin pendant les heures d'ouverture",
                    "In-store collection during opening hours",
                  )}
            </p>
          </div>
          <ul className="space-y-2 text-sm">
            {selectedItems.map((item) => (
              <li
                key={item.code}
                className="flex justify-between gap-3 border-b border-slate-200 pb-2"
              >
                <span>
                  {item.name} ×{item.quantity}
                </span>
                <span className="font-medium">
                  {eur(item.priceCents * item.quantity)}
                </span>
              </li>
            ))}
            {deliveryCents > 0 && (
              <li className="flex justify-between gap-3 border-b border-slate-200 pb-2">
                <span>{deliveryProduct?.name}</span>
                <span className="font-medium">{eur(deliveryCents)}</span>
              </li>
            )}
          </ul>
          <p className="text-right text-lg font-semibold text-ardoise">
            Total : {eur(totalCents)}
          </p>
          <p className="text-xs text-slate-600">
            {t(
              `Pas de compte à créer : après paiement, votre bon de commande PDF est téléchargeable et envoyé à ${data.clientEmail}.`,
              `No account needed: after payment, your PDF order form (in French) is downloadable and sent to ${data.clientEmail}.`,
            )}
          </p>
          {standby && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              {t(
                "Paiement en ligne désactivé : site en veille hors saison.",
                "Online payment disabled: off-season mode.",
              )}
            </p>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0 || pending}
          className="rounded-full border border-slate-400 px-4 py-2.5 text-sm disabled:opacity-40"
        >
          {t("Retour", "Back")}
        </button>
        {step < STEP_COUNT - 1 ? (
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            {t("Continuer", "Continue")}
          </button>
        ) : (
          <button
            type="submit"
            disabled={pending || totalCents <= 0 || standby}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-ardoise hover:bg-accent-dark disabled:opacity-50"
          >
            {pending
              ? t("Redirection…", "Redirecting…")
              : t(`Payer ${eur(totalCents)}`, `Pay ${eur(totalCents)}`)}
          </button>
        )}
      </div>
    </form>
  );
}
