// ────────────────────────────────────────────────────────────
// OG 이미지 전용 HEX 토큰 — 프로젝트에서 raw hex가 허용되는 유일한 곳.
// next/og(ImageResponse)는 CSS 변수를 읽지 못해 hex가 기술적으로 필요하다.
//
// ⚠ 동기화 규칙 (DESIGN.md "OG 이미지 동기화 절차"):
//   src/app/globals.css 의 :root 값을 바꾸면 반드시 이 파일도 같이 갱신할 것.
// ────────────────────────────────────────────────────────────

import type { ColorKey } from "./colorTest";

export const OG_HEX = {
  /** = --background (순백) */
  paper: "#ffffff",
  /** = --foreground (니어블랙) — 웹 --ink(#111111)와 별개로 OG 텍스트/밴드용 */
  ink: "#0a0a0a",
  /** = --surface (소프트 그레이) */
  surface: "#f4f4f5",
  /** = --muted */
  muted: "#71717a",
  /** = --therapy-* (7색) */
  t: {
    red: "#e5392e",
    orange: "#ef8a3c",
    yellow: "#f4c430",
    green: "#3fa65a",
    blue: "#2e78c8",
    violet: "#8b5cf6",
    pink: "#f48fb1",
  } satisfies Record<ColorKey, string>,
} as const;

// 참고: route.tsx 내 반투명 색은 rgba(10,10,10,α)(니어블랙) 리터럴을 사용한다.
// ink 값 변경 시 함께 치환할 것.
