/**
 * Azure Rooftop Bar — Table Booking Plugin
 * ─────────────────────────────────────────
 * INSTALLATION :
 *   1. Copiez ce fichier sur votre serveur (ex: /js/azure-booking.js)
 *   2. Ajoutez avant </body> dans votre HTML :
 *        <script src="azure-booking.js"></script>
 *   3. PREMIERE RESERVATION : FormSubmit enverra un email de confirmation
 *      a nui.mauri@gmail.com — cliquez "Confirm your form" pour activer.
 *   4. Toutes les reservations suivantes arrivent directement dans Gmail.
 *
 * CONFIGURATION :
 */
const AZURE_CONFIG = {
  EMAIL: "nui.mauri@gmail.com",        // ← Email de reception des reservations
  BAR_NAME:     "The Azure Rooftop Bar",
  OPEN_HOUR:    12,                    // Earliest opening (Sunday/Saturday)
  CLOSE_HOUR:   24,                    // Latest closing (Fri/Sat 1AM shown as 00:00)
  MAX_TABLES:   7,                     // Nombre de tables
  MAX_GUESTS:   10,                    // Max guests per booking
  ACCENT_COLOR: "#b8965a",            // Gold accent matching site
};
/* ─────────────────────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  /* ── CSS ───────────────────────────────────────────────────────────────── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');

    :root {
      --az-accent:    ${AZURE_CONFIG.ACCENT_COLOR};
      --az-accent-dk: #9a7a48;
      --az-bg:        #0f1218;
      --az-card:      #141a24;
      --az-border:    rgba(184,150,90,0.18);
      --az-text:      #e8edf5;
      --az-muted:     #7a8699;
      --az-input-bg:  #181f2c;
      --az-error:     #e05a6a;
      --az-success:   #b8965a;
    }

    #az-overlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(4,8,18,0.92);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    #az-overlay.az-open { display: flex; animation: az-fade-in .25s ease; }

    @keyframes az-fade-in  { from { opacity:0 } to { opacity:1 } }
    @keyframes az-slide-up { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:translateY(0) } }

    #az-modal {
      background: var(--az-card);
      border: 1px solid var(--az-border);
      border-radius: 16px;
      width: 100%;
      max-width: 520px;
      max-height: 92vh;
      overflow-y: auto;
      box-shadow: 0 30px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(184,150,90,.08);
      animation: az-slide-up .3s cubic-bezier(.16,1,.3,1);
      scrollbar-width: thin;
      scrollbar-color: var(--az-border) transparent;
    }
    #az-modal::-webkit-scrollbar { width:4px }
    #az-modal::-webkit-scrollbar-track { background:transparent }
    #az-modal::-webkit-scrollbar-thumb { background:var(--az-border); border-radius:4px }

    .az-header {
      padding: 32px 32px 0;
      position: relative;
    }
    .az-header-line {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 6px;
    }
    .az-header-line span {
      display: inline-block;
      width: 28px;
      height: 2px;
      background: var(--az-accent);
    }
    .az-eyebrow {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--az-accent);
    }
    .az-title {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      color: var(--az-text);
      line-height: 1.2;
      margin: 0 0 6px;
    }
    .az-subtitle {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      color: var(--az-muted);
      margin: 0;
    }

    .az-close {
      position: absolute;
      top: 28px;
      right: 28px;
      width: 34px;
      height: 34px;
      border: 1px solid var(--az-border);
      border-radius: 50%;
      background: transparent;
      color: var(--az-muted);
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all .2s;
      line-height: 1;
    }
    .az-close:hover { border-color: var(--az-accent); color: var(--az-accent); }

    .az-divider {
      height: 1px;
      background: var(--az-border);
      margin: 24px 32px;
    }

    .az-body { padding: 0 32px 32px; }

    .az-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .az-field {
      margin-bottom: 16px;
    }
    .az-field label {
      display: block;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--az-muted);
      margin-bottom: 7px;
    }
    .az-field input,
    .az-field select,
    .az-field textarea {
      width: 100%;
      background: var(--az-input-bg);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      color: var(--az-text);
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      padding: 13px 16px;
      outline: none;
      transition: border-color .2s, box-shadow .2s;
      box-sizing: border-box;
      appearance: none;
      -webkit-appearance: none;
    }
    .az-field select {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23b8965a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 38px;
      cursor: pointer;
    }
    .az-field select option { background: #131c2b; color: var(--az-text); }
    .az-field textarea { resize: vertical; min-height: 90px; }
    .az-field input:focus,
    .az-field select:focus,
    .az-field textarea:focus {
      border-color: var(--az-accent);
      box-shadow: 0 0 0 3px rgba(184,150,90,.12);
    }
    .az-field input::placeholder,
    .az-field textarea::placeholder { color: #3a4558; }
    .az-field.az-error input,
    .az-field.az-error select,
    .az-field.az-error textarea {
      border-color: var(--az-error);
    }
    .az-field .az-err-msg {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      color: var(--az-error);
      margin-top: 5px;
      display: none;
    }
    .az-field.az-error .az-err-msg { display: block; }

    .az-info-bar {
      background: rgba(184,150,90,.07);
      border: 1px solid rgba(184,150,90,.15);
      border-radius: 10px;
      padding: 12px 16px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .az-info-bar svg { flex-shrink:0; }
    .az-info-bar span {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: var(--az-muted);
      line-height: 1.5;
    }

    .az-btn {
      width: 100%;
      padding: 15px;
      background: var(--az-accent);
      border: none;
      border-radius: 10px;
      color: #05090f;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      cursor: pointer;
      transition: background .2s, transform .1s, box-shadow .2s;
      position: relative;
      overflow: hidden;
    }
    .az-btn:hover { background: var(--az-accent-dk); box-shadow: 0 8px 24px rgba(184,150,90,.25); }
    .az-btn:active { transform: scale(.98); }
    .az-btn:disabled { opacity:.6; cursor:not-allowed; }

    .az-btn .az-spinner {
      display: none;
      width: 18px;
      height: 18px;
      border: 2px solid rgba(0,0,0,.3);
      border-top-color: #05090f;
      border-radius: 50%;
      animation: az-spin .7s linear infinite;
      margin: 0 auto;
    }
    .az-btn.az-loading .az-btn-label { display:none; }
    .az-btn.az-loading .az-spinner { display:block; }
    @keyframes az-spin { to { transform:rotate(360deg) } }

    /* ── SUCCESS SCREEN ── */
    #az-success {
      display: none;
      padding: 48px 32px;
      text-align: center;
    }
    #az-success.az-open { display: block; animation: az-fade-in .4s ease; }
    .az-success-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(184,150,90,.1);
      border: 2px solid var(--az-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }
    .az-success-title {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      color: var(--az-text);
      margin: 0 0 10px;
    }
    .az-success-sub {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: var(--az-muted);
      line-height: 1.6;
      margin: 0 0 28px;
    }
    .az-success-detail {
      background: var(--az-input-bg);
      border: 1px solid var(--az-border);
      border-radius: 10px;
      padding: 16px 20px;
      text-align: left;
      margin-bottom: 28px;
    }
    .az-success-detail p {
      margin: 0 0 8px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      color: var(--az-muted);
      display: flex;
      gap: 8px;
    }
    .az-success-detail p:last-child { margin-bottom:0; }
    .az-success-detail p strong { color: var(--az-text); min-width: 80px; }
    .az-btn-outline {
      background: transparent;
      border: 1px solid var(--az-border);
      color: var(--az-muted);
    }
    .az-btn-outline:hover { border-color: var(--az-accent); color: var(--az-accent); background: rgba(184,150,90,.05); box-shadow:none; }

    /* ── ERROR SCREEN ── */
    #az-error-screen {
      display: none;
      padding: 40px 32px;
      text-align: center;
    }
    #az-error-screen.az-open { display:block; animation: az-fade-in .3s ease; }
    .az-error-icon {
      width: 64px; height: 64px;
      border-radius: 50%;
      background: rgba(224,90,106,.1);
      border: 2px solid var(--az-error);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
    }
    .az-error-title {
      font-family: 'Playfair Display', serif;
      font-size: 22px; color: var(--az-text); margin: 0 0 10px;
    }
    .az-error-sub {
      font-family: 'Inter', sans-serif;
      font-size: 13px; color: var(--az-muted); line-height:1.6; margin: 0 0 24px;
    }

    @media (max-width: 540px) {
      #az-overlay { padding: 0; align-items: flex-end; }
      #az-modal { max-height: 95vh; border-radius: 20px 20px 0 0; }
      .az-grid-2 { grid-template-columns: 1fr; }
      .az-header { padding: 28px 24px 0; }
      .az-body { padding: 0 24px 32px; }
      .az-divider { margin: 20px 24px; }
    }
  `;

  /* ── Inject CSS ─────────────────────────────────────────────────────────── */
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ── Build time slots ───────────────────────────────────────────────────── */
  function buildTimeOptions() {
    let opts = '<option value="">Select a time</option>';
    for (let h = AZURE_CONFIG.OPEN_HOUR; h < AZURE_CONFIG.CLOSE_HOUR; h++) {
      const hh = String(h).padStart(2, "0");
      opts += `<option value="${hh}:00">${hh}:00</option>`;
      opts += `<option value="${hh}:30">${hh}:30</option>`;
    }
    opts += `<option value="${String(AZURE_CONFIG.CLOSE_HOUR).padStart(2,"0")}:00">${String(AZURE_CONFIG.CLOSE_HOUR).padStart(2,"0")}:00</option>`;
    return opts;
  }

  /* ── Build guest options ────────────────────────────────────────────────── */
  function buildGuestOptions() {
    let opts = '<option value="">Number of guests</option>';
    for (let i = 1; i <= AZURE_CONFIG.MAX_GUESTS; i++) {
      opts += `<option value="${i}">${i} guest${i > 1 ? "s" : ""}</option>`;
    }
    return opts;
  }

  /* ── Min date = today ───────────────────────────────────────────────────── */
  function todayISO() {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }

  /* ── Inject HTML ────────────────────────────────────────────────────────── */
  const html = `
    <div id="az-overlay" role="dialog" aria-modal="true" aria-labelledby="az-modal-title">
      <div id="az-modal">

        <!-- FORM VIEW -->
        <div id="az-form-view">
          <div class="az-header">
            <div class="az-header-line">
              <span></span>
              <p class="az-eyebrow">Reservation</p>
            </div>
            <h2 class="az-title" id="az-modal-title">Book Your Table</h2>
            <p class="az-subtitle">Mon–Thu 4 PM – 11 PM · Fri 3 PM – 1 AM · Sat 12 PM – 1 AM · Sun 12 PM – 10 PM</p>
            <button class="az-close" id="az-close-btn" aria-label="Close">&#x2715;</button>
          </div>

          <div class="az-divider"></div>

          <div class="az-body">
            <div class="az-info-bar">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#b8965a" stroke-width="1.3"/>
                <path d="M8 7v4M8 5.5v.5" stroke="#b8965a" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>Tables for up to ${AZURE_CONFIG.MAX_GUESTS} guests. Subject to availability — email confirmation within 24h.</span>
            </div>

            <form id="az-form" novalidate>
              <div class="az-grid-2">
                <div class="az-field" id="f-name">
                  <label for="az-name">Full Name</label>
                  <input type="text" id="az-name" name="Name" placeholder="John Smith" autocomplete="name">
                  <span class="az-err-msg">Please enter your name</span>
                </div>
                <div class="az-field" id="f-phone">
                  <label for="az-phone">Phone</label>
                  <input type="tel" id="az-phone" name="Phone" placeholder="+61 4XX XXX XXX" autocomplete="tel">
                  <span class="az-err-msg">Invalid phone number</span>
                </div>
              </div>

              <div class="az-field" id="f-email">
                <label for="az-email">Email</label>
                <input type="email" id="az-email" name="Email" placeholder="john@example.com" autocomplete="email">
                <span class="az-err-msg">Invalid email address</span>
              </div>

              <div class="az-grid-2">
                <div class="az-field" id="f-date">
                  <label for="az-date">Date</label>
                  <input type="date" id="az-date" name="Date" min="${todayISO()}">
                  <span class="az-err-msg">Please select a date</span>
                </div>
                <div class="az-field" id="f-time">
                  <label for="az-time">Time</label>
                  <select id="az-time" name="Horaire">
                    ${buildTimeOptions()}
                  </select>
                  <span class="az-err-msg">Please select a time</span>
                </div>
              </div>

              <div class="az-field" id="f-guests">
                <label for="az-guests">Number of Guests</label>
                <select id="az-guests" name="Couverts">
                  ${buildGuestOptions()}
                </select>
                <span class="az-err-msg">Please select number of guests</span>
              </div>

              <div class="az-field">
                <label for="az-notes">Special Requests <span style="opacity:.5;font-size:10px">(optional)</span></label>
                <textarea id="az-notes" name="Special Requests" placeholder="Allergies, special occasions, seating preferences..."></textarea>
              </div>

              <button type="submit" class="az-btn" id="az-submit">
                <span class="az-btn-label">CONFIRM RESERVATION</span>
                <div class="az-spinner"></div>
              </button>
            </form>
          </div>
        </div>

        <!-- SUCCESS VIEW -->
        <div id="az-success">
          <div class="az-success-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 16l5 5 11-11" stroke="#b8965a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="az-success-title">Reservation Submitted!</h2>
          <p class="az-success-sub">Your booking request has been received.<br>We'll confirm via email within 24 hours.</p>
          <div class="az-success-detail" id="az-recap"></div>
          <button class="az-btn az-btn-outline" id="az-close-success">Close</button>
        </div>

        <!-- ERROR VIEW -->
        <div id="az-error-screen">
          <div class="az-error-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 9v6M14 19v.5" stroke="#e05a6a" stroke-width="2" stroke-linecap="round"/>
              <circle cx="14" cy="14" r="12" stroke="#e05a6a" stroke-width="1.5"/>
            </svg>
          </div>
          <h2 class="az-error-title">Something went wrong</h2>
          <p class="az-error-sub" id="az-err-detail">Unable to submit your request.<br>Please try again or contact us directly.</p>
          <button class="az-btn" id="az-retry-btn">Try Again</button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  /* ── DOM refs ───────────────────────────────────────────────────────────── */
  const overlay      = document.getElementById("az-overlay");
  const modal        = document.getElementById("az-modal");
  const form         = document.getElementById("az-form");
  const submitBtn    = document.getElementById("az-submit");
  const formView     = document.getElementById("az-form-view");
  const successView  = document.getElementById("az-success");
  const errorScreen  = document.getElementById("az-error-screen");
  const recap        = document.getElementById("az-recap");
  const errDetail    = document.getElementById("az-err-detail");

  /* ── Open / Close ───────────────────────────────────────────────────────── */
  function openModal() {
    overlay.classList.add("az-open");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    overlay.classList.remove("az-open");
    document.body.style.overflow = "";
  }
  function resetToForm() {
    successView.classList.remove("az-open");
    errorScreen.classList.remove("az-open");
    formView.style.display = "";
    submitBtn.classList.remove("az-loading");
    submitBtn.disabled = false;
  }

  /* ── Trigger on any .azure-book-btn or [data-azure-book] ─────────────────── */
  document.addEventListener("click", function (e) {
    const t = e.target.closest(".azure-book-btn, [data-azure-book], #az-close-btn, #az-close-success, #az-retry-btn");
    if (!t) return;
    if (t.id === "az-close-btn" || t.id === "az-close-success") { closeModal(); return; }
    if (t.id === "az-retry-btn") { resetToForm(); return; }
    openModal();
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ── Validation ─────────────────────────────────────────────────────────── */
  function setError(fieldId, show) {
    const el = document.getElementById(fieldId);
    if (el) el.classList.toggle("az-error", show);
  }
  function validateForm() {
    const name   = document.getElementById("az-name").value.trim();
    const email  = document.getElementById("az-email").value.trim();
    const phone  = document.getElementById("az-phone").value.trim();
    const date   = document.getElementById("az-date").value;
    const time   = document.getElementById("az-time").value;
    const guests = document.getElementById("az-guests").value;

    let ok = true;
    setError("f-name",   !name);           if (!name)   ok = false;
    setError("f-email",  !/\S+@\S+\.\S+/.test(email)); if (!/\S+@\S+\.\S+/.test(email)) ok = false;
    setError("f-phone",  phone.length < 6); if (phone.length < 6) ok = false;
    setError("f-date",   !date);            if (!date)   ok = false;
    setError("f-time",   !time);            if (!time)   ok = false;
    setError("f-guests", !guests);          if (!guests) ok = false;

    return ok;
  }

  /* ── Format date FR ─────────────────────────────────────────────────────── */
  function formatDate(iso) {
    const [y, m, d] = iso.split("-");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${parseInt(d)} ${months[parseInt(m)-1]} ${y}`;
  }

  /* ── Submit ─────────────────────────────────────────────────────────────── */
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    submitBtn.classList.add("az-loading");
    submitBtn.disabled = true;

    const name   = document.getElementById("az-name").value.trim();
    const email  = document.getElementById("az-email").value.trim();
    const phone  = document.getElementById("az-phone").value.trim();
    const date   = document.getElementById("az-date").value;
    const time   = document.getElementById("az-time").value;
    const guests = document.getElementById("az-guests").value;
    const notes  = document.getElementById("az-notes").value.trim();

    const data = {
      name:               name,
      email:              email,
      phone:              phone,
      date:               formatDate(date),
      time:               time,
      guests:             `${guests} guest${guests > 1 ? "s" : ""}`,
      message:            notes || "None",
      _subject:           `New Reservation — ${name} on ${formatDate(date)} at ${time}`,
      _replyto:           email,
    };

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${AZURE_CONFIG.EMAIL}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body:    JSON.stringify({
          ...data,
          _subject: `New Reservation — ${name} on ${formatDate(date)} at ${time}`,
          _autoresponse: `Thank you ${name} for your reservation at The Azure Rooftop Bar!\n\nHere's a summary of your booking:\n\n• Date: ${formatDate(date)}\n• Time: ${time}\n• Guests: ${guests}\n\nWe will confirm your reservation within 24 hours.\n\nIf you need to make any changes, please contact us at (02) 8XXX XXXX or info@theazurerooftop.com.au\n\nSee you soon!\nThe Azure Rooftop Bar\nLevel 10, 123 Harbour View St, Brookvale NSW 2100`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const json = await res.json();
      if (res.ok && json.success === "true") {
        showSuccess(name, formatDate(date), time, guests);
      } else {
        throw new Error("Erreur serveur");
      }
    } catch (err) {
      submitBtn.classList.remove("az-loading");
      submitBtn.disabled = false;
      formView.style.display = "none";
      errDetail.textContent = err.message.includes("fetch")
        ? "Please check your internet connection and try again."
        : "Unable to submit your request. Please try again or contact us directly.";
      errorScreen.classList.add("az-open");
    }
  });

  function showSuccess(name, date, time, guests) {
    formView.style.display = "none";
    recap.innerHTML = `
      <p><strong>Name</strong> ${name}</p>
      <p><strong>Date</strong> ${date}</p>
      <p><strong>Time</strong> ${time}</p>
      <p><strong>Guests</strong> ${guests} guest${guests > 1 ? "s" : ""}</p>
    `;
    successView.classList.add("az-open");
    modal.scrollTop = 0;
  }

  /* ── Clear errors on input ──────────────────────────────────────────────── */
  ["az-name","az-email","az-phone","az-date","az-time","az-guests"].forEach(id => {
    const map = { "az-name":"f-name","az-email":"f-email","az-phone":"f-phone","az-date":"f-date","az-time":"f-time","az-guests":"f-guests" };
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => setError(map[id], false));
    if (el) el.addEventListener("change", () => setError(map[id], false));
  });

  /* ── Public API ─────────────────────────────────────────────────────────── */
  window.AzureBooking = { open: openModal, close: closeModal };

})();
