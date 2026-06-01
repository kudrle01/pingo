import type { Lang } from "@/i18n/translations";

interface FlagIconProps {
  code: Lang;
  className?: string;
}

export function FlagIcon({ code, className = "" }: FlagIconProps) {
  return (
    <span
      aria-hidden
      className={`inline-flex overflow-hidden rounded-[3px] ring-1 ring-white/15 ${className}`}
    >
      {code === "cs" ? (
        <svg
          viewBox="0 0 60 40"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <rect width="60" height="20" fill="#ffffff" />
          <rect y="20" width="60" height="20" fill="#d7141a" />
          <path d="M0 0 30 20 0 40Z" fill="#11457e" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 60 30"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <clipPath id="flag-uk-clip">
            <path d="M0 0v30h60V0z" />
          </clipPath>
          <clipPath id="flag-uk-cross">
            <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
          </clipPath>
          <g clipPath="url(#flag-uk-clip)">
            <path d="M0 0v30h60V0z" fill="#012169" />
            <path d="M0 0 60 30m0-30L0 30" stroke="#ffffff" strokeWidth="6" />
            <path
              d="M0 0 60 30m0-30L0 30"
              clipPath="url(#flag-uk-cross)"
              stroke="#c8102e"
              strokeWidth="4"
            />
            <path d="M30 0v30M0 15h60" stroke="#ffffff" strokeWidth="10" />
            <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
          </g>
        </svg>
      )}
    </span>
  );
}
