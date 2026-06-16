import type { Parent, Root, RootContent, Text } from "hast";
import type { GlossaryLinkTerm } from "@/features/glossary/shared/types";

type GlossaryMatch = {
  label: string;
  term: GlossaryLinkTerm;
};

const SKIPPED_TAGS = new Set(["a", "code", "pre", "script", "style"]);

function createMatches(terms: GlossaryLinkTerm[]): GlossaryMatch[] {
  return terms
    .flatMap((term) =>
      [term.term, ...term.aliases].map((label) => ({ label, term }))
    )
    .filter((match) => match.label.length > 0)
    .sort((a, b) => b.label.length - a.label.length);
}

function findNextMatch(
  value: string,
  matches: GlossaryMatch[],
  linkedSlugs: Set<string>
) {
  let found:
    | {
        index: number;
        match: GlossaryMatch;
      }
    | undefined;

  for (const match of matches) {
    if (linkedSlugs.has(match.term.slug)) continue;
    const index = value.indexOf(match.label);
    if (index < 0) continue;

    if (
      !found ||
      index < found.index ||
      (index === found.index && match.label.length > found.match.label.length)
    ) {
      found = { index, match };
    }
  }

  return found;
}

function linkText(
  node: Text,
  matches: GlossaryMatch[],
  linkedSlugs: Set<string>
): RootContent[] {
  const children: RootContent[] = [];
  let remaining = node.value;

  while (remaining.length > 0) {
    const found = findNextMatch(remaining, matches, linkedSlugs);
    if (!found) {
      children.push({ type: "text", value: remaining });
      break;
    }

    if (found.index > 0) {
      children.push({
        type: "text",
        value: remaining.slice(0, found.index),
      });
    }

    const { label, term } = found.match;
    children.push({
      type: "element",
      tagName: "a",
      properties: {
        href: `/glossary/${term.slug}`,
        title: `${term.term}: ${term.short_description}`,
        className: ["glossary-link"],
      },
      children: [{ type: "text", value: label }],
    });
    linkedSlugs.add(term.slug);
    remaining = remaining.slice(found.index + label.length);
  }

  return children;
}

function transformParent(
  parent: Parent,
  matches: GlossaryMatch[],
  linkedSlugs: Set<string>
) {
  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index];

    if (child.type === "text") {
      const replacement = linkText(child, matches, linkedSlugs);
      parent.children.splice(index, 1, ...replacement);
      index += replacement.length - 1;
      continue;
    }

    if (child.type === "element") {
      if (SKIPPED_TAGS.has(child.tagName)) continue;
      transformParent(child, matches, linkedSlugs);
    }
  }
}

export function rehypeGlossaryLinks(options: { terms: GlossaryLinkTerm[] }) {
  const matches = createMatches(options.terms);

  return (tree: Root) => {
    if (matches.length === 0) return;
    transformParent(tree, matches, new Set());
  };
}
