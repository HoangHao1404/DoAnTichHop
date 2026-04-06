const fs = require("fs");
const path = require("path");

const CSV_HEADERS = [
  "id",
  "userId",
  "title",
  "type",
  "location",
  "status",
  "description",
  "imagePath",
  "potholeCount",
  "damageLevel",
  "aiPercent",
  "createdAt",
];

function getProjectRoot() {
  return path.resolve(__dirname, "../../..");
}

function getDefaultCsvPath() {
  return path.join(getProjectRoot(), "test-data", "reports", "testReport.csv");
}

function getDefaultUploadDir() {
  return path.join(getProjectRoot(), "test-data", "reports", "uploads");
}

function getCsvPath() {
  return process.env.TEST_REPORT_CSV_PATH || getDefaultCsvPath();
}

function getUploadDir() {
  return process.env.TEST_REPORT_UPLOAD_DIR || getDefaultUploadDir();
}

function ensureStorage() {
  const csvPath = getCsvPath();
  const uploadDir = getUploadDir();

  fs.mkdirSync(path.dirname(csvPath), { recursive: true });
  fs.mkdirSync(uploadDir, { recursive: true });

  if (!fs.existsSync(csvPath)) {
    fs.writeFileSync(csvPath, `${CSV_HEADERS.join(",")}\n`, "utf8");
  }

  return { csvPath, uploadDir };
}

function escapeCsvValue(value) {
  const raw = value === undefined || value === null ? "" : String(value);
  const escaped = raw.replace(/"/g, '""');
  return `"${escaped}"`;
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function readAllRows() {
  const { csvPath } = ensureStorage();
  const raw = fs.readFileSync(csvPath, "utf8");
  const lines = raw.split(/\r?\n/).filter(Boolean);

  if (lines.length <= 1) {
    return [];
  }

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};

    CSV_HEADERS.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    return row;
  });
}

function getNextNumericId() {
  const rows = readAllRows();
  const maxId = rows.reduce((max, row) => {
    const parsed = Number(row.id);
    if (Number.isNaN(parsed)) {
      return max;
    }
    return Math.max(max, parsed);
  }, 0);

  return maxId + 1;
}

function appendRow(row) {
  const { csvPath } = ensureStorage();
  const line = CSV_HEADERS.map((header) => escapeCsvValue(row[header])).join(
    ",",
  );
  fs.appendFileSync(csvPath, `${line}\n`, "utf8");
}

module.exports = {
  CSV_HEADERS,
  ensureStorage,
  getCsvPath,
  getUploadDir,
  getNextNumericId,
  readAllRows,
  appendRow,
};
