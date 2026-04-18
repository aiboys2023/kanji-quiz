import Link from "next/link";
import CatMascot from "@/components/CatMascot";

export default function HomePage() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <div className="flex justify-center">
          <CatMascot mood="wave" size={160} className="drop-shadow-md" />
        </div>
        <div className="sticker w-full max-w-sm rounded-3xl bg-pink px-6 py-6">
          <h1 className="text-[1.75rem] font-black tracking-wide text-white md:text-[2rem]">
            漢字クイズ N3
          </h1>
          <p className="mt-2 text-[1rem] font-bold text-white/90">
            JLPT N3 いっしょにれんしゅう！
          </p>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-4">
          <Link
            href="/settings?mode=reading"
            className="retro-btn flex min-h-12 items-center gap-4 rounded-2xl bg-orange px-5 py-4 text-left text-[1.2rem] font-bold text-white"
          >
            <span className="text-4xl" aria-hidden>
              👀
            </span>
            <span>
              読み方モード
              <span className="mt-1 block text-[0.95rem] font-medium text-white/85">
                漢字 → ひらがな
              </span>
            </span>
          </Link>

          <Link
            href="/settings?mode=kanji"
            className="retro-btn flex min-h-12 items-center gap-4 rounded-2xl bg-blue px-5 py-4 text-left text-[1.2rem] font-bold text-white"
          >
            <span className="text-4xl" aria-hidden>
              ✍️
            </span>
            <span>
              漢字モード
              <span className="mt-1 block text-[0.95rem] font-medium text-white/85">
                4択で漢字をえらぶ
              </span>
            </span>
          </Link>

          <Link
            href="/daily"
            className="retro-btn flex min-h-12 items-center justify-center rounded-2xl bg-purple px-5 py-4 text-[1.2rem] font-bold text-white"
          >
            📅 デイリーチャレンジ（10問）
          </Link>
        </div>
      </div>
    </main>
  );
}
