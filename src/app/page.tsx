"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import { COLOR_ORDER, colors } from "@/lib/colorTest";
import { ease, Eyebrow, Reveal, pill, CountUp } from "@/components/modern";
import { YouTubeLite } from "@/components/YouTubeLite";

const palette = COLOR_ORDER.map((k) => ({ key: k, ...colors[k] }));

// 매듭 2종 — 프로덕트 카드 데이터
const knots = [
  {
    name: "도래매듭 팔찌",
    sub: "마음의 중심을 잡아주는 매듭",
    body: "두 끈이 서로 감겨 중심을 잡는 도래매듭. 흔들리던 마음이 제자리로 돌아오도록, 손목 위에서 하루의 쉼표가 되어 줍니다.",
    image: "/knots/all.jpg?v=5",
  },
  {
    name: "평매듭 팔찌",
    sub: "잔잔하게 흐르는 균형의 매듭",
    body: "평평하고 고르게 짜 나가는 평매듭은 '평안함'과 '균형'의 상징. 잔잔한 결이 지친 마음을 고르게 다독여 줍니다.",
    image: "/knots/flat-all.jpg?v=5",
  },
];

const steps = [
  { no: "1", title: "색을 고르다", body: "컬러 테스트로 지금 내 마음에 필요한 색을 찾아요.", image: "/knots/threads2.jpg?v=5", pos: 50, gif: false },
  { no: "2", title: "매듭을 짓다", body: "한 올 한 올, 손으로 천천히 매듭을 엮어요.", image: "/knots/knotting.gif", pos: 50, gif: true },
  { no: "3", title: "손목에 두르다", body: "나만의 색이 바쁜 하루 곁에 가만히 머물러요.", image: "/knots/moment-dog.jpg?v=5", pos: 40, gif: false },
];

// 가로 드래그 스크롤 컨테이너 (관성) — 갤러리 공용
function DragScroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
    lastX: 0,
    vx: 0,
    raf: 0,
  });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(drag.current.raf);
    const d = drag.current;
    d.active = true;
    d.startX = e.clientX;
    d.startScroll = el.scrollLeft;
    d.moved = false;
    d.lastX = e.clientX;
    d.vx = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    const d = drag.current;
    if (!d.active || !el) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) {
      d.moved = true;
      el.setPointerCapture(e.pointerId);
    }
    el.scrollLeft = d.startScroll - dx;
    d.vx = e.clientX - d.lastX;
    d.lastX = e.clientX;
  };
  const onPointerUp = () => {
    const el = ref.current;
    const d = drag.current;
    d.active = false;
    if (!el) return;
    let v = d.vx;
    const decay = () => {
      if (Math.abs(v) < 0.4) return;
      el.scrollLeft -= v;
      v *= 0.92;
      d.raf = requestAnimationFrame(decay);
    };
    if (Math.abs(v) > 1.5) {
      d.raf = requestAnimationFrame(decay);
    }
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
      className="flex cursor-grab select-none gap-4 overflow-x-auto pb-4 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x_pan-y] [&::-webkit-scrollbar]:hidden"
    >
      {children}
      <span className="shrink-0 pr-1" aria-hidden />
    </div>
  );
}

// 색깔 카드 — 눌러 뒤집으면 의미가 보이는 3D 플립
function ColorFlipCard({ c }: { c: (typeof palette)[number] }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-label={`${c.name} 의미 보기`}
      className="w-44 shrink-0 text-left [perspective:1000px] sm:w-52"
    >
      <div
        className={`relative mb-3 aspect-[4/5] transition-transform duration-500 [transform-style:preserve-3d] [-webkit-transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        }`}
      >
        {/* 앞면 — 색면 */}
        <div
          className={`absolute inset-0 rounded-3xl [backface-visibility:hidden] [-webkit-backface-visibility:hidden] ${c.dot}`}
        >
          <span className="absolute right-4 top-4 text-sm text-white/70" aria-hidden>
            ↻
          </span>
        </div>
        {/* 뒷면 — 의미 */}
        <div className="absolute inset-0 flex flex-col justify-end gap-2 rounded-3xl bg-surface p-5 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} aria-hidden />
          <span className="text-lg font-bold tracking-tight">{c.mean}</span>
          <p className="text-sm leading-relaxed text-muted">{c.desc}</p>
        </div>
      </div>
      <div className="flex items-baseline justify-between px-1">
        <span className="font-semibold">{c.name}</span>
        <span className="text-sm text-muted">
          {flipped ? "다시 뒤집기 ↻" : "눌러서 의미 ↻"}
        </span>
      </div>
    </button>
  );
}

// 매듭 카드 — 눌러 뒤집으면 일반샷 ↔ 착용샷 전환
function KnotFlipCard({
  c,
  knot = "dorae",
}: {
  c: (typeof palette)[number];
  knot?: "dorae" | "flat";
}) {
  const [flipped, setFlipped] = useState(false);
  const isFlat = knot === "flat";
  const front = isFlat ? c.flatImage : c.image;
  const back = isFlat ? c.flatWornImage : c.wornImage;
  const backPos = isFlat ? c.flatWornPos : c.wornPos;
  const knotName = isFlat ? "평매듭" : "도래매듭";
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-label={`${c.name} ${knotName} 착용샷 보기`}
      className="w-80 shrink-0 text-left [perspective:1200px] sm:w-96"
    >
      <div
        className={`relative mb-3 aspect-[3/2] transition-transform duration-500 [transform-style:preserve-3d] [-webkit-transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        }`}
      >
        {/* 앞면 — 일반샷 */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl bg-surface [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
          <Image
            src={front}
            alt={`${c.name} ${knotName} 단독컷`}
            fill
            sizes="(min-width: 640px) 384px, 320px"
            className="object-cover"
          />
          <span
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/85 text-sm text-foreground/70 backdrop-blur-sm"
            aria-hidden
          >
            ↻
          </span>
        </div>
        {/* 뒷면 — 착용샷 */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl bg-surface [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Image
            src={back}
            alt={`${c.name} ${knotName} 착용샷`}
            fill
            sizes="(min-width: 640px) 384px, 320px"
            className="object-cover"
            style={{ objectPosition: `${backPos}% center` }}
          />
        </div>
      </div>
      <div className="flex items-baseline justify-between px-1">
        <span className="flex items-center gap-2 font-semibold">
          <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} aria-hidden />
          {c.name} {knotName}
        </span>
        <span className="text-sm text-muted">{flipped ? "착용컷" : "눌러서 착용컷 ↻"}</span>
      </div>
    </button>
  );
}

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
    <div className="flex flex-col">
      {/* 1. Hero — 착용 사진을 희미하게 깔고 좌측에 볼드 타이포 (사진 우측이 손, 좌측이 여백) */}
      <section className="relative overflow-hidden">
        <Image
          src="/knots/lifestyle-hero.jpg?v=9"
          alt="레드·네이비 매듭 팔찌를 착용한 손목"
          fill
          priority
          sizes="100vw"
          // 2800x1400 와이드 — 좌측은 흰 여백(텍스트 자리), 팔찌는 약 (73%, 30%) 지점
          className="object-cover object-[73%_30%]"
        />
        {/* 아주 옅은 전체 베일 — 팔찌 색이 죽지 않을 만큼만 */}
        <div className="absolute inset-0 bg-background/10" aria-hidden />
        {/* 좌측 페이드 — 텍스트가 놓이는 왼쪽만 하얗게, 팔찌가 놓이는 60% 지점부터는 투명 */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-background from-15% via-background/40 via-42% to-transparent to-66%"
          aria-hidden
        />
        {/* 하단 그라데이션 — 다음 화이트 섹션으로 매끄러운 전환 */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto flex min-h-[82svh] w-full max-w-6xl flex-col items-start justify-center px-6 py-24 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <Eyebrow>Color Therapy × Korean Knot</Eyebrow>
          </motion.div>

          <motion.h1
            className="mt-6 text-balance text-[clamp(3rem,9vw,7rem)] font-extrabold leading-[1.02] tracking-tight text-foreground"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
          >
            나의 색을
            <br />
            매듭으로 엮다
          </motion.h1>

          <motion.p
            className="mt-8 max-w-md text-pretty text-lg leading-relaxed text-foreground/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease }}
          >
            컬러 테스트로 지금 나에게 필요한 색을 찾고, 손으로 엮은 전통 매듭
            팔찌를 만나 보세요.
          </motion.p>

        </div>
      </section>

      {/* 이름과 철학 */}
      <section className="mx-auto w-full max-w-3xl px-6 pt-24 pb-10 text-center sm:px-8 sm:pt-32 sm:pb-14">
        <Reveal>
          <Eyebrow>The Name</Eyebrow>
        </Reveal>
        <Reveal
          as="h2"
          className="mt-6 text-balance text-3xl font-extrabold tracking-tight sm:text-5xl"
        >
          루미 연 <span className="text-muted">LUMI YEON</span>
        </Reveal>
        <Reveal as="p" className="mx-auto mt-7 max-w-xl text-pretty leading-relaxed text-muted">
          빛을 뜻하는 라틴어{" "}
          <span className="font-semibold text-foreground">Lumi</span>와 인연·연결을
          뜻하는 한자{" "}
          <span className="font-semibold text-foreground">연(緣·連)</span>이 만난
          이름이에요. 빛으로 몸과 마음을 편안하게 이어 준다는 뜻을 담았어요.
        </Reveal>

        <Reveal className="mx-auto mt-16 max-w-2xl border-t border-line pt-12">
          <Eyebrow>Philosophy</Eyebrow>
          <p className="mt-6 text-pretty leading-relaxed text-muted">
            루미연은 내 마음에 컬러 에너지를 채우는 컬러테라피적 가치와, 그
            기운이 흩어지지 않도록 단단히 고정하는 전통 매듭 팔찌를 현대적
            감성으로 융합했습니다. 한국 전통 매듭 방식인 도래매듭과 평매듭을
            현대적 감각으로 섬세하게 되살린{" "}
            <span className="font-semibold text-foreground">100% 수작업 팔찌</span>
            입니다.
          </p>
          <p className="mt-4 text-pretty leading-relaxed text-muted">
            공장에서 기계로 빠르게 찍어내기보다, 내 소중한 인연이 지닐
            물건이라는 마음으로 정직한 힘을 다해 정성껏 완성합니다.
          </p>
        </Reveal>
      </section>

      {/* 2. 팔레트 — 화이트, 인터랙티브 스와치 */}
      <section id="therapy" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 pt-12 pb-24 sm:px-8 sm:pt-16 sm:pb-32">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <Eyebrow>Color Therapy</Eyebrow>
            <h2 className="max-w-2xl text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
              일곱 가지 색,
              <br />
              일곱 가지 마음
            </h2>
            <p className="max-w-xl text-pretty leading-relaxed text-muted">
              색 카드를 눌러 뒤집으면 그 색의 의미가 보여요.
            </p>
          </div>
          <span className="shrink-0 text-sm font-medium text-muted">밀어서 둘러보기 →</span>
        </Reveal>
        <Reveal className="mt-12">
          <DragScroller>
            {palette.map((c) => (
              <ColorFlipCard key={c.key} c={c} />
            ))}
          </DragScroller>
        </Reveal>
      </section>

      {/* 2-1. 자격 — 컬러테라피 수료증 (테스트의 근거) */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-8 sm:pb-32">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start">
            <Reveal>
              <Eyebrow>Certified</Eyebrow>
            </Reveal>
            <Reveal
              as="h2"
              className="mt-5 text-balance text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-5xl"
            >
              컬러테라피스트와 AI가
              <br />
              함께 만든 컬러 검사지
            </Reveal>
            <Reveal as="p" className="mt-7 max-w-md text-pretty leading-relaxed text-muted">
              본 서비스는 퍼스널 이미지 브랜딩 연구소(PIB) 및 일본 JCLTA 컬러테라피 과정을
              수료한 컬러테라피스트의 자문과 AI(인공지능) 기술을 이용하여 만든 컬러
              검사지입니다.
            </Reveal>
            <Reveal className="mt-8 flex max-w-md flex-col gap-4 border-t border-line pt-8">
              {[
                {
                  title: "컬러테라피스트 자문",
                  body: "국내외 과정을 수료한 테라피스트의 자문을 바탕으로 컬러 검사지를 설계했습니다.",
                },
                {
                  title: "AI 기술 이용",
                  body: "AI 기술을 활용하여 체계적인 컬러 검사지 문항을 구축했습니다.",
                },
              ].map((it) => (
                <div key={it.title} className="flex flex-col gap-1">
                  <span className="text-sm font-bold tracking-tight">{it.title}</span>
                  <p className="text-sm leading-relaxed text-muted">{it.body}</p>
                </div>
              ))}
            </Reveal>
            <Reveal as="p" className="mt-8 max-w-md text-pretty leading-relaxed text-muted">
              PIB 및 JCLTA 과정을 수료한 컬러테라피스트의 자문과 AI를 이용해 만든 컬러
              검사지를 통해, 당신만을 위한 맞춤형 컬러 힐링 솔루션을 확인해 보세요.
            </Reveal>
          </div>
          <Reveal className="grid grid-cols-2 gap-4">
            {[
              {
                src: "/knots/cert-jclta.jpg?v=5",
                alt: "일본컬러라이트테라피협회 JCLTA 컬러 프랙티셔너 수료증",
                label: "JCLTA 일본컬러라이트테라피협회",
                sub: "Color Practitioner Course · 2016",
              },
              {
                src: "/knots/cert-pib.jpg?v=5",
                alt: "PIB연구소 컬러테라피 기초 과정 수료증",
                label: "PIB연구소",
                sub: "Color Therapy Basic Course · 2016",
              },
            ].map((c) => (
              <div key={c.src} className="rounded-3xl bg-surface p-3">
                {/* 문서라 잘림 없이 전체가 보여야 함 — object-contain */}
                <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-background">
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 1024px) 270px, 45vw"
                    className="object-contain"
                  />
                </div>
                <p className="px-1 pt-3 text-xs font-bold tracking-tight">{c.label}</p>
                <p className="px-1 pb-1 pt-0.5 text-xs text-muted">{c.sub}</p>
              </div>
            ))}
          </Reveal>
        </div>
        {/* 유의사항 — 의학적 진단이 아님을 고지 */}
        <Reveal as="p" className="mt-12 text-pretty text-xs leading-relaxed text-muted">
          ※ 본 컬러 검사지는 컬러테라피스트의 자문 및 AI 기술을 이용해 제작된 심리 코칭
          가이드이며, 의학적인 진단이나 치료를 대신할 수 없습니다.
        </Reveal>
      </section>

      {/* 3. 프로덕트 — 매듭 2종 대형 카드 */}
      <section id="knot" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 pb-24 sm:px-8 sm:pb-32">
        <Reveal className="flex flex-col gap-4">
          <Eyebrow>The Knots</Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
            두 가지 매듭
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {knots.map((k, i) => (
            <Reveal
              key={k.name}
              delay={i * 0.08}
              className="group overflow-hidden rounded-3xl bg-surface transition-transform duration-200 ease-out hover:-translate-y-1"
            >
              {/* 전체샷 원본 비율(3:2) 그대로 — 7색 라인업이 크롭 없이 다 보이게 */}
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={k.image}
                  alt={k.name}
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col gap-2 p-7 sm:p-8">
                <p className="text-sm font-semibold text-muted">{k.sub}</p>
                <h3 className="text-2xl font-bold tracking-tight">{k.name}</h3>
                <p className="text-pretty leading-relaxed text-muted">{k.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4. 착용 갤러리 — 가로 스크롤 */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-8 sm:pb-32">
        <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <Eyebrow>On Wrist</Eyebrow>
            <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
              손목 위의 일곱 색
            </h2>
            <p className="max-w-xl text-pretty leading-relaxed text-muted">
              카드를 눌러 뒤집으면 손목에 닿은 모습을 볼 수 있어요.
            </p>
          </div>
          <span className="text-sm font-medium text-muted">밀어서 둘러보기 →</span>
        </Reveal>
        <div className="flex flex-col gap-12">
          {/* 도래매듭 줄 */}
          <Reveal className="flex flex-col gap-4">
            <span className="text-sm font-bold tracking-tight text-foreground">
              도래매듭
            </span>
            <DragScroller>
              {palette.map((c) => (
                <KnotFlipCard key={`${c.key}-dorae`} c={c} />
              ))}
            </DragScroller>
          </Reveal>
          {/* 평매듭 줄 */}
          <Reveal className="flex flex-col gap-4">
            <span className="text-sm font-bold tracking-tight text-foreground">
              평매듭
            </span>
            <DragScroller>
              {palette.map((c) => (
                <KnotFlipCard key={`${c.key}-flat`} c={c} knot="flat" />
              ))}
            </DragScroller>
          </Reveal>
        </div>
      </section>

      {/* 브랜드 선언 — 여름 한정이 아닌, 모든 계절의 팔찌 */}
      <section className="mx-auto w-full max-w-3xl px-6 pb-24 text-center sm:px-8 sm:pb-32">
        <Reveal>
          <Eyebrow>Lumi Yeon</Eyebrow>
        </Reveal>
        <Reveal
          as="h2"
          className="mt-6 text-balance text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-5xl"
        >
          잠깐 스쳐가는
          <br />
          여름 액세서리가 아닙니다
        </Reveal>
        <Reveal as="p" className="mx-auto mt-7 max-w-xl text-pretty leading-relaxed text-muted">
          매일 지친 일상 속, 나에게 가장 필요한 기운을 채워줄 시간. 모든 계절의
          경계를 넘어 나의 모든 순간에 스며듭니다.
        </Reveal>
      </section>

      {/* 계절 — 여름/겨울 소매 대비로 '계절을 타지 않는다'를 증명 */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-8 sm:pb-32">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* 좌: 긴팔 소매 착용컷 두 컷 나란히 (계절 라벨 없이) */}
          <Reveal className="grid grid-cols-2 gap-3">
            {[
              { src: "/knots/season-summer.jpg?v=5", alt: "셔츠 소매에 착용한 레드 매듭 팔찌" },
              { src: "/knots/season-winter.jpg?v=5", alt: "니트 소매에 착용한 네이비 매듭 팔찌" },
            ].map((s) => (
              <div
                key={s.src}
                className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-surface"
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1024px) 275px, 45vw"
                  className="object-cover"
                />
              </div>
            ))}
          </Reveal>
          <div className="flex flex-col items-start">
            <Reveal>
              <Eyebrow>All Season</Eyebrow>
            </Reveal>
            <Reveal
              as="h2"
              className="mt-5 text-balance text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-5xl"
            >
              계절을 타지 않는 단정함,
              <br />
              일상 속의 스며듦
            </Reveal>
            <Reveal as="p" className="mt-7 max-w-md text-pretty leading-relaxed text-muted">
              여름의 얇은 셔츠 소매부터 겨울의 니트까지, 긴팔 소매 끝에 은은하게
              스며들어 모든 계절 당신의 일상에 맑은 에너지를 채워 드릴게요.
            </Reveal>
          </div>
        </div>
      </section>

      {/* 레이어드 — 자유로운 스타일링 */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-8 sm:pb-32">
        <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <Eyebrow>Layered Styling</Eyebrow>
            <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
              나의 스타일에 맞춘
              <br />
              자유로운 레이어드
            </h2>
            <p className="max-w-2xl text-pretty leading-relaxed text-muted">
              정해진 답은 없습니다. 소장하고 계신 시계, 반지, 가죽팔찌나 실버
              주얼리, 또는 도래매듭과 평매듭을 함께 자유롭게 매칭해 보세요. 일상의
              어떤 소재와도 자연스럽게 어우러지며 당신만의 고유한 힐링 스타일을
              완성해 줍니다.
            </p>
          </div>
          <span className="shrink-0 text-sm font-medium text-muted">밀어서 둘러보기 →</span>
        </Reveal>
        <Reveal>
          <DragScroller>
            {[
              { src: "/knots/layer-knots.jpg?v=5", label: "도래매듭과 평매듭 함께" },
              { src: "/knots/layer-watch.jpg?v=5", label: "시계와 함께" },
              { src: "/knots/layer-applewatch.jpg?v=5", label: "애플워치와 함께" },
              { src: "/knots/layer-silver.jpg?v=5", label: "실버 볼체인과 함께" },
              { src: "/knots/layer-stone.jpg?v=5", label: "스톤 팔찌와 함께" },
              { src: "/knots/layer-bangle.jpg?v=5", label: "골드 뱅글과 함께" },
            ].map((s) => (
              <div key={s.src} className="flex shrink-0 flex-col gap-3">
                <div className="relative h-56 w-80 overflow-hidden rounded-3xl bg-surface sm:h-64 sm:w-96">
                  <Image
                    src={s.src}
                    alt={s.label}
                    fill
                    sizes="(min-width: 640px) 384px, 320px"
                    className="object-cover"
                  />
                </div>
                <p className="px-1 text-sm font-semibold text-muted">{s.label}</p>
              </div>
            ))}
          </DragScroller>
        </Reveal>
      </section>

      {/* 인연 — 함께 나누는 맑은 에너지 */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-8 sm:pb-32">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start lg:order-1">
            <Reveal>
              <Eyebrow>Share the Light</Eyebrow>
            </Reveal>
            <Reveal
              as="h2"
              className="mt-5 text-balance text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-5xl"
            >
              소중한 인연과 함께
              <br />
              나누는 맑은 에너지
            </Reveal>
            <Reveal as="p" className="mt-7 max-w-md text-pretty leading-relaxed text-muted">
              소중한 인연과 함께 일상의 힐링을 나누어 보세요. 사랑하는 가족부터
              고마운 친구까지, 내 곁의 소중한 이들에게 내면을 채워줄 빛깔을
              선물해 보세요.
            </Reveal>
          </div>
          <Reveal className="relative aspect-square overflow-hidden rounded-3xl bg-surface lg:order-2">
            <Image
              src="/knots/gift-together.jpg?v=5"
              alt="세 사람이 매듭 팔찌를 나란히 착용한 손목"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* 5. 공예 스토리 — 블랙 밴드 + 카운트업 + 제작 영상 */}
      <section className="bg-ink">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pt-24 pb-16 sm:px-8 sm:pt-32 sm:pb-20 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/knots/threads.jpg?v=5"
              alt="일곱 빛깔로 염색된 실"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </Reveal>
          <div className="flex flex-col items-start">
            <Reveal
              as="h2"
              className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl"
            >
              한 올 한 올,
              <br />
              색을 입힌 실
            </Reveal>
            <Reveal as="p" className="mt-7 max-w-md text-pretty leading-relaxed text-white/60">
              저희 실은 면사에 컬러를 직접 염색한 뒤, 촘촘하고 밀도 있게 짜
              내려가기 때문에 빛깔이 곱고 은은한 광택이 흘러 고급스러운 느낌을
              줍니다. 한 타래를 짜는 데 한 시간 정도 걸릴 만큼, 천천히 정성 들여
              짜여집니다.
            </Reveal>
            <Reveal className="mt-10 grid w-full max-w-sm grid-cols-2 gap-6 border-t border-white/10 pt-8">
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-extrabold tracking-tight text-white">
                  <CountUp to={1} suffix="시간" />
                </span>
                <span className="text-xs text-white/50">한 타래를 짜는 시간</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-extrabold tracking-tight text-white">
                  <CountUp to={7} suffix="색" />
                </span>
                <span className="text-xs text-white/50">컬러테라피</span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* 제작 영상 — 100% 수작업의 증거 */}
        <div className="mx-auto w-full max-w-5xl px-6 pb-24 sm:px-8 sm:pb-32">
          <Reveal className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4">
              <Eyebrow onDark>Handmade</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                기계가 아니라,
                <br />
                손으로 짓습니다
              </h2>
            </div>
            <p className="max-w-sm text-pretty leading-relaxed text-white/60">
              실을 고르고 매듭을 엮어 하나의 팔찌가 되기까지, 모든 과정을 직접
              손으로 작업합니다. 영상으로 확인해 보세요.
            </p>
          </Reveal>
          <Reveal className="mt-10">
            <YouTubeLite
              id="H-zb1R1QqSE"
              title="루미연 LUMIYEON | 도래매듭 팔찌, 100% 손으로 직접 만듭니다"
              poster="/knots/craft-video.jpg?v=5"
            />
          </Reveal>
        </div>
      </section>

      {/* 6. 제작 3스텝 */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
        <Reveal className="flex flex-col gap-4">
          <Eyebrow>How It Works</Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
            색에서 손목까지
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal
              as="li"
              key={s.no}
              delay={i * 0.08}
              className="overflow-hidden rounded-3xl bg-surface"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: `center ${s.pos}%` }}
                  // GIF는 최적화를 끄지 않으면 정지 이미지로 변환됨
                  unoptimized={s.gif}
                />
              </div>
              <div className="flex flex-col gap-1.5 p-6">
                <span className="text-xs font-bold text-muted">STEP {s.no}</span>
                <h3 className="text-lg font-bold tracking-tight">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* 6-1. 착용법 영상 — 조절 매듭 사용법 */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-8 sm:pb-32">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-14">
          <div className="flex flex-col items-start">
            <Reveal>
              <Eyebrow>How to Wear</Eyebrow>
            </Reveal>
            <Reveal
              as="h2"
              className="mt-5 text-balance text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-5xl"
            >
              팔찌 매듭,
              <br />
              이렇게 매세요
            </Reveal>
            <Reveal as="p" className="mt-7 max-w-md text-pretty leading-relaxed text-muted">
              끈 양쪽을 당기면 조여지고, 매듭을 밀면 다시 넉넉해지는 조절
              매듭이에요. 잠금장치 없이 누구나 손목 굵기에 맞춰 편하게 착용할 수
              있습니다.
            </Reveal>
          </div>
          <Reveal>
            <YouTubeLite
              id="zbOVsMnXsu4"
              title="루미연 LUMIYEON | 팔찌 매는법"
              poster="/knots/wear-video.jpg?v=5"
            />
          </Reveal>
        </div>
      </section>

      {/* 7. CTA — 블랙 */}
      <section className="bg-ink">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-28 text-center sm:px-8 sm:py-36">
          <Reveal>
            <Eyebrow onDark>Find Your Color</Eyebrow>
          </Reveal>
          <Reveal
            as="h2"
            className="mt-6 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl"
          >
            이제, 당신의 색을
            <br />
            찾을 차례
          </Reveal>
          <Reveal as="p" className="mt-7 max-w-md text-pretty leading-relaxed text-white/60">
            간단한 컬러 테스트로 지금 내 마음의 색을 확인하고, 나를 다독여 줄 매듭
            팔찌를 만나 보세요.
          </Reveal>
          <Reveal className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link href="/test" className={`${pill.light} group`}>
              나의 컬러 찾기
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <a
              href="https://www.wadiz.kr"
              target="_blank"
              rel="noopener noreferrer"
              className={pill.wadiz}
            >
              와디즈에서 보기
            </a>
          </Reveal>
        </div>
      </section>
    </div>
    </MotionConfig>
  );
}
