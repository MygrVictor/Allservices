"use client";

import { useEffect, useRef } from "react";

const STATIC = "https://static.systempay.fr/static/js/krypton-client/V4.0";

/**
 * Formulaire de carte Systempay (Krypton). Le script lit les attributs
 * kr-* et se monte sur la div .kr-embedded. Il est injecté une seule fois.
 */
export function SystempayForm({
  publicKey,
  formToken,
  successUrl,
}: {
  publicKey: string;
  formToken: string;
  successUrl: string;
}) {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${STATIC}/ext/neon-reset.min.css`;
    document.head.appendChild(css);

    const theme = document.createElement("script");
    theme.src = `${STATIC}/ext/neon.js`;
    document.head.appendChild(theme);

    const script = document.createElement("script");
    script.src = `${STATIC}/stable/kr-payment-form.min.js`;
    script.setAttribute("kr-public-key", publicKey);
    script.setAttribute("kr-language", "fr-FR");
    script.setAttribute(
      "kr-post-url-success",
      new URL(successUrl, window.location.origin).toString(),
    );
    document.head.appendChild(script);
  }, [publicKey, successUrl]);

  return <div className="kr-embedded" kr-form-token={formToken} />;
}

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    "kr-form-token"?: string;
  }
}
