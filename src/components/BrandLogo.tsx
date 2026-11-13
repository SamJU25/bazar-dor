interface BrandLogoProps {
  className?: string;
}

/** BazarDor brand mark: market basket silhouette with integrated price-trend arrow. */
export default function BrandLogo({
  className = "w-6 h-6 sm:w-7 sm:h-7",
}: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`${className} shrink-0`}
    >
      <rect width="64" height="64" rx="16" fill="#15803d" />
      <path
        d="M21 25 27.5 14M43 25 36.5 14"
        stroke="#ffffff"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <rect x="11.5" y="23.5" width="41" height="5" rx="2.5" fill="#ffffff" />
      <path
        d="M14.2 27.5h35.6l-3.7 18.7a4.5 4.5 0 0 1-4.42 3.8H22.32a4.5 4.5 0 0 1-4.42-3.8L14.2 27.5Z"
        fill="#ffffff"
      />
      <path
        d="M22.5 42.5 28.5 36.5 33 40 41 32"
        stroke="#15803d"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35.5 32H41v5.5"
        stroke="#15803d"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
