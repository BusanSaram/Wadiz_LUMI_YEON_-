# LUMIYEON — DESIGN.md

> **"Mono"** — 흑백이 조화된 완전 모던 룩. 순백과 니어블랙이 교차하고, 색은 오직 7가지 테라피 컬러와 제품 사진에서만 팝으로 터진다.
> 이 문서가 룩의 단일 소스다. UI를 만들거나 고칠 때 반드시 이 문서를 따른다.
> 레퍼런스: Lazyweb 리서치 — lucky-beard/marko-jotic(블랙 드라마), square/factory(화이트 커머스), flora(카드 퀴즈).

---

## 1. Visual Theme & Atmosphere

- **무드**: 모던 프로덕트/커머스. 흑↔백 섹션이 교차하며 리듬을 만들고, 컬러는 흑백 위에서 보석처럼 강조.
- **밀도**: 낮음~중간. 큰 볼드 타이포 + 넉넉한 여백 + 라운드 카드.
- **금지**: 세리프, 오방색/전통 장식, № 넘버링, 괘선(hairline rule), 도록식 캡션.

## 2. Color Palette & Roles

모든 색은 `src/app/globals.css` 토큰 경유. **raw hex 하드코딩 금지** (예외: `src/lib/ogTokens.ts` 1곳 — OG 이미지 기술 제약).

| 토큰 | 값 | 역할 |
| --- | --- | --- |
| `--background` (`bg-background`) | `#ffffff` | 순백 — 기본 배경 |
| `--foreground` (`text-foreground`) | `#0a0a0a` | 니어블랙 — 텍스트/블랙 버튼 |
| `--ink` (`bg-ink`) | `#0a0a0a` | **블랙 섹션 배경** (히어로/공예/CTA/푸터) — 내부 텍스트는 `text-white`/`text-white/60` |
| `--surface` (`bg-surface`) | `#f4f4f5` | 소프트 그레이 — 카드/블록 |
| `--line` (`border-line`) | 블랙 8% | 헤어라인 구분 (헤더 하단 등 최소한만) |
| `--muted` (`text-muted`) | `#71717a` | 보조 텍스트 |
| `--wadiz` (`bg-wadiz`) | `#00c4c4` | 와디즈 CTA 버튼 **전용** |
| `--therapy-*` (`bg-t-red` … `bg-t-purple` `bg-t-pink`) | 7색 | **데이터 색** (테스트/결과/스와치) — 값 변경 금지 |

## 3. Typography Rules

| 역할 | 폰트 | 스타일 |
| --- | --- | --- |
| 히어로 헤드라인 | **Pretendard** (`font-sans` 기본) | `clamp(3rem,9vw,7rem)`, weight 800(`font-extrabold`), `tracking-tight`, `leading-[1.02]`, `text-balance` |
| 섹션 타이틀 | Pretendard | `text-3xl sm:text-5xl font-extrabold tracking-tight` |
| 본문 | Pretendard | `text-base~lg`, 400/500, `leading-relaxed`, `text-pretty` |
| Eyebrow 라벨 | Pretendard | `text-xs font-bold uppercase tracking-[0.22em]` (`Eyebrow` 컴포넌트) |
| 숫자(진행/퍼센트) | Geist Mono | `font-mono tabular-nums` |

- 폰트 로딩: `pretendard` npm 패키지 → `next/font/local` (layout.tsx). 세리프/Google 한글 폰트 사용 금지.

## 4. Component Stylings

- **버튼**: 필(pill, `rounded-full`) — `src/components/modern.tsx`의 `pill.dark / light / outline / outlineOnDark / wadiz` 클래스만 사용. press `active:scale-[0.97]`.
- **카드**: `rounded-2xl`~`3xl` + `bg-surface`. hover 리프트(`hover:-translate-y-0.5`~`1`) + 이미지 `scale-[1.03]` 이하. 그림자는 hover 시 은은하게만.
- **선택지(테스트)**: 라운드 카드, hover 시 블랙 반전(`hover:bg-foreground hover:text-background`).
- **스와치**: 라운드 원형, 선택 시 이중 링(`shadow-[0_0_0_3px_var(--background),0_0_0_5px_var(--foreground)]`).
- **사진**: 프레임/아웃라인 없음 — 순백 배경 사진이 페이지와 이어지게. 카드 안에서는 `overflow-hidden rounded-*`로만.

## 5. Layout Principles

- 컨테이너 `max-w-6xl px-6 sm:px-8`, 섹션 리듬 `py-24 sm:py-32`.
- **흑백 교차**: 홈 = 블랙(히어로) → 화이트(팔레트·프로덕트·갤러리) → 블랙(공예) → 화이트(3스텝) → 블랙(CTA·푸터).
- 히어로는 좌측 정렬, 나머지 섹션 헤더도 좌측 정렬. CTA 밴드만 중앙.
- 모바일 퍼스트 (와디즈 유입 다수 모바일).

## 6. Depth & Elevation

- 위계는 **흑백 대비 > surface 블록 > 여백** 순. 테두리 최소화.
- hover 시에만 soft shadow (`hover:shadow-lg`) 허용.

## 7. Motion (모션그래픽)

- 이징 `[0.22,1,0.36,1]`(ease-out), UI 트랜지션 150ms, 리빌 0.6s. `MotionConfig reducedMotion="user"` 필수.
- **카운트업**: `CountUp` (modern.tsx) — 뷰포트 진입 1회.
- **진행바**: 스프링 `{type:"spring", duration:0.55, bounce:0}`.
- **분포바**: `whileInView` 순차 채움 (delay `i*0.06`).
- `transition-all` 금지 — 속성 명시. `AnimatePresence`는 `initial={false}`.

## 8. Responsive Behavior

- 브레이크포인트 Tailwind 기본. 테스트 페이지는 `lg`부터 스플릿(좌 사진/우 문항), 미만은 단일 컬럼.
- 터치 타겟 44×44px 이상 (필 버튼 py-4, 스와치 h-12+).

## 9. Agent Prompt Guide

- "블랙 섹션" → `bg-ink` + 내부 `text-white`/`text-white/60`, "회색 카드" → `bg-surface rounded-3xl`, "보조 텍스트" → `text-muted`.
- 버튼은 `modern.tsx`의 `pill.*`, 리빌은 `Reveal`, 라벨은 `Eyebrow` — 새 variants 만들지 말 것.
- 색 변경 시: `globals.css` 수정 → **`src/lib/ogTokens.ts` 동기화** → `/result/image` 재생성 육안 확인.

## OG 이미지 동기화 절차

1. `globals.css`의 `:root` 값 변경.
2. `src/lib/ogTokens.ts`의 `OG_HEX`를 같은 값으로 갱신 (유일한 hex 허용처).
3. `npm run dev` → `/result/image?s=...` 육안 확인 (route 캐시 immutable — 배포가 CDN 캐시를 무효화함).
