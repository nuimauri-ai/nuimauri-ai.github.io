# Where the answers go

One completed survey = one row in your Google Sheet. No database, no server to pay for, no account for anyone to create.

## Setup, about 10 minutes, done once

1. **Create the sheet.** New Google Sheet, rename the first tab to `Responses`.
2. **Open the script editor.** Extensions → Apps Script. Delete the placeholder code, paste everything from `Code.gs`.
3. **Deploy it.** Deploy → New deployment → select type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy, then authorise when Google asks. It will warn that the app is unverified because it is your own script. Advanced → Go to project.
4. **Copy the URL** it gives you. It ends in `/exec`.
5. **Paste it into the survey.** Open `index.html`, find `const ENDPOINT = '';` near the bottom and put the URL between the quotes.

That is it. The header row writes itself on the first response.

## Check it is live

Open the `/exec` URL in a browser. You should see:

```json
{"ok":true,"service":"scrollytelling survey collector","rows":0}
```

Then run through the survey once on your phone. A new row appears in the sheet within a second or two, and the last screen of the survey says "Answers sent."

## What lands in each row

| Column | What it is |
|---|---|
| received_at | Server time, written by Google |
| submitted_at | Browser time, ISO 8601 UTC |
| session_id | Unique per run, so duplicates are easy to spot |
| q1 | Energy left by Friday, 0 to 10 |
| q2 | Last GP check-up |
| q3 | What gets in the way, multiple answers joined with a pipe |
| q4 | Trust in online health advice, 0 to 10 |
| q5 | Would try a video consult |
| q6 | Mood today |
| q6note | Optional word, may be empty |
| seconds_taken | How long the run took |
| device | mobile or desktop |
| viewport | Screen size in CSS pixels |
| referrer | Where they came from, empty if opened directly |
| user_agent | Full browser string |

## Changing the questions later

Two edits, both small.

1. In `index.html`, change the question text and the answer options.
2. In `Code.gs`, add or rename the key in the `FIELDS` list.

New keys become new columns on the next response. Existing rows keep their values, they just have blanks in the new column.

## Notes

- The answers are sent once, the moment the last question is answered, not on every scroll.
- If someone closes the tab right after answering, the answers still go through. `sendBeacon` is built for exactly that.
- Nothing is stored in the browser and no cookie is set.
- If `ENDPOINT` is left empty, the survey runs normally and simply does not send anything. Useful while testing.
- The sheet is yours. Airtasker, GitHub and I have no access to it.
