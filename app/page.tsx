import Link from "next/link";
import Image from "next/image";

export default function TopPage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-white px-6 py-10">
      <div className="w-full max-w-md flex flex-col items-center gap-8">

        {/* ロゴ横並び */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <Image
              src="/STRACT_logo_660x270_white_full.png"
              alt="STRACT"
              width={100}
              height={41}
            />
            <div className="w-px h-8 bg-gray-300" />
            <Image
              src="/PlUG_BRANDLOGO_H.png"
              alt="PLUG"
              width={100}
              height={30}
            />
          </div>
          <p className="text-xs font-bold tracking-wider text-center" style={{ color: "#1b71ff" }}>
            Product Management Summit 2026 Quiz Challenge
          </p>
        </div>

        {/* 説明カード */}
        <div className="w-full rounded-2xl p-6 flex flex-col gap-4 border border-gray-100"
          style={{ backgroundColor: "#f5f7fa" }}>
          <h2 className="text-lg font-bold text-center" style={{ color: "#111111" }}>クイズに挑戦しよう！</h2>
          <p className="text-sm leading-relaxed text-center" style={{ color: "#555555" }}>
            全<span className="font-bold" style={{ color: "#111111" }}>5問</span>の3択クイズです。<br />
            STRACTやプロダクト「PLUG」について<br />
            楽しんで知っていただけたら嬉しいです！
          </p>

          <div className="flex flex-col gap-3 pt-1">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100">
              <span className="text-xl">🏆</span>
              <span className="text-sm font-medium" style={{ color: "#111111" }}>
                全問正解で
                <span className="font-bold ml-1" style={{ color: "#1b71ff" }}>特別ノベルティプレゼント！</span>
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100">
              <span className="text-xl">🎁</span>
              <span className="text-sm font-medium" style={{ color: "#111111" }}>
                回答完了で
                <span className="font-bold ml-1" style={{ color: "#ffbe00" }}>ノベルティゲット！</span>
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs" style={{ color: "#999999" }}>所要時間：約3〜5分</p>

        <Link
          href="/quiz"
          className="w-full py-4 rounded-2xl text-center text-white font-black text-lg tracking-wide transition-all duration-200 active:scale-95 shadow-md"
          style={{ backgroundColor: "#1b71ff" }}
        >
          スタート →
        </Link>

      </div>
    </main>
  );
}
