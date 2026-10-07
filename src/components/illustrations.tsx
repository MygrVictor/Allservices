/**
 * Illustrations vectorielles des sections (couleurs issues du thème via
 * currentColor / variables CSS). À remplacer par des illustrations définitives
 * si un graphiste en fournit.
 */

const primary = "rgb(var(--color-primary))";
const primaryLight = "rgb(var(--color-primary-light))";
const accent = "rgb(var(--color-accent))";

/** Main tenant une clé — section Propriétaires */
export function HandKeyIllustration({
  className = "h-28 w-full",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 120"
      className={className}
      fill="none"
      role="img"
      aria-label="Main tenant une clé"
    >
      <rect x="8" y="8" width="224" height="104" rx="14" fill={primaryLight} />
      {/* clé */}
      <circle cx="150" cy="40" r="16" stroke={accent} strokeWidth="6" />
      <path
        d="M140 52 112 80m8-8 8 8m-16 0 6 6"
        stroke={accent}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* main */}
      <path
        d="M40 104V82c0-6 4-10 10-12l30-8c5-1 9 2 9 6 0 3-2 6-5 7l-14 4h30c4 0 8 3 8 8s-4 8-8 8H82"
        fill="#fff"
        stroke={primary}
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M86 75h22c4 0 7 3 7 7M90 92h20"
        stroke={primary}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="22" y="80" width="18" height="28" rx="4" fill={primary} />
    </svg>
  );
}

/** Skieurs — section Vacanciers / Packs ski */
export function SkiersIllustration({
  className = "h-28 w-full",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 120"
      className={className}
      fill="none"
      role="img"
      aria-label="Skieurs sur une piste"
    >
      <rect x="8" y="8" width="224" height="104" rx="14" fill="#E6F0FA" />
      <path d="M8 70 70 30l40 28 36-22 86 48v38H8Z" fill="#fff" />
      <path d="M70 30 58 38l12 4 10-6Z" fill={primaryLight} />
      <path d="M8 112 232 70v42Z" fill="#F1F5F9" />
      {/* skieur 1 */}
      <circle cx="96" cy="64" r="6" fill={accent} />
      <path
        d="M96 70 90 84l10 6M93 77l12-2M90 84l-8 8"
        stroke={primary}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M72 96 112 86"
        stroke={primary}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* skieur 2 (enfant) */}
      <circle cx="150" cy="72" r="5" fill={primary} />
      <path
        d="M150 77 146 88l7 4M148 82l9-2M146 88l-6 6"
        stroke={accent}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M132 98 164 90"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Plan stylisé des Arcs — section Infos pratiques */
export function ArcsMapIllustration({
  className = "h-28 w-full",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 120"
      className={className}
      fill="none"
      role="img"
      aria-label="Plan des Arcs 1800 et 2000"
    >
      <rect x="8" y="8" width="224" height="104" rx="14" fill={primaryLight} />
      <path
        d="M20 96c40-10 60-40 100-40s70-28 100-30"
        stroke="#fff"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M20 96c40-10 60-40 100-40s70-28 100-30"
        stroke={primary}
        strokeWidth="2"
        strokeDasharray="6 6"
        strokeLinecap="round"
      />
      <g>
        <path
          d="M60 80s10-8 10-15a10 10 0 1 0-20 0c0 7 10 15 10 15Z"
          fill={primary}
        />
        <circle cx="60" cy="64" r="3.5" fill="#fff" />
        <text x="44" y="100" fontSize="11" fontWeight="700" fill={primary}>
          Arc 1800
        </text>
      </g>
      <g>
        <path
          d="M184 50s10-8 10-15a10 10 0 1 0-20 0c0 7 10 15 10 15Z"
          fill={accent}
        />
        <circle cx="184" cy="34" r="3.5" fill="#fff" />
        <text x="164" y="68" fontSize="11" fontWeight="700" fill={primary}>
          Arc 2000
        </text>
      </g>
    </svg>
  );
}
