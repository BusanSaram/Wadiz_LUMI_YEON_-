"use client";

import { useEffect } from "react";
import { isAndroid, isInAppBrowser, openInDefaultBrowser } from "@/lib/inApp";

// 안드로이드 인앱 웹뷰(카카오톡·인스타 등)로 열리면 Chrome으로 1회 자동 전환한다.
// iOS는 애플 정책상 Safari 자동 전환이 불가능해 아무 것도 하지 않는다
// (결과 페이지의 안내 배너로 수동 유도).
const TRIED_KEY = "lumiyeon-inapp-redirect";

export default function InAppRedirect() {
  useEffect(() => {
    if (!isAndroid() || !isInAppBrowser()) return;
    // 같은 세션에서 한 번만 시도 (되돌아왔을 때 반복 전환 방지)
    try {
      if (sessionStorage.getItem(TRIED_KEY)) return;
      sessionStorage.setItem(TRIED_KEY, "1");
    } catch {
      /* sessionStorage 접근 불가 시에도 전환은 시도 */
    }
    openInDefaultBrowser();
  }, []);

  return null;
}
