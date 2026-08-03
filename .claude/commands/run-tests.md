---
description: Playwright로 4페이지 골든 패스 E2E 테스트를 실행한다
---

`tester` 에이전트를 사용해서 전체 E2E 골든 패스를 검증하라.

순서:
1. 로컬 서버 구동 (`npm run build && npm run start`)
2. Playwright MCP로 `/`, `/test`, `/result`, `/about` 검증
3. 모바일 뷰포트(375px) 레이아웃 확인
4. 항목별 통과/실패를 명확히 보고 (추측 통과 금지)
