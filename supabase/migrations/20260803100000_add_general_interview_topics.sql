create table interview_topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  background text,
  purpose text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint interview_topics_slug_format_check
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

alter table interview_topics enable row level security;

create trigger update_interview_topics_updated_at
  before update on interview_topics
  for each row execute function update_updated_at_column();

alter table interview_configs
  alter column bill_id drop not null,
  add column interview_topic_id uuid references interview_topics(id) on delete cascade;

alter table interview_configs
  add constraint interview_configs_single_subject_check
  check (num_nonnulls(bill_id, interview_topic_id) = 1);

create index idx_interview_configs_topic_id
  on interview_configs(interview_topic_id);

create unique index idx_interview_configs_one_public_per_topic
  on interview_configs(interview_topic_id)
  where status = 'public' and interview_topic_id is not null;

comment on table interview_topics is
  '議案に紐づかない一般テーマ型AIインタビューの対象情報';
comment on column interview_topics.slug is '公開URLに使用する識別子';
comment on column interview_topics.description is '公開ページに表示する概要';
comment on column interview_topics.background is 'AIが参照する背景情報・資料';
comment on column interview_topics.purpose is 'インタビューの目的と活用方針';
comment on column interview_configs.interview_topic_id is
  '一般テーマ型インタビューの対象ID。bill_idとは排他的に設定する';
