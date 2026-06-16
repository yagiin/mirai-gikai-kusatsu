import type { MetadataRoute } from "next";
import { getBills } from "@/features/bills/server/loaders/get-bills";
import { getPublishedGeneralQuestions } from "@/features/general-questions/server/loaders/get-published-general-questions";
import { getPublishedGlossaryTerms } from "@/features/glossary/server/loaders/get-published-glossary-terms";
import { routes } from "@/lib/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const [bills, glossaryTerms, generalQuestions] = await Promise.all([
    getBills(),
    getPublishedGlossaryTerms(),
    getPublishedGeneralQuestions(),
  ]);

  const billUrls = bills.map((bill) => ({
    url: `${baseUrl}${routes.billDetail(bill.id)}`,
    lastModified: new Date(bill.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const glossaryUrls = glossaryTerms.map((term) => ({
    url: `${baseUrl}${routes.glossaryTerm(term.slug)}`,
    lastModified: new Date(term.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const generalQuestionUrls = generalQuestions.map((question) => ({
    url: `${baseUrl}${routes.generalQuestionDetail(question.id)}`,
    lastModified: new Date(question.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}${routes.glossary()}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}${routes.generalQuestions()}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...billUrls,
    ...glossaryUrls,
    ...generalQuestionUrls,
  ];
}
