"use client";

// ────────────────────────────────────────────────────────────
// 경량 유튜브 임베드 — 처음엔 로컬 썸네일만 그리고,
// 클릭한 순간에만 iframe(nocookie)을 붙인다. LCP/스크립트 부담 없음.
// ────────────────────────────────────────────────────────────

import { useState } from "react";
import Image from "next/image";

export function YouTubeLite({
  id,
  title,
  poster,
  className = "",
}: {
  /** 유튜브 영상 ID */
  id: string;
  /** 접근성 라벨 + iframe title */
  title: string;
  /** 로컬 썸네일 경로 (public/) */
  poster: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-3xl bg-ink ${className}`}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`${title} 재생`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(min-width: 1024px) 900px, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          {/* 재생 버튼 대비를 위한 은은한 딤 */}
          <span
            className="absolute inset-0 bg-ink/25 transition-colors duration-150 ease-out group-hover:bg-ink/35"
            aria-hidden
          />
          <span
            className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink transition-transform duration-150 ease-out group-hover:scale-105 group-active:scale-[0.97] sm:h-20 sm:w-20"
            aria-hidden
          >
            {/* 재생 삼각형 — 시각 중심을 맞추려 살짝 우측으로 */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-0.5 h-6 w-6 sm:h-7 sm:w-7"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
