"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import { questions } from "@/data/questions";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const saved = useRef(false);
  const [saving, setSaving] = useState(false);

  const score = Number(searchParams.get("score") ?? 0);
  const total = Number(searchParams.get("total") ?? questions.length);
  const answersRaw = searchParams.get("answers");
  const answers: number[] = answersRaw ? JSON.parse(answersRaw) : [];

  const isPerfect = score === total;
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    setSaving(true);
    fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, total, answers }),
    }).finally(() => setSaving(false));
  }, [score, total, answers]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white">
      <div className="w-full max-w-md flex flex-col items-center gap-6">

        {/* ロゴ横並び */}
        <div className="flex items-center gap-4">
          <Image
            src="/STRACT_logo_660x270_white_full.png"
            alt="STRACT"
            width={90}
            height={37}
          />
          <div className="w-px h-7 bg-gray-300" />
          <Image src="/PlUG_BRANDLOGO_H.png" alt="PLUG" width={90} height={27} />
        </div>

        {/* スコア表示 */}
        <div className="flex flex-col items-center gap-3 text-center">
          {isPerfect ? (
            <>
              <div
                className="w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 shadow-lg"
                style={{ backgroundColor: "#ffbe00", borderColor: "#ffbe00" }}
              >
                <span className="text-3xl">🏆</span>
                <span className="text-xs font-black text-white mt-0.5">PERFECT!</span>
              </div>
              <h1 className="text-2xl font-black" style={{ color: "#111111" }}>全問正解！おめでとう！</h1>
            </>
          ) : (
            <>
              <div
                className="w-28 h-28 rounded-full flex flex-col items-center justify-center border-4"
                style={{ borderColor: "#1b71ff", backgroundColor: "#f0f5ff" }}
              >
                <span className="text-3xl font-black" style={{ color: "#1b71ff" }}>{score}</span>
                <span className="text-sm font-semibold" style={{ color: "#999999" }}>/ {total}</span>
              </div>
              <h1 className="text-2xl font-black" style={{ color: "#111111" }}>お疲れさまでした！</h1>
            </>
          )}

          <p className="text-sm" style={{ color: "#555555" }}>
            {total}問中 <span className="font-bold text-xl" style={{ color: "#111111" }}>{score}</span> 問正解
            <span className="ml-2 font-bold" style={{ color: isPerfect ? "#e6a800" : "#1b71ff" }}>
              ({percentage}%)
            </span>
          </p>
        </div>

        {/* 景品・ノベルティ案内 */}
        <div
          className="w-full rounded-2xl p-6 flex flex-col gap-3 border-2"
          style={{
            backgroundColor: isPerfect ? "#fff8e1" : "#f0f5ff",
            borderColor: isPerfect ? "#ffbe00" : "#1b71ff",
          }}
        >
          {isPerfect ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <h2 className="text-lg font-black" style={{ color: "#e6a800" }}>特別ノベルティプレゼント！</h2>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#555555" }}>
                全問正解達成です！スタッフにこの画面を見せて、
                <span className="font-bold" style={{ color: "#e6a800" }}>特別ノベルティ</span>
                をお受け取りください！
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎉</span>
                <h2 className="text-lg font-black" style={{ color: "#1b71ff" }}>ノベルティプレゼント！</h2>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#555555" }}>
                クイズ回答ありがとうございます！スタッフにこの画面を見せて、
                <span className="font-bold" style={{ color: "#111111" }}>ノベルティグッズ</span>
                をお受け取りください！
              </p>
            </>
          )}
        </div>

        {/* 回答まとめ */}
        <div className="w-full flex flex-col gap-2">
          <h3 className="text-sm font-bold" style={{ color: "#999999" }}>回答まとめ</h3>
          <div className="flex flex-col gap-2">
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const isCorrect = userAnswer === q.answer;
              return (
                <div
                  key={q.id}
                  className="rounded-xl px-4 py-3 flex items-center gap-3 border border-gray-100"
                  style={{ backgroundColor: "#f5f7fa" }}
                >
                  <span className="text-base flex-shrink-0">
                    {isCorrect ? "✅" : "❌"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "#111111" }}>
                      Q{i + 1}. {q.question}
                    </p>
                    {!isCorrect && (
                      <p className="text-xs mt-0.5" style={{ color: "#999999" }}>
                        正解: {q.options[q.answer]}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {saving && (
          <p className="text-xs" style={{ color: "#999999" }}>結果を保存中...</p>
        )}

        <button
          onClick={() => router.push("/")}
          className="w-full py-4 rounded-2xl text-white font-black text-base tracking-wide transition-all duration-200 active:scale-95 shadow-md"
          style={{ backgroundColor: "#1b71ff" }}
        >
          トップに戻る
        </button>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p style={{ color: "#111111" }}>読み込み中...</p>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
