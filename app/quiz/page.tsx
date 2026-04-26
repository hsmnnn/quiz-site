"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { questions } from "@/data/questions";

type AnswerState = "unanswered" | "confirmed_correct" | "confirmed_incorrect";

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  function handleSelect(optionIndex: number) {
    if (answerState !== "unanswered") return;
    setSelected(optionIndex);
  }

  function handleConfirm() {
    if (selected === null) return;
    const isCorrect = selected === currentQuestion.answer;
    setAnswerState(isCorrect ? "confirmed_correct" : "confirmed_incorrect");
  }

  function handleNext() {
    const newAnswers = [...answers, selected!];
    if (isLastQuestion) {
      const score = newAnswers.filter(
        (ans, i) => ans === questions[i].answer
      ).length;
      const params = new URLSearchParams({
        score: String(score),
        total: String(questions.length),
        answers: JSON.stringify(newAnswers),
      });
      router.push(`/result?${params.toString()}`);
    } else {
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setAnswerState("unanswered");
    }
  }

  function handleBack() {
    if (currentIndex === 0) return;
    const newAnswers = answers.slice(0, -1);
    setAnswers(newAnswers);
    setCurrentIndex(currentIndex - 1);
    setSelected(null);
    setAnswerState("unanswered");
  }

  function getOptionStyle(optionIndex: number): React.CSSProperties {
    if (answerState === "unanswered") {
      return {
        backgroundColor: selected === optionIndex ? "#e8f0ff" : "#ffffff",
        borderColor: selected === optionIndex ? "#1b71ff" : "#e5e7eb",
        color: "#111111",
      };
    }
    if (optionIndex === currentQuestion.answer) {
      return {
        backgroundColor: "#fff8e1",
        borderColor: "#ffbe00",
        color: "#111111",
      };
    }
    if (optionIndex === selected && answerState === "confirmed_incorrect") {
      return {
        backgroundColor: "#f5f5f5",
        borderColor: "#cccccc",
        color: "#999999",
      };
    }
    return {
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
      color: "#cccccc",
    };
  }

  return (
    <main className="min-h-screen flex flex-col px-6 py-8 bg-white">
      <div className="w-full max-w-md mx-auto flex flex-col gap-6 flex-1">

        {/* ヘッダー */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/STRACT_logo_660x270_white_full.png"
                alt="STRACT"
                width={60}
                height={25}
              />
              <div className="w-px h-5 bg-gray-300" />
              <Image src="/PlUG_BRANDLOGO_H.png" alt="PLUG" width={56} height={17} />
            </div>
            <button
              onClick={() => setShowRestartConfirm(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200"
              style={{ color: "#999999", borderColor: "#e5e7eb" }}
            >
              最初からやり直す
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold" style={{ color: "#999999" }}>
              問題 {currentIndex + 1} / {questions.length}
            </span>
            <div className="w-full h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: "#1b71ff" }}
              />
            </div>
          </div>
        </div>

        {/* 問題文 */}
        <div className="rounded-2xl p-6 border border-gray-100" style={{ backgroundColor: "#f5f7fa" }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1b71ff" }}>
            Q{currentIndex + 1}
          </div>
          <p className="font-bold text-lg leading-relaxed" style={{ color: "#111111" }}>
            {currentQuestion.question}
          </p>
        </div>

        {/* 選択肢 */}
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answerState !== "unanswered"}
              className="w-full text-left px-5 py-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200 active:scale-98 disabled:cursor-default"
              style={getOptionStyle(i)}
            >
              <span
                className="inline-block w-6 h-6 rounded-full text-center text-xs font-black mr-3 align-middle"
                style={{
                  backgroundColor:
                    answerState !== "unanswered" && i === currentQuestion.answer
                      ? "#ffbe00"
                      : "#e8f0ff",
                  color:
                    answerState !== "unanswered" && i === currentQuestion.answer
                      ? "#111111"
                      : "#1b71ff",
                  lineHeight: "1.5rem",
                }}
              >
                {["A", "B", "C"][i]}
              </span>
              {option}
            </button>
          ))}
        </div>

        {/* フィードバック */}
        {answerState !== "unanswered" && (
          <div
            className="rounded-2xl px-5 py-4 flex flex-col gap-3"
            style={{
              backgroundColor: answerState === "confirmed_correct" ? "#fff8e1" : "#f5f5f5",
              borderLeft: `4px solid ${answerState === "confirmed_correct" ? "#ffbe00" : "#cccccc"}`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {answerState === "confirmed_correct" ? "🎉" : "😢"}
              </span>
              <div>
                <p className="font-black text-sm"
                  style={{ color: answerState === "confirmed_correct" ? "#e6a800" : "#999999" }}>
                  {answerState === "confirmed_correct" ? "正解！" : "不正解..."}
                </p>
                {answerState === "confirmed_incorrect" && (
                  <p className="text-xs mt-0.5" style={{ color: "#555555" }}>
                    正解は「{currentQuestion.options[currentQuestion.answer]}」
                  </p>
                )}
              </div>
            </div>
            {/* 解説 */}
            <div className="border-t pt-3" style={{ borderColor: answerState === "confirmed_correct" ? "#ffd54f" : "#e0e0e0" }}>
              <p className="text-xs font-bold mb-1" style={{ color: answerState === "confirmed_correct" ? "#e6a800" : "#999999" }}>
                解説
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#555555" }}>
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
        )}

        {/* ボタンエリア */}
        <div className="flex gap-3 mt-auto">
          {/* 前の問題に戻る */}
          {currentIndex > 0 && answerState === "unanswered" && (
            <button
              onClick={handleBack}
              className="flex-1 py-4 rounded-2xl font-bold text-base tracking-wide transition-all duration-200 active:scale-95 border-2"
              style={{ color: "#1b71ff", borderColor: "#1b71ff", backgroundColor: "#ffffff" }}
            >
              ← 前の問題
            </button>
          )}

          {/* 回答ボタン（選択後・確定前） */}
          {answerState === "unanswered" && (
            <button
              onClick={handleConfirm}
              disabled={selected === null}
              className="flex-1 py-4 rounded-2xl text-white font-black text-base tracking-wide transition-all duration-200 active:scale-95 shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#1b71ff" }}
            >
              回答する
            </button>
          )}

          {/* 次へ／結果を見る（確定後） */}
          {answerState !== "unanswered" && (
            <button
              onClick={handleNext}
              className="flex-1 py-4 rounded-2xl text-white font-black text-base tracking-wide transition-all duration-200 active:scale-95 shadow-md"
              style={{ backgroundColor: "#1b71ff" }}
            >
              {isLastQuestion ? "結果を見る →" : "次の問題 →"}
            </button>
          )}
        </div>
      </div>

      {/* やり直し確認モーダル */}
      {showRestartConfirm && (
        <div className="fixed inset-0 flex items-center justify-center px-6 z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
            <h2 className="text-lg font-black" style={{ color: "#111111" }}>最初からやり直しますか？</h2>
            <p className="text-sm" style={{ color: "#555555" }}>
              現在の回答はリセットされます。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm border-2"
                style={{ color: "#999999", borderColor: "#e5e7eb" }}
              >
                キャンセル
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white"
                style={{ backgroundColor: "#1b71ff" }}
              >
                トップへ戻る
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
