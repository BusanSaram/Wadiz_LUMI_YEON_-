"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import {
  questions,
  scoreAnswers,
  encodeScores,
  type Choice,
} from "@/lib/colorTest";
import { ease, Eyebrow } from "@/components/modern";

// 좌측 아트 패널 사진 — 4문항마다 교체 (데스크톱 전용 스플릿)
// 홈에서 쓰지 않는 색 조합 페어 컷들로만 구성 (사진 중복 방지)
const artImages = [
  { src: "/knots/pair-1.jpg?v=5", alt: "빨강과 네이비 매듭 팔찌 페어" },
  { src: "/knots/pair-2.jpg?v=5", alt: "초록과 주황 매듭 팔찌 페어" },
  { src: "/knots/pair-3.jpg?v=5", alt: "자주와 금색 매듭 팔찌 페어" },
  { src: "/knots/pair-4.jpg?v=5", alt: "금색과 초록 매듭 팔찌 페어" },
  { src: "/knots/pair-5.jpg?v=5", alt: "자주와 핑크 매듭 팔찌 페어" },
];

export default function TestPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Choice[]>([]);

  const total = questions.length;
  const question = questions[step];
  const progress = Math.round((step / total) * 100);
  const activeArt = Math.floor(step / 4) % artImages.length;

  function pick(choice: Choice) {
    const next = [...answers, choice];
    if (step + 1 < total) {
      setAnswers(next);
      setStep(step + 1);
    } else {
      const scores = encodeScores(scoreAnswers(next));
      router.push(`/result?s=${scores}`);
    }
  }

  function back() {
    if (step === 0) return;
    setAnswers(answers.slice(0, -1));
    setStep(step - 1);
  }

  return (
    // reducedMotion="user": 시스템 '동작 줄이기' 설정 시 이동은 끄고 opacity만 유지
    <MotionConfig reducedMotion="user">
    <div className="w-full lg:grid lg:min-h-[calc(100svh-4rem)] lg:grid-cols-2">
      {/* 좌측 아트 패널 — 데스크톱 전용, 4문항마다 크로스페이드.
          모든 컷을 미리 쌓아 프리로드하고 opacity만 바꿔 검은 플래시 없이 스르르 전환한다. */}
      <div className="relative hidden overflow-hidden bg-surface lg:block">
        {artImages.map((a, i) => (
          <motion.div
            key={a.src}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === activeArt ? 1 : 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <Image
              src={a.src}
              alt={a.alt}
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
          </motion.div>
        ))}
        <div className="absolute bottom-6 left-6 rounded-full bg-ink/70 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
          LUMIYEON COLOR TEST
        </div>
      </div>

      {/* 우측 테스트 컬럼 */}
      <div className="flex flex-col justify-center">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-18 lg:px-12">
          {/* 진행 헤더 */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <Eyebrow>Color Test</Eyebrow>
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="text-sm font-semibold text-muted transition-colors hover:text-foreground disabled:invisible"
              >
                ← 이전
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-sm font-semibold tabular-nums">
                  {String(step + 1).padStart(2, "0")}
                  <span className="text-muted"> / {String(total).padStart(2, "0")}</span>
                </span>
                <span className="font-mono text-xs tabular-nums text-muted">
                  {progress}%
                </span>
              </div>
              {/* 필 진행 바 — 스프링 */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
                <motion.div
                  className="h-full rounded-full bg-foreground"
                  initial={false}
                  animate={{ width: `${Math.max(progress, 2)}%` }}
                  transition={{ type: "spring", duration: 0.55, bounce: 0 }}
                />
              </div>
            </div>
          </div>

          {/* 질문 전환 */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              className="flex flex-col gap-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease }}
            >
              <h1 className="text-balance text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-4xl">
                {question.text}
              </h1>

              {/* 카드형 선택지 */}
              <ul className="flex flex-col gap-3">
                {question.choices.map((choice, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: 0.04 + i * 0.05, ease }}
                  >
                    <button
                      type="button"
                      onClick={() => pick(choice)}
                      className="group flex w-full items-center gap-4 rounded-2xl bg-surface px-6 py-5 text-left text-base font-medium transition-[background-color,transform,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:bg-foreground hover:text-background hover:shadow-lg active:scale-[0.99] sm:px-7"
                    >
                      <span className="flex-1">{choice.label}</span>
                      <span
                        className="text-muted transition-[transform,color] duration-150 group-hover:translate-x-1 group-hover:text-background"
                        aria-hidden
                      >
                        →
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
    </MotionConfig>
  );
}
