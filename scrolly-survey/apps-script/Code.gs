/**
 * Scrollytelling survey — answer collector
 * Receives one JSON payload per completed survey and appends it as a row.
 *
 * SETUP (10 minutes, once)
 * 1. Create a Google Sheet. Name the first tab: Responses
 * 2. Extensions > Apps Script. Delete the placeholder, paste this file.
 * 3. Set SHEET_NAME below if you renamed the tab.
 * 4. Deploy > New deployment > type "Web app"
 *      Execute as:        Me
 *      Who has access:    Anyone
 *    Copy the /exec URL it gives you.
 * 5. Paste that URL into index.html, in the ENDPOINT constant near the bottom.
 *
 * The header row is written automatically on the first response.
 * To add a question later, add its key to FIELDS and it lands in a new column.
 */

var SHEET_NAME = 'Responses';

/** Column order. Keys must match what index.html sends. */
var FIELDS = [
  'received_at',      // written by this script, server time
  'submitted_at',     // written by the browser, ISO 8601 UTC
  'session_id',
  'q1',               // slider 0-10, energy left by Friday
  'q2',               // last GP check-up
  'q3',               // what gets in the way (multi, joined with " | ")
  'q4',               // slider 0-10, trust in online health advice
  'q5',               // would try a video consult
  'q6',               // mood today
  'q6note',           // optional word
  'seconds_taken',
  'device',
  'viewport',
  'referrer',
  'user_agent'
];

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = JSON.parse(raw);

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sheet = getSheet_();
      if (sheet.getLastRow() === 0) sheet.appendRow(FIELDS);

      data.received_at = new Date();
      data.user_agent = (e && e.parameter && e.parameter.ua) || data.user_agent || '';

      var row = FIELDS.map(function (key) {
        var v = data[key];
        if (v === undefined || v === null) return '';
        if (Object.prototype.toString.call(v) === '[object Array]') return v.join(' | ');
        return v;
      });

      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true });
  } catch (err) {
    // Never throw: a 500 here would make the browser retry and duplicate rows.
    return json_({ ok: false, error: String(err) });
  }
}

/** Open the sheet in a browser to check the deployment is live. */
function doGet() {
  return json_({ ok: true, service: 'scrollytelling survey collector', rows: getSheet_().getLastRow() });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
