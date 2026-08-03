@AGENTS.md

# Palette Knot — 프로젝트 하네스

## 무엇을 만드는가
한국 전통 매듭 팔찌 + 컬러테라피 브랜드 **Palette Knot**의 홈페이지.
와디즈 써머 기획전 링크로 유입된 사용자가 **컬러 심리 테스트**를 하고,
결과에 맞는 **전통 매듭 팔찌 색상**을 추천받는다. 로그인 없음.

## 기술 스택
- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v4 (CSS-first, `@theme`)
- Claude API 호출은 서버 라우트 핸들러 경유 (`/api/color-test`)
- 배포: Vercel

## 하네스 규칙 (반드시 지킬 것)
1. raw hex 하드코딩 금지 (예외: `src/lib/ogTokens.ts` 1곳 — OG 이미지 기술 제약).
   `globals.css`의 토큰만 사용: `bg-background/foreground/ink/surface`, `border-line`, `text-muted`, `bg-t-*`(테라피 7색), `bg-wadiz`.
   디자인 단일 소스는 루트 `DESIGN.md`("Mono" 흑백 모던) — UI 작업 전 필독.
2. **TypeScript strict 통과 필수.** `npm run build`가 깨지면 배포 불가.
3. **이미지는 `next/image`의 `<Image>` 컴포넌트만** 사용. `<img>` 금지.
4. **Claude API 키는 클라이언트에 절대 노출 금지.** 반드시 `/api/color-test` 라우트 핸들러 경유.
5. **Next.js 16은 학습 데이터와 다를 수 있다.** API 작성 전 `node_modules/next/dist/docs/` 확인.

## 페이지 구조
- `/` 메인 랜딩 — 브랜드 헤드라인 + "나의 컬러 찾기" CTA
- `/test` 컬러 심리 테스트 (카드 선택형 UX)
- `/result` 팔찌 추천 결과 + 와디즈 CTA
- `/about` 브랜드/제품 소개

> 검사지 문항 · 색상 매핑 · 팔찌 추천 로직은 추후 내용 전달 시 채운다.

## 자주 쓰는 명령
- `npm run dev` — 로컬 개발 서버
- `npm run build` — 프로덕션 빌드 + 타입체크 (배포 전 게이트)
- `npm run lint` — ESLint

## 디렉토리
- `src/app/` — 페이지 라우트
- `src/components/` — 재사용 컴포넌트
- `src/app/api/` — 서버 라우트 핸들러
- `.claude/agents/` — 역할별 서브에이전트
- `.claude/commands/` — 슬래시 커맨드
- `.claude/memory/` — 설계 결정 기록
