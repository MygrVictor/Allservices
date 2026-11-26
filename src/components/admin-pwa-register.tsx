"use client";

import { useEffect } from "react";

/** Enregistre le service worker qui permet d'installer le back-office. */
export function AdminPwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/admin-sw.js").catch(() => {});
    }
  }, []);
  return null;
}
