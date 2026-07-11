/* =====================================================
   GREATBRIDGE TECHNOLOGIES – STUDENT SERVICE PLATFORM
   script.js — Interactions, Forms, WhatsApp Integration
===================================================== */

const PRIMARY_WA   = '254769642043';
const SECONDARY_WA = '254711416574';

/* ─── WHATSAPP SOURCE TRACKING ───────────────────
   Share links like:
   yourdomain.com/?wa=1   -> routes back to PRIMARY_WA   (0769642043)
   yourdomain.com/?wa=2   -> routes back to SECONDARY_WA (0711416574)
   The chosen number is remembered (localStorage) so that even if the
   student browses several sections before submitting, their completed
   form still goes back to whichever WhatsApp chat they came from.
   If no ?wa= param was ever seen, PRIMARY_WA is used as default.
================================================== */
const WA_SOURCE_MAP = { '1': PRIMARY_WA, '2': SECONDARY_WA };
const WA_STORAGE_KEY = 'gb_active_wa_number';

(function captureWaSource() {
  const params = new URLSearchParams(window.location.search);
  const waParam = params.get('wa');
  if (waParam && WA_SOURCE_MAP[waParam]) {
    localStorage.setItem(WA_STORAGE_KEY, WA_SOURCE_MAP[waParam]);
  }
})();

function getActiveWaNumber() {
  return localStorage.getItem(WA_STORAGE_KEY) || PRIMARY_WA;
}

/* Keep the floating button + contact/footer WhatsApp links pointed at
   whichever number the student arrived through. */
function syncWaLinks() {
  const num = getActiveWaNumber();
  document.querySelectorAll('[data-wa-link]').forEach(a => {
    a.href = `https://wa.me/${num}`;
  });
}

/* ─── LOADER ───────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initScrollReveal();
  }, 1800);
  syncWaLinks();
});

/* ─── HAMBURGER / MOBILE NAV ───────────────────── */
const hamburger    = document.getElementById('hamburger');
const navLinks     = document.getElementById('navLinks');
const mobileOverlay = document.getElementById('mobileOverlay');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  mobileOverlay.classList.toggle('show', open);
});
mobileOverlay.addEventListener('click', closeMobileNav);
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

function closeMobileNav() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  mobileOverlay.classList.remove('show');
}

/* ─── SEARCH ─────────────────────────────────── */
const serviceIndex = [
  { id:'helb',        label:'HELB First-Time Application (Band 1)', desc:'First HELB loan application assistance — Band 1', fee:'Ksh 1000',   icon:'fa-graduation-cap' },
  { id:'helb-appeal', label:'HELB Appeal',                        desc:'Appeal a rejected HELB application',        fee:'Custom',    icon:'fa-balance-scale' },
  { id:'kuccps',      label:'KUCCPS Course Application',          desc:'University placement course change',        fee:'Ksh 500',   icon:'fa-university' },
  { id:'transfer',    label:'Inter-Institution Transfer',         desc:'Transfer between universities',             fee:'Ksh 500',   icon:'fa-exchange-alt' },
  { id:'admission',   label:'Admission Letter Download',          desc:'Download your official admission letter',   fee:'Ksh 50',    icon:'fa-file-download' },
  { id:'kmtc',        label:'KMTC SEP Intake Application',        desc:'KMTC Self-Sponsored Programme',             fee:'Ksh 500',   icon:'fa-hospital' },
  { id:'kra-pin',     label:'KRA PIN Registration',               desc:'Register for a KRA Personal ID Number',    fee:'Ksh 150',   icon:'fa-id-card' },
  { id:'nil-returns', label:'Filing Nil Returns',                 desc:'Annual KRA nil returns filing',             fee:'Ksh 50',    icon:'fa-file-invoice' },
  { id:'single-parent',label:'Single Parent Certificate',         desc:'Certificate for HELB / bursary use',       fee:'Ksh 500/100',icon:'fa-users' },
  { id:'sponsorship', label:'Sponsorship Document',               desc:'Sponsorship letter, stamped or unstamped',  fee:'Ksh 400/100',icon:'fa-file-signature' },
  { id:'courses',     label:'Computer & IT Online Courses',       desc:'Web Dev, Graphic Design, Cybersecurity',   fee:'Ksh 999',   icon:'fa-laptop-code' },
  { id:'free-guidance',label:'Free Career & Bursary Guidance',   desc:'Free advice on bursaries and scholarships', fee:'FREE',      icon:'fa-compass' },
];

const heroSearch    = document.getElementById('heroSearch');
const searchResults = document.getElementById('searchResults');

heroSearch.addEventListener('input', () => {
  const q = heroSearch.value.trim().toLowerCase();
  if (!q) { searchResults.classList.remove('show'); return; }
  const matches = serviceIndex.filter(s =>
    s.label.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
  );
  if (!matches.length) { searchResults.classList.remove('show'); return; }
  searchResults.innerHTML = matches.map(s => `
    <div class="search-result-item" onclick="openService('${s.id}')">
      <div class="sri-icon"><i class="fas ${s.icon}"></i></div>
      <div class="sri-text"><strong>${s.label}</strong><span>${s.fee} — ${s.desc}</span></div>
    </div>`).join('');
  searchResults.classList.add('show');
});

document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrap')) searchResults.classList.remove('show');
});

function doSearch() {
  heroSearch.dispatchEvent(new Event('input'));
  heroSearch.focus();
}

/* ─── FAQ ACCORDION ─────────────────────────── */
function toggleFaq(btn) {
  const item   = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-a');
  const isOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-q.open').forEach(q => {
    q.classList.remove('open');
    q.closest('.faq-item').querySelector('.faq-a').classList.remove('open');
  });
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

/* ─── SCROLL REVEAL ─────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.service-card, .course-card, .tool-card, .testimonial-card, .trust-card, .contact-card, .tbadge, .stat-item, .faq-item'
  );
  revealEls.forEach(el => el.classList.add('reveal'));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  revealEls.forEach(el => obs.observe(el));
}

/* ─── ANIMATED COUNTERS ─────────────────────── */
/* ─── NAVBAR SCROLL SHADOW ───────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.boxShadow =
    window.scrollY > 10 ? '0 4px 24px rgba(26,122,63,.15)' : '';
});

/* ─── NEXUS ACADEMY COURSES ──────────────────── */
const NEXUS_URL = 'https://nexus-academy-q6t2.onrender.com/';
const NEXUS_COURSES = ['web-development', 'graphic-design', 'cybersecurity'];

function openCourse(courseId) {
  window.open(NEXUS_URL, '_blank');
}

/* ─── MODAL SYSTEM ───────────────────────────── */
function openService(id) {
  // Redirect these three straight to Nexus Academy
  if (NEXUS_COURSES.includes(id)) {
    window.open(NEXUS_URL, '_blank');
    return;
  }
  const config = getServiceConfig(id);
  if (!config) return;
  document.getElementById('modalContent').innerHTML = buildModalHTML(config);
  document.getElementById('serviceModal').classList.add('show');
  document.body.style.overflow = 'hidden';
  searchResults.classList.remove('show');
}

function closeModal() {
  document.getElementById('serviceModal').classList.remove('show');
  document.body.style.overflow = '';
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('serviceModal')) closeModal();
}

/* ─── FORM BUILD HELPERS ─────────────────────── */
function field(id, label, type = 'text', required = true, options = null) {
  if (options) {
    return `<div class="form-field">
      <label for="${id}">${label}${required ? ' *' : ''}</label>
      <select id="${id}" name="${id}" ${required ? 'required' : ''}>
        <option value="">Select ${label}</option>
        ${options.map(o => `<option value="${o}">${o}</option>`).join('')}
      </select>
      <span class="field-error" id="${id}-err">This field is required</span>
    </div>`;
  }
  return `<div class="form-field">
    <label for="${id}">${label}${required ? ' *' : ''}</label>
    <input type="${type}" id="${id}" name="${id}" placeholder="${label}" ${required ? 'required' : ''} />
    <span class="field-error" id="${id}-err">This field is required</span>
  </div>`;
}

function sectionTitle(t) {
  return `<div class="form-section-title">${t}</div>`;
}

function modalHeader(icon, title, fee, notice) {
  return `
    <div class="modal-header">
      <div class="modal-icon"><i class="fas ${icon}"></i></div>
      <div>
        <h3>${title}</h3>
        <span class="fee-tag">Fee: ${fee} &nbsp;|&nbsp; Pay After Service</span>
      </div>
    </div>
    <div class="modal-body">
      <div class="form-notice">
        <i class="fas fa-info-circle"></i>
        ${notice}
      </div>`;
}

/* ─── HELB SHARED DATA ────────────────────────── */
const HELB_COUNTIES = ['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Nyeri','Meru','Kakamega','Kericho','Machakos','Kitui','Garissa','Kisii','Migori','Bungoma','Trans Nzoia','Uasin Gishu','Nandi','Baringo','Laikipia','Samburu','Isiolo','Marsabit','Mandera','Wajir','Tana River','Lamu','Kilifi','Kwale','Taita Taveta','Makueni','Kajiado','Muranga','Kirinyaga','Nyamira','Siaya','Vihiga','Busia','Homa Bay','Rachuonyo','Turkana','West Pokot','Elgeyo Marakwet','Nyandarua','Embu','Tharaka Nithi','Imenti'];
const HELB_MARITAL   = ['Single','Married','Widowed','Divorced'];
const HELB_RELIGION  = ['Christian','Muslim','Hindu','Other'];
const HELB_EMP_STATUS= ['Employed','Self Employed','Unemployed','Student'];
const HELB_YESNO     = ['Yes','No'];
const HELB_EMPLOYED_YESNO = ['Employed','Not Employed'];
const HELB_BANK_OR_MPESA  = ['Bank Account','M-Pesa'];
const HELB_JUNIOR_BANKS   = ['KCB Bank','Equity Bank','Co-operative Bank','Postbank'];

/* Skip-friendly line builder for WhatsApp messages: omits a line entirely
   if the field was left blank, instead of printing "undefined" or empty. */
function line(label, value) {
  return (value && String(value).trim()) ? `${label}: ${value}\n` : '';
}

/* ---- Sections shared by BOTH the "Has ID" and "No ID" HELB forms ---- */
function helbSharedSections() {
  return `
    ${sectionTitle('Place of Birth')}
    <div class="form-grid">
      ${field('pobCounty','County','text',false,HELB_COUNTIES)}
      ${field('pobConstituency','Constituency','text',false)}
      ${field('pobWard','Ward','text',false)}
      ${field('pobDivision','Division','text',false)}
      ${field('pobLocation','Location','text',false)}
      ${field('pobSubLocation','Sub Location','text',false)}
    </div>
    ${sectionTitle('Resident Details')}
    <div class="form-grid">
      ${field('nearestPrimarySchool','Nearest Primary School','text',false)}
      ${field('estateVillage','Estate / Village','text',false)}
      ${field('nearestRoad','Nearest Road Name','text',false)}
      ${field('resCity','Town / City','text',false)}
      ${field('resCounty','County','text',false,HELB_COUNTIES)}
      ${field('resConstituency','Constituency','text',false)}
      ${field('resWard','Ward','text',false)}
      ${field('resDivision','Division','text',false)}
      ${field('resLocation','Location','text',false)}
      ${field('resSubLocation','Sub Location','text',false)}
    </div>
    ${sectionTitle('Primary School')}
    <div class="form-grid">
      ${field('primarySchoolName','School Name','text',false)}
      ${field('primarySchoolType','School Type (Day/Boarding, Public/Private)','text',false)}
      ${field('primaryExamYear','KCPE Exam Year','text',false)}
      ${field('primaryIndexNo','KCPE Index Number','text',false)}
      ${field('primaryCounty','County','text',false,HELB_COUNTIES)}
    </div>
    ${sectionTitle('Secondary School')}
    <div class="form-grid">
      ${field('secExamYear','KCSE Exam Year','text',false)}
      ${field('secIndexNo','KCSE Index Number','text',false)}
      ${field('secCounty','County','text',false,HELB_COUNTIES)}
      ${field('sponsored','Sponsored?','text',false,HELB_YESNO)}
    </div>
    ${sectionTitle('University / Institution Details')}
    <div class="form-grid">
      ${field('uniName','Institution Name','text',false)}
      ${field('uniCourse','Course','text',false)}
      ${field('admissionNo','Registration / Admission Number','text',false)}
      ${field('yearOfAdmission','Year of Admission','text',false)}
      ${field('currentYear','Current Year of Study','text',false)}
    </div>
    ${sectionTitle('Guarantors')}
    <div class="form-notice guarantor-note">
      <i class="fas fa-info-circle"></i>
      A guarantor can be your parent, guardian, or someone close to you who is willing to vouch for you.
    </div>
    ${sectionTitle('Guarantor 1')}
    <div class="form-grid">
      ${field('g1FullName','Full Name','text',false)}
      ${field('g1IdNo','ID Number','text',false)}
      ${field('g1Phone','Phone Number','tel',false)}
      ${field('g1EmpStatus','Employed?','text',false,HELB_EMPLOYED_YESNO)}
    </div>
    ${sectionTitle('Guarantor 2')}
    <div class="form-grid">
      ${field('g2FullName','Full Name','text',false)}
      ${field('g2IdNo','ID Number','text',false)}
      ${field('g2Phone','Phone Number','tel',false)}
      ${field('g2EmpStatus','Employed?','text',false,HELB_EMPLOYED_YESNO)}
    </div>`;
}

/* ---- Personal Details: has-ID variant ---- */
function helbPersonalWithId() {
  return `
    ${sectionTitle('Personal Details')}
    <div class="form-grid">
      ${field('fullName','Full Name','text',false)}
      ${field('idNumber','ID Number','text',false)}
      ${field('kraPin','KRA PIN','text',false)}
      ${field('phone','Phone Number','tel',false)}
      ${field('email','Email Address','email',false)}
      ${field('religion','Religion','text',false,HELB_RELIGION)}
      ${field('maritalStatus','Marital Status','text',false,HELB_MARITAL)}
      ${field('physicalChallenges','Physical Challenges','text',false,HELB_YESNO)}
      ${field('employmentStatus','Employment Status','text',false,HELB_EMP_STATUS)}
      ${field('boxNumber','Box Number','text',false)}
      ${field('postalCode','Postal Code','text',false)}
      ${field('town','Town','text',false)}
      ${field('county','County','text',false,HELB_COUNTIES)}
      ${field('constituency','Constituency','text',false)}
      ${field('ward','Ward','text',false)}
      ${field('division','Division','text',false)}
      ${field('location','Location','text',false)}
      ${field('subLocation','Sub Location','text',false)}
      ${field('coursePlaced','Course Placed','text',false)}
    </div>`;
}

/* ---- Personal Details: no-ID / underage variant ---- */
function helbPersonalNoId() {
  return `
    ${sectionTitle('Personal Details')}
    <div class="form-grid">
      ${field('kcseIndex','KCSE Index Number','text',false)}
      ${field('fullName','Full Name','text',false)}
      ${field('phone','Phone Number','tel',false)}
      ${field('email','Email Address','email',false)}
      ${field('religion','Religion','text',false,HELB_RELIGION)}
      ${field('maritalStatus','Marital Status','text',false,HELB_MARITAL)}
      ${field('physicalChallenges','Physical Challenges','text',false,HELB_YESNO)}
      ${field('employmentStatus','Employment Status','text',false,HELB_EMP_STATUS)}
      ${field('postalAddress','Postal Address','text',false)}
      ${field('postalCode','Postal Code','text',false)}
      ${field('town','Town','text',false)}
      ${field('county','County','text',false,HELB_COUNTIES)}
      ${field('constituency','Constituency','text',false)}
      ${field('ward','Ward','text',false)}
      ${field('division','Division','text',false)}
      ${field('location','Location','text',false)}
      ${field('subLocation','Sub Location','text',false)}
      ${field('coursePlaced','Course Placed (Degree, Diploma, Certificate, etc.)','text',false)}
    </div>`;
}

/* ---- Mode of Payment: has-ID variant (dynamic Bank / M-Pesa) ---- */
function helbPaymentFieldsWithId(mode) {
  if (mode === 'M-Pesa') {
    return `<div class="form-grid">
      ${field('mpesaNo','M-Pesa Number (must be registered under your own ID)','tel',false)}
    </div>`;
  }
  if (mode === 'Bank Account') {
    return `<div class="form-grid">
      ${field('bankName','Bank Name','text',false)}
      ${field('bankAcctNo','Account Number','text',false)}
      ${field('bankBranch','Branch','text',false)}
    </div>`;
  }
  return `<div class="form-hint">Select a payment mode above to continue.</div>`;
}

function helbPaymentWithId(mode = '') {
  return `
    ${sectionTitle('Mode of Payment')}
    <div class="form-grid">
      <div class="form-field">
        <label for="paymentMode">Select Payment Mode</label>
        <select id="paymentMode" name="paymentMode" onchange="switchHelbPaymentMode(this.value)">
          <option value="">Select Payment Mode</option>
          <option value="Bank Account" ${mode === 'Bank Account' ? 'selected' : ''}>Bank Account</option>
          <option value="M-Pesa" ${mode === 'M-Pesa' ? 'selected' : ''}>M-Pesa</option>
        </select>
      </div>
    </div>
    <div id="helbPaymentFieldsWrap">${helbPaymentFieldsWithId(mode)}</div>`;
}

function switchHelbPaymentMode(mode) {
  const wrap = document.getElementById('helbPaymentFieldsWrap');
  if (wrap) wrap.innerHTML = helbPaymentFieldsWithId(mode);
}

/* ---- Mode of Payment: no-ID / underage variant (Junior Account only) ---- */
function helbPaymentNoId() {
  return `
    ${sectionTitle('Mode of Payment — Junior Bank Account')}
    <div class="form-notice doc-notice">
      <i class="fas fa-info-circle"></i>
      HELB requires a <strong>Junior Bank Account opened in the student's own name</strong> — with KCB, Equity, Co-operative Bank, or Postbank. Do not use a parent's account or a parent's ID to open it.
    </div>
    <div class="form-grid">
      ${field('bankName','Bank Name','text',false,HELB_JUNIOR_BANKS)}
      ${field('bankAcctNo','Account Number','text',false)}
      ${field('bankBranch','Branch','text',false)}
    </div>`;
}

/* ---- Assemble the full HELB form body for a given ID status ---- */
function renderHelbFormBody(status) {
  const personal = status === 'no' ? helbPersonalNoId() : helbPersonalWithId();
  const payment  = status === 'no' ? helbPaymentNoId()  : helbPaymentWithId();
  return `
    <form id="serviceForm" onsubmit="submitForm(event,'helb')">
    <input type="hidden" id="helbIdStatus" name="helbIdStatus" value="${status}" />
    <div class="form-hint">You can skip any field you're unsure about — fill in what you know.</div>
    ${personal}
    ${helbSharedSections()}
    ${payment}
    <button type="submit" class="modal-submit"><i class="fab fa-whatsapp"></i>Send Application via WhatsApp</button>
    </form>`;
}

function switchHelbForm(status) {
  const wrap = document.getElementById('helbFormWrap');
  if (wrap) wrap.innerHTML = renderHelbFormBody(status);
}

/* ---- WhatsApp messages for each HELB variant ---- */
function helbWaMessageWithId(data) {
  let paymentBlock = `--- MODE OF PAYMENT ---\n`;
  if (data.paymentMode === 'M-Pesa') {
    paymentBlock += `Mode: M-Pesa\n` + line('M-Pesa Number', data.mpesaNo);
  } else if (data.paymentMode === 'Bank Account') {
    paymentBlock += `Mode: Bank Account\n` +
      line('Bank Name', data.bankName) + line('Account Number', data.bankAcctNo) + line('Branch', data.bankBranch);
  } else {
    paymentBlock += `(Not specified)\n`;
  }

  return `*HELB FIRST-TIME APPLICATION*\n` +
    `*Greatbridge Technologies*\n\n` +
    `--- PERSONAL DETAILS (Has National ID) ---\n` +
    line('Name', data.fullName) + line('ID', data.idNumber) + line('KRA PIN', data.kraPin) +
    line('Phone', data.phone) + line('Email', data.email) +
    line('Religion', data.religion) + line('Marital Status', data.maritalStatus) +
    line('Physical Challenges', data.physicalChallenges) + line('Employment', data.employmentStatus) +
    line('Box No', data.boxNumber) + line('Postal Code', data.postalCode) + line('Town', data.town) +
    line('County', data.county) + line('Constituency', data.constituency) + line('Ward', data.ward) +
    line('Division', data.division) + line('Location', data.location) + line('Sub Location', data.subLocation) +
    line('Course Placed', data.coursePlaced) + `\n` +
    helbSharedWaBlock(data) +
    paymentBlock + `\n` +
    `Service Fee: Ksh 1000 (Pay After Service)\nSubmitted via Greatbridge Technologies Student Service Platform`;
}

function helbWaMessageNoId(data) {
  return `*HELB FIRST-TIME APPLICATION (NO NATIONAL ID / UNDER-AGE)*\n` +
    `*Greatbridge Technologies*\n\n` +
    `--- PERSONAL DETAILS ---\n` +
    line('KCSE Index', data.kcseIndex) + line('Name', data.fullName) + line('Phone', data.phone) + line('Email', data.email) +
    line('Religion', data.religion) + line('Marital Status', data.maritalStatus) +
    line('Physical Challenges', data.physicalChallenges) + line('Employment', data.employmentStatus) +
    line('Postal Address', data.postalAddress) + line('Postal Code', data.postalCode) + line('Town', data.town) +
    line('County', data.county) + line('Constituency', data.constituency) + line('Ward', data.ward) +
    line('Division', data.division) + line('Location', data.location) + line('Sub Location', data.subLocation) +
    line('Course Placed', data.coursePlaced) + `\n` +
    helbSharedWaBlock(data) +
    `--- MODE OF PAYMENT (Junior Bank Account) ---\n` +
    line('Bank', data.bankName) + line('Account Number', data.bankAcctNo) + line('Branch', data.bankBranch) +
    `(Junior account in student's own name — not a parent's account/ID)\n\n` +
    `Service Fee: Ksh 1000 (Pay After Service)\nSubmitted via Greatbridge Technologies Student Service Platform`;
}

/* Sections common to both WA messages */
function helbSharedWaBlock(data) {
  return `--- PLACE OF BIRTH ---\n` +
    line('County', data.pobCounty) + line('Constituency', data.pobConstituency) +
    line('Ward', data.pobWard) + line('Division', data.pobDivision) +
    line('Location', data.pobLocation) + line('Sub Location', data.pobSubLocation) + `\n` +
    `--- RESIDENT DETAILS ---\n` +
    line('Nearest Primary School', data.nearestPrimarySchool) + line('Estate/Village', data.estateVillage) +
    line('Nearest Road', data.nearestRoad) + line('Town/City', data.resCity) + line('County', data.resCounty) +
    line('Constituency', data.resConstituency) + line('Ward', data.resWard) + line('Division', data.resDivision) +
    line('Location', data.resLocation) + line('Sub Location', data.resSubLocation) + `\n` +
    `--- PRIMARY SCHOOL ---\n` +
    line('School Name', data.primarySchoolName) + line('School Type', data.primarySchoolType) +
    line('KCPE Year', data.primaryExamYear) + line('KCPE Index', data.primaryIndexNo) + line('County', data.primaryCounty) + `\n` +
    `--- SECONDARY SCHOOL ---\n` +
    line('KCSE Year', data.secExamYear) + line('KCSE Index', data.secIndexNo) +
    line('County', data.secCounty) + line('Sponsored', data.sponsored) + `\n` +
    `--- UNIVERSITY / INSTITUTION ---\n` +
    line('Institution', data.uniName) + line('Course', data.uniCourse) +
    line('Reg/Adm No', data.admissionNo) + line('Year of Admission', data.yearOfAdmission) +
    line('Current Year', data.currentYear) + `\n` +
    `--- GUARANTOR 1 ---\n` +
    line('Name', data.g1FullName) + line('ID', data.g1IdNo) + line('Phone', data.g1Phone) + line('Employed', data.g1EmpStatus) + `\n` +
    `--- GUARANTOR 2 ---\n` +
    line('Name', data.g2FullName) + line('ID', data.g2IdNo) + line('Phone', data.g2Phone) + line('Employed', data.g2EmpStatus) + `\n`;
}

/* ─── SERVICE CONFIGS ─────────────────────────── */
function getServiceConfig(id) {
  const configs = {
    /* ---------- HELB ---------- */
    helb: {
      render: () => {
        return modalHeader('fa-graduation-cap','HELB First-Time Application (Band 1)','Ksh 1000',
          'Fill in as much as you know below — you can skip anything you\'re unsure about. After submission, you will be redirected to WhatsApp where our team will guide you through the rest. You only pay after your HELB application is successfully completed.') + `
          <div class="id-status-toggle">
            <label class="id-status-label">Do you have a National ID?</label>
            <div class="toggle-options">
              <label class="toggle-option">
                <input type="radio" name="helbIdStatusToggle" value="yes" checked onchange="switchHelbForm('yes')" />
                <span>Yes, I have a National ID</span>
              </label>
              <label class="toggle-option">
                <input type="radio" name="helbIdStatusToggle" value="no" onchange="switchHelbForm('no')" />
                <span>No National ID / I am under 18</span>
              </label>
            </div>
          </div>
          <div id="helbFormWrap">${renderHelbFormBody('yes')}</div>
        </div>`;
      },
      waMessage: (data) => {
        return data.helbIdStatus === 'no' ? helbWaMessageNoId(data) : helbWaMessageWithId(data);
      }
    },

    /* ---------- HELB APPEAL ---------- */
    'helb-appeal': {
      render: () => {
        return modalHeader('fa-balance-scale','HELB Appeal','Custom Fee',
          'Provide the details below to begin your HELB appeal process. Our team will draft a professional appeal on your behalf.') + `
          <form id="serviceForm" onsubmit="submitForm(event,'helb-appeal')">
          <div class="form-grid">
            ${field('fullName','Full Name')}
            ${field('idNumber','National ID Number')}
            ${field('phone','Phone Number','tel')}
            ${field('admissionNo','Admission Number')}
            ${field('institution','Institution')}
          </div>
          <div class="form-grid single">
            ${field('appealReason','Reason for Appeal')}
          </div>
          <div class="form-field" style="margin-top:12px">
            <label for="appealExplanation">Supporting Explanation *</label>
            <textarea id="appealExplanation" name="appealExplanation" rows="5" placeholder="Provide a detailed explanation for your appeal..." required></textarea>
            <span class="field-error" id="appealExplanation-err">This field is required</span>
          </div>
          <button type="submit" class="modal-submit"><i class="fab fa-whatsapp"></i>Send Appeal via WhatsApp</button>
          </form></div>`;
      },
      waMessage: (data) => {
        return `*HELB APPEAL*\n*Greatbridge Technologies*\n\n` +
          `Name: ${data.fullName}\nID: ${data.idNumber}\nPhone: ${data.phone}\n` +
          `Admission No: ${data.admissionNo}\nInstitution: ${data.institution}\n` +
          `Reason: ${data.appealReason}\nExplanation: ${data.appealExplanation}\n\n` +
          `Pay After Service | Greatbridge Technologies`;
      }
    },

    /* ---------- KUCCPS ---------- */
    kuccps: {
      render: () => {
        return modalHeader('fa-university','KUCCPS Course Application','Ksh 500 (+ Ksh 1,550 eCitizen paid by student)',
          'Our service fee is Ksh 500, paid after completion. The Ksh 1,550 KUCCPS government fee is paid directly by you via eCitizen.') + `
          <form id="serviceForm" onsubmit="submitForm(event,'kuccps')">
          <div class="form-grid">
            ${field('kcseIndex','KCSE Index Number')}
            ${field('kcpeIndex','KCPE Index Number')}
            ${field('birthCertEntry','Birth Certificate Entry Number')}
            ${field('kcseYear','KCSE Year')}
            ${field('phone','Phone Number','tel')}
            ${field('fullName','Full Name')}
          </div>
          ${sectionTitle('Course Preferences (in order of priority)')}
          <div class="form-grid">
            ${field('course1','1st Preferred Course')}
            ${field('course2','2nd Preferred Course')}
            ${field('course3','3rd Preferred Course')}
            ${field('institution1','1st Preferred Institution')}
            ${field('institution2','2nd Preferred Institution')}
            ${field('institution3','3rd Preferred Institution')}
          </div>
          <button type="submit" class="modal-submit"><i class="fab fa-whatsapp"></i>Send Application via WhatsApp</button>
          </form></div>`;
      },
      waMessage: (data) => {
        return `*KUCCPS COURSE APPLICATION*\n*Greatbridge Technologies*\n\n` +
          `Name: ${data.fullName}\nPhone: ${data.phone}\n` +
          `KCSE Index: ${data.kcseIndex}\nKCPE Index: ${data.kcpeIndex}\n` +
          `Birth Cert Entry: ${data.birthCertEntry}\nKCSE Year: ${data.kcseYear}\n\n` +
          `--- PREFERENCES ---\n` +
          `Course 1: ${data.course1} | Institution: ${data.institution1}\n` +
          `Course 2: ${data.course2} | Institution: ${data.institution2}\n` +
          `Course 3: ${data.course3} | Institution: ${data.institution3}\n\n` +
          `Service Fee: Ksh 500 (Pay After Service)\nNote: Ksh 1,550 eCitizen fee paid separately by student`;
      }
    },

    /* ---------- INTER-INSTITUTION TRANSFER ---------- */
    transfer: {
      render: () => {
        return modalHeader('fa-exchange-alt','Inter-Institution Transfer','Ksh 500 (+ Ksh 1,000 KUCCPS fee paid by student)',
          'Applicant must meet minimum requirements and cluster points. The Ksh 1,000 KUCCPS government fee is paid directly to KUCCPS. Our service fee: Ksh 500.') + `
          <form id="serviceForm" onsubmit="submitForm(event,'transfer')">
          <div class="form-grid">
            ${field('fullName','Full Name')}
            ${field('phone','Phone Number','tel')}
            ${field('kcseIndex','KCSE Index Number')}
            ${field('kcpeIndex','KCPE Index Number / Birth Entry No.')}
            ${field('course','Desired Course')}
            ${field('institution','Desired Institution')}
          </div>
          <button type="submit" class="modal-submit"><i class="fab fa-whatsapp"></i>Send Transfer Request via WhatsApp</button>
          </form></div>`;
      },
      waMessage: (data) => {
        return `*INTER-INSTITUTION TRANSFER*\n*Greatbridge Technologies*\n\n` +
          `Name: ${data.fullName}\nPhone: ${data.phone}\n` +
          `KCSE Index: ${data.kcseIndex}\nKCPE/Birth Entry: ${data.kcpeIndex}\n` +
          `Desired Course: ${data.course}\nDesired Institution: ${data.institution}\n\n` +
          `Service Fee: Ksh 500 (Pay After Service)\nNote: Ksh 1,000 KUCCPS fee paid separately`;
      }
    },

    /* ---------- ADMISSION LETTER ---------- */
    admission: {
      render: () => {
        return modalHeader('fa-file-download','Admission Letter Download','Ksh 50',
          'We will download your official admission letter from your institution portal and share it with you via WhatsApp.') + `
          <form id="serviceForm" onsubmit="submitForm(event,'admission')">
          <div class="form-grid">
            ${field('fullName','Full Name')}
            ${field('kcseIndex','KCSE Index Number')}
            ${field('institution','Institution')}
            ${field('phone','Phone Number','tel')}
          </div>
          <button type="submit" class="modal-submit"><i class="fab fa-whatsapp"></i>Send Request via WhatsApp</button>
          </form></div>`;
      },
      waMessage: (data) => {
        return `*ADMISSION LETTER DOWNLOAD*\n*Greatbridge Technologies*\n\n` +
          `Name: ${data.fullName}\nKCSE Index: ${data.kcseIndex}\n` +
          `Institution: ${data.institution}\nPhone: ${data.phone}\n\n` +
          `Fee: Ksh 50 (Pay After Service)`;
      }
    },

    /* ---------- KMTC ---------- */
    kmtc: {
      render: () => {
        return modalHeader('fa-hospital','KMTC SEP Intake Application','Ksh 500',
          'We assist with the KMTC Self-Sponsored Programme intake application. Submit your details and we will guide you through the process.') + `
          <form id="serviceForm" onsubmit="submitForm(event,'kmtc')">
          <div class="form-grid">
            ${field('fullName','Full Name')}
            ${field('phone','Phone Number','tel')}
            ${field('idNumber','National ID / Birth Certificate No.')}
            ${field('kcseIndex','KCSE Index Number')}
            ${field('kcseYear','KCSE Year')}
            ${field('preferredCourse','Preferred KMTC Course')}
            ${field('preferredCampus','Preferred KMTC Campus')}
          </div>
          <button type="submit" class="modal-submit"><i class="fab fa-whatsapp"></i>Send Application via WhatsApp</button>
          </form></div>`;
      },
      waMessage: (data) => {
        return `*KMTC SEP INTAKE APPLICATION*\n*Greatbridge Technologies*\n\n` +
          `Name: ${data.fullName}\nPhone: ${data.phone}\nID/BC: ${data.idNumber}\n` +
          `KCSE Index: ${data.kcseIndex}\nKCSE Year: ${data.kcseYear}\n` +
          `Course: ${data.preferredCourse}\nCampus: ${data.preferredCampus}\n\n` +
          `Service Fee: Ksh 500 (Pay After Service)`;
      }
    },

    /* ---------- KRA PIN ---------- */
    'kra-pin': {
      render: () => {
        return modalHeader('fa-id-card','KRA PIN Registration','Ksh 150',
          'We register your KRA PIN on iTax. You only pay Ksh 150 after your PIN is successfully generated and shared with you.') + `
          <form id="serviceForm" onsubmit="submitForm(event,'kra-pin')">
          <div class="form-grid">
            ${field('fullName','Full Name')}
            ${field('idNumber','ID Number')}
            ${field('email','Email Address','email')}
            ${field('phone','Phone Number','tel')}
            ${field('town','Town')}
            ${field('county','County')}
            ${field('district','District')}
            ${field('postalAddress','Postal Address')}
          </div>
          <button type="submit" class="modal-submit"><i class="fab fa-whatsapp"></i>Send Request via WhatsApp</button>
          </form></div>`;
      },
      waMessage: (data) => {
        return `*KRA PIN REGISTRATION*\n*Greatbridge Technologies*\n\n` +
          `Name: ${data.fullName}\nID: ${data.idNumber}\nEmail: ${data.email}\n` +
          `Phone: ${data.phone}\nTown: ${data.town}\nCounty: ${data.county}\n` +
          `District: ${data.district}\nPostal: ${data.postalAddress}\n\n` +
          `Fee: Ksh 150 (Pay After Service)`;
      }
    },

    /* ---------- NIL RETURNS ---------- */
    'nil-returns': {
      render: () => {
        return modalHeader('fa-file-invoice','Filing Nil Returns','Ksh 50',
          'We file your KRA Nil Returns to keep you compliant. You need either your ID Number or KRA PIN.') + `
          <form id="serviceForm" onsubmit="submitForm(event,'nil-returns')">
          <div class="form-grid">
            ${field('fullName','Full Name')}
            ${field('idOrPin','ID Number or KRA PIN')}
            ${field('phone','Phone Number','tel')}
          </div>
          <button type="submit" class="modal-submit"><i class="fab fa-whatsapp"></i>Send Request via WhatsApp</button>
          </form></div>`;
      },
      waMessage: (data) => {
        return `*KRA NIL RETURNS FILING*\n*Greatbridge Technologies*\n\n` +
          `Name: ${data.fullName}\nID/PIN: ${data.idOrPin}\nPhone: ${data.phone}\n\n` +
          `Fee: Ksh 50 (Pay After Service)`;
      }
    },

    /* ---------- SINGLE PARENT CERTIFICATE ---------- */
    'single-parent': {
      render: () => {
        return modalHeader('fa-users','Single Parent Certificate','Stamped: Ksh 500 | Unstamped: Ksh 100',
          'Required for HELB bursary applications. Choose whether you need the stamped or unstamped version.') + `
          <form id="serviceForm" onsubmit="submitForm(event,'single-parent')">
          ${sectionTitle('Student Details')}
          <div class="form-grid">
            ${field('fullName','Full Name')}
            ${field('idNumber','National ID Number')}
            ${field('kcseIndex','KCSE Index Number')}
            ${field('phone','Telephone Number','tel')}
            ${field('institution','University / College')}
            ${field('admissionNo','Admission Number')}
            ${field('email','Email Address','email')}
          </div>
          ${sectionTitle('Parent / Guardian Details')}
          <div class="form-grid">
            ${field('parentName','Full Name')}
            ${field('parentId','National ID Number')}
            ${field('parentPhone','Telephone Number','tel')}
            ${field('relationship','Relationship to Student','text',true,['Mother','Father','Guardian'])}
            ${field('parentMaritalStatus','Marital Status','text',true,['Single','Widowed','Divorced','Separated'])}
            ${field('certType','Certificate Type','text',true,['Stamped (Ksh 500)','Unstamped (Ksh 100)'])}
          </div>
          <button type="submit" class="modal-submit"><i class="fab fa-whatsapp"></i>Send Request via WhatsApp</button>
          </form></div>`;
      },
      waMessage: (data) => {
        return `*SINGLE PARENT CERTIFICATE*\n*Greatbridge Technologies*\n\n` +
          `--- STUDENT ---\n` +
          `Name: ${data.fullName}\nID: ${data.idNumber}\nKCSE Index: ${data.kcseIndex}\n` +
          `Phone: ${data.phone}\nInstitution: ${data.institution}\nAdm No: ${data.admissionNo}\n` +
          `Email: ${data.email}\n\n--- PARENT ---\n` +
          `Name: ${data.parentName}\nID: ${data.parentId}\nPhone: ${data.parentPhone}\n` +
          `Relationship: ${data.relationship}\nMarital Status: ${data.parentMaritalStatus}\n\n` +
          `Certificate Type: ${data.certType}\nPay After Service`;
      }
    },

    /* ---------- SPONSORSHIP ---------- */
    sponsorship: {
      render: () => {
        return modalHeader('fa-file-signature','Sponsorship Document','Stamped: Ksh 400 | Unstamped: Ksh 100',
          'A professionally drafted sponsorship letter for bursary, scholarship, or institutional use.') + `
          <form id="serviceForm" onsubmit="submitForm(event,'sponsorship')">
          <div class="form-grid">
            ${field('studentName','Student Name')}
            ${field('institution','Institution')}
            ${field('admissionNo','Admission Number')}
            ${field('sponsorName','Sponsor Name')}
            ${field('sponsorContact','Sponsor Contact','tel')}
            ${field('purpose','Purpose of Document')}
            ${field('docType','Document Type','text',true,['Stamped (Ksh 400)','Unstamped (Ksh 100)'])}
            ${field('phone','Your Phone Number','tel')}
          </div>
          <button type="submit" class="modal-submit"><i class="fab fa-whatsapp"></i>Send Request via WhatsApp</button>
          </form></div>`;
      },
      waMessage: (data) => {
        return `*SPONSORSHIP DOCUMENT*\n*Greatbridge Technologies*\n\n` +
          `Student: ${data.studentName}\nInstitution: ${data.institution}\n` +
          `Adm No: ${data.admissionNo}\nSponsor: ${data.sponsorName}\n` +
          `Sponsor Contact: ${data.sponsorContact}\nPurpose: ${data.purpose}\n` +
          `Document Type: ${data.docType}\nYour Phone: ${data.phone}\n\nPay After Service`;
      }
    },

    /* ---------- COURSES ---------- */
    courses: {
      render: () => {
        return modalHeader('fa-laptop-code','Computer & IT Online Courses','Ksh 999 per course',
          'Enrol in any of our certificate courses. Certificate issued after successful completion. Payment is made after enrolment confirmation.') + `
          <form id="serviceForm" onsubmit="submitForm(event,'courses')">
          <div class="form-grid">
            ${field('fullName','Full Name')}
            ${field('phone','Phone Number','tel')}
            ${field('email','Email Address','email')}
            ${field('courseInterested','Course Interested In','text',true,['Computer Packages','Web Development','Graphic Design','Cybersecurity'])}
          </div>
          <button type="submit" class="modal-submit"><i class="fab fa-whatsapp"></i>Enrol via WhatsApp</button>
          </form></div>`;
      },
      waMessage: (data) => {
        return `*ONLINE COURSE ENROLMENT*\n*Greatbridge Technologies*\n\n` +
          `Name: ${data.fullName}\nPhone: ${data.phone}\nEmail: ${data.email}\n` +
          `Course: ${data.courseInterested}\n\nFee: Ksh 999 (Pay After Service)`;
      }
    },

    /* ---------- FREE GUIDANCE ---------- */
    'free-guidance': {
      render: () => {
        return modalHeader('fa-compass','Free Career & Bursary Guidance','FREE',
          'Get free guidance on bursaries, scholarships, government grants and career pathways. No payment required.') + `
          <form id="serviceForm" onsubmit="submitForm(event,'free-guidance')">
          <div class="form-grid">
            ${field('fullName','Full Name')}
            ${field('phone','Phone Number','tel')}
            ${field('county','County')}
            ${field('institution','Institution (current or expected)')}
          </div>
          <button type="submit" class="modal-submit"><i class="fab fa-whatsapp"></i>Request Guidance via WhatsApp</button>
          </form></div>`;
      },
      waMessage: (data) => {
        return `*FREE CAREER & BURSARY GUIDANCE REQUEST*\n*Greatbridge Technologies*\n\n` +
          `Name: ${data.fullName}\nPhone: ${data.phone}\n` +
          `County: ${data.county}\nInstitution: ${data.institution}\n\nThis is a FREE service.`;
      }
    },
  };

  return configs[id] || null;
}

/* ─── BUILD MODAL HTML ─────────────────────── */
function buildModalHTML(config) {
  return config.render();
}

/* ─── FORM SUBMISSION ────────────────────────── */
function submitForm(e, serviceId) {
  e.preventDefault();
  const form    = document.getElementById('serviceForm');
  const inputs  = form.querySelectorAll('input[required], select[required], textarea[required]');
  let   valid   = true;

  inputs.forEach(input => {
    const errEl = document.getElementById(input.id + '-err');
    const filled = input.type === 'checkbox' ? input.checked : !!input.value.trim();
    if (!filled) {
      input.classList.add('error');
      if (errEl) errEl.classList.add('show');
      valid = false;
    } else {
      input.classList.remove('error');
      if (errEl) errEl.classList.remove('show');
    }
  });

  if (!valid) {
    (form.querySelector('.error') || form.querySelector('input[type="checkbox"].error'))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  /* Collect all form data */
  const data = {};
  form.querySelectorAll('input, select, textarea').forEach(el => {
    if (!el.name) return;
    data[el.name] = el.type === 'checkbox' ? el.checked : el.value;
  });

  /* Build WhatsApp message */
  const config  = getServiceConfig(serviceId);
  const message = config.waMessage(data);
  const encoded = encodeURIComponent(message);
  const waURL   = `https://wa.me/${getActiveWaNumber()}?text=${encoded}`;

  closeModal();
  window.open(waURL, '_blank');
}

/* ─── INPUT VALIDATION LIVE ─────────────────── */
document.addEventListener('input', e => {
  if (e.target.matches('input[required], select[required], textarea[required]')) {
    const errEl = document.getElementById(e.target.id + '-err');
    if (e.target.value.trim()) {
      e.target.classList.remove('error');
      if (errEl) errEl.classList.remove('show');
    }
  }
});
document.addEventListener('change', e => {
  if (e.target.matches('input[type="checkbox"][required]')) {
    const errEl = document.getElementById(e.target.id + '-err');
    if (e.target.checked) {
      e.target.classList.remove('error');
      if (errEl) errEl.classList.remove('show');
    }
  }
});

/* ─── KEYBOARD ESCAPE CLOSE MODAL ─────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});