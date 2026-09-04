import fs from "node:fs/promises";
import path from "node:path";
import {
  parseBillUpdateCsv,
  serializeBillUpdateCsv,
} from "./bill-update-csv";
import { applyR8SepOfficialData } from "./r8-sep-bill-data";

const CSV_PATH = path.resolve(
  import.meta.dirname,
  "data",
  "bills-update.csv"
);

const FIRST_BILL_NUMBER = 52;
const LAST_BILL_NUMBER = 73;

function getBillNumber(name: string) {
  const match = name.match(/^議第(\d+)号/);
  return match ? Number(match[1]) : null;
}

async function prepareR8SepBills() {
  const csv = await fs.readFile(CSV_PATH, "utf8");
  const rows = parseBillUpdateCsv(csv);
  const targetRows = rows.filter((row) => {
    const billNumber = getBillNumber(row.name);
    return (
      billNumber !== null &&
      billNumber >= FIRST_BILL_NUMBER &&
      billNumber <= LAST_BILL_NUMBER
    );
  });
  const expectedCount = LAST_BILL_NUMBER - FIRST_BILL_NUMBER + 1;
  if (targetRows.length !== expectedCount) {
    throw new Error(
      `議第${FIRST_BILL_NUMBER}号〜議第${LAST_BILL_NUMBER}号は` +
        `${expectedCount}件必要ですが、${targetRows.length}件でした`
    );
  }
  const updatedRows = targetRows.map(applyR8SepOfficialData);

  await fs.writeFile(
    CSV_PATH,
    serializeBillUpdateCsv(updatedRows),
    "utf8"
  );
  console.log(`Prepared ${updatedRows.length} bills in ${CSV_PATH}`);
}

prepareR8SepBills().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
