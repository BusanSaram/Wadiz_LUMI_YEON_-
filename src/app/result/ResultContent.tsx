"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, MotionConfig } from "motion/react";
import {
  colors,
  decodeScores,
  toPercent,
  rank,
  type ColorKey,
} from "@/lib/colorTest";
import { isAndroid, isInAppBrowser, openInDefaultBrowser } from "@/lib/inApp";
import { WADIZ_URL } from "@/lib/links";
import { ease, Eyebrow, pill } from "@/components/modern";

// OG 결과지 이미지 캐시 버스터.
// /result/image 는 immutable 1년 캐시라, 디자인을 바꾸면 이 숫자를 올려야
// 사용자 브라우저·CDN이 새 이미지를 받아온다.
const OG_VERSION = 2;

// 색 이름 텍스트 컬러 클래스 — Tailwind JIT가 리터럴을 스캔하도록 정적 매핑.
// (동적 문자열 조립은 프로덕션 빌드에서 purge되어 색이 안 먹음)
const NAME_TEXT: Record<ColorKey, string> = {
  red: "text-t-red",
  orange: "text-t-orange",
  yellow: "text-t-yellow",
  green: "text-t-green",
  blue: "text-t-blue",
  violet: "text-t-purple",
  pink: "text-t-pink",
};

// 인앱 웹뷰 여부 + 안드로이드 여부를 SSR 안전하게 노출 (마운트 후 판별).
// iOS 인앱은 Web Share가 정상 동작하므로 안내가 불필요 → 안드로이드만 안내한다.
function useInAppInfo() {
  const [info, setInfo] = useState({ inApp: false, android: false });
  useEffect(() => {
    setInfo({ inApp: isInAppBrowser(), android: isAndroid() });
  }, []);
  return info;
}

// 리포트 섹션 타이틀
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{children}</h2>
  );
}

export default function ResultContent() {
  const params = useSearchParams();
  const scores = decodeScores(params.get("s"));

  const [saving, setSaving] = useState(false);
  // 공유/저장 결과 안내 문구 (공유 모달을 못 띄운 환경에서 사용자에게 상황 전달)
  const [hint, setHint] = useState<string | null>(null);
  // 결과 이미지 파일을 미리 받아둔다. iOS Safari는 navigator.share()가 사용자
  // 제스처 '직후'에만 허용되는데, 클릭 후 fetch를 await하면 활성이 만료되어
  // 공유 시트가 안 뜬다. 미리 받아두면 클릭 시 await 없이 즉시 공유 가능.
  const fileRef = useRef<File | null>(null);
  const s = params.get("s") ?? "";

  useEffect(() => {
    if (!s) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/result/image?s=${encodeURIComponent(s)}&v=${OG_VERSION}`);
        if (!res.ok || cancelled) return;
        const blob = await res.blob();
        if (cancelled) return;
        fileRef.current = new File([blob], "lumiyeon-color-result.png", {
          type: "image/png",
        });
      } catch {
        /* 프리페치 실패 시 클릭 시점에 다시 시도 */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [s]);

  function saveFile(file: File) {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    // 공유 모달 없이 곧바로 저장된 경우 — 어디 갔는지 모르지 않도록 안내
    setHint("이미지를 저장했어요. 사진첩 또는 다운로드 폴더를 확인해 주세요.");
  }

  // 결과 이미지는 서버(/result/image, next/og)에서 생성한다.
  // 브라우저 DOM 캡처(html-to-image)는 iOS Safari에서 착용샷이 빈칸으로 저장되고
  // 화질도 낮은 문제가 있어, 기기와 무관하게 동일·선명한 서버 렌더로 대체.
  async function handleDownload() {
    if (saving) return;
    setHint(null);

    // 프리페치된 파일이 있으면 제스처 내에서 즉시 공유(활성 유지) →
    // iOS에서 공유 시트의 "이미지 저장"으로 사진첩에 바로 넣을 수 있다.
    const cached = fileRef.current;
    if (cached && navigator.canShare?.({ files: [cached] })) {
      try {
        await navigator.share({ files: [cached] });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        saveFile(cached);
        return;
      }
    }

    // 아직 준비 전이거나 공유 미지원: 가져와서 공유/다운로드.
    setSaving(true);
    try {
      let file = fileRef.current;
      if (!file) {
        const res = await fetch(`/result/image?s=${encodeURIComponent(s)}&v=${OG_VERSION}`);
        if (!res.ok) throw new Error(`이미지 생성 실패: ${res.status}`);
        file = new File([await res.blob()], "lumiyeon-color-result.png", {
          type: "image/png",
        });
        fileRef.current = file;
      }
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
          return;
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return;
        }
      }
      saveFile(file);
    } catch (e) {
      console.error("결과 이미지 저장 실패:", e);
      setHint("이미지 저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  }

  // 결과 없이 직접 진입한 경우 → 테스트로 유도
  if (!scores) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-28 text-center">
        <Eyebrow>Color Test</Eyebrow>
        <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
          아직 테스트 결과가 없어요
        </h1>
        <p className="max-w-sm text-pretty leading-relaxed text-muted">
          간단한 컬러 테스트로 나의 색을 먼저 찾아볼까요?
        </p>
        <Link href="/test" className={`${pill.dark} group mt-2`}>
          컬러 테스트 시작하기
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    );
  }

  const percent = toPercent(scores);
  const ranked = rank(scores);
  const topKeys = ranked.slice(0, 2).map((e) => e[0]);
  const bottomKeys = ranked
    .slice(-2)
    .map((e) => e[0])
    .reverse(); // 가장 적은 색이 먼저
  const maxPercent = percent[ranked[0][0]] || 1;
  const top = colors[topKeys[0]];

  return (
    <MotionConfig reducedMotion="user">
    <div className="flex flex-col">
      {/* 헤더 — 블랙 블록 */}
      <header className="bg-ink">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-7 px-6 py-20 text-center sm:py-24">
          <Eyebrow onDark>Color Report</Eyebrow>
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease }}
          >
            <p className="text-base text-white/55 sm:text-lg">
              내 안에 가장 많은 색은
            </p>
            {/* 색 이름을 그 색으로 크게 — 원 대신 타이포로 표현 */}
            <h1
              className={`text-7xl font-extrabold leading-none tracking-tight sm:text-8xl ${NAME_TEXT[topKeys[0]]}`}
            >
              {top.name}
            </h1>
          </motion.div>
          <motion.p
            className="max-w-md text-pretty leading-relaxed text-white/60"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
          >
            {top.identity}
          </motion.p>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-12 px-6 py-14 sm:py-16">
        {/* 1. 컬러 분포 — 순차 채움 애니메이션 */}
        <section className="flex flex-col gap-6">
          <SectionTitle>컬러 분포</SectionTitle>
          <ul className="flex flex-col gap-3.5">
            {ranked.map(([k], i) => (
              <li key={k} className="flex items-center gap-3">
                <span className="w-12 shrink-0 text-sm font-medium text-foreground/70">
                  {colors[k].name}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface">
                  <motion.div
                    className={`h-full rounded-full ${colors[k].dot}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(percent[k] / maxPercent) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.06, ease }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right font-mono text-xs tabular-nums text-muted">
                  {percent[k]}%
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 2. 내 안에 많은 컬러 */}
        <section className="flex flex-col gap-6">
          <SectionTitle>내 안에 많은 컬러</SectionTitle>
          {topKeys.map((k) => (
            <ColorBlock key={k} colorKey={k} variant="high" />
          ))}
        </section>

        {/* 3. 셀프케어 확언 — 블랙 카드 */}
        <AffirmationCard colorKey={topKeys[0]} />

        {/* 4. 내 안에 적은 컬러 */}
        <section className="flex flex-col gap-6">
          <SectionTitle>내 안에 적은 컬러</SectionTitle>
          {bottomKeys.map((k) => (
            <ColorBlock key={k} colorKey={k} variant="low" />
          ))}
        </section>

        {/* 5. 추천 매듭 팔찌 */}
        <section className="flex flex-col gap-6">
          <SectionTitle>추천 매듭 팔찌</SectionTitle>
          <BraceletCard colorKey={topKeys[0]} tag="나를 표현하는 팔찌" />
          <BraceletCard colorKey={bottomKeys[0]} tag="균형을 채우는 팔찌" />
        </section>

        {/* 6. CTA */}
        <div data-noexport className="flex flex-col items-stretch gap-3 sm:flex-row">
          <a
            href={WADIZ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${pill.wadiz} group flex-1`}
          >
            와디즈에서 팔찌 보기
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <Link href="/test" className={`${pill.outline} flex-1`}>
            테스트 다시 하기
          </Link>
        </div>

        {/* 7. 공유 · 저장 */}
        <ShareCard
          topKey={topKeys[0]}
          onDownload={handleDownload}
          saving={saving}
          hint={hint}
          setHint={setHint}
        />

        {/* 참고 문헌 */}
        <p className="text-center text-xs leading-relaxed text-muted">
          참고 문헌 · 『울고 있지만 립스틱은 빨갛게』 김옥기 (트라이온) ·{" "}
          『만화로 읽는 색채심리 1』 포포 프로덕션 지음 · 서인숙 옮김
        </p>
      </div>
    </div>
    </MotionConfig>
  );
}

// ── 컬러 상세 블록 (많은/적은 컬러 공용) ──────────────────────────
function ColorBlock({
  colorKey,
  variant,
}: {
  colorKey: ColorKey;
  variant: "high" | "low";
}) {
  const c = colors[colorKey];
  return (
    <div className="flex gap-4 rounded-3xl bg-surface p-6 sm:p-7">
      <span className={`mt-1 h-11 w-11 shrink-0 rounded-2xl ${c.dot}`} aria-hidden />
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-lg font-bold tracking-tight">{c.name}</p>
          <p className="text-sm leading-relaxed text-muted">{c.identity}</p>
        </div>

        {variant === "high" ? (
          <>
            <p className="text-pretty leading-relaxed text-foreground/80">{c.resultCopy}</p>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">
                긍정 에너지
              </p>
              <div className="flex flex-wrap gap-1.5">
                {c.energy.map((e) => (
                  <span
                    key={e}
                    className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground/70"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted">✱ {c.shadow}</p>
          </>
        ) : (
          <>
            <p className="text-pretty leading-relaxed text-foreground/80">{c.lowCopy}</p>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">
                이럴 때 좋아요
              </p>
              <div className="flex flex-wrap gap-1.5">
                {c.howToUse.map((h) => (
                  <span
                    key={h}
                    className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground/70"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── 셀프케어 확언 카드 — 블랙 ────────────────────────────────────
function AffirmationCard({ colorKey }: { colorKey: ColorKey }) {
  const c = colors[colorKey];
  return (
    <section className="flex flex-col items-center gap-6 rounded-3xl bg-ink px-7 py-11 text-center sm:px-10 sm:py-13">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} aria-hidden />
        <Eyebrow onDark>Self-care Affirmation</Eyebrow>
      </div>
      <p className="max-w-lg text-pretty text-lg font-semibold leading-[1.7] tracking-tight text-white sm:text-xl">
        “{c.affirmation}”
      </p>
    </section>
  );
}

// ── 추천 팔찌 카드 ───────────────────────────────────────────────
function BraceletCard({ colorKey, tag }: { colorKey: ColorKey; tag: string }) {
  const c = colors[colorKey];
  return (
    <div className="overflow-hidden rounded-3xl bg-surface">
      {/* 도래매듭 · 평매듭 착용샷 나란히 */}
      <div className="grid grid-cols-2 gap-1 p-1">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-background">
          <Image
            src={c.wornImage}
            alt={`${c.name} 도래매듭 착용 사진`}
            fill
            sizes="(min-width: 768px) 330px, 50vw"
            className="object-cover"
            style={{ objectPosition: `${c.wornPos}% center` }}
          />
          <span className="absolute bottom-2.5 left-2.5 rounded-full bg-ink/70 px-2.5 py-1 text-[0.65rem] font-semibold text-white backdrop-blur-sm">
            도래매듭
          </span>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-background">
          <Image
            src={c.flatWornImage}
            alt={`${c.name} 평매듭 착용 사진`}
            fill
            sizes="(min-width: 768px) 330px, 50vw"
            className="object-cover"
            style={{ objectPosition: `${c.flatWornPos}% center` }}
          />
          <span className="absolute bottom-2.5 left-2.5 rounded-full bg-ink/70 px-2.5 py-1 text-[0.65rem] font-semibold text-white backdrop-blur-sm">
            평매듭
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 p-6 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{tag}</p>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} aria-hidden />
          <p className="text-lg font-bold tracking-tight">{c.name} 매듭 팔찌</p>
        </div>
        <p className="text-sm leading-relaxed text-muted">{c.braceletMsg}</p>
      </div>
    </div>
  );
}

// ── 공유·저장 카드 ───────────────────────────────────────────────
function ShareCard({
  topKey,
  onDownload,
  saving,
  hint,
  setHint,
}: {
  topKey: ColorKey;
  onDownload: () => void;
  saving: boolean;
  hint: string | null;
  setHint: (v: string | null) => void;
}) {
  const [copied, setCopied] = useState(false);
  const { inApp, android } = useInAppInfo();
  const c = colors[topKey];

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `내 안의 컬러는 ${c.name}! ${c.resultCopy}`;
    setHint(null);
    // 1) Web Share 지원 시 공유 모달 시도
    if (navigator.share) {
      try {
        await navigator.share({ title: "LUMIYEON 컬러 테스트", text, url });
        return;
      } catch (err) {
        // 사용자가 직접 취소한 경우만 조용히 종료.
        // 그 외(인앱 웹뷰의 거부·미지원 예외 등)는 아래 복사 폴백으로 넘어간다.
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    // 2) 폴백: 링크를 클립보드에 복사
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 3) 클립보드마저 막힌 경우 — 수동 복사 안내
      setHint("이 브라우저는 공유가 제한돼요. 아래 ‘기본 브라우저로 열기’로 열어 주세요.");
    }
  }

  return (
    <div
      data-noexport
      className="flex flex-col items-center gap-4 rounded-3xl bg-surface p-7 text-center sm:p-8"
    >
      <p className="text-sm text-muted">
        결과를 친구에게 공유하거나 이미지로 저장해보세요
      </p>
      <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
        <button type="button" onClick={share} className={pill.outline}>
          {copied ? "링크가 복사됐어요 ✓" : "결과 공유하기"}
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={saving}
          className={`${pill.dark} disabled:opacity-60`}
        >
          {saving ? "저장 중…" : "결과 이미지 저장"}
        </button>
      </div>

      {/* 저장/공유 결과 안내 (모달을 못 띄운 환경) */}
      {hint && <p className="text-xs leading-relaxed text-muted">{hint}</p>}

      {/* 안드로이드 인앱 웹뷰: 자동 전환이 실패했을 때의 수동 폴백.
          (iOS 인앱은 Web Share가 정상 동작하므로 안내하지 않는다) */}
      {inApp && android && (
        <p className="text-xs leading-relaxed text-muted">
          카카오톡·인스타 등 앱 안에서는 공유 모달이 제한돼요.{" "}
          <button
            type="button"
            onClick={openInDefaultBrowser}
            className="font-semibold text-foreground underline underline-offset-2"
          >
            기본 브라우저로 열기
          </button>
        </p>
      )}
    </div>
  );
}
