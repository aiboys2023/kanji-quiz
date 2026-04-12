"use client";

const ICONS = ["★", "♡", "✦", "☺", "⚡", "✿", "◆", "♪"];

interface Props {
  density?: number;
}

export default function StickerDeco({ density = 12 }: Props) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: density }).map((_, i) => (
        <span
          key={i}
          className="absolute text-[1.4rem] md:text-[1.6rem] opacity-[0.18] animate-float select-none"
          style={{
            left: `${(i * 17 + 5) % 92}%`,
            top: `${(i * 23 + 3) % 88}%`,
            color: ["#FF6B9D", "#FFD93D", "#6BCB77", "#4D96FF", "#9B59B6", "#FF8C42"][
              i % 6
            ],
            animationDelay: `${(i % 5) * 0.35}s`,
            transform: `rotate(${(i * 31) % 40 - 20}deg)`,
          }}
        >
          {ICONS[i % ICONS.length]}
        </span>
      ))}
    </div>
  );
}
