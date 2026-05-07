// Report Detail — red-flag highlighting + similar report count
const MOCK_REPORTS = {
    r001: {
        id: 'r001', org: 'SkillBridge Internship Hub', fee: 1999,
        tags: ['registration fee', 'no interview', 'work from home'],
        count: 38,
        message: `Congratulations! You have been selected for our remote internship program at SkillBridge Internship Hub. Your profile caught our eye and no interview is required. This is a work from home opportunity with a huge stipend of ₹15,000 per month. To secure your spot and proceed further, please pay ₹1,999 as a registration fee within 24 hours. Hurry up! Only 3 slots left. Certificate guaranteed upon completion.`,
        date: '2025-04-12',
        similar: 12,
    },
    r002: {
        id: 'r002', org: 'NextGen Careers Pvt Ltd', fee: 2500,
        tags: ['certificate scam', 'upfront payment', 'fake stipend'],
        count: 27,
        message: `Dear Candidate, We are pleased to inform you that you have been shortlisted for our premium internship at NextGen Careers Pvt Ltd. Earn ₹15,000/month stipend from day one. A certificate is guaranteed at the end. Please make an upfront payment of ₹2,500 as a non-refundable security deposit to confirm your spot. Limited slots. This offer expires tonight.`,
        date: '2025-03-28',
        similar: 9,
    },
    r003: {
        id: 'r003', org: 'EduTech Pro Internships', fee: 999,
        tags: ['registration fee', 'urgent', 'limited slots'],
        count: 52,
        message: `URGENT: Only 5 slots left for our live internship batch! You have been pre-selected based on your Internshala profile. No interview required. Pay a ₹999 registration fee to unlock your access. This offer expires in 24 hours. Secure your slot now and get a certificate guaranteed. Hurry!`,
        date: '2025-02-15',
        similar: 21,
    },
    r004: {
        id: 'r004', org: 'Digital Marketing India', fee: 1500,
        tags: ['no interview', 'fake certificate', 'registration fee'],
        count: 19,
        message: `Hi! Your LinkedIn profile impressed our HR team. No interview needed — you are directly selected for our digital marketing internship. Work from home, earn a certificate, and build your portfolio. Pay a small registration fee of ₹1,500 as security deposit to confirm your slot. Only few slots left.`,
        date: '2025-01-20',
        similar: 7,
    },
    r005: {
        id: 'r005', org: 'StartUp Launchpad Co.', fee: 3000,
        tags: ['upfront payment', 'training fee', 'work from home'],
        count: 14,
        message: `We at StartUp Launchpad are offering an exclusive internship with training kit included. Work from home with flexible hours. The one-time training fee is ₹3,000 which covers all materials. Certificate guaranteed. Pay upfront to secure your spot. Huge stipend promised after 30-day probation.`,
        date: '2025-01-05',
        similar: 5,
    },
    r006: {
        id: 'r006', org: 'CareerBoost Academy', fee: 750,
        tags: ['registration fee', 'certificate scam'],
        count: 61,
        message: `Congratulations on being selected for CareerBoost Academy's internship batch! Your academic record has been verified. Enroll now for just ₹750 registration fee and receive a certificate guaranteed upon completion. Limited slots, hurry up and pay to secure your enrollment today!`,
        date: '2024-12-18',
        similar: 28,
    },
    r007: {
        id: 'r007', org: 'Internify Solutions', fee: 1200,
        tags: ['upfront payment', 'fake stipend', 'urgent'],
        count: 33,
        message: `We found your resume on Naukri.com and think you are a great fit. This is an urgent opening — no interview required. Pay a refundable ₹1,200 deposit to secure this role. Earn huge stipend of ₹12,000/month. Offer valid for only 24 hours. Hurry up!`,
        date: '2024-11-30',
        similar: 15,
    },
    r008: {
        id: 'r008', org: 'TalentBridge Pvt Ltd', fee: 2200,
        tags: ['no interview', 'registration fee', 'limited slots'],
        count: 45,
        message: `Your spot has been confirmed at TalentBridge Pvt Ltd! No interview necessary — you are selected. Pay ₹2,200 within 24 hours or your slot goes to the next candidate on the waitlist. Only 2 slots remaining. Certificate guaranteed. Work from home. Hurry up!`,
        date: '2024-11-10',
        similar: 18,
    },
};

const RED_FLAG_WORDS = [
    'registration fee', 'no interview', 'no interview required', 'without interview',
    'work from home', 'wfh', 'huge stipend', 'guaranteed stipend', 'earn ₹',
    'certificate guaranteed', 'certificate provided', 'upfront payment', 'advance payment',
    'non-refundable', 'hurry', 'hurry up', 'urgent', 'limited slots', 'only.*slot',
    'expires', '24 hours', 'secure your spot', 'secure your slot', 'few slots left',
    'training fee', 'directly selected', 'pre-selected', 'shortlisted',
    'pay.*deposit', 'deposit', 'refundable', 'immediately', 'today only',
];

function highlightRedFlags(text) {
    let safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    RED_FLAG_WORDS.forEach(word => {
        const re = new RegExp(`(${word})`, 'gi');
        safe = safe.replace(re, '<mark class="red-flag">$1</mark>');
    });
    return safe;
}

const TAG_COLORS = {
    'registration fee': '#d0443e',
    'no interview': '#c27a2b',
    'work from home': '#6f73c4',
    'certificate scam': '#8f5fbf',
    'upfront payment': '#c65b6a',
    'fake stipend': '#c4631a',
    'urgent': '#d0443e',
    'limited slots': '#c08900',
    'training fee': '#4b90c4',
    'fake certificate': '#8e5bbf',
};

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'r001';
    const report = MOCK_REPORTS[id] || MOCK_REPORTS['r001'];

    // Populate org name
    const orgEl = document.getElementById('detail-org');
    if (orgEl) orgEl.textContent = report.org;

    // Fee
    const feeEl = document.getElementById('detail-fee');
    if (feeEl) feeEl.textContent = `₹${report.fee.toLocaleString()}`;

    // Date
    const dateEl = document.getElementById('detail-date');
    if (dateEl) dateEl.textContent = new Date(report.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    // Tags
    const tagsEl = document.getElementById('detail-tags');
    if (tagsEl) {
        tagsEl.innerHTML = report.tags.map(tag => {
            const color = TAG_COLORS[tag] || '#aaa';
            return `<span class="report-tag" style="border-color:${color};color:${color}">${tag}</span>`;
        }).join('');
    }

    // Highlighted message
    const msgEl = document.getElementById('detail-message');
    if (msgEl) msgEl.innerHTML = highlightRedFlags(report.message);

    // Report count
    const countEl = document.getElementById('detail-count');
    if (countEl) {
        let cur = 0;
        const t = setInterval(() => {
            cur = Math.min(cur + 1, report.count);
            countEl.textContent = cur;
            if (cur >= report.count) clearInterval(t);
        }, 25);
    }

    // Similar count
    const simEl = document.getElementById('detail-similar');
    if (simEl) simEl.textContent = report.similar;

    // Page title
    document.title = `${report.org} — InternPhish`;
});
