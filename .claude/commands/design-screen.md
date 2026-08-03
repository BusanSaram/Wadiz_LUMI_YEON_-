---
description: Stitch로 화면/섹션 디자인을 생성하고 오방색 토큰 기반 Tailwind 마크업으로 옮긴다
argument-hint: <화면 이름 또는 설명> (예- "컬러 테스트 결과 페이지 히어로 섹션")
---

`designer` 에이전트를 사용해서 다음 화면을 디자인하라: **$ARGUMENTS**

순서:
1. Stitch MCP로 시안 생성 (브랜드 톤: 미니멀 모던 + 한국적, 오방색 포인트)
2. 시안을 Next.js 16 + Tailwind v4 마크업으로 변환
3. 색상은 오방색 토큰만, 이미지는 `<Image>`만 사용
4. `npm run build`로 통과 확인 후 결과 보고
