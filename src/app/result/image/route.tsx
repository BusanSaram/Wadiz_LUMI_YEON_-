import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import {
  colors,
  decodeScores,
  toPercent,
  rank,
  type ColorKey,
} from "@/lib/colorTest";
import { OG_HEX } from "@/lib/ogTokens";

// Node 런타임: 서브셋 폰트(fs) 로드 + 큰 번들 허용 (Edge 크기 제한 회피)
export const runtime = "nodejs";

// 색 토큰 — globals.css와의 동기화는 src/lib/ogTokens.ts 한 곳에서 관리
const HEX = OG_HEX.t;
const BG = OG_HEX.paper;
const FG = OG_HEX.ink;
const SURFACE = OG_HEX.surface;
const MUTED = OG_HEX.muted;

const fontRegular = readFileSync(
  new URL("./NotoSansKR-400.ttf", import.meta.url),
);
const fontBold = readFileSync(new URL("./NotoSansKR-700.ttf", import.meta.url));

function WornPair({
  origin,
  colorKey,
}: {
  origin: string;
  colorKey: ColorKey;
}) {
  const c = colors[colorKey];
  const cells: { src: string; pos: number; label: string }[] = [
    { src: c.wornImage, pos: c.wornPos, label: "도래매듭" },
    { src: c.flatWornImage, pos: c.flatWornPos, label: "평매듭" },
  ];
  return (
    <div style={{ display: "flex", width: "100%", gap: 8 }}>
      {cells.map((cell) => (
        <div
          key={cell.label}
          style={{
            display: "flex",
            position: "relative",
            width: 452,
            height: 340,
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: SURFACE,
          }}
        >
          <img
            width={452}
            height={340}
            src={`${origin}${cell.src}`}
            style={{
              width: 452,
              height: 340,
              objectFit: "cover",
              objectPosition: `${cell.pos}% center`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 14,
              bottom: 14,
              display: "flex",
              backgroundColor: "rgba(10,10,10,0.7)",
              color: "#ffffff",
              fontSize: 20,
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: 999,
            }}
          >
            {cell.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function BraceletCard({
  origin,
  colorKey,
  tag,
}: {
  origin: string;
  colorKey: ColorKey;
  tag: string;
}) {
  const c = colors[colorKey];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: SURFACE,
        borderRadius: 28,
        padding: 16,
        gap: 16,
      }}
    >
      <WornPair origin={origin} colorKey={colorKey} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "0 8px 8px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 3,
            color: MUTED,
          }}
        >
          {tag}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              display: "flex",
              width: 22,
              height: 22,
              borderRadius: 999,
              backgroundColor: HEX[colorKey],
            }}
          />
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>
            {c.name} 매듭 팔찌
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 25,
            color: MUTED,
            lineHeight: 1.5,
          }}
        >
          {c.braceletMsg}
        </div>
      </div>
    </div>
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const scores = decodeScores(url.searchParams.get("s"));

  const W = 1080;
  // 콘텐츠 높이는 top 색과 무관하게 일정. 참고 문헌 2줄까지 담기도록 여유 확보.
  const H = 2640;
  const common = {
    width: W,
    height: H,
    fonts: [
      { name: "NotoKR", data: fontRegular, weight: 400 as const, style: "normal" as const },
      { name: "NotoKR", data: fontBold, weight: 700 as const, style: "normal" as const },
    ],
  };

  if (!scores) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 566,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: FG,
            color: "#ffffff",
            fontFamily: "NotoKR",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          LUMIYEON 컬러 테스트
        </div>
      ),
      { ...common, height: 566 },
    );
  }

  const percent = toPercent(scores);
  const ranked = rank(scores);
  const topKeys = ranked.slice(0, 2).map((e) => e[0]);
  const bottomKeys = ranked
    .slice(-2)
    .map((e) => e[0])
    .reverse();
  const maxPercent = percent[ranked[0][0]] || 1;
  const top = colors[topKeys[0]];

  const res = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: BG,
          color: FG,
          fontFamily: "NotoKR",
        }}
      >
        {/* 블랙 헤더 밴드 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            backgroundColor: FG,
            color: "#ffffff",
            padding: "56px 64px 48px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img
              width={124}
              height={35}
              src={`${origin}/lumiyeon-logo-white.png`}
              style={{ width: 124, height: 35, objectFit: "contain" }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 5,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              COLOR REPORT
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "rgba(255,255,255,0.6)",
              marginTop: 20,
            }}
          >
            내 안에 가장 많은 색은
          </div>
          {/* 원 대신 색 이름을 그 색으로 크게 (온페이지 헤더와 동일 컨셉) */}
          <div
            style={{
              display: "flex",
              fontSize: 108,
              fontWeight: 700,
              marginTop: 4,
              color: HEX[topKeys[0]],
            }}
          >
            {top.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            {top.identity}
          </div>
        </div>

        {/* 본문 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "48px 64px 56px",
            gap: 40,
          }}
        >
          {/* 컬러 분포 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>
              컬러 분포
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ranked.map(([k]) => (
                <div
                  key={k}
                  style={{ display: "flex", alignItems: "center", gap: 20 }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: 90,
                      fontSize: 26,
                      color: "rgba(10,10,10,0.7)",
                    }}
                  >
                    {colors[k].name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      height: 18,
                      borderRadius: 999,
                      backgroundColor: SURFACE,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: `${(percent[k] / maxPercent) * 100}%`,
                        height: 18,
                        borderRadius: 999,
                        backgroundColor: HEX[k],
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: 70,
                      justifyContent: "flex-end",
                      fontSize: 26,
                      color: MUTED,
                    }}
                  >
                    {percent[k]}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 셀프케어 확언 — 블랙 카드 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              backgroundColor: FG,
              color: "#ffffff",
              borderRadius: 28,
              padding: "44px 40px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 6,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              SELF-CARE AFFIRMATION
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 29,
                fontWeight: 700,
                lineHeight: 1.6,
                textAlign: "center",
              }}
            >
              “{top.affirmation}”
            </div>
          </div>

          {/* 추천 매듭 팔찌 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>
              추천 매듭 팔찌
            </div>
            <BraceletCard
              origin={origin}
              colorKey={topKeys[0]}
              tag="나를 표현하는 팔찌"
            />
            <BraceletCard
              origin={origin}
              colorKey={bottomKeys[0]}
              tag="균형을 채우는 팔찌"
            />
          </div>

          {/* 푸터 — 참고 문헌 (satori 자동 줄바꿈이 불안정해 두 줄로 명시 분리) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              width: "100%",
              fontSize: 19,
              color: MUTED,
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex" }}>
              참고 문헌 · 『울고 있지만 립스틱은 빨갛게』 김옥기 (트라이온)
            </div>
            <div style={{ display: "flex" }}>
              『만화로 읽는 색채심리 1』 포포 프로덕션 지음 · 서인숙 옮김
            </div>
          </div>
        </div>
      </div>
    ),
    common,
  );
  // 같은 s면 이미지가 항상 동일 → CDN 장기 캐시(프리페치·재요청 비용 절감).
  res.headers.set(
    "cache-control",
    "public, max-age=31536000, s-maxage=31536000, immutable",
  );
  return res;
}
