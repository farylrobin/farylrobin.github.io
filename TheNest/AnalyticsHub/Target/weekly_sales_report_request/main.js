// ======= CONFIG =======
const WEBHOOK_URL = "https://farylrobin.app.n8n.cloud/webhook/4060b9db-fe04-45b4-9af5-60ed52f513d1";

// Paste of your CSV (kept verbatim)
const NRF_CSV = `"nrf_calendar_id","Start Date","End Date"
"1","February 2th 2025","February 8th 2025"
"2","February 9th 2025","February 15th 2025"
"3","February 16th 2025","February 22th 2025"
"4","February 23th 2025","March 1th 2025"
"5","March 2th 2025","March 8th 2025"
"6","March 9th 2025","March 15th 2025"
"7","March 16th 2025","March 22th 2025"
"8","March 23th 2025","March 29th 2025"
"9","March 30th 2025","April 5th 2025"
"10","April 6th 2025","April 12th 2025"
"11","April 13th 2025","April 19th 2025"
"12","April 20th 2025","April 26th 2025"
"13","April 27th 2025","May 3th 2025"
"14","May 4th 2025","May 10th 2025"
"15","May 11th 2025","May 17th 2025"
"16","May 18th 2025","May 24th 2025"
"17","May 25th 2025","May 31th 2025"
"18","June 1th 2025","June 7th 2025"
"19","June 8th 2025","June 14th 2025"
"20","June 15th 2025","June 21th 2025"
"21","June 22th 2025","June 28th 2025"
"22","June 29th 2025","July 5th 2025"
"23","July 6th 2025","July 12th 2025"
"24","July 13th 2025","July 19th 2025"
"25","July 20th 2025","July 26th 2025"
"26","July 27th 2025","August 2th 2025"
"27","August 3th 2025","August 9th 2025"
"28","August 10th 2025","August 16th 2025"
"29","August 17th 2025","August 23th 2025"
"30","August 24th 2025","August 30th 2025"
"31","August 31th 2025","September 6th 2025"
"32","September 7th 2025","September 13th 2025"
"33","September 14th 2025","September 20th 2025"
"34","September 21th 2025","September 27th 2025"
"35","September 28th 2025","October 4th 2025"
"36","October 5th 2025","October 11th 2025"
"37","October 12th 2025","October 18th 2025"
"38","October 19th 2025","October 25th 2025"
"39","October 26th 2025","November 1th 2025"
"40","November 2th 2025","November 8th 2025"
"41","November 9th 2025","November 15th 2025"
"42","November 16th 2025","November 22th 2025"
"43","November 23th 2025","November 29th 2025"
"44","November 30th 2025","December 6th 2025"
"45","December 7th 2025","December 13th 2025"
"46","December 14th 2025","December 20th 2025"
"47","December 21th 2025","December 27th 2025"
"48","December 28th 2025","January 3th 2026"
"49","January 4th 2026","January 10th 2026"
"50","January 11th 2026","January 17th 2026"
"51","January 18th 2026","January 24th 2026"
"52","January 25th 2026","January 31th 2026"
"53","February 1th 2026","February 7th 2026"
"54","February 8th 2026","February 14th 2026"
"55","February 15th 2026","February 21th 2026"
"56","February 22th 2026","February 28th 2026"
"57","March 1th 2026","March 7th 2026"
"58","March 8th 2026","March 14th 2026"
"59","March 15th 2026","March 21th 2026"
"60","March 22th 2026","March 28th 2026"
"61","March 29th 2026","April 4th 2026"
"62","April 5th 2026","April 11th 2026"
"63","April 12th 2026","April 18th 2026"
"64","April 19th 2026","April 25th 2026"
"65","April 26th 2026","May 2th 2026"
"66","May 3th 2026","May 9th 2026"
"67","May 10th 2026","May 16th 2026"
"68","May 17th 2026","May 23th 2026"
"69","May 24th 2026","May 30th 2026"
"70","May 31th 2026","June 6th 2026"
"71","June 7th 2026","June 13th 2026"
"72","June 14th 2026","June 20th 2026"
"73","June 21th 2026","June 27th 2026"
"74","June 28th 2026","July 4th 2026"
"75","July 5th 2026","July 11th 2026"
"76","July 12th 2026","July 18th 2026"
"77","July 19th 2026","July 25th 2026"
"78","July 26th 2026","August 1th 2026"
"79","August 2th 2026","August 8th 2026"
"80","August 9th 2026","August 15th 2026"
"81","August 16th 2026","August 22th 2026"
"82","August 23th 2026","August 29th 2026"
"83","August 30th 2026","September 5th 2026"
"84","September 6th 2026","September 12th 2026"
"85","September 13th 2026","September 19th 2026"
"86","September 20th 2026","September 26th 2026"
"87","September 27th 2026","October 3th 2026"
"88","October 4th 2026","October 10th 2026"
"89","October 11th 2026","October 17th 2026"
"90","October 18th 2026","October 24th 2026"
"91","October 25th 2026","October 31th 2026"
"92","November 1th 2026","November 7th 2026"
"93","November 8th 2026","November 14th 2026"
"94","November 15th 2026","November 21th 2026"
"95","November 22th 2026","November 28th 2026"
"96","November 29th 2026","December 5th 2026"
"97","December 6th 2026","December 12th 2026"
"98","December 13th 2026","December 19th 2026"
"99","December 20th 2026","December 26th 2026"
"100","December 27th 2026","January 2th 2027"
"101","January 3th 2027","January 9th 2027"
"102","January 10th 2027","January 16th 2027"
"103","January 17th 2027","January 23th 2027"
"104","January 24th 2027","January 30th 2027"
"105","January 31th 2027","February 6th 2027"
"106","February 7th 2027","February 13th 2027"
"107","February 14th 2027","February 20th 2027"
"108","February 21th 2027","February 27th 2027"
"109","February 28th 2027","March 6th 2027"
"110","March 7th 2027","March 13th 2027"
"111","March 14th 2027","March 20th 2027"
"112","March 21th 2027","March 27th 2027"
"113","March 28th 2027","April 3th 2027"
"114","April 4th 2027","April 10th 2027"
"115","April 11th 2027","April 17th 2027"
"116","April 18th 2027","April 24th 2027"
"117","April 25th 2027","May 1th 2027"
"118","May 2th 2027","May 8th 2027"
"119","May 9th 2027","May 15th 2027"
"120","May 16th 2027","May 22th 2027"
"121","May 23th 2027","May 29th 2027"
"122","May 30th 2027","June 5th 2027"
"123","June 6th 2027","June 12th 2027"
"124","June 13th 2027","June 19th 2027"
"125","June 20th 2027","June 26th 2027"
"126","June 27th 2027","July 3th 2027"
"127","July 4th 2027","July 10th 2027"
"128","July 11th 2027","July 17th 2027"
"129","July 18th 2027","July 24th 2027"
"130","July 25th 2027","July 31th 2027"
"131","August 1th 2027","August 7th 2027"
"132","August 8th 2027","August 14th 2027"
"133","August 15th 2027","August 21th 2027"
"134","August 22th 2027","August 28th 2027"
"135","August 29th 2027","September 4th 2027"
"136","September 5th 2027","September 11th 2027"
"137","September 12th 2027","September 18th 2027"
"138","September 19th 2027","September 25th 2027"
"139","September 26th 2027","October 2th 2027"
"140","October 3th 2027","October 9th 2027"
"141","October 10th 2027","October 16th 2027"
"142","October 17th 2027","October 23th 2027"
"143","October 24th 2027","October 30th 2027"
"144","October 31th 2027","November 6th 2027"
"145","November 7th 2027","November 13th 2027"
"146","November 14th 2027","November 20th 2027"
"147","November 21th 2027","November 27th 2027"
"148","November 28th 2027","December 4th 2027"
"149","December 5th 2027","December 11th 2027"
"150","December 12th 2027","December 18th 2027"
"151","December 19th 2027","December 25th 2027"
"152","December 26th 2027","January 1th 2028"
"153","January 2th 2028","January 8th 2028"
"154","January 9th 2028","January 15th 2028"
"155","January 16th 2028","January 22th 2028"
"156","January 23th 2028","January 29th 2028"
"157","January 30th 2028","February 5th 2028"`;

// ======= Elements =======
const reportWeekEl = document.getElementById("reportWeek");
const seasonStartEl = document.getElementById("seasonStart");
const seasonEndEl = document.getElementById("seasonEnd");
const emailHandleEl = document.getElementById("emailHandle");
const formEl = document.getElementById("reportForm");
const submitBtn = document.getElementById("submitBtn");
const msgEl = document.getElementById("msg");
const notesEl = document.getElementById("notes");

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
  // Label format: W{n}: Start – End
  return weeks.map(w => ({
    value: w.id,
    label: `W${w.id}: ${w.start} – ${w.end}`,
    start: w.start,
    end: w.end
  }));
}

function fillSelect(el, opts) {
  // Remove all but placeholder
  el.querySelectorAll("option:not(:first-child)").forEach(o => o.remove());
  for (const o of opts) {
    const opt = document.createElement("option");
    opt.value = o.value;
    opt.textContent = o.label;
    el.appendChild(opt);
  }
}

// ======= Init =======
const NRF_WEEKS = parseNRF(NRF_CSV);
const WEEK_OPTIONS = buildOptions(NRF_WEEKS);

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

  if (!reportWeekEl.value || !seasonStartEl.value || !seasonEndEl.value) {
    setMessage("Please select all weeks.", "error");
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
    report_week: {
      id: Number(reportWeekEl.value),
      label: rw?.label,
      start: rw?.start,
      end: rw?.end
    },
    season: {
      start_week: {
        id: Number(seasonStartEl.value),
        label: ss?.label,
        start: ss?.start,
        end: ss?.end
      },
      end_week: {
        id: Number(seasonEndEl.value),
        label: se?.label,
        start: se?.start,
        end: se?.end
      }
    },
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
      // mode: "no-cors", // uncomment if you hit CORS issues
      body: JSON.stringify(payload)
    });

    setMessage("Request sent. You’ll receive your report if configured.", "success");
    formEl.reset();
    [reportWeekEl, seasonStartEl, seasonEndEl].forEach(el => (el.selectedIndex = 0));
  } catch (err) {
    console.error(err);
    setMessage("Failed to send request. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit report request";
  }
});