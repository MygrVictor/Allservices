"use client";

import { FormEvent, useState } from "react";
import {
  CONTACT_SUBJECTS,
  CONTACT_SUBJECTS_EN,
  contactSchema,
} from "@/lib/validation";
import { useLocale } from "@/components/locale-provider";
import { makeT } from "@/lib/i18n";

const FIELD_ERRORS_EN: Record<string, string> = {
  prenom: "Enter your first name.",
  telephone: "Invalid phone number.",
  email: "Invalid email address.",
  sujet: "Choose a subject.",
  message: "Your message is too short (10 characters min.).",
};

type FieldErrors = Partial<
  Record<"prenom" | "telephone" | "email" | "sujet" | "message", string>
>;

const inputClass =
  "w-full rounded-xl border border-slate-400 bg-white px-3.5 py-2.5 text-base text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-red-600";

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const locale = useLocale();
  const t = makeT(locale);
  const [startedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form)) as Record<
      string,
      string
    >;
    const payload = { ...raw, startedAt };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !next[key])
          next[key] =
            locale === "en"
              ? (FIELD_ERRORS_EN[key] ?? issue.message)
              : issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setServerError(null);
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setServerError(
          result.error ?? t("L'envoi a échoué.", "Sending failed."),
        );
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setServerError(
        t(
          "Erreur réseau, merci de réessayer.",
          "Network error, please try again.",
        ),
      );
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p
        role="status"
        className="mt-6 rounded-panel border border-primary/30 bg-primary-light p-4 text-ardoise"
      >
        {t(
          "Merci, votre message a bien été envoyé. Nous vous répondons rapidement.",
          "Thank you, your message has been sent. We will reply shortly.",
        )}
      </p>
    );
  }

  const field = (name: keyof FieldErrors) => ({
    name,
    id: `contact-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    className: inputClass,
  });
  const fieldError = (name: keyof FieldErrors) =>
    errors[name] ? (
      <span
        id={`contact-${name}-error`}
        className="mt-1 block text-sm text-red-700"
      >
        {errors[name]}
      </span>
    ) : null;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mt-6 grid gap-4 sm:grid-cols-2"
    >
      <div>
        <label
          htmlFor="contact-prenom"
          className="mb-1.5 block text-sm font-medium text-ardoise"
        >
          {t("Prénom", "First name")} *
        </label>
        <input {...field("prenom")} autoComplete="given-name" required />
        {fieldError("prenom")}
      </div>
      <div>
        <label
          htmlFor="contact-telephone"
          className="mb-1.5 block text-sm font-medium text-ardoise"
        >
          {t("Téléphone", "Phone")} *
        </label>
        <input {...field("telephone")} type="tel" autoComplete="tel" required />
        {fieldError("telephone")}
      </div>
      <div className="sm:col-span-2">
        <label
          htmlFor="contact-email"
          className="mb-1.5 block text-sm font-medium text-ardoise"
        >
          Email *
        </label>
        <input {...field("email")} type="email" autoComplete="email" required />
        {fieldError("email")}
      </div>
      <div className="sm:col-span-2">
        <label
          htmlFor="contact-sujet"
          className="mb-1.5 block text-sm font-medium text-ardoise"
        >
          {t("Sujet du message", "Subject")} *
        </label>
        <select
          {...field("sujet")}
          defaultValue={defaultSubject ?? ""}
          required
        >
          <option value="" disabled>
            {t("Choisir un sujet…", "Choose a subject…")}
          </option>
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {locale === "en" ? CONTACT_SUBJECTS_EN[subject] : subject}
            </option>
          ))}
        </select>
        {fieldError("sujet")}
      </div>
      <div className="sm:col-span-2">
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-sm font-medium text-ardoise"
        >
          Message *
        </label>
        <textarea {...field("message")} rows={5} required />
        {fieldError("message")}
      </div>

      {/* Champ piège anti-spam : invisible pour les humains */}
      <div
        aria-hidden
        className="absolute left-[-10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor="contact-website">Site web</label>
        <input
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {serverError && (
        <p
          role="alert"
          className="text-sm font-medium text-red-700 sm:col-span-2"
        >
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-fit items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
      >
        {status === "sending"
          ? t("Envoi…", "Sending…")
          : t("Envoyer mon message", "Send my message")}
      </button>
    </form>
  );
}
