# MARC survey — editing guide

Two files matter:

| File | What it holds | Touch it? |
|---|---|---|
| `content.js` | Every word on the page: questions, options, helper text, the "other doctors" comparison numbers, beta form labels | **Yes — this is yours** |
| `index.html` | Layout, animation, data sending | Only to paste the collector URL (see below) |

## Changing wording, options or numbers

Open `content.js`. Each block is one screen. Change the text between the quotes, keep the quotes and commas. Examples:

- Reword a question: edit `question:` in `q1` … `q5`.
- Add / remove / reorder a tick-box option: edit the list under `options:` in `q4` or `q5`. One line per option.
- Change the slider range: `min`, `max`, `step`, `start` in `q1` / `q2`.
- Change the plain-English bands of Q3: `bands:` — each pair is `[upper bound %, label]`.
- Change the comparison figures ("Other doctors reported around …"): `benchmarks:` at the top. These are placeholders until you have enough real responses.
- Beta form labels and roles list: `beta:`.

Save, reload the page. Nothing else needs to change.

## Where the answers go

At the bottom of `index.html` there is a line:

```js
const ENDPOINT = '';
```

Paste the URL of your collector between the quotes (a Supabase Edge Function or a Google Apps Script web-app URL). While it is empty, nothing is sent. One response is sent once, when the participant joins the beta or taps "Not now" (and as a safety net if they close the tab after Q5).

Each response is one JSON object with these fields:

`q1_items, q2_minutes, q3_percent, q3_label, q4_frustrations, q4_other, q5_matters, q5_other, beta, beta_name, beta_email, beta_role, session_id, submitted_at, seconds_taken, device, viewport, referrer, user_agent`

## Testing a specific screen

Add `?at=` to the URL to jump straight to a screen, e.g. `index.html?at=q3` (a question) or `index.html?at=pin5:0.5` (the MARC reveal scene frozen at 50 % of its animation). Scene ids: `pin0` opening, `pin2` clock, `pin3` record, `pin4` noise, `pin5` MARC reveal. Screens: `q1`–`q5`, `result`, `beta`, `closing`.

## How it moves

One swipe (or one wheel notch / arrow key) = one screen. A scene plays its whole animation on arrival, then waits. Sliders move on by themselves once answered; tick-box screens have a Next button; long lists scroll inside their screen first and only change screen once you reach the end.

## Hosting

Static files, no build step. Any host works (Vercel, Netlify, GitHub Pages, your own server). Upload the folder as is.
