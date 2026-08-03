export const meta = {
  name: 'deploy-pipeline',
  description: 'Palette Knot 배포 전 게이트: 빌드 → E2E → 배포 준비 보고',
  phases: [
    { title: 'Build', detail: 'npm run build 타입체크/컴파일 게이트' },
    { title: 'E2E', detail: 'Playwright 4페이지 골든 패스' },
    { title: 'Report', detail: '배포 가능 여부 종합' },
  ],
}

const VERDICT = {
  type: 'object',
  properties: {
    pass: { type: 'boolean' },
    detail: { type: 'string' },
  },
  required: ['pass', 'detail'],
}

// 1) 빌드 게이트 — strict 타입체크 + 컴파일
phase('Build')
const build = await agent(
  '`npm run build`를 실행하라. 성공하면 pass:true, 실패하면 pass:false와 에러 요약을 detail에 담아 반환하라.',
  { label: 'build-gate', phase: 'Build', schema: VERDICT },
)

if (!build || !build.pass) {
  return { deployable: false, stage: 'build', detail: build?.detail ?? 'build agent 실패' }
}

// 2) E2E — tester 에이전트로 골든 패스 검증
phase('E2E')
const e2e = await agent(
  '로컬 서버를 띄우고 Playwright로 /, /test, /result, /about 골든 패스와 모바일(375px) 레이아웃을 검증하라. 모두 통과하면 pass:true.',
  { label: 'e2e-golden', phase: 'E2E', schema: VERDICT, agentType: 'tester' },
)

// 3) 종합 보고
phase('Report')
const deployable = Boolean(e2e && e2e.pass)
log(deployable ? '✅ 배포 가능' : '❌ E2E 실패 — 배포 보류')

return {
  deployable,
  build: build.detail,
  e2e: e2e?.detail ?? 'e2e agent 실패',
}
