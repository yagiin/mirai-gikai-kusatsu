with bill_prefixes as (
  select
    id,
    (regexp_match(name, '^(議第[0-9０-９]+号|意見書第[0-9０-９]+号|決議第[0-9０-９]+号)'))[1] as prefix
  from public.bills
)
update public.bill_contents as bill_contents
set
  title = bill_prefixes.prefix || '　' || bill_contents.title,
  updated_at = now()
from bill_prefixes
where bill_contents.bill_id = bill_prefixes.id
  and bill_prefixes.prefix is not null
  and bill_contents.title !~ ('^' || bill_prefixes.prefix);
