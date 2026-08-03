# LUMIYEON · 루미 연

> **컬러테라피 × 한국 전통 매듭 팔찌** 브랜드 홈페이지
> 빛(Lumi) + 인연(緣·連)이 만난 이름, 루미 연.
> 1분 컬러 심리 테스트로 지금 나에게 필요한 색을 찾고, 그 색에 맞는 도래매듭·평매듭 팔찌를 추천받는 원페이지 커머스 랜딩.

🔗 **라이브**: https://lumiyeon.vercel.app
🏷️ **유입 경로**: 와디즈 써머 기획전 → 홈페이지 (로그인 없음)

---

## 무엇을 만들었나

와디즈 펀딩으로 유입된 사용자가 **컬러 심리 테스트**를 하고, 결과에 맞는 **전통 매듭 팔찌 색상**을 추천받는 흐름을 담은 브랜드 사이트. 결과는 이미지로 저장·공유할 수 있어 SNS 바이럴을 노린다.

```
와디즈 유입 → 홈(브랜드 스토리) → /test(20문항 컬러 테스트)
           → /result(진단 리포트 + 팔찌 추천) → 결과지 이미지 저장·공유 → 와디즈 CTA
```

---

## 핵심 기능

| 페이지 | 설명 |
|---|---|
| **`/` 홈** | 브랜드 스토리 랜딩 — 히어로, 이름·철학, 7색 컬러테라피 팔레트(플립 카드), 도래/평매듭 소개, 색상별 착용샷 갤러리(플립), 계절·레이어드 스타일링, 제작 스토리(카운트업 통계·제작 GIF), CTA |
| **`/test` 컬러 테스트** | 20문항 카드 선택형 UX. 데스크톱은 좌측 아트 패널 + 우측 문항 스플릿, 문항 전환·아트 크로스페이드 애니메이션. 채점은 100% 클라이언트에서 처리 |
| **`/result` 결과 리포트** | 가장 많은/적은 색 top2·bottom2, 컬러 분포 바(순차 채움 애니메이션), 셀프케어 확언, 색상별 추천 팔찌(도래+평매듭 착용샷), 와디즈 CTA, 공유·저장 |
| **`/result/image` 결과지 생성** | `next/og`로 결과를 **1080×2640 PNG**로 동적 렌더 → 사진첩 저장·SNS 공유용. iOS Safari 대응(서버 렌더 + Web Share 프리페치) |

### 컬러 테스트 로직
- **7색 팔레트**: 빨강·주황·노랑·초록·파랑·보라·핑크 (컬러테라피 기반)
- 20문항 × 4보기, 보기당 1색 배정 → 합산 채점 → 색 분포 산출
- 색채심리 도서 2권 참고 (『울고 있지만 립스틱은 빨갛게』, 『만화로 읽는 색채심리 1』)
- 로직·문항·채점·인코딩 전부 `src/lib/colorTest.ts` 단일 소스

---

## 디자인 시스템 — "Mono"

흑백이 조화된 완전 모던 룩. 순백과 니어블랙 섹션이 교차하고, 색은 오직 7가지 테라피 컬러와 제품 사진에서만 팝으로 터진다. (Lazyweb 25만 화면 리서치 기반으로 방향 결정)

- **컬러**: `#ffffff`(배경) · `#0a0a0a`(먹색) · `#111111`(블랙 섹션) · 7색 테라피 토큰 · 와디즈 민트(CTA 전용)
- **폰트**: Pretendard Variable(헤드라인/본문) + Geist Mono(숫자·라벨)
- **모던 문법**: 라운드 카드, 필(pill) 버튼, 플로팅 사진, 흑백 교차 섹션
- **모션**: 스크롤 리빌, 카운트업, 3D 플립 카드, 스프링 진행바, 분포 바 순차 채움 — 전부 `prefers-reduced-motion` 대응
- 📄 전체 규칙은 [`DESIGN.md`](./DESIGN.md) 참조 (UI 작업 전 필독)

**하네스 규칙**
1. raw hex 하드코딩 금지 — `globals.css` 토큰만 사용 (예외: OG 이미지용 `src/lib/ogTokens.ts` 1곳)
2. `npm run build`(TS strict) 통과 필수
3. 이미지는 `next/image`의 `<Image>`만
4. 색 데이터는 `src/lib/colorTest.ts` 단일 소스

---

## 기술 스택

- **Next.js 16** (App Router) + **React 19** + **TypeScript**(strict)
- **Tailwind CSS v4** (CSS-first `@theme` 토큰)
- **motion**(Framer Motion) — 인터랙션·애니메이션
- **next/og** — 결과지 이미지 동적 생성 (Node 런타임 + 로컬 서브셋 폰트)
- **Pretendard** — 한글 가변 폰트
- **배포**: Vercel

---

## 프로젝트 구조

```
src/
├─ app/
│  ├─ page.tsx              # 홈 랜딩
│  ├─ test/page.tsx         # 컬러 테스트
│  ├─ result/
│  │  ├─ page.tsx           # 결과 (Suspense 래퍼)
│  │  ├─ ResultContent.tsx  # 결과 리포트 UI + 공유/저장
│  │  └─ image/route.tsx    # 결과지 OG 이미지 생성 (next/og)
│  ├─ layout.tsx            # 폰트·헤더·푸터·메타
│  └─ globals.css           # Mono 디자인 토큰 (@theme)
├─ components/
│  ├─ modern.tsx            # 공통 프리미티브 (Eyebrow/Reveal/pill/CountUp)
│  ├─ SiteHeader.tsx / SiteFooter.tsx
│  └─ InAppRedirect.tsx     # 카카오·인스타 인앱 웹뷰 → 기본 브라우저 유도
└─ lib/
   ├─ colorTest.ts          # 7색 데이터 + 20문항 + 채점 로직 (단일 소스)
   ├─ ogTokens.ts           # OG 이미지 전용 HEX (globals.css와 동기화)
   └─ inApp.ts              # 인앱 웹뷰 판별
public/knots/               # 제품 사진(색상별 단독·착용샷, 스타일링, 제작 GIF)
DESIGN.md                   # 디자인 시스템 단일 소스
```

---

## 로컬 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드 + 타입체크 (배포 전 게이트)
npm run lint     # ESLint
```

---

## 구현 하이라이트

- **결과지 이미지 파이프라인** — `next/og`로 서버에서 결과를 PNG로 렌더. 브라우저 DOM 캡처(html-to-image)가 iOS Safari에서 착용샷이 빈칸으로 저장되던 문제를 서버 렌더로 대체. Web Share 프리페치로 iOS 제스처 만료 회피
- **캐시 버스터** — OG 이미지가 `immutable` 장기 캐시라, 디자인 변경 시 `OG_VERSION`을 올려 사용자가 새 이미지를 받도록 처리
- **Tailwind 동적 클래스 이슈 해결** — 색 이름 컬러를 런타임 문자열로 조립하면 프로덕션 빌드에서 purge되던 버그를, `ColorKey → text-t-*` 정적 매핑으로 해결
- **아트 패널 크로스페이드** — 테스트 좌측 사진 전환 시 검은 플래시가 뜨던 문제를, 전체 이미지를 미리 쌓아두고 opacity만 전환하도록 개선
- **인앱 웹뷰 대응** — 카카오톡·인스타 웹뷰에서 공유/저장 제약을 감지해 기본 브라우저로 유도

---

## 참고

- 색상 토큰·디자인 규칙: [`DESIGN.md`](./DESIGN.md) / [`CLAUDE.md`](./CLAUDE.md)
- 컬러 테스트 기획: `docs/컬러성격테스트_기획.md`

© 2026 LUMIYEON. Made by hand in Korea.
