/* =====================================================================
   MARC survey — all editable content lives here.
   Change any wording, option or number below; nothing in index.html
   needs to be touched. Keep the quotes and commas as they are.
   ===================================================================== */
window.CONTENT = {

  /* Comparison figures shown to the participant.
     PLACEHOLDERS until the survey has enough live responses: replace
     them with the real medians, or wire them to the response store. */
  benchmarks: {
    items:   68,   // "Other doctors reported around ___ inbox items"
    minutes: 45,   // typical minutes spent on results / inbox
    percent: 40    // typical % needing the record reopened (shown in result.compare)
  },

  /* Small interface labels */
  ui: {
    lock: "Got it",
    cueTouch: "Swipe up",
    cueMouse: "Scroll",
    you: "You",
    others: "Others",
    counter: " of 5",
    sent: "Answers sent."
  },

  opening: {
    /* One phrase per beat, in order. They build up on screen with the animation:
       1 while the medical items pile up, 2 as the tired doctor appears, 3 as she rubs her eyes
       and slumps back, 4 and 5 as the screen fills with incoming results. */
    lines: [
      "As a doctor…",
      "at the end of a long clinical day…",
      "you’ve still got to check your inbox…",
      "check the results…",
      "check the correspondence."
    ],
    /* the little notifications that pop up around the monitor at the end: [text, colour] with colour "" (red), "amber" or "blue" */
    incoming: [["New result",""],["Pathology","amber"],["Letter received","blue"],["Radiology",""],["Discharge summary","blue"],["Result","amber"],["Specialist letter","blue"],["Abnormal result",""]]
  },

  q1: {
    chapter: "Workload",
    question: "If you had to guess, how many results, letters or other inbox items would you typically have to sort through?",
    help: "Per clinical day. Drag the slider.",
    min: 0, max: 100, step: 5, start: 40,
    unit: "items",
    reveal: "Other doctors reported around {items}."
  },

  scene2: {
    line1: "Thinking about the last clinical day you worked…",
    hold: 2.2   // seconds the phrase stays on screen before it fades into the question
  },
  q2: {
    chapter: "Time",
    question: "How long did it take you to review your results, inbox and correspondence?",
    help: "Drag the slider.",
    min: 0, max: 180, step: 5, start: 30,
    unit: "min"
  },

  scene3: {
    line1: "Some results make sense on their own.",
    line2: "Others only make sense once you’ve reopened the record and pieced the story back together."
  },
  q3: {
    chapter: "The clinical story",
    question: "Roughly what percentage required you to open the patient record and reconstruct the clinical story before you could decide what the result meant for that patient?",
    help: "Drag to answer in plain words. We record the percentage.",
    start: 30,
    /* wording shown while dragging: [upper bound (inclusive), label]. Keep ascending and end at 100. */
    bands: [
      [10, "Almost none"],
      [35, "A few"],
      [65, "About half"],
      [90, "Most"],
      [100, "Almost all"]
    ]
  },

  scene4: {
    line1: "And it’s not only the volume.",
    /* labels stuck on the scattered papers: [text, colour] with colour "" (red), "amber" or "blue" */
    badges: [["Duplicate",""],["Unread 143","blue"],["Mislabelled","amber"],["Filed to wrong patient",""],["Overdue follow-up","amber"],["Duplicate",""],["Unread","blue"]]
  },
  q4: {
    chapter: "Current frustrations",
    question: "What are the hardest parts of dealing with results, inbox and correspondence?",
    help: "Select the ones most relevant to you.",
    options: [
      "The amount of time it takes",
      "Having to open the patient record and reconstruct the clinical story",
      "The reason the test was ordered is often not obvious from the inbox / result itself",
      "Results or correspondence being duplicated, incorrectly labelled or filed",
      "Doing this work after the clinical day / unpaid overtime",
      "Worrying that something important may be buried amongst the noise",
      "Worrying about missing a clinically important result or follow-up",
      "Most results are normal but still need to be individually reviewed and cleared",
      "Mildly abnormal results where it is difficult to answer: “Is this important for this patient right now?”",
      "Reviewing results for patients I don’t remember well",
      "Following up results or patients on behalf of another doctor",
      "Chasing patients or arranging further follow-up",
      "Keeping track of whether required follow-up has actually occurred"
    ],
    otherLabel: "Other",
    otherPlaceholder: "Tell us in a few words",
    next: "Next"
  },

  reveal: {
    line1: "Developed to bring the information needed for that decision together in one place.",   // reads on from the logo above it
    sources: [
      "The current result",
      "Previous results and trends",
      "Why the test was ordered",
      "Recent illness or acute presentations",
      "Recent medication changes",
      "Relevant past medical history",
      "Relevant specialist correspondence",
      "Relevant follow-up"
    ],
    cardTitle: "Clinical summary",
    line2: "One concise clinical summary. Around every result."
  },

  q5: {
    chapter: "Adoption",
    question: "What would matter most to you before using something like this in clinical practice?",
    help: "Select the ones most relevant to you.",
    options: [
      "Accuracy",
      "Seamless integration with existing clinical software",
      "Speed",
      "Ability to verify where the information came from",
      "Privacy and security",
      "Minimal additional clicks or workflow changes",
      "Confidence that important information won’t be omitted",
      "Medico-legal confidence",
      "Cost",
      "Ability to customise the amount of information shown"
    ],
    otherLabel: "Other",
    otherPlaceholder: "Tell us in a few words",
    next: "See my summary"
  },

  result: {
    kicker: "Your clinical day",
    title: "Here’s what you told us.",
    labels: {
      items: "Inbox items per day",
      minutes: "Minutes reviewing results",
      percent: "Needed the record reopened",
      concerns: "What weighs most",
      matters: "What would matter most"
    },
    compare: "Other doctors so far: around {items} items, {minutes} minutes, and {percent}% needing the record reopened."
  },

  beta: {
    kicker: "Beta",
    title: "We’re planning to launch the MARC beta soon.",
    text: "Would you like to try it in your own clinical workflow and see how much time it could save you?",
    name: "Name",
    email: "Email",
    role: "Role / practice type",
    roles: ["GP", "GP registrar", "Specialist", "Practice manager / nurse", "Other"],
    button: "Join the beta",
    skip: "Not now",
    privacy: "We’ll only use this to contact you about the beta.",
    emailError: "Please enter a valid email address."
  },

  closing: {
    thanks: "Thank you.",
    sub: "Safer results review, with less cognitive load.",
    link: "marc.health",
    url: "https://marc.health"
  }
};
