
const YMD_RE = /^(\d{4})-(\d{2})-(\d{2})/;

function parseYmd(ymd) {
  const m = String(ymd || "").match(YMD_RE);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, mo, d };
}

function formatYmdUTC(date) {
  const y = date.getUTCFullYear();
  const mo = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${mo}-${d}`;
}

function addDaysYmd(ymd, deltaDays) {
  const p = parseYmd(ymd);
  if (!p) return null;
  const dt = new Date(Date.UTC(p.y, p.mo - 1, p.d));
  dt.setUTCDate(dt.getUTCDate() + Number(deltaDays || 0));
  return formatYmdUTC(dt);
}

function cnDateToEtGameDate(cnYmd) {
  return addDaysYmd(cnYmd, -1);
}

function etGameDateToCnDate(etYmd) {
  return addDaysYmd(etYmd, +1);
}



function getChinaTodayYmd(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

module.exports = {
  parseYmd,
  addDaysYmd,
  cnDateToEtGameDate,
  etGameDateToCnDate,
  getChinaTodayYmd,
};

