// End-to-end check of the Supabase wiring, from the command line (Node 18+, no install needed).
//
//   node supabase/test-e2e.mjs https://xxxx.supabase.co sb_publishable_xxxx
//
// 1. inserts one clearly-labelled test response with the same headers the page uses (anon / publishable key)
// 2. reads the response_stats view the page reads for the live "other doctors" figures
// 3. checks that the anon key can NOT read individual rows (the policy must block it)
// Afterwards, delete the test rows in Supabase: SQL editor → delete from responses where session_id like 'e2e-%';

const [url, key] = process.argv.slice(2);
if (!url || !key) { console.error('usage: node supabase/test-e2e.mjs <SUPABASE_URL> <PUBLISHABLE_OR_ANON_KEY>'); process.exit(1); }
const base = url.replace(/\/+$/, '');
const headers = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
const ok = (label, pass, extra = '') => console.log((pass ? '  ✓ ' : '  ✗ ') + label + (extra ? ' — ' + extra : ''));
let failed = false;

// 1. insert
const sessionId = 'e2e-' + Date.now().toString(36);
const row = {
  q1_items: 44, q2_minutes: 45, q3_percent: 40, q3_label: 'About a third',
  q4_frustrations: 'e2e test', q4_other: '', q5_matters: 'e2e test', q5_other: '',
  complete: true, beta: false, beta_name: '', beta_email: '', beta_role: '',
  session_id: sessionId, submitted_at: new Date().toISOString(), seconds_taken: 1,
  device: 'test', viewport: '0x0', referrer: 'e2e-test', user_agent: 'test-e2e.mjs',
};
const ins = await fetch(base + '/rest/v1/responses', { method: 'POST', headers: { ...headers, Prefer: 'return=minimal' }, body: JSON.stringify(row) });
ok('insert one response (' + sessionId + ')', ins.status === 201, 'HTTP ' + ins.status + (ins.ok ? '' : ' ' + (await ins.text()).slice(0, 200)));
if (!ins.ok) failed = true;

// 2. stats view
const st = await fetch(base + '/rest/v1/response_stats?select=*', { headers });
const stats = st.ok ? await st.json() : null;
ok('read response_stats view', !!(stats && stats[0]), st.ok ? JSON.stringify(stats && stats[0]) : 'HTTP ' + st.status);
if (!st.ok) failed = true;

// 3. rows must stay private
const rd = await fetch(base + '/rest/v1/responses?select=id&limit=1', { headers });
const rows = rd.ok ? await rd.json() : null;
const priv = rd.ok ? Array.isArray(rows) && rows.length === 0 : rd.status === 401 || rd.status === 403;
ok('individual rows are NOT readable with this key', priv, rd.ok ? 'select returned ' + (rows ? rows.length : '?') + ' rows' : 'HTTP ' + rd.status);
if (!priv) failed = true;

console.log(failed ? '\nSomething is off — see above.' : '\nAll good. Delete the test rows in Supabase: SQL editor →\n  delete from responses where session_id like \'e2e-%\';');
process.exit(failed ? 1 : 0);
