import { z } from "zod";

const documentUrlSchema = z.union([
  z.url().refine((url) => url.startsWith("https://"), {
    message: "PDFのURLはhttps://で入力してください",
  }),
  z.string().regex(/^\/session-documents\/[a-zA-Z0-9._-]+\.pdf$/),
]);

export const sessionDocumentSchema = z.object({
  title: z.string().trim().min(1, "資料名を入力してください").max(150),
  url: documentUrlSchema,
  date: z.iso.date(),
  is_published: z.boolean(),
});

export const sessionDocumentsSchema = z.array(sessionDocumentSchema).max(10);
export type SessionDocument = z.infer<typeof sessionDocumentSchema>;

export function parseSessionDocuments(value: unknown): SessionDocument[] {
  const result = sessionDocumentsSchema.safeParse(value);
  return result.success ? result.data : [];
}

export function publishedSessionDocuments(value: unknown): SessionDocument[] {
  return parseSessionDocuments(value).filter((document) => document.is_published);
}
