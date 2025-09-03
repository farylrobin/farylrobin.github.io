// ======= CONFIG =======
const WEBHOOK_URL = "https://farylrobin.app.n8n.cloud/webhook/4060b9db-fe04-45b4-9af5-60ed52f513d1";

// Paste of your CSV (kept verbatim)
const NRF_CSV = `"nrf_calendar_id","Start Date","End Date"
"1","February 2 2025","February 8 2025"
"2","February 9 2025","February 15 2025"
"3","February 16 2025","February 22 2025"
"4","February 23 2025","March 1 2025"
"5","March 2 2025","March 8 2025"
"6","March 9 2025","March 15 2025"
"7","March 16 2025","March 22 2025"
"8","March 23 2025","March 29 2025"
"9","March 30 2025","April 5 2025"
"10","April 6 2025","April 12 2025"
"11","April 13 2025","April 19 2025"
"12","April 20 2025","April 26 2025"
"13","April 27 2025","May 3 2025"
"14","May 4 2025","May 10 2025"
"15","May 11 2025","May 17 2025"
"16","May 18 2025","May 24 2025"
"17","May 25 2025","May 31 2025"
"18","June 1 2025","June 7 2025"
"19","June 8 2025","June 14 2025"
"20","June 15 2025","June 21 2025"
"21","June 22 2025","June 28 2025"
"22","June 29 2025","July 5 2025"
"23","July 6 2025","July 12 2025"
"24","July 13 2025","July 19 2025"
"25","July 20 2025","July 26 2025"
"26","July 27 2025","August 2 2025"
"27","August 3 2025","August 9 2025"
"28","August 10 2025","August 16 2025"
"29","August 17 2025","August 23 2025"
"30","August 24 2025","August 30 2025"
"31","August 31 2025","September 6 2025"
"32","September 7 2025","September 13 2025"
"33","September 14 2025","September 20 2025"
"34","September 21 2025","September 27 2025"
"35","September 28 2025","October 4 2025"
"36","October 5 2025","October 11 2025"
"37","October 12 2025","October 18 2025"
"38","October 19 2025","October 25 2025"
"39","October 26 2025","November 1 2025"
"40","November 2 2025","November 8 2025"
"41","November 9 2025","November 15 2025"
"42","November 16 2025","November 22 2025"
"43","November 23 2025","November 29 2025"
"44","November 30 2025","December 6 2025"
"45","December 7 2025","December 13 2025"
"46","December 14 2025","December 20 2025"
"47","December 21 2025","December 27 2025"
"48","December 28 2025","January 3 2026"
"49","January 4 2026","January 10 2026"
"50","January 11 2026","January 17 2026"
"51","January 18 2026","January 24 2026"
"52","January 25 2026","January 31 2026"
"53","February 1 2026","February 7 2026"
"54","February 8 2026","February 14 2026"
"55","February 15 2026","February 21 2026"
"56","February 22 2026","February 28 2026"
"57","March 1 2026","March 7 2026"
"58","March 8 2026","March 14 2026"
"59","March 15 2026","March 21 2026"
"60","March 22 2026","March 28 2026"
"61","March 29 2026","April 4 2026"
"62","April 5 2026","April 11 2026"
"63","April 12 2026","April 18 2026"
"64","April 19 2026","April 25 2026"
"65","April 26 2026","May 2 2026"
"66","May 3 2026","May 9 2026"
"67","May 10 2026","May 16 2026"
"68","May 17 2026","May 23 2026"
"69","May 24 2026","May 30 2026"
"70","May 31 2026","June 6 2026"
"71","June 7 2026","June 13 2026"
"72","June 14 2026","June 20 2026"
"73","June 21 2026","June 27 2026"
"74","June 28 2026","July 4 2026"
"75","July 5 2026","July 11 2026"
"76","July 12 2026","July 18 2026"
"77","July 19 2026","July 25 2026"
"78","July 26 2026","August 1 2026"
"79","August 2 2026","August 8 2026"
"80","August 9 2026","August 15 2026"
"81","August 16 2026","August 22 2026"
"82","August 23 2026","August 29 2026"
"83","August 30 2026","September 5 2026"
"84","September 6 2026","September 12 2026"
"85","September 13 2026","September 19 2026"
"86","September 20 2026","September 26 2026"
"87","September 27 2026","October 3 2026"
"88","October 4 2026","October 10 2026"
"89","October 11 2026","October 17 2026"
"90","October 18 2026","October 24 2026"
"91","October 25 2026","October 31 2026"
"92","November 1 2026","November 7 2026"
"93","November 8 2026","November 14 2026"
"94","November 15 2026","November 21 2026"
"95","November 22 2026","November 28 2026"
"96","November 29 2026","December 5 2026"
"97","December 6 2026","December 12 2026"
"98","December 13 2026","December 19 2026"
"99","December 20 2026","December 26 2026"
"100","December 27 2026","January 2 2027"
"101","January 3 2027","January 9 2027"
"102","January 10 2027","January 16 2027"
"103","January 17 2027","January 23 2027"
"104","January 24 2027","January 30 2027"
"105","January 31 2027","February 6 2027"
"106","February 7 2027","February 13 2027"
"107","February 14 2027","February 20 2027"
"108","February 21 2027","February 27 2027"
"109","February 28 2027","March 6 2027"
"110","March 7 2027","March 13 2027"
"111","March 14 2027","March 20 2027"
"112","March 21 2027","March 27 2027"
"113","March 28 2027","April 3 2027"
"114","April 4 2027","April 10 2027"
"115","April 11 2027","April 17 2027"
"116","April 18 2027","April 24 2027"
"117","April 25 2027","May 1 2027"
"118","May 2 2027","May 8 2027"
"119","May 9 2027","May 15 2027"
"120","May 16 2027","May 22 2027"
"121","May 23 2027","May 29 2027"
"122","May 30 2027","June 5 2027"
"123","June 6 2027","June 12 2027"
"124","June 13 2027","June 19 2027"
"125","June 20 2027","June 26 2027"
"126","June 27 2027","July 3 2027"
"127","July 4 2027","July 10 2027"
"128","July 11 2027","July 17 2027"
"129","July 18 2027","July 24 2027"
"130","July 25 2027","July 31 2027"
"131","August 1 2027","August 7 2027"
"132","August 8 2027","August 14 2027"
"133","August 15 2027","August 21 2027"
"134","August 22 2027","August 28 2027"
"135","August 29 2027","September 4 2027"
"136","September 5 2027","September 11 2027"
"137","September 12 2027","September 18 2027"
"138","September 19 2027","September 25 2027"
"139","September 26 2027","October 2 2027"
"140","October 3 2027","October 9 2027"
"141","October 10 2027","October 16 2027"
"142","October 17 2027","October 23 2027"
"143","October 24 2027","October 30 2027"
"144","October 31 2027","November 6 2027"
"145","November 7 2027","November 13 2027"
"146","November 14 2027","November 20 2027"
"147","November 21 2027","November 27 2027"
"148","November 28 2027","December 4 2027"
"149","December 5 2027","December 11 2027"
"150","December 12 2027","December 18 2027"
"151","December 19 2027","December 25 2027"
"152","December 26 2027","January 1 2028"
"153","January 2 2028","January 8 2028"
"154","January 9 2028","January 15 2028"
"155","January 16 2028","January 22 2028"
"156","January 23 2028","January 29 2028"
"157","January 30 2028","February 5 2028"`;

// Strip ordinal suffixes globally within the CSV so the matrix itself is clean
const CLEAN_NRF_CSV = NRF_CSV.replace(/(\d{1,2})(st|nd|rd|th)/g, "$1");

// ======= Elements =======
const reportWeekEl = document.getElementById("reportWeek");
const seasonStartEl = document.getElementById("seasonStart");
const seasonEndEl = document.getElementById("seasonEnd");
const emailHandleEl = document.getElementById("emailHandle");
const formEl = document.getElementById("reportForm");
const submitBtn = document.getElementById("submitBtn");
const msgEl = document.getElementById("msg");
const notesEl = document.getElementById("notes");
const accountEl = document.getElementById("account");
const dueDateEl = document.getElementById("dueDate");

// ======= CSV Parsing (simple) =======
function parseNRF(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const header = (lines.shift() || "");
  const out = [];
  for (const line of lines) {
    const cols = [];
    const re = /"([^"]*)"/g;
    let m;
    while ((m = re.exec(line)) !== null) cols.push(m[1]);
    if (cols.length >= 3) {
      const id = cols[0].trim();
      const start = cols[1].trim();
      const end = cols[2].trim();
      out.push({ id, start, end });
    }
  }
  return out;
}

function buildOptions(weeks) {
  // Label format: Start – End (no W{id} in UI); include `name` for backend
  return weeks.map(w => ({
    value: w.id,
    label: `${w.start} – ${w.end}`,
    name: `W${w.id}`,
    start: w.start,
    end: w.end
  }));
}
// Populate a <select> with options [{ value, label }]
function fillSelect(selectEl, options) {
  if (!selectEl) {
    console.error("fillSelect: selectEl is null/undefined");
    return;
  }
  // Preserve any first placeholder option and clear the rest
  try {
    selectEl.querySelectorAll("option:not(:first-child)").forEach(o => o.remove());
  } catch (_) {
    // If there is no first-child or options, that's fine; we'll just append
  }
  options.forEach(opt => {
    const o = document.createElement("option");
    o.value = String(opt.value);
    o.textContent = opt.label;
    selectEl.appendChild(o);
  });
}

// ======= Init =======
const NRF_WEEKS = parseNRF(CLEAN_NRF_CSV);
const WEEK_OPTIONS = buildOptions(NRF_WEEKS);

// ======= Accounts (static list) =======
const ACCOUNTS = [
  { id: 1, name: "target" },
  { id: 2, name: "amazon" },
  { id: 3, name: "walmart" },
  { id: 4, name: "american eagle" },
  { id: 5, name: "abercrombie" },
  { id: 6, name: "draper james" }
];
function fillAccounts(selectEl, accounts) {
  selectEl.querySelectorAll("option:not(:first-child)").forEach(o => o.remove());
  accounts.forEach(a => {
    const opt = document.createElement("option");
    opt.value = String(a.id);
    opt.textContent = a.name;
    selectEl.appendChild(opt);
  });
}
fillAccounts(accountEl, ACCOUNTS);

fillSelect(reportWeekEl, WEEK_OPTIONS);
fillSelect(seasonStartEl, WEEK_OPTIONS);
fillSelect(seasonEndEl, WEEK_OPTIONS);

function setMessage(text, kind = "") {
  msgEl.textContent = text || "";
  msgEl.className = "message" + (kind ? ` ${kind}` : "");
}

function validateRange() {
  const s = Number(seasonStartEl.value || NaN);
  const e = Number(seasonEndEl.value || NaN);
  if (!Number.isFinite(s) || !Number.isFinite(e)) return true;
  if (e < s) {
    setMessage("Season end week occurs before start week. Please adjust.", "error");
    return false;
  }
  setMessage("");
  return true;
}

seasonStartEl.addEventListener("change", validateRange);
seasonEndEl.addEventListener("change", validateRange);

// Helper to lookup label/start/end by id
function weekById(id) {
  return WEEK_OPTIONS.find(w => String(w.value) === String(id));
}

// ======= Submit =======
formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMessage("");

  if (!accountEl.value || !reportWeekEl.value || !seasonStartEl.value || !seasonEndEl.value || !dueDateEl.value) {
    setMessage("Please select all required fields.", "error");
    return;
  }
  if (!emailHandleEl.value.trim()) {
    setMessage("Please enter your email handle.", "error");
    return;
  }
  if (!validateRange()) return;

  const rw = weekById(reportWeekEl.value);
  const ss = weekById(seasonStartEl.value);
  const se = weekById(seasonEndEl.value);

  const payload = {
    account: {
      id: Number(accountEl.value),
      name: accountEl.options[accountEl.selectedIndex]?.text || ""
    },
    report_week: {
      id: Number(reportWeekEl.value),
      name: rw?.name,
      label: rw?.label,
      start: rw?.start,
      end: rw?.end
    },
    season: {
      start_week: {
        id: Number(seasonStartEl.value),
        name: ss?.name,
        label: ss?.label,
        start: ss?.start,
        end: ss?.end
      },
      end_week: {
        id: Number(seasonEndEl.value),
        name: se?.name,
        label: se?.label,
        start: se?.start,
        end: se?.end
      }
    },
    due_date: dueDateEl.value,
    email: `${emailHandleEl.value.trim()}@farylrobin.com`,
    notes: (notesEl?.value || "").trim(),
    submitted_at: new Date().toISOString()
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";

  try {
    // If your webhook enforces CORS, you can use mode: 'no-cors' for fire-and-forget.
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      body: JSON.stringify(payload)
    });

    setMessage("Request sent. We'll send you a confirmation shortly.", "success");
    formEl.reset();
    [reportWeekEl, seasonStartEl, seasonEndEl].forEach(el => (el.selectedIndex = 0));
  } catch (err) {
    console.error(err);
    setMessage("Failed to send request. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "SUBMIT REPORT REQUEST";
  }
});