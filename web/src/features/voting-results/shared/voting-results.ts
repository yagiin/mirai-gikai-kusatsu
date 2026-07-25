export type VoteMark =
  | "for"
  | "against"
  | "absent"
  | "abstain"
  | "excluded"
  | "chair";

export type VotingMember = {
  name: string;
  caucus: string;
};

export type VotingResult = {
  proposalNumber: string;
  title: string;
  outcome: string;
  votedOn: string;
  votes: VoteMark[];
};

export type SessionVotingResults = {
  sourceUrl: string;
  members: VotingMember[];
  results: VotingResult[];
};

const members: VotingMember[] = [
  { name: "井上 薫", caucus: "輝勢会" },
  { name: "小野 元嗣", caucus: "輝勢会" },
  { name: "中嶋 昭雄", caucus: "輝勢会" },
  { name: "中島 美徳", caucus: "輝勢会" },
  { name: "服部 利比郎", caucus: "輝勢会" },
  { name: "福田 茂雄", caucus: "輝勢会" },
  { name: "山元 宏和", caucus: "輝勢会" },
  { name: "横江 政則", caucus: "輝勢会" },
  { name: "遠藤 覚", caucus: "草政会" },
  { name: "瀬川 裕海", caucus: "草政会" },
  { name: "田中 香治", caucus: "草政会" },
  { name: "西田 剛", caucus: "草政会" },
  { name: "田中 詩織", caucus: "みらいと維新の風" },
  { name: "野村 友子", caucus: "みらいと維新の風" },
  { name: "藤本 晶", caucus: "みらいと維新の風" },
  { name: "八木 良人", caucus: "みらいと維新の風" },
  { name: "杉江 昇", caucus: "市民派クラブ" },
  { name: "先成 俊士", caucus: "市民派クラブ" },
  { name: "土肥 浩資", caucus: "市民派クラブ" },
  { name: "西垣 和美", caucus: "公明党" },
  { name: "西村 隆行", caucus: "公明党" },
  { name: "西川 仁", caucus: "日本共産党草津市会議員団" },
  { name: "藤井 三恵子", caucus: "日本共産党草津市会議員団" },
  { name: "伊吹 達郎", caucus: "シン・プロジェクトK" },
];

function createVotes(overrides: Partial<Record<number, VoteMark>> = {}) {
  return members.map((_, index): VoteMark => {
    if (overrides[index]) {
      return overrides[index];
    }
    return index === 8 ? "chair" : "for";
  });
}

const communistAgainst = createVotes({ 21: "against", 22: "against" });
const miraiAndCommunistAgainst = createVotes({
  12: "against",
  13: "against",
  14: "against",
  15: "against",
  21: "against",
  22: "against",
});
const onlyFujimotoAndLaterFor = createVotes({
  0: "against",
  1: "against",
  2: "against",
  3: "against",
  4: "against",
  5: "against",
  6: "against",
  7: "against",
  9: "against",
  10: "against",
  11: "against",
  12: "against",
  13: "against",
});
const onlyCommunistFor = createVotes(
  Object.fromEntries(
    members
      .map((_, index) => index)
      .filter((index) => index !== 8 && index !== 21 && index !== 22)
      .map((index) => [index, "against" as const])
  )
);
const onlyKomeitoFor = createVotes(
  Object.fromEntries(
    members
      .map((_, index) => index)
      .filter((index) => index !== 8 && index !== 19 && index !== 20)
      .map((index) => [index, "against" as const])
  )
);
const communistAndShinProjectAgainst = createVotes({
  21: "against",
  22: "against",
  23: "against",
});

function result(
  proposalNumber: string,
  title: string,
  outcome: string,
  votedOn: string,
  votes: VoteMark[] = createVotes()
): VotingResult {
  return { proposalNumber, title, outcome, votedOn, votes };
}

const februaryResults: VotingResult[] = [
  result("議第2号", "専決処分の承認", "承認", "2026-02-26"),
  result(
    "議第3号",
    "令和8年度草津市一般会計予算",
    "原案可決",
    "2026-03-26",
    communistAgainst
  ),
  result(
    "議第4号",
    "令和8年度草津市国民健康保険事業特別会計予算",
    "原案可決",
    "2026-03-26",
    communistAgainst
  ),
  result(
    "議第5号",
    "令和8年度草津市財産区特別会計予算",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "議第6号",
    "令和8年度草津市介護保険事業特別会計予算",
    "原案可決",
    "2026-03-26",
    communistAgainst
  ),
  result(
    "議第7号",
    "令和8年度草津市後期高齢者医療特別会計予算",
    "原案可決",
    "2026-03-26",
    communistAgainst
  ),
  result(
    "議第8号",
    "令和8年度草津市水道事業会計予算",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "議第9号",
    "令和8年度草津市下水道事業会計予算",
    "原案可決",
    "2026-03-26"
  ),
  result("議第10号", "草津市行政手続条例の一部改正", "原案可決", "2026-03-26"),
  result(
    "議第11号",
    "草津市議会議員の議員報酬および費用弁償等に関する条例の一部改正",
    "原案可決",
    "2026-03-26",
    miraiAndCommunistAgainst
  ),
  result(
    "議第12号",
    "草津市特別職の職員で非常勤のものの報酬および費用弁償に関する条例等の一部改正",
    "原案可決",
    "2026-03-26",
    communistAgainst
  ),
  result(
    "議第13号",
    "草津市職員の給与に関する条例等の一部改正",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "議第14号",
    "草津市手数料条例の一部改正",
    "原案可決",
    "2026-03-26",
    communistAgainst
  ),
  result("議第15号", "草津市特別会計条例の一部改正", "原案可決", "2026-03-26"),
  result(
    "議第16号",
    "草津市災害弔慰金の支給等に関する条例の一部改正",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "議第17号",
    "草津市特定乳児等通園支援事業の運営に関する基準を定める条例",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "議第18号",
    "草津市乳児等通園支援事業の利用料徴収に関する条例",
    "原案可決",
    "2026-03-26"
  ),
  result("議第19号", "草津市介護保険条例の一部改正", "原案可決", "2026-03-26"),
  result(
    "議第20号",
    "草津市道路占用料条例および草津市駅前広場管理条例の一部改正",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "議第21号",
    "損害賠償の額を定めることにつき議決を求めることについて",
    "原案可決",
    "2026-03-26"
  ),
  result("議第22号", "市道路線の認定", "原案可決", "2026-03-26"),
  result("議第23号", "市道路線の廃止", "原案可決", "2026-03-26"),
  result(
    "議第24号",
    "令和7年度草津市一般会計補正予算（第8号）",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "議第25号",
    "令和7年度草津市国民健康保険事業特別会計補正予算（第3号）",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "議第26号",
    "令和7年度草津市財産区特別会計補正予算（第2号）",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "議第27号",
    "令和7年度草津市学校給食センター特別会計補正予算（第2号）",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "議第28号",
    "令和7年度草津市介護保険事業特別会計補正予算（第3号）",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "議第29号",
    "令和7年度草津市後期高齢者医療特別会計補正予算（第3号）",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "議第30号",
    "令和7年度草津市水道事業会計補正予算（第2号）",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "議第31号",
    "令和7年度草津市下水道事業会計補正予算（第2号）",
    "原案可決",
    "2026-03-26"
  ),
  result("議第32号", "草津市公平委員会委員の選任", "同意", "2026-03-26"),
  result("議第33号", "木川地区財産区管理委員の選任", "同意", "2026-03-26"),
  result("議第34号", "橋岡町財産区管理委員の選任", "同意", "2026-03-26"),
  result("議第35号", "野村町財産区管理委員の選任", "同意", "2026-03-26"),
  result(
    "議第36号",
    "人権擁護委員の候補者の推薦",
    "別段異議はない",
    "2026-03-26"
  ),
  result(
    "議第37号",
    "令和8年度草津市一般会計補正予算（第1号）",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "議第38号",
    "令和8年度草津市水道事業会計補正予算（第1号）",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "意見書第1号",
    "民生委員・児童委員の活動環境の抜本的改善と担い手確保対策の強化を求める意見書",
    "原案可決",
    "2026-03-26"
  ),
  result(
    "意見書第2号",
    "非核三原則の堅持を求める意見書（案）",
    "否決",
    "2026-03-26",
    onlyFujimotoAndLaterFor
  ),
  result(
    "意見書第3号",
    "高額療養費上限額引き上げの中止を求める意見書（案）",
    "否決",
    "2026-03-26",
    onlyCommunistFor
  ),
  result(
    "意見書第4号",
    "OTC類似薬の公的保険適用外しの中止を求める意見書（案）",
    "否決",
    "2026-03-26",
    onlyCommunistFor
  ),
];

const juneResults: VotingResult[] = [
  result("議第39号", "専決処分の承認", "承認", "2026-06-08"),
  result(
    "議第40号",
    "専決処分の承認",
    "承認",
    "2026-06-08",
    communistAndShinProjectAgainst
  ),
  result(
    "議第41号",
    "令和8年度草津市一般会計補正予算（第2号）",
    "原案可決",
    "2026-06-29"
  ),
  result(
    "議第42号",
    "地方自治法の一部を改正する法律の施行に伴う関係条例の整理に関する条例",
    "原案可決",
    "2026-06-29"
  ),
  result(
    "議第43号",
    "草津市立地域まちづくりセンター条例の一部改正",
    "原案可決",
    "2026-06-29"
  ),
  result("議第44号", "草津市税条例の一部改正", "原案可決", "2026-06-29"),
  result(
    "議第45号",
    "草津市地区計画の区域内における建築物の制限に関する条例の一部改正",
    "原案可決",
    "2026-06-29"
  ),
  result("議第46号", "契約の締結", "原案可決", "2026-06-29"),
  result(
    "議第47号",
    "令和8年度草津市一般会計補正予算（第3号）",
    "原案可決",
    "2026-06-29"
  ),
  result("議第48号", "草津町財産区管理委員の選任", "同意", "2026-06-29"),
  result("議第49号", "山田町財産区管理委員の選任", "同意", "2026-06-29"),
  result(
    "議第50号",
    "草津市職員懲戒審査委員会委員の選任",
    "同意",
    "2026-06-29"
  ),
  result("議第51号", "草津市農業委員会委員の任命", "同意", "2026-06-29"),
  result(
    "意見書第5号",
    "滋賀県における地域公共交通を目的とした新たな税導入に慎重な対応を求める意見書",
    "原案可決",
    "2026-06-29"
  ),
  result(
    "意見書第6号",
    "防衛装備移転三原則の運用指針の見直しに関する意見書（案）",
    "否決",
    "2026-06-29",
    onlyKomeitoFor
  ),
  result(
    "意見書第7号",
    "殺傷武器輸出の全面解禁に反対し、閣議決定の撤回を求める意見書（案）",
    "否決",
    "2026-06-29",
    onlyCommunistFor
  ),
  result(
    "決議第1号",
    "北朝鮮による日本人拉致問題に対する理解を深めるための広報啓発を推進する決議",
    "原案可決",
    "2026-06-29"
  ),
];

const votingResultsBySessionSlug: Record<string, SessionVotingResults> = {
  "r8-2-teireikai": {
    sourceUrl:
      "https://www.city.kusatsu.shiga.jp/shigikai/hongikai_iinkai/R3gian.files/R8.3.26hyouketsu.pdf",
    members,
    results: februaryResults,
  },
  "r8-6-teireikai": {
    sourceUrl:
      "https://www.city.kusatsu.shiga.jp/shigikai/hongikai_iinkai/R3gian.files/R8.6.29hyouketsu.pdf",
    members,
    results: juneResults,
  },
};

export function getVotingResultsBySessionSlug(
  slug: string
): SessionVotingResults | null {
  return votingResultsBySessionSlug[slug] ?? null;
}
