"use client";

import { useEffect } from "react";

/**
 * Le seul usage « application installée » du site est le back-office : si le
 * site est lancé en mode application sur la page d'accueil, on ouvre /admin
 * (certains téléphones ignorent l'adresse de démarrage du manifeste).
 * Une fois par session : le logo ramène ensuite normalement à l'accueil.
 */
export function StandaloneRedirect() {
  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (!standalone || window.location.pathname !== "/") return;
    try {
      if (sessionStorage.getItem("asm-admin-launched")) return;
      sessionStorage.setItem("asm-admin-launched", "1");
    } catch {
      /* ignore */
    }
    window.location.replace("/admin");
  }, []);
  return null;
}
