"use client";

// ────────────────────────────────────────────────────────────
// "Mono" 공통 프리미티브 (DESIGN.md) — 흑백 조화 풀모던.
// page / test / result 공용. 새 variants를 만들지 말고 이걸 쓸 것.
// ────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

/** 공용 이징 — 강한 ease-out */
export const ease = [0.22, 1, 0.36, 1] as const;

/** 뷰포트 진입 시 1회 fade + y 리빌 */
export function Reveal({
  children,
  className,
  y = 16,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  as?: "div" | "h2" | "li" | "p";
}) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </MotionTag>
  );
}

/** 작은 볼드 캡스 라벨 */
export function Eyebrow({
  children,
  onDark = false,
}: {
  children: React.ReactNode;
  onDark?: boolean;
}) {
  return (
    <span
      className={`text-xs font-bold uppercase tracking-[0.22em] ${
        onDark ? "text-white/50" : "text-muted"
      }`}
    >
      {children}
    </span>
  );
}

/** 필 버튼 공통 클래스 */
export const pill = {
  /** 블랙 채움 (화이트 섹션용) */
  dark: "inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/85 active:scale-[0.97]",
  /** 화이트 채움 (블랙 섹션용) */
  light:
    "inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-white/85 active:scale-[0.97]",
  /** 아웃라인 (블랙 섹션용) */
  outlineOnDark:
    "inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-white/10 active:scale-[0.97]",
  /** 아웃라인 (화이트 섹션용) */
  outline:
    "inline-flex items-center justify-center gap-2 rounded-full border border-line px-8 py-4 text-sm font-semibold text-foreground transition-[background-color,transform] duration-150 ease-out hover:bg-surface active:scale-[0.97]",
  /** 와디즈 CTA 전용 */
  wadiz:
    "inline-flex items-center justify-center gap-2 rounded-full bg-wadiz px-8 py-4 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-wadiz/90 active:scale-[0.97]",
};

/** 뷰포트 진입 시 숫자 카운트업 (블랙 밴드 통계용) */
export function CountUp({
  to,
  suffix = "",
  duration = 1.2,
  className = "",
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {val}
      {suffix}
    </span>
  );
}
