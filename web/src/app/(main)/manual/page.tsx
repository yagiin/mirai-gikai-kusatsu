import type { Metadata } from "next";
import {
  LegalList,
  LegalPageLayout,
  LegalParagraph,
  LegalSectionTitle,
  LegalSubSectionTitle,
} from "@/components/layouts/legal-page-layout";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "更新マニュアル | みらい議会＠草津市",
  description: "みらい議会＠草津市の議案CSV更新マニュアル",
};

type ManualTableRow = {
  label: string;
  example: string;
  description: string;
};

const csvFields: ManualTableRow[] = [
  {
    label: "id",
    example: "xxxxxxxx-...",
    description:
      "管理用IDです。既存議案の更新に使うため、修正時は消さないでください。新規追加時のみ空欄にします。",
  },
  {
    label: "name",
    example: "議第47号 令和8年度草津市一般会計補正予算（第3号）",
    description:
      "議案の正式名称です。管理画面の議案名と、詳細ページのタイトル下の表示に使われます。",
  },
  {
    label: "status",
    example: "introduced",
    description:
      "議案の審議状況です。議案カードのバッジや、詳細ページの審議ステータスに関係します。",
  },
  {
    label: "status_note",
    example: "予算委員会で審査中",
    description:
      "詳細ページの「審議のステータス」に表示される説明文に使われます。",
  },
  {
    label: "committee_name",
    example: "予算委員会",
    description:
      "詳細ページの「審議のステータス」内にある「所管委員会」に表示されます。",
  },
  {
    label: "submitted_date",
    example: "2026-06-08",
    description:
      "議案カードと詳細ページに「2026.6.8 提出」のように表示されます。",
  },
  {
    label: "publish_status",
    example: "published",
    description: "公開状態です。公開サイトに表示するかどうかを決めます。",
  },
  {
    label: "is_featured",
    example: "true",
    description:
      "trueにすると、公開中の議案の場合、トップページの「注目の議案」に表示されます。",
  },
  {
    label: "is_review_completed",
    example: "false",
    description:
      "falseの場合、詳細ページに確認中の案内が表示されます。trueの場合は確認済みとして扱われます。",
  },
  {
    label: "originating_type",
    example: "mayor",
    description:
      "提案者の種類です。市長提出ならmayor、議員提出ならmemberを入力します。",
  },
  {
    label: "session_slug",
    example: "r8-6-teireikai",
    description:
      "どの会期に属する議案かを指定します。会期別アーカイブページに表示するために使います。",
  },
  {
    label: "slug",
    example: "空欄",
    description:
      "現在の運用では通常は空欄で構いません。画面には表示されません。",
  },
  {
    label: "source_url",
    example: "https://...",
    description: "議案資料などの出典URLです。元資料を管理するために使います。",
  },
  {
    label: "normal_title",
    example: "議第47号 一般会計補正予算（第3号）",
    description:
      "通常表示の議案タイトルです。トップページ、アーカイブ一覧、詳細ページの大きなタイトルに表示されます。",
  },
  {
    label: "normal_summary",
    example: "物価高騰対策などに必要な費用を追加する補正予算です。",
    description:
      "通常表示の短い説明です。議案カードと詳細ページのタイトル下に表示されます。",
  },
  {
    label: "normal_content",
    example: "## 何を決める議案？",
    description:
      "通常表示の本文です。議案詳細ページの本文として表示されます。Markdown形式で見出しや箇条書きを使えます。",
  },
  {
    label: "hard_title",
    example: "議第47号 令和8年度草津市一般会計補正予算（第3号）",
    description:
      "「説明をもっと詳しく」をオンにしたときのタイトルです。空欄の場合はnormal_titleが使われます。",
  },
  {
    label: "hard_summary",
    example: "一般会計補正予算として、歳入歳出予算を追加補正するものです。",
    description:
      "「説明をもっと詳しく」をオンにしたときの短い説明です。空欄の場合はnormal_summaryが使われます。",
  },
  {
    label: "hard_content",
    example: "## 補正予算の内容",
    description:
      "「説明をもっと詳しく」をオンにしたときの本文です。空欄の場合はnormal_contentが使われます。",
  },
];

const statusRows: ManualTableRow[] = [
  {
    label: "preparing",
    example: "議案提出前",
    description: "カードでは「議案提出前」と表示されます。",
  },
  {
    label: "introduced",
    example: "提出済み",
    description: "カードでは「審議中」と表示されます。",
  },
  {
    label: "in_originating_house",
    example: "委員会審査中",
    description: "カードでは「審議中」と表示されます。",
  },
  {
    label: "in_receiving_house",
    example: "本会議審議中",
    description: "カードでは「審議中」と表示されます。",
  },
  {
    label: "enacted",
    example: "可決",
    description: "カードでは「可決」と表示されます。",
  },
  {
    label: "rejected",
    example: "否決",
    description: "カードでは「否決」と表示されます。",
  },
];

const publishStatusRows: ManualTableRow[] = [
  {
    label: "draft",
    example: "下書き",
    description: "公開サイトには表示されません。",
  },
  {
    label: "published",
    example: "公開中",
    description: "公開サイトに表示されます。",
  },
  {
    label: "coming_soon",
    example: "今後掲載予定",
    description: "現在の市議会版では通常は使いません。",
  },
];

const frequentEditRows: ManualTableRow[] = [
  {
    label: "一覧や詳細ページのタイトルを直したい",
    example: "normal_title",
    description: "必要に応じてhard_titleも編集します。",
  },
  {
    label: "議案カードの短い説明を直したい",
    example: "normal_summary",
    description: "必要に応じてhard_summaryも編集します。",
  },
  {
    label: "議案詳細ページの本文を直したい",
    example: "normal_content",
    description: "必要に応じてhard_contentも編集します。",
  },
  {
    label: "公開・非公開を切り替えたい",
    example: "publish_status",
    description: "公開する場合はpublished、非公開にする場合はdraftにします。",
  },
  {
    label: "トップページの注目議案に出したい",
    example: "is_featured",
    description: "trueにします。注目議案から外す場合はfalseにします。",
  },
  {
    label: "確認中表示を消したい",
    example: "is_review_completed",
    description: "trueにします。",
  },
  {
    label: "所管委員会を表示したい",
    example: "committee_name",
    description: "該当する委員会名を入力します。",
  },
  {
    label: "審議状況を変えたい",
    example: "status",
    description: "必要に応じてstatus_noteも編集します。",
  },
];

const unavailableRows: ManualTableRow[] = [
  {
    label: "用語解説との関連付け",
    example: "用語解説管理",
    description: "CSVではなく、管理画面の用語解説管理で編集します。",
  },
  {
    label: "みらいと維新の風の見解",
    example: "議案編集画面",
    description: "議案編集画面の「みらいと維新の風のスタンス」で編集します。",
  },
  {
    label: "タグ",
    example: "タグ関連の管理画面",
    description: "CSVでは更新できません。",
  },
  {
    label: "一般質問",
    example: "一般質問管理または一般質問CSV",
    description: "議案CSVとは別に管理します。",
  },
];

function ManualSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <LegalSectionTitle>{title}</LegalSectionTitle>
      {children}
    </section>
  );
}

function ManualTable({
  rows,
  firstHeader,
  secondHeader,
  thirdHeader,
}: {
  rows: ManualTableRow[];
  firstHeader: string;
  secondHeader: string;
  thirdHeader: string;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="min-w-40 border-b border-slate-200 px-4 py-3 font-semibold">
              {firstHeader}
            </th>
            <th className="min-w-48 border-b border-slate-200 px-4 py-3 font-semibold">
              {secondHeader}
            </th>
            <th className="min-w-96 border-b border-slate-200 px-4 py-3 font-semibold">
              {thirdHeader}
            </th>
          </tr>
        </thead>
        <tbody className="text-slate-600">
          {rows.map((row) => (
            <tr
              key={row.label}
              className="border-b border-slate-100 last:border-b-0"
            >
              <td className="px-4 py-3 font-semibold text-slate-900">
                <code>{row.label}</code>
              </td>
              <td className="px-4 py-3">
                <code>{row.example}</code>
              </td>
              <td className="px-4 py-3 leading-relaxed">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ManualPage() {
  return (
    <LegalPageLayout
      title="更新マニュアル"
      description="議案CSVを使って、会期ごとに議案情報を更新するための手順です。"
    >
      <ManualSection title="議案CSV更新マニュアル">
        <LegalParagraph>
          このマニュアルは、管理画面の「議案管理」からダウンロードできるCSVを編集し、
          みらい議会＠草津市の公開サイトに反映するための説明です。
        </LegalParagraph>
        <LegalParagraph>
          CSVは「1行 = 1つの議案」です。すでに登録済みの議案を修正する場合は、
          ダウンロードしたCSVの該当行を編集してアップロードします。新しい議案を追加する場合は、
          <code>id</code>を空欄にした行を追加します。
        </LegalParagraph>
        <p>
          <a
            href={routes.billCsvManualPdf()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full border border-slate-900 px-5 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
          >
            PDF版を開く
          </a>
        </p>
      </ManualSection>

      <ManualSection title="基本の流れ">
        <LegalList
          ordered
          items={[
            "管理画面にログインします。",
            "「議案管理」を開きます。",
            "会期を選び、「議案CSVをダウンロード」を押します。",
            "CSVをExcelなどで開いて編集します。",
            "CSV形式のまま保存します。",
            "管理画面の「編集したCSV」からファイルを選び、「CSVをアップロード」を押します。",
            "公開サイトで表示を確認します。",
          ]}
        />
      </ManualSection>

      <ManualSection title="編集時の注意">
        <LegalList
          items={[
            "文字化けを避けるため、ダウンロードしたCSVをそのまま編集してください。",
            "既存議案を修正する場合、idは変更しないでください。",
            "新規議案を追加する場合だけ、idを空欄にしてください。",
            "CSVに含まれていない既存議案は削除されません。",
            "日付は2026-06-08または2026/6/8の形式で入力できます。",
            "true / falseの列は、ExcelでTRUE / FALSEと表示されることがあります。アップロード時には小文字のtrue / falseまたは1 / 0として扱えます。",
          ]}
        />
      </ManualSection>

      <ManualSection title="CSV項目と公開サイトでの表示">
        <ManualTable
          rows={csvFields}
          firstHeader="CSV項目"
          secondHeader="入力例"
          thirdHeader="公開サイトでの表示・役割"
        />
      </ManualSection>

      <ManualSection title="statusの入力値">
        <ManualTable
          rows={statusRows}
          firstHeader="入力値"
          secondHeader="公開サイトでの意味"
          thirdHeader="表示"
        />
      </ManualSection>

      <ManualSection title="publish_statusの入力値">
        <ManualTable
          rows={publishStatusRows}
          firstHeader="入力値"
          secondHeader="意味"
          thirdHeader="説明"
        />
      </ManualSection>

      <ManualSection title="committee_nameの入力値">
        <LegalParagraph>
          入力できる委員会名は次のいずれかです。該当しない場合は空欄にできます。
        </LegalParagraph>
        <LegalList
          items={[
            "総務常任委員会",
            "文教厚生常任委員会",
            "産業建設常任委員会",
            "予算委員会",
            "決算委員会",
            "委員会審査なし",
          ]}
        />
      </ManualSection>

      <ManualSection title="よく編集する列">
        <ManualTable
          rows={frequentEditRows}
          firstHeader="目的"
          secondHeader="編集する列"
          thirdHeader="補足"
        />
      </ManualSection>

      <ManualSection title="本文で使える書き方">
        <LegalParagraph>
          <code>normal_content</code>と<code>hard_content</code>
          はMarkdown形式で書けます。HTMLタグを直接入れる運用は避け、
          Markdownで書くのがおすすめです。
        </LegalParagraph>
        <div className="rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">
          <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {`## 何を決める議案？

この議案は、草津市の予算を追加するものです。

## ポイント

- 子育て支援に関する費用を追加します。
- 公共施設の整備費を追加します。`}
          </pre>
        </div>
      </ManualSection>

      <ManualSection title="CSVでは更新できないもの">
        <ManualTable
          rows={unavailableRows}
          firstHeader="内容"
          secondHeader="編集場所"
          thirdHeader="補足"
        />
      </ManualSection>

      <ManualSection title="反映されないときの確認">
        <LegalList
          items={[
            "publish_statusがpublishedになっているか確認してください。",
            "session_slugが正しい会期になっているか確認してください。",
            "normal_titleが空欄になっていないか確認してください。",
            "日付がYYYY-MM-DDまたはYYYY/M/Dの形になっているか確認してください。",
            "is_featuredやis_review_completedがtrue / falseになっているか確認してください。",
            "Vercelの公開サイトは反映まで少し時間がかかることがあります。必要に応じて再デプロイしてください。",
          ]}
        />
      </ManualSection>

      <section className="space-y-3 rounded-2xl bg-emerald-50 p-5 text-emerald-950">
        <LegalSubSectionTitle>運用メモ</LegalSubSectionTitle>
        <LegalParagraph className="text-emerald-950">
          このページは、みらい議会＠草津市の更新作業を行う人向けの資料です。
          他の議員・会派メンバーに作業を引き継ぐ場合は、まずこのページを見てもらうと、
          CSVのどの列を触ればよいか確認しやすくなります。
        </LegalParagraph>
      </section>
    </LegalPageLayout>
  );
}
