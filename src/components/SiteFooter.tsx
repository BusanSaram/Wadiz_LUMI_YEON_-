import Link from "next/link";
import Image from "next/image";
import { WADIZ_URL } from "@/lib/links";

export default function SiteFooter() {
  return (
    <footer className="mt-auto w-full bg-ink text-white">
      {/* 상단 — 브랜드 + 링크 */}
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:grid-cols-2 sm:px-8">
        {/* 브랜드 */}
        <div className="flex flex-col gap-5">
          <Link href="/" aria-label="LUMIYEON 홈" className="flex items-center">
            <Image
              src="/lumiyeon-logo-white.svg"
              alt="LUMIYEON 로고"
              width={1234}
              height={406}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="max-w-xs text-pretty leading-relaxed text-white/55">
            한국 전통 매듭과 컬러테라피가 만나는 곳.
            <br />
            지친 하루에 작은 쉼이 될 나의 색을 손목 위에 엮어요.
          </p>
        </div>

        {/* 링크 그룹 */}
        <div className="sm:justify-self-end">
          <nav className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              Contact
            </span>
            <a
              href="https://www.instagram.com/lumiyeon_official"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              Instagram
            </a>
            <a
              href="http://pf.kakao.com/_rLMBX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              카카오톡 채널
            </a>
            <a
              href={WADIZ_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              와디즈
            </a>
          </nav>
        </div>
      </div>

      {/* 하단 — 카피라이트 */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2026 LUMIYEON. All rights reserved.</span>
          <span>Made by hand in Korea</span>
        </div>
      </div>
    </footer>
  );
}
