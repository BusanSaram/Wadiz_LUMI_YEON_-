import Link from "next/link";
import Image from "next/image";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-8">
        <Link href="/" aria-label="LUMIYEON 홈" className="flex items-center">
          <Image
            src="/lumiyeon-mark.png"
            alt="LUMIYEON 로고"
            width={1234}
            height={406}
            priority
            unoptimized
            className="h-9 w-auto object-contain"
          />
        </Link>
        {/* 모바일에서도 두 버튼이 한 줄에 들어가도록 패딩·문구를 좁게 */}
        <div className="flex items-center gap-2">
          <Link
            href="/test"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-3.5 py-2.5 text-sm font-semibold text-background transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/85 active:scale-[0.97] sm:px-5"
          >
            나의 컬러 찾기
          </Link>
          <a
            href="https://www.wadiz.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-wadiz px-3.5 py-2.5 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-wadiz/90 active:scale-[0.97] sm:px-5"
          >
            <span className="sm:hidden">와디즈</span>
            <span className="hidden sm:inline">와디즈에서 보기</span>
          </a>
        </div>
      </div>
    </header>
  );
}
