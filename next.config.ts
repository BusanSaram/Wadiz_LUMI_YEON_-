import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 로컬 이미지 최적화 허용 경로.
    // knots/** 는 캐시 무효화용 버전 쿼리(?v=2)를 포함하므로 search 미지정(모든 쿼리 허용).
    localPatterns: [
      { pathname: "/knots/**" },
      { pathname: "/lumiyeon-**", search: "" },
    ],
  },
};

export default nextConfig;
