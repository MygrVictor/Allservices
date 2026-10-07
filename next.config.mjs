/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Photos placeholder libres de droits (à remplacer par les photos fournies)
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  experimental: {
    // pdf-lib est utilisé côté serveur (bons de commande)
    serverComponentsExternalPackages: ["pdf-lib"],
  },
  async redirects() {
    return [
      // Page « Bons plans » supprimée : contenu intégré en bandeau sur l'accueil
      { source: "/bons-plans", destination: "/", statusCode: 301 },
      // Formulaire de réservation fusionné dans la page Vacanciers
      {
        source: "/reservation",
        destination: "/vacanciers#reserver",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
