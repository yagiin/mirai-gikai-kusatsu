import { Download, ExternalLink, Pencil } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiRoutes, routes } from "@/lib/routes";
import { env } from "@/lib/env";
import type { InterviewTopicWithConfig } from "../repositories/interview-topic-repository";

export function InterviewTopicList({
  topics,
}: {
  topics: InterviewTopicWithConfig[];
}) {
  if (topics.length === 0) {
    return (
      <p className="py-8 text-center text-gray-500">
        一般テーマ型インタビューはまだありません。
      </p>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>テーマ</TableHead>
            <TableHead>設定名</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead>作成日</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topics.map((topic) => {
            const config = topic.interview_configs[0];
            return (
              <TableRow key={topic.id}>
                <TableCell className="font-medium">{topic.title}</TableCell>
                <TableCell>{config?.name ?? "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      config?.status === "public" ? "default" : "secondary"
                    }
                  >
                    {config?.status === "public" ? "公開" : "非公開"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(topic.created_at).toLocaleDateString("ja-JP")}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={routes.interviewTopicEdit(topic.id) as Route}>
                        <Pencil className="size-4" />
                        編集
                      </Link>
                    </Button>
                    {config?.status === "public" ? (
                      <Button asChild variant="ghost" size="sm">
                        <a
                          href={`${env.webUrl}/interviews/${topic.slug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="size-4" />
                          公開ページ
                        </a>
                      </Button>
                    ) : null}
                    <Button asChild variant="ghost" size="sm">
                      <a href={apiRoutes.interviewTopicKouchouCsv(topic.id)}>
                        <Download className="size-4" />
                        広聴AI用CSV
                      </a>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
