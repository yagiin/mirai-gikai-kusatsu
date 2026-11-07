-- 旧制約を外してから、委員会の正式名称へ既存議案の値を移行する。
alter table public.bills
  drop constraint if exists bills_committee_name_check;

update public.bills
set committee_name = '予算常任委員会'
where committee_name = '予算委員会';

update public.bills
set committee_name = '決算特別委員会'
where committee_name = '決算委員会';

alter table public.bills
  add constraint bills_committee_name_check
  check (
    committee_name is null
    or committee_name in (
      '総務常任委員会',
      '文教厚生常任委員会',
      '産業建設常任委員会',
      '予算常任委員会',
      '決算特別委員会',
      '委員会審査なし'
    )
  );
