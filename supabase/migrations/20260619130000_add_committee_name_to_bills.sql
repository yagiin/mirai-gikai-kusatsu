alter table public.bills
  add column if not exists committee_name text;

alter table public.bills
  drop constraint if exists bills_committee_name_check;

alter table public.bills
  add constraint bills_committee_name_check
  check (
    committee_name is null
    or committee_name in (
      '総務常任委員会',
      '文教厚生常任委員会',
      '産業建設常任委員会',
      '予算委員会',
      '決算委員会',
      '委員会審査なし'
    )
  );

comment on column public.bills.committee_name is
  '市議会で議案を審査する所管委員会。委員会審査がない場合は「委員会審査なし」。';
