import type { BillUpdateRow } from "./bill-update-csv";

const OFFICIAL_SOURCE_URL =
  "https://www.city.kusatsu.shiga.jp/shisei/gyoseijoho/" +
  "shityougiangiin/shityouteisyutsugian.html";

interface R8SepBillData {
  number: number;
  name: string;
  summary: string;
  details: string[];
  featured?: boolean;
}

export const R8_SEP_BILLS: R8SepBillData[] = [
  {
    number: 52,
    name: "契約の締結につき議決を求めることについて",
    summary:
      "総合体育館に空調設備を設置する工事について、1億9,008万円で請負契約を締結する議案です。",
    details: [
      "契約相手は草津設備株式会社です。",
      "室内機22台と室外機8台を設置します。",
      "工期は契約締結日から2027年8月31日までです。",
    ],
    featured: true,
  },
  {
    number: 53,
    name: "令和7年度草津市一般会計歳入歳出決算",
    summary:
      "令和7年度一般会計の決算について、議会の認定を求める議案です。",
    details: [
      "歳入は683億2,584万7千円、歳出は676億7,641万円です。",
      "翌年度への繰越財源を除いた実質収支は4億8,397万4千円の黒字です。",
      "実質収支は58年連続の黒字となりました。",
    ],
    featured: true,
  },
  {
    number: 54,
    name: "令和7年度草津市国民健康保険事業特別会計歳入歳出決算",
    summary:
      "令和7年度国民健康保険事業特別会計の決算について、議会の認定を求める議案です。",
    details: [
      "歳入は110億486万9千円、歳出は109億3,143万6千円です。",
      "実質収支は7,343万3千円の黒字です。",
    ],
  },
  {
    number: 55,
    name: "令和7年度草津市財産区特別会計歳入歳出決算",
    summary:
      "令和7年度財産区特別会計の決算について、議会の認定を求める議案です。",
    details: [
      "歳入・歳出はいずれも2億2,987万3千円です。",
      "一部財産区の会館改修などにより、決算規模は前年度から6.5％増加しました。",
    ],
  },
  {
    number: 56,
    name: "令和7年度草津市学校給食センター特別会計歳入歳出決算",
    summary:
      "令和7年度学校給食センター特別会計の決算について、議会の認定を求める議案です。",
    details: [
      "歳入・歳出はいずれも12億644万6千円です。",
      "児童・生徒数と賄材料費の増加により、決算規模は前年度から4.3％増加しました。",
    ],
  },
  {
    number: 57,
    name: "令和7年度草津市介護保険事業特別会計歳入歳出決算",
    summary:
      "令和7年度介護保険事業特別会計の決算について、議会の認定を求める議案です。",
    details: [
      "歳入は106億8,140万7千円、歳出は105億759万4千円です。",
      "実質収支は1億7,381万3千円の黒字です。",
    ],
  },
  {
    number: 58,
    name: "令和7年度草津市後期高齢者医療特別会計歳入歳出決算",
    summary:
      "令和7年度後期高齢者医療特別会計の決算について、議会の認定を求める議案です。",
    details: [
      "歳入は22億1,517万2千円、歳出は22億1,141万2千円です。",
      "実質収支は376万円の黒字です。",
      "被保険者数は前年度から3.0％増の1万8,636人です。",
    ],
  },
  {
    number: 59,
    name: "令和7年度草津市水道事業会計利益の処分および決算の認定について",
    summary:
      "令和7年度水道事業会計の利益処分の議決と決算の認定を求める議案です。",
    details: [
      "利益剰余金は8億4,422万1,374円です。",
      "収益的収入は26億6,532万3,910円、収益的支出は24億523万5,723円です。",
      "資本的収入は4億1,982万8,044円、資本的支出は15億3,845万3,650円です。",
    ],
  },
  {
    number: 60,
    name: "令和7年度草津市下水道事業会計利益の処分および決算の認定について",
    summary:
      "令和7年度下水道事業会計の利益処分の議決と決算の認定を求める議案です。",
    details: [
      "利益剰余金は4億4,795万5,403円です。",
      "収益的収入は39億6,355万4,737円、収益的支出は33億9,449万8,063円です。",
      "資本的収入は9億3,805万4,356円、資本的支出は22億9,439万4,532円です。",
    ],
  },
  {
    number: 61,
    name: "令和8年度草津市一般会計補正予算（第4号）",
    summary:
      "一般会計に4億3,303万3千円を追加し、総額を700億8,273万5千円とする補正予算案です。",
    details: [
      "令和7年度実質収支の2分の1に当たる2億4,198万8千円を財政調整基金へ積み立てます。",
      "中小企業の設備投資を支援する補助金4,004万5千円を計上します。",
      "各種返還金1億5,100万円を計上します。",
      "公立保育所など5施設の給食調理業務委託に関する債務負担行為を設定します。",
    ],
    featured: true,
  },
  {
    number: 62,
    name: "令和8年度草津市国民健康保険事業特別会計補正予算（第1号）",
    summary:
      "国民健康保険事業特別会計に1億287万8千円を追加する補正予算案です。",
    details: [
      "補正後の総額は112億1,037万8千円です。",
      "準備基金への積立金3,577万1千円、保険税還付金557万4千円、各種返還金4,405万8千円などを計上します。",
    ],
  },
  {
    number: 63,
    name: "令和8年度草津市財産区特別会計補正予算（第1号）",
    summary:
      "財産区特別会計に5,033万5千円を追加する補正予算案です。",
    details: [
      "補正後の総額は1億6,073万5千円です。",
      "各財産区の基金積立金4,446万1千円と繰出金587万4千円を計上します。",
    ],
  },
  {
    number: 64,
    name: "令和8年度草津市介護保険事業特別会計補正予算（第1号）",
    summary:
      "介護保険事業特別会計に1億7,381万3千円を追加する補正予算案です。",
    details: [
      "補正後の総額は111億5,001万3千円です。",
      "各種返還金1億3,442万7千円と一般会計繰出金3,938万6千円を計上します。",
    ],
  },
  {
    number: 65,
    name: "令和8年度草津市後期高齢者医療特別会計補正予算（第1号）",
    summary:
      "後期高齢者医療特別会計に434万2千円を追加する補正予算案です。",
    details: [
      "補正後の総額は24億4,394万2千円です。",
      "前年度繰越金などを財源に、一般会計への繰出金を計上します。",
    ],
  },
  {
    number: 66,
    name: "草津市認可地縁団体印鑑条例の一部を改正する条例案",
    summary:
      "地方自治法施行規則の改正に合わせ、認可地縁団体の印鑑登録に関する引用条項を改める条例案です。",
    details: ["施行日は公布の日です。"],
  },
  {
    number: 67,
    name: "草津市附属機関設置条例の一部を改正する条例案",
    summary:
      "ロクハ公園プールの再整備事業者を選定するため、新たな附属機関を設置する条例案です。",
    details: [
      "ロクハ公園プール再整備事業者等選定委員会を新設します。",
      "委員の定数は5人以内です。",
      "施行日は公布の日です。",
    ],
    featured: true,
  },
  {
    number: 68,
    name: "草津市手数料条例の一部を改正する条例案",
    summary:
      "草津っ子サポート事業の対象拡大に合わせ、利用手数料を徴収する対象年齢を変更する条例案です。",
    details: [
      "対象を1歳未満の子どもがいる家庭から、3歳未満の子どもがいる家庭へ拡大します。",
      "利用手数料は1時間当たり500円です。",
      "施行日は公布の日で、2026年6月1日から適用します。",
    ],
    featured: true,
  },
  {
    number: 69,
    name: "契約の締結につき議決を求めることについて",
    summary:
      "草津川跡地（区間6）整備工事について、2億662万2,636円で請負契約を締結する議案です。",
    details: [
      "契約相手は衣川建設株式会社です。",
      "旧河川堤体の掘削・土砂搬出や擁壁設置などを行います。",
      "工期は契約締結日から2027年3月30日までです。",
    ],
    featured: true,
  },
  {
    number: 70,
    name: "財産の取得につき議決を求めることについて",
    summary:
      "市が電子黒板を2,925万5,600円で取得することについて、議会の議決を求める議案です。",
    details: [
      "取得相手は株式会社ウチダビジネスソリューションズ草津営業所です。",
      "取得する財産の種類は動産です。",
    ],
  },
  {
    number: 71,
    name: "市道路線の認定につき議決を求めることについて",
    summary: "市道として4路線、合計211.7メートルを認定する議案です。",
    details: [
      "上笠北33号線を認定します。",
      "野路南126号線と野路南127号線を認定します。",
      "青地北75号線を認定します。",
    ],
  },
  {
    number: 72,
    name: "市道路線の変更につき議決を求めることについて",
    summary: "市道1路線、延長180.4メートルの起点・終点を変更する議案です。",
    details: ["対象は上笠北29号線です。"],
  },
  {
    number: 73,
    name: "令和8年度草津市一般会計補正予算（第5号）",
    summary:
      "市長選挙の実施に必要な7,772万4千円を追加する、開会日追加提案の補正予算案です。",
    details: [
      "補正後の一般会計総額は701億6,045万9千円です。",
      "追加額の全額を市長選挙執行費として計上します。",
      "財源は前年度からの繰越金です。",
    ],
    featured: true,
  },
];

function getBillNumber(name: string) {
  const match = name.match(/^議第(\d+)号/);
  if (!match) {
    throw new Error(`議案番号を取得できません: ${name}`);
  }
  return Number(match[1]);
}

function buildContent(
  title: string,
  summary: string,
  details: string[],
  detailed: boolean
) {
  const points = details.map((detail) => `- ${detail}`).join("\n");
  const heading = detailed ? "議案の内容" : "この議案のポイント";
  return `# ${title}

## ${heading}

${summary}

${points}

## 現在の状況

2026年9月1日に提出され、審議中です。

## 出典

[草津市公式資料](${OFFICIAL_SOURCE_URL})

> このページは草津市の公式資料を基に作成した要約です。正確な内容は出典資料をご確認ください。`;
}

export function applyR8SepOfficialData(row: BillUpdateRow): BillUpdateRow {
  const number = getBillNumber(row.name);
  const data = R8_SEP_BILLS.find((bill) => bill.number === number);
  if (!data) {
    throw new Error(`配布資料のデータがありません: 議第${number}号`);
  }

  const expectedName = `議第${number}号 ${data.name}`;
  const normalizedName = row.name.replace(/　/g, " ").replace(/\s+/g, " ").trim();
  if (normalizedName !== expectedName) {
    throw new Error(
      `議第${number}号の件名が配布資料と一致しません: ${row.name}`
    );
  }

  const normalTitle = data.name.replace(/案$/, "");
  return {
    ...row,
    status: "introduced",
    statusNote: "審議中（2026年9月1日提出）",
    submittedDate: "2026-09-01",
    publishStatus: "published",
    isFeatured: data.featured ?? false,
    slug: `r8-9-gidai-${number}`,
    sourceUrl: OFFICIAL_SOURCE_URL,
    normalTitle,
    normalSummary: data.summary,
    normalContent: buildContent(
      normalTitle,
      data.summary,
      data.details,
      false
    ),
    hardTitle: data.name,
    hardSummary: data.summary,
    hardContent: buildContent(
      data.name,
      data.summary,
      data.details,
      true
    ),
  };
}
