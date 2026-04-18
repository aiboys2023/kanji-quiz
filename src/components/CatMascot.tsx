"use client";

export type CatMood =
  | "happy"
  | "wave"
  | "thinking"
  | "excited"
  | "encourage"
  | "result-high"
  | "result-mid"
  | "result-low"
  | "super";

interface Props {
  mood: CatMood;
  className?: string;
  size?: number;
}

const STROKE = "#000";
const FUR = "#FFECD2";
const EAR = "#FFB8C9";

/** Pop ステッカー風ネコ（太枠・パステル塗り） */
export default function CatMascot({
  mood,
  className = "",
  size = 200,
}: Props) {
  const superMode = mood === "super";
  const thinking = mood === "thinking";
  const excited = mood === "excited" || mood === "result-high";
  const encourage = mood === "encourage" || mood === "result-low";
  const wave = mood === "wave";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      <ellipse
        cx="100"
        cy="120"
        rx="72"
        ry="62"
        fill={FUR}
        stroke={STROKE}
        strokeWidth="3"
      />
      <path
        d="M55 75 L45 35 L85 60 Z M145 75 L155 35 L115 60 Z"
        fill={EAR}
        stroke={STROKE}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {superMode && (
        <ellipse cx="100" cy="55" rx="58" ry="14" fill={STROKE} opacity="0.85" />
      )}
      <ellipse cx="78" cy="108" rx="10" ry="14" fill={STROKE} />
      <ellipse cx="122" cy="108" rx="10" ry="14" fill={STROKE} />
      {thinking && (
        <>
          <circle cx="78" cy="100" r="4" fill="#fff" />
          <circle cx="122" cy="100" r="4" fill="#fff" />
          <path
            d="M70 95 Q78 88 86 95"
            fill="none"
            stroke={STROKE}
            strokeWidth="2"
          />
          <path
            d="M114 95 Q122 88 130 95"
            fill="none"
            stroke={STROKE}
            strokeWidth="2"
          />
        </>
      )}
      {excited && !thinking && (
        <>
          <path
            d="M72 118 Q78 128 84 118"
            fill="none"
            stroke={STROKE}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M116 118 Q122 128 128 118"
            fill="none"
            stroke={STROKE}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
      {encourage && !thinking && (
        <path
          d="M88 125 Q100 118 112 125"
          fill="none"
          stroke={STROKE}
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
      {!thinking && !excited && !encourage && (
        <path
          d="M88 122 Q100 132 112 122"
          fill="none"
          stroke={STROKE}
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
      <ellipse cx="100" cy="135" rx="8" ry="6" fill="#FF9EBB" opacity="0.6" />
      {wave && (
        <path
          d="M155 130 Q175 110 165 95 Q175 80 155 75"
          fill="none"
          stroke={STROKE}
          strokeWidth="4"
          strokeLinecap="round"
          className="origin-[155px_110px] animate-[wave_1.2s_ease-in-out_infinite]"
        />
      )}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-18deg); }
        }
      `}</style>
    </svg>
  );
}
