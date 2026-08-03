// ────────────────────────────────────────────────────────────
// LUMIYEON 컬러 성격 테스트 — 데이터 & 채점 로직
//
// 출처: docs/컬러성격테스트_기획.md (색채심리 + 컬러 코칭 프레임).
// 7색 팔레트, 20문항(보기당 1색, 총 80보기;
//   green·blue·pink 각 12회, red·orange·yellow·violet 각 11회 균형),
// 합산 채점 → 많은 컬러 top2 / 적은 컬러 bottom2.
// 색 표현은 globals.css의 테라피 토큰(bg-t-*)만 사용 — raw hex 금지.
// (violet 보라 = bg-t-purple 토큰에 매핑)
// ────────────────────────────────────────────────────────────

export type ColorKey =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "violet"
  | "pink";

/** 점수 직렬화·표시 순서 고정 */
export const COLOR_ORDER: ColorKey[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "violet",
  "pink",
];

export type Scores = Record<ColorKey, number>;

export interface ColorInfo {
  /** 한글 색 이름 */
  name: string;
  /** Tailwind 배경 토큰 클래스 */
  dot: string;
  /** 색 한 단어 의미 (예: 열정) — 홈 팔레트 카드용 */
  mean: string;
  /** 홈 팔레트 카드 설명 한 문장 */
  desc: string;
  /** 도래매듭 단독컷 경로 (public/knots) */
  image: string;
  /** 평매듭 단독컷 경로 (public/knots) */
  flatImage: string;
  /** 도래매듭 착용컷 경로 (public/knots) */
  wornImage: string;
  /** 착용컷에서 손목의 가로 위치(%) — object-position 정렬용 (신규 착용샷은 가로 2400×1600) */
  wornPos: number;
  /** 평매듭 착용컷 경로 (public/knots) */
  flatWornImage: string;
  /** 평매듭 착용컷 손목 가로 위치(%) */
  flatWornPos: number;
  /** 한 줄 정체성 */
  identity: string;
  /** "많은 컬러"일 때 한 줄 결과 카피 */
  resultCopy: string;
  /** 성격 키워드 */
  keywords: string[];
  /** 긍정 에너지(강점) */
  energy: string[];
  /** 강점의 그림자(경계 신호, 부드럽게 한 문장) */
  shadow: string;
  /** "적은 컬러"일 때 보완 카피 */
  lowCopy: string;
  /** 이럴 때 좋아요 (How to Use) */
  howToUse: string[];
  /** 셀프케어 확언 */
  affirmation: string;
  /** 추천 팔찌 메시지 */
  braceletMsg: string;
}

export const colors: Record<ColorKey, ColorInfo> = {
  red: {
    name: "빨강",
    dot: "bg-t-red",
    mean: "열정",
    desc: "지친 하루에 다시 불을 지피는 색. 활력과 용기를 채우고 싶을 때 곁에 둬요.",
    image: "/knots/red.jpg?v=5",
    flatImage: "/knots/red-flat.jpg?v=5",
    wornImage: "/knots/red-worn.jpg?v=5",
    wornPos: 60,
    flatWornImage: "/knots/red-flat-worn.jpg?v=5",
    flatWornPos: 60,
    identity: "살아 있음 그 자체. 뜨겁고, 지금 이 순간을 사는 색.",
    resultCopy:
      "당신은 정열과 행동의 사람. 마음먹으면 바로 움직이고, 솔직한 에너지로 주위를 이끌어요.",
    keywords: ["외향적", "활동적", "정열", "정의감"],
    energy: ["열정", "용기", "생명력", "리더십", "현실화 능력"],
    shadow: "감정 기복이 심하고 때로 충동적일 수 있어요.",
    lowCopy:
      "조금 더 용기를 내어 행동으로. 빨강 팔찌가 그 한 걸음을 살며시 응원해요.",
    howToUse: ["동기부여가 필요할 때", "도전을 앞두고 용기가 필요할 때"],
    affirmation:
      "나는 생명력이 넘치는 붉은 불꽃입니다. 내 안의 열정은 모든 도전을 뛰어넘게 하며, 강한 의지로 꿈을 현실로 만들어 갑니다. 나는 용기 그 자체이며, 세상을 변화시키는 원동력입니다.",
    braceletMsg: "자신감과 행동력을 더하고 싶을 때.",
  },
  orange: {
    name: "주황",
    dot: "bg-t-orange",
    mean: "활력",
    desc: "가라앉은 기분을 따뜻하게 데워 주는 색. 다시 웃음을 찾고 싶을 때.",
    image: "/knots/orange.jpg?v=5",
    flatImage: "/knots/orange-flat.jpg?v=5",
    wornImage: "/knots/orange-worn.jpg?v=5",
    wornPos: 60,
    flatWornImage: "/knots/orange-flat-worn.jpg?v=5",
    flatWornPos: 60,
    identity: "삶의 즐거움과 존재의 기쁨을 꺼내는 색. 태양처럼 따뜻하다.",
    resultCopy:
      "당신은 활력과 유쾌함의 사람. 어디서든 분위기를 밝히고 사람을 이어 줘요.",
    keywords: ["사교적", "분위기메이커", "집중력", "경쟁심"],
    energy: ["자존감", "창조성", "통찰력", "유쾌함", "적응력"],
    shadow: "감정 기복이나 자기 과시가 드러날 때가 있어요.",
    lowCopy:
      "침울할 땐 잠시 기분을 풀어 주세요. 주황 팔찌가 다시 웃게 하는 활력을 더해요.",
    howToUse: ["자존감을 올리고 싶을 때", "유쾌한 관계를 원할 때"],
    affirmation:
      "나는 기쁨과 창조의 오렌지 빛입니다. 내 웃음은 주변을 밝히고, 자유로운 영혼으로 새로운 가능성을 창조합니다. 나는 순수한 즐거움이며, 삶의 모든 순간을 축복으로 받아들입니다.",
    braceletMsg: "침울할 때 기분을 릴렉스시키고 활기를 더하고 싶을 때.",
  },
  yellow: {
    name: "노랑",
    dot: "bg-t-yellow",
    mean: "행복",
    desc: "마음을 환하게 밝혀 주는 색. 일상에 작은 즐거움을 더하고 싶을 때.",
    image: "/knots/yellow.jpg?v=5",
    flatImage: "/knots/yellow-flat.jpg?v=5",
    wornImage: "/knots/yellow-worn.jpg?v=5",
    wornPos: 60,
    flatWornImage: "/knots/yellow-flat-worn.jpg?v=5",
    flatWornPos: 60,
    identity: "깨달음과 희망의 빛. 마음을 비추는 햇살 같은 존재감.",
    resultCopy:
      "당신은 호기심 가득한 도전자. 새로움을 즐기고 반짝이는 생각으로 빛나요.",
    keywords: ["지적", "호기심", "아이디어", "상승지향"],
    energy: ["지성", "명석함", "호기심", "희망", "유머"],
    shadow: "싫증을 잘 내고 끈기가 부족할 수 있어요.",
    lowCopy: "새로운 시도를 두려워 마세요. 노랑 팔찌가 호기심에 불을 밝혀요.",
    howToUse: ["새로운 것을 배우고 싶을 때", "생각을 명료하게 하고 싶을 때"],
    affirmation:
      "나는 지혜와 희망의 옐로우 빛입니다. 내 밝은 마음은 어둠을 걷어 내고, 명확한 사고로 길을 찾아갑니다. 나는 태양처럼 빛나며, 내 주변 모든 것에 따뜻한 희망을 전합니다.",
    braceletMsg: "호기심·집중력을 높이고 밝은 기운을 더하고 싶을 때.",
  },
  green: {
    name: "초록",
    dot: "bg-t-green",
    mean: "안정",
    desc: "지친 마음을 가만히 쉬게 하는 색. 편안함과 균형이 필요할 때.",
    image: "/knots/green.jpg?v=5",
    flatImage: "/knots/green-flat.jpg?v=5",
    wornImage: "/knots/green-worn.jpg?v=5",
    wornPos: 60,
    flatWornImage: "/knots/green-flat-worn.jpg?v=5",
    flatWornPos: 60,
    identity: "평화와 성장의 색. 삶의 숨결이 머무는 공간.",
    resultCopy:
      "당신은 평화와 성장의 사람. 성실하게 조화를 만들고 편안함을 줘요.",
    keywords: ["성실", "평화주의", "신념", "신중"],
    energy: ["안정감", "성장", "조화", "신뢰", "치유"],
    shadow: "나서기보다 기다리다 기회를 놓칠 때가 있어요.",
    lowCopy: "균형과 쉼이 필요할 때. 초록 팔찌가 마음의 안정을 더해요.",
    howToUse: ["밸런스를 회복하고 싶을 때", "감정적 안정이 필요할 때"],
    affirmation:
      "나는 그린의 에너지로 스스로를 치유하고 성장해 나갑니다. 숲의 고요함처럼 평온하며, 다정한 마음으로 나를 감쌉니다. 균형의 지혜 속에서, 나는 오늘도 조금씩 자라납니다.",
    braceletMsg: "판단이 필요하거나 마음의 안정·균형을 회복하고 싶을 때.",
  },
  blue: {
    name: "파랑",
    dot: "bg-t-blue",
    mean: "평온",
    desc: "복잡한 마음을 차분히 가라앉히는 색. 잠시 숨을 고르고 싶을 때.",
    image: "/knots/blue.jpg?v=5",
    flatImage: "/knots/blue-flat.jpg?v=5",
    wornImage: "/knots/blue-worn.jpg?v=5",
    wornPos: 60,
    flatWornImage: "/knots/blue-flat-worn.jpg?v=5",
    flatWornPos: 60,
    identity: "진실과 신뢰의 색. 깊은 교감과 내면의 질서를 이끄는 힘.",
    resultCopy:
      "당신은 신뢰와 진실의 사람. 차분하고 깊이 있게, 곁에 있으면 마음이 놓여요.",
    keywords: ["겸손", "협조", "계획적", "지성"],
    energy: ["신뢰", "책임감", "명료함", "인내력", "평화로움"],
    shadow: "완고하거나 감정을 눌러 담을 때가 있어요.",
    lowCopy:
      "잠시 숨을 고르고 나를 돌볼 시간. 파랑 팔찌가 마음을 가라앉혀 줘요.",
    howToUse: ["소통이 필요할 때", "명확한 판단이 필요할 때"],
    affirmation:
      "나는 소통의 블루입니다. 내 말은 진심으로 울려 퍼지고, 깊은 이해는 우리를 하나로 이어 줍니다. 약속과 시간을 소중히 여기며, 매 순간을 진실하게 살아갑니다.",
    braceletMsg: "마음을 가라앉히고 집중·신뢰를 더하고 싶을 때.",
  },
  violet: {
    name: "보라",
    dot: "bg-t-purple",
    mean: "신비",
    desc: "마음에 영감을 채워 주는 색. 오롯이 나만의 시간을 갖고 싶을 때.",
    image: "/knots/violet.jpg?v=5",
    flatImage: "/knots/violet-flat.jpg?v=5",
    wornImage: "/knots/violet-worn.jpg?v=5",
    wornPos: 60,
    flatWornImage: "/knots/violet-flat-worn.jpg?v=5",
    flatWornPos: 60,
    identity: "영혼과 감성의 교차점. 현실과 비현실의 경계를 허무는 신비한 빛.",
    resultCopy:
      "당신은 감성과 직관의 사람. 남다른 시선으로 자신만의 세계를 만들어 가요.",
    keywords: ["예술적", "감성", "개성", "고귀"],
    energy: ["직관력", "창조성", "치유", "미의식", "통찰"],
    shadow: "타인을 쉽게 신용하지 않는 면이 있어요.",
    lowCopy:
      "가끔은 감성과 상상에 나를 맡겨 보세요. 보라 팔찌가 직관과 영감을 깨워요.",
    howToUse: ["자아를 찾고 싶을 때", "삶의 깊이를 성찰하고 싶을 때"],
    affirmation:
      "나는 직관의 바이올렛입니다. 내 감정은 고요히 흐르며, 내면의 지혜는 나를 빛나는 길로 이끕니다. 삶의 깊은 울림 속에서 나는 진정한 나를 만납니다.",
    braceletMsg: "오롯이 나다운 감성과 여유로운 시간을 갖고 싶을 때.",
  },
  pink: {
    name: "핑크",
    dot: "bg-t-pink",
    mean: "사랑",
    desc: "마음을 포근하게 감싸 주는 색. 다정한 위로가 필요할 때.",
    image: "/knots/pink.jpg?v=5",
    flatImage: "/knots/pink-flat.jpg?v=5",
    wornImage: "/knots/pink-worn.jpg?v=5",
    wornPos: 60,
    flatWornImage: "/knots/pink-flat-worn.jpg?v=5",
    flatWornPos: 60,
    identity: "사랑의 감정이 피어나는 색. 온기와 배려로 삶을 감싸는 부드러운 힘.",
    resultCopy:
      "당신은 사랑과 다정함의 사람. 따뜻한 배려로 주위를 포근하게 감싸요.",
    keywords: ["온화", "다정", "섬세", "배려"],
    energy: ["자기애", "케어", "섬세함", "감수성", "실천적 사랑"],
    shadow: "행동력이 약하거나 의존적일 수 있어요.",
    lowCopy:
      "스스로에게 더 다정해도 괜찮아요. 핑크 팔찌가 마음에 여유를 더해요.",
    howToUse: ["자기애가 깊어지고 싶을 때", "따뜻한 연결이 필요할 때"],
    affirmation:
      "나는 부드러우면서도 강인한 사랑입니다. 온화한 가슴의 사랑으로 모든 존재를 무조건적으로 받아들이고 길러 내는 지혜가 있습니다. 나는 핑크 에너지입니다.",
    braceletMsg: "마음을 편안하게 하고 다정함·여유를 더하고 싶을 때.",
  },
};

export interface Choice {
  label: string;
  color: ColorKey;
}

export interface Question {
  id: number;
  text: string;
  choices: Choice[];
}

// ── 20문항 (docs/컬러성격테스트_기획.md §3.2) ──────────────────
// 각 보기 = 1색. 총 80보기 — green·blue·pink 12회, red·orange·yellow·violet 11회.
export const questions: Question[] = [
  {
    id: 1,
    text: "주말에 가장 끌리는 건?",
    choices: [
      { label: "새로운 도전·운동", color: "red" },
      { label: "친구들과 활기찬 약속", color: "orange" },
      { label: "새 카페·전시 탐험", color: "yellow" },
      { label: "자연 속 산책·휴식", color: "green" },
    ],
  },
  {
    id: 2,
    text: "에너지가 솟는 순간은?",
    choices: [
      { label: "사람들과 어울릴 때", color: "orange" },
      { label: "호기심을 채울 때", color: "yellow" },
      { label: "자연에서 쉴 때", color: "green" },
      { label: "혼자 차분히 몰입할 때", color: "blue" },
    ],
  },
  {
    id: 3,
    text: "쉬고 싶을 때 찾는 곳은?",
    choices: [
      { label: "초록이 있는 공원", color: "green" },
      { label: "조용하고 정돈된 공간", color: "blue" },
      { label: "감성적인 나만의 아지트", color: "violet" },
      { label: "포근하고 아늑한 곳", color: "pink" },
    ],
  },
  {
    id: 4,
    text: "나를 채우는 방법은?",
    choices: [
      { label: "생각을 글로 정리", color: "blue" },
      { label: "예술로 위로받기", color: "violet" },
      { label: "사랑하는 사람과 시간", color: "pink" },
      { label: "몸을 움직여 발산", color: "red" },
    ],
  },
  {
    id: 5,
    text: "여행 스타일은?",
    choices: [
      { label: "예술·감성의 도시", color: "violet" },
      { label: "소중한 사람과 힐링", color: "pink" },
      { label: "액티비티 가득", color: "red" },
      { label: "즉흥적이고 활기찬 탐험", color: "orange" },
    ],
  },
  {
    id: 6,
    text: "나를 표현하는 단어는?",
    choices: [
      { label: "신뢰", color: "blue" },
      { label: "감성", color: "violet" },
      { label: "사랑", color: "pink" },
      { label: "열정", color: "red" },
    ],
  },
  {
    id: 7,
    text: "일할 때 나는?",
    choices: [
      { label: "일단 부딪쳐 행동", color: "red" },
      { label: "분위기 살려 팀을 이끔", color: "orange" },
      { label: "새 아이디어를 던짐", color: "yellow" },
      { label: "묵묵히 조화를 맞춤", color: "green" },
    ],
  },
  {
    id: 8,
    text: "팀에서 내 역할은?",
    choices: [
      { label: "분위기 메이커", color: "orange" },
      { label: "아이디어 뱅크", color: "yellow" },
      { label: "중재자·서포터", color: "green" },
      { label: "계획·관리 담당", color: "blue" },
    ],
  },
  {
    id: 9,
    text: "새로운 일을 만나면?",
    choices: [
      { label: "호기심에 바로 시도", color: "yellow" },
      { label: "신중히 살펴본 뒤", color: "green" },
      { label: "계획을 세워 접근", color: "blue" },
      { label: "직감으로 느껴봄", color: "violet" },
    ],
  },
  {
    id: 10,
    text: "사람 관계에서 나는?",
    choices: [
      { label: "편안하게 오래가는 사이", color: "green" },
      { label: "신뢰로 깊게", color: "blue" },
      { label: "개성 있는 소수와", color: "violet" },
      { label: "다정하게 배려하며", color: "pink" },
    ],
  },
  {
    id: 11,
    text: "갈등이 생기면?",
    choices: [
      { label: "논리로 차분히 대화", color: "blue" },
      { label: "거리를 두고 관조", color: "violet" },
      { label: "상대 마음을 먼저 헤아림", color: "pink" },
      { label: "정면으로 부딪쳐 해결", color: "red" },
    ],
  },
  {
    id: 12,
    text: "친구가 힘들어하면?",
    choices: [
      { label: "조용히 곁에서 공감", color: "violet" },
      { label: "따뜻하게 안아줌", color: "pink" },
      { label: "해결책을 바로 제시", color: "red" },
      { label: "기운 나게 띄워줌", color: "orange" },
    ],
  },
  {
    id: 13,
    text: "듣고 싶은 칭찬은?",
    choices: [
      { label: "“따뜻하다”", color: "pink" },
      { label: "“추진력 있다”", color: "red" },
      { label: "“함께 있으면 즐겁다”", color: "orange" },
      { label: "“아이디어가 좋다”", color: "yellow" },
    ],
  },
  {
    id: 14,
    text: "삶에서 중요한 가치는?",
    choices: [
      { label: "도전과 성취", color: "red" },
      { label: "즐거움과 연결", color: "orange" },
      { label: "배움과 성장", color: "yellow" },
      { label: "평화와 안정", color: "green" },
    ],
  },
  {
    id: 15,
    text: "스트레스를 풀 때?",
    choices: [
      { label: "사람들과 신나게", color: "orange" },
      { label: "새 취미·자극으로", color: "yellow" },
      { label: "자연·산책으로", color: "green" },
      { label: "혼자만의 시간으로", color: "blue" },
    ],
  },
  {
    id: 16,
    text: "마음이 힘들 때 위로는?",
    choices: [
      { label: "자연의 고요함", color: "green" },
      { label: "믿을 수 있는 대화", color: "blue" },
      { label: "예술·아름다움", color: "violet" },
      { label: "다정한 포옹", color: "pink" },
    ],
  },
  {
    id: 17,
    text: "되고 싶은 이미지는?",
    choices: [
      { label: "똑똑하고 재밌는", color: "yellow" },
      { label: "편안하고 믿음직한", color: "green" },
      { label: "차분하고 전문적인", color: "blue" },
      { label: "개성 있는 아티스트", color: "violet" },
    ],
  },
  {
    id: 18,
    text: "좋아하는 콘텐츠는?",
    choices: [
      { label: "자연·힐링", color: "green" },
      { label: "미스터리·지식", color: "blue" },
      { label: "정보·트렌드", color: "yellow" },
      { label: "로맨스·일상", color: "pink" },
    ],
  },
  {
    id: 19,
    text: "첫인상으로 주고 싶은 모습은?",
    choices: [
      { label: "신비롭고 세련된", color: "violet" },
      { label: "다정하고 부드러운", color: "pink" },
      { label: "자신감 있고 강렬한", color: "red" },
      { label: "밝고 유쾌한", color: "orange" },
    ],
  },
  {
    id: 20,
    text: "지금 마음이 가는 느낌은?",
    choices: [
      { label: "사랑스럽고 포근한", color: "pink" },
      { label: "뜨겁고 강렬한", color: "red" },
      { label: "밝고 활기찬", color: "orange" },
      { label: "반짝이고 산뜻한", color: "yellow" },
    ],
  },
];

// ── 채점 (docs/컬러성격테스트_기획.md §3.3) ─────────────────────

function emptyScores(): Scores {
  return { red: 0, orange: 0, yellow: 0, green: 0, blue: 0, violet: 0, pink: 0 };
}

/** 응답 → 색별 합산 점수 */
export function scoreAnswers(answers: Choice[]): Scores {
  const scores = emptyScores();
  for (const a of answers) {
    scores[a.color] += 1;
  }
  return scores;
}

/** 색별 정규화(%) — 합 0이면 모두 0 */
export function toPercent(scores: Scores): Scores {
  const total = COLOR_ORDER.reduce((sum, k) => sum + scores[k], 0);
  const out = emptyScores();
  if (total === 0) return out;
  for (const k of COLOR_ORDER) {
    out[k] = Math.round((scores[k] / total) * 100);
  }
  return out;
}

/** 높은 순 정렬된 [ColorKey, 점수] 배열 */
export function rank(scores: Scores): [ColorKey, number][] {
  return COLOR_ORDER.map((k) => [k, scores[k]] as [ColorKey, number]).sort(
    (a, b) => b[1] - a[1],
  );
}

/** 점수를 URL 파라미터 문자열로 (COLOR_ORDER 순서, 쉼표 구분) */
export function encodeScores(scores: Scores): string {
  return COLOR_ORDER.map((k) => scores[k]).join(",");
}

/** URL 파라미터 → 점수. 형식이 어긋나면 null */
export function decodeScores(s: string | null): Scores | null {
  if (!s) return null;
  const parts = s.split(",");
  if (parts.length !== COLOR_ORDER.length) return null;
  const scores = emptyScores();
  for (let i = 0; i < COLOR_ORDER.length; i++) {
    const n = Number(parts[i]);
    if (!Number.isFinite(n) || n < 0) return null;
    scores[COLOR_ORDER[i]] = n;
  }
  return scores;
}

export function isColorKey(v: unknown): v is ColorKey {
  return typeof v === "string" && COLOR_ORDER.includes(v as ColorKey);
}
