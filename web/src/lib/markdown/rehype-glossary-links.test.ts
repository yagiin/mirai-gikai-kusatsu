import type { Root } from "hast";
import { describe, expect, it } from "vitest";
import { rehypeGlossaryLinks } from "./rehype-glossary-links";

const terms = [
  {
    term: "専決処分",
    aliases: ["専決"],
    slug: "senketsu-shobun",
    short_description: "市長が議会に代わって決定することです。",
  },
  {
    term: "使用料",
    aliases: [],
    slug: "shiyouryou",
    short_description: "自治体が条例に基づいて徴収するお金です。",
  },
];

describe("rehypeGlossaryLinks", () => {
  it("用語の最初の出現だけをリンクにする", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "p",
          properties: {},
          children: [
            {
              type: "text",
              value: "専決処分を報告します。別の専決処分もあります。",
            },
          ],
        },
      ],
    };

    rehypeGlossaryLinks({ terms })(tree);
    const paragraph = tree.children[0];
    expect(paragraph.type).toBe("element");
    if (paragraph.type !== "element") return;

    expect(
      paragraph.children.filter((child) => child.type === "element")
    ).toHaveLength(1);
  });

  it("既存リンクとコードの中は変更しない", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "a",
          properties: { href: "/existing" },
          children: [{ type: "text", value: "使用料" }],
        },
        {
          type: "element",
          tagName: "code",
          properties: {},
          children: [{ type: "text", value: "使用料" }],
        },
      ],
    };

    rehypeGlossaryLinks({ terms })(tree);

    expect(tree.children[0]).toMatchObject({
      type: "element",
      properties: { href: "/existing" },
      children: [{ type: "text", value: "使用料" }],
    });
    expect(tree.children[1]).toMatchObject({
      type: "element",
      tagName: "code",
      children: [{ type: "text", value: "使用料" }],
    });
  });
});
