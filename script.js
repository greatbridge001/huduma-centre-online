/* =====================================================
   GREATBRIDGE TECHNOLOGIES – STUDENT SERVICE PLATFORM
   script.js — Interactions, Forms, WhatsApp Integration
===================================================== */

const PRIMARY_WA   = '254769642043';
const SECONDARY_WA = '254711416574';

/* ─── LOADER ───────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initScrollReveal();
  }, 1800);
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
  { id:'helb',        label:'HELB First-Time Application',        desc:'First HELB loan application assistance',    fee:'Ksh 500',   icon:'fa-graduation-cap' },
  { id:'helb-appeal', label:'HELB Appeal',                        desc:'Appeal a rejected HELB application',        fee:'Custom',    icon:'fa-balance-scale' },
  { id:'kuccps',      label:'KUCCPS Course Application',          desc:'University placement course change',        fee:'Ksh 500',   icon:'fa-university' },
  { id:'transfer',    label:'Inter-Institution Transfer',         desc:'Transfer between universities',             fee:'Ksh 500',   icon:'fa-exchange-alt' },
  { id:'admission',   label:'Admission Letter Download',          desc:'Download your official admission letter',   fee:'Ksh 50',    icon:'fa-file-download' },
  { id:'kmtc',        label:'KMTC SEP Intake Application',        desc:'KMTC Self-Sponsored Programme',             fee:'Ksh 500',   icon:'fa-hospital' },
  { id:'kra-pin',     label:'KRA PIN Registration',               desc:'Register for a KRA Personal ID Number',    fee:'Ksh 150',   icon:'fa-id-card' },
  { id:'nil-returns', label:'Filing Nil Returns',                 desc:'Annual KRA nil returns filing',             fee:'Ksh 50',    icon:'fa-file-invoice' },
  { id:'single-parent',label:'Single Parent Certificate',         desc:'Certificate for HELB / bursary use',       fee:'Ksh 300/100',icon:'fa-users' },
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

/* ─── MODAL SYSTEM ───────────────────────────── */
function openService(id) {
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

/* ─── SERVICE CONFIGS ─────────────────────────── */
function getServiceConfig(id) {
  const configs = {
    /* ---------- HELB ---------- */
    helb: {
      render: () => {
        const counties = ['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Nyeri','Meru','Kakamega','Kericho','Machakos','Kitui','Garissa','Kisii','Migori','Bungoma','Trans Nzoia','Uasin Gishu','Nandi','Baringo','Laikipia','Samburu','Isiolo','Marsabit','Mandera','Wajir','Tana River','Lamu','Kilifi','Kwale','Taita Taveta','Makueni','Kajiado','Muranga','Kirinyaga','Nyamira','Siaya','Vihiga','Busia','Homa Bay','Rachuonyo','Turkana','West Pokot','Elgeyo Marakwet','Nyandarua','Embu','Tharaka Nithi','Imenti'];
        const marital  = ['Single','Married','Widowed','Divorced'];
        const religion = ['Christian','Muslim','Hindu','Other'];
        const empStatus= ['Employed','Self Employed','Unemployed','Student'];
        const yesno    = ['Yes','No'];
        const bankOrMpesa = ['Bank Account','M-Pesa'];
        return modalHeader('fa-graduation-cap','HELB First-Time Application','Ksh 500',
          'Fill in the details below. After submission, you will be redirected to WhatsApp where our team will guide you through the next steps. You only pay after your HELB application is successfully completed.') + `
          <form id="serviceForm" onsubmit="submitForm(event,'helb')">
          ${sectionTitle('Personal Details')}
          <div class="form-grid">
            ${field('fullName','Full Name')}
            ${field('idNumber','ID Number')}
            ${field('kraPin','KRA PIN')}
            ${field('phone','Phone Number','tel')}
            ${field('email','Email Address','email')}
            ${field('religion','Religion','text',true,religion)}
            ${field('maritalStatus','Marital Status','text',true,marital)}
            ${field('physicalChallenges','Physical Challenges','text',true,yesno)}
            ${field('employmentStatus','Employment Status','text',true,empStatus)}
            ${field('boxNumber','Box Number')}
            ${field('postalCode','Postal Code')}
            ${field('town','Town')}
            ${field('county','County','text',true,counties)}
            ${field('constituency','Constituency')}
            ${field('ward','Ward')}
            ${field('division','Division')}
            ${field('location','Location')}
            ${field('subLocation','Sub Location')}
            ${field('coursePlaced','Course Placed')}
          </div>
          ${sectionTitle('Place of Birth')}
          <div class="form-grid">
            ${field('pobCounty','County','text',true,counties)}
            ${field('pobConstituency','Constituency')}
            ${field('pobLocation','Location')}
            ${field('pobDivision','Division')}
            ${field('pobWard','Ward')}
            ${field('pobSubLocation','Sub Location')}
          </div>
          ${sectionTitle('Residential Details')}
          <div class="form-grid">
            ${field('nearestPrimarySchool','Nearest Primary School')}
            ${field('estateVillage','Estate / Village')}
            ${field('nearestRoad','Nearest Road Name')}
            ${field('resCity','Town / City')}
            ${field('resCounty','County','text',true,counties)}
            ${field('resConstituency','Constituency')}
            ${field('resDivision','Division')}
            ${field('resWard','Ward')}
            ${field('resLocation','Location')}
            ${field('resSubLocation','Sub Location')}
          </div>
          ${sectionTitle('Primary School')}
          <div class="form-grid">
            ${field('primarySchoolName','School Name')}
            ${field('primarySchoolType','School Type')}
            ${field('primaryExamYear','Exam Year')}
            ${field('primaryIndexNo','Index Number')}
            ${field('primaryCounty','County','text',true,counties)}
            ${field('primaryConstituency','Constituency')}
            ${field('primaryWard','Ward')}
            ${field('primaryDivision','Division')}
            ${field('primaryLocation','Location')}
            ${field('primarySubLocation','Sub Location')}
          </div>
          ${sectionTitle('Secondary School')}
          <div class="form-grid">
            ${field('secSchoolName','School Name')}
            ${field('secSchoolType','School Type')}
            ${field('secExamYear','Exam Year')}
            ${field('secIndexNo','Index Number')}
            ${field('secCounty','County','text',true,counties)}
            ${field('secConstituency','Constituency')}
            ${field('secWard','Ward')}
            ${field('secDivision','Division')}
            ${field('secLocation','Location')}
            ${field('secSubLocation','Sub Location')}
            ${field('sponsored','Sponsored?','text',true,yesno)}
          </div>
          ${sectionTitle('University Details')}
          <div class="form-grid">
            ${field('uniName','Institution Name')}
            ${field('uniCourse','Course')}
            ${field('admissionNo','Admission Number')}
            ${field('yearOfAdmission','Year of Admission')}
            ${field('currentYear','Current Year of Study')}
          </div>
          ${sectionTitle('Guarantor 1')}
          <div class="form-grid">
            ${field('g1FullName','Full Name')}
            ${field('g1IdNo','ID Number')}
            ${field('g1Occupation','Occupation')}
            ${field('g1EmpStatus','Employment Status','text',true,empStatus)}
            ${field('g1EmployerName','Employer Name')}
            ${field('g1EmployerPhone','Employer Phone','tel')}
            ${field('g1EmployerEmail','Employer Email','email')}
            ${field('g1StaffNo','Staff Number')}
            ${field('g1Phone','Phone Number','tel')}
          </div>
          ${sectionTitle('Guarantor 2')}
          <div class="form-grid">
            ${field('g2FullName','Full Name')}
            ${field('g2IdNo','ID Number')}
            ${field('g2Occupation','Occupation')}
            ${field('g2EmpStatus','Employment Status','text',true,empStatus)}
            ${field('g2EmployerName','Employer Name')}
            ${field('g2EmployerPhone','Employer Phone','tel')}
            ${field('g2EmployerEmail','Employer Email','email')}
            ${field('g2StaffNo','Staff Number')}
            ${field('g2Phone','Phone Number','tel')}
          </div>
          ${sectionTitle('Mode of Payment')}
          <div class="form-grid">
            ${field('paymentMode','Preferred Mode','text',true,bankOrMpesa)}
            ${field('bankAcctNo','Bank Account Number',false,false)}
            ${field('bankName','Bank Name','text',false)}
            ${field('bankBranch','Bank Branch','text',false)}
            ${field('mpesaNo','M-Pesa Phone Number','tel',false)}
          </div>
          <button type="submit" class="modal-submit"><i class="fab fa-whatsapp"></i>Send Application via WhatsApp</button>
          </form>
        </div>`;
      },
      waMessage: (data) => {
        return `*HELB FIRST-TIME APPLICATION*\n` +
          `*Greatbridge Technologies*\n\n` +
          `--- PERSONAL DETAILS ---\n` +
          `Name: ${data.fullName}\nID: ${data.idNumber}\nKRA PIN: ${data.kraPin}\n` +
          `Phone: ${data.phone}\nEmail: ${data.email}\n` +
          `Religion: ${data.religion}\nMarital Status: ${data.maritalStatus}\n` +
          `Physical Challenges: ${data.physicalChallenges}\nEmployment: ${data.employmentStatus}\n` +
          `Box No: ${data.boxNumber} | Postal: ${data.postalCode}\n` +
          `Town: ${data.town} | County: ${data.county}\n` +
          `Constituency: ${data.constituency} | Ward: ${data.ward}\n` +
          `Division: ${data.division} | Location: ${data.location}\n` +
          `Sub Location: ${data.subLocation}\nCourse Placed: ${data.coursePlaced}\n\n` +
          `--- PLACE OF BIRTH ---\n` +
          `County: ${data.pobCounty} | Const: ${data.pobConstituency}\n` +
          `Location: ${data.pobLocation} | Division: ${data.pobDivision}\n` +
          `Ward: ${data.pobWard} | Sub Location: ${data.pobSubLocation}\n\n` +
          `--- RESIDENTIAL ---\n` +
          `Nearest Primary: ${data.nearestPrimarySchool}\nEstate/Village: ${data.estateVillage}\n` +
          `Road: ${data.nearestRoad} | City: ${data.resCity} | County: ${data.resCounty}\n` +
          `Constituency: ${data.resConstituency} | Division: ${data.resDivision}\n` +
          `Ward: ${data.resWard} | Location: ${data.resLocation}\n` +
          `Sub Location: ${data.resSubLocation}\n\n` +
          `--- PRIMARY SCHOOL ---\n` +
          `School: ${data.primarySchoolName} | Type: ${data.primarySchoolType}\n` +
          `Year: ${data.primaryExamYear} | Index: ${data.primaryIndexNo}\n` +
          `County: ${data.primaryCounty} | Constituency: ${data.primaryConstituency}\n\n` +
          `--- SECONDARY SCHOOL ---\n` +
          `School: ${data.secSchoolName} | Type: ${data.secSchoolType}\n` +
          `Year: ${data.secExamYear} | Index: ${data.secIndexNo}\n` +
          `County: ${data.secCounty} | Constituency: ${data.secConstituency}\n` +
          `Sponsored: ${data.sponsored}\n\n` +
          `--- UNIVERSITY ---\n` +
          `Institution: ${data.uniName}\nCourse: ${data.uniCourse}\n` +
          `Adm No: ${data.admissionNo} | Year of Adm: ${data.yearOfAdmission}\n` +
          `Current Year: ${data.currentYear}\n\n` +
          `--- GUARANTOR 1 ---\n` +
          `Name: ${data.g1FullName} | ID: ${data.g1IdNo}\n` +
          `Occupation: ${data.g1Occupation} | Employment: ${data.g1EmpStatus}\n` +
          `Employer: ${data.g1EmployerName} | Phone: ${data.g1EmployerPhone}\n` +
          `Email: ${data.g1EmployerEmail} | Staff No: ${data.g1StaffNo}\n` +
          `Guarantor Phone: ${data.g1Phone}\n\n` +
          `--- GUARANTOR 2 ---\n` +
          `Name: ${data.g2FullName} | ID: ${data.g2IdNo}\n` +
          `Occupation: ${data.g2Occupation} | Employment: ${data.g2EmpStatus}\n` +
          `Employer: ${data.g2EmployerName} | Phone: ${data.g2EmployerPhone}\n` +
          `Email: ${data.g2EmployerEmail} | Staff No: ${data.g2StaffNo}\n` +
          `Guarantor Phone: ${data.g2Phone}\n\n` +
          `--- PAYMENT MODE ---\n` +
          `Mode: ${data.paymentMode}\nBank Acct: ${data.bankAcctNo}\n` +
          `Bank: ${data.bankName} | Branch: ${data.bankBranch}\n` +
          `M-Pesa: ${data.mpesaNo}\n\n` +
          `Service Fee: Ksh 500 (Pay After Service)\nSubmitted via Greatbridge Technologies Student Service Platform`;
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
        return modalHeader('fa-users','Single Parent Certificate','Stamped: Ksh 300 | Unstamped: Ksh 100',
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
            ${field('certType','Certificate Type','text',true,['Stamped (Ksh 300)','Unstamped (Ksh 100)'])}
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
    if (!input.value.trim()) {
      input.classList.add('error');
      if (errEl) errEl.classList.add('show');
      valid = false;
    } else {
      input.classList.remove('error');
      if (errEl) errEl.classList.remove('show');
    }
  });

  if (!valid) {
    form.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  /* Collect all form data */
  const data = {};
  form.querySelectorAll('input, select, textarea').forEach(el => {
    if (el.name) data[el.name] = el.value;
  });

  /* Build WhatsApp message */
  const config  = getServiceConfig(serviceId);
  const message = config.waMessage(data);
  const encoded = encodeURIComponent(message);
  const waURL   = `https://wa.me/${PRIMARY_WA}?text=${encoded}`;

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

/* ─── KEYBOARD ESCAPE CLOSE MODAL ─────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});