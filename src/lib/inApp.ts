// 인앱 웹뷰(카카오톡·인스타 등) 및 기기 판별 유틸.
// 이런 환경은 Web Share API가 막혀 공유 모달이 뜨지 않는다 → 기본 브라우저로 유도한다.
const IN_APP_RE =
  /KAKAOTALK|Instagram|FBAN|FBAV|FB_IAB|Line\/|NAVER|DaumApps|wadiz|Snapchat|Whale|; wv\)/i;

function ua(): string {
  return typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
}

export function isInAppBrowser(): boolean {
  return IN_APP_RE.test(ua());
}

export function isAndroid(): boolean {
  return /Android/i.test(ua());
}

export function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(ua());
}

// 현재 페이지를 기기 기본 브라우저로 다시 연다.
// Android: intent로 Chrome 강제 실행. 그 외: 새 탭(제한적).
export function openInDefaultBrowser(): void {
  if (typeof window === "undefined") return;
  const url = window.location.href;
  if (isAndroid()) {
    const bare = url.replace(/^https?:\/\//, "");
    window.location.href = `intent://${bare}#Intent;scheme=https;package=com.android.chrome;end`;
  } else {
    window.open(url, "_blank", "noopener");
  }
}
