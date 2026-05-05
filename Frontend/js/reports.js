// Reports Hub — search/filter + mock data
const MOCK_REPORTS = [
    {
        id: 'r001', org: 'SkillBridge Internship Hub', fee: 1999,
        tags: ['registration fee', 'no interview', 'work from home'],
        count: 38, excerpt: 'Congratulations! You are selected. Pay ₹1999 to register your slot.'
    },
    {
        id: 'r002', org: 'NextGen Careers Pvt Ltd', fee: 2500,
        tags: ['certificate scam', 'upfront payment', 'fake stipend'],
        count: 27, excerpt: 'Earn ₹15,000/month stipend. Secure your spot with a non-refundable ₹2500 deposit.'
    },
    {
        id: 'r003', org: 'EduTech Pro Internships', fee: 999,
        tags: ['registration fee', 'urgent', 'limited slots'],
        count: 52, excerpt: 'Only 5 slots left! Pay ₹999 processing fee to confirm. Offer expires tonight!'
    },
    {
        id: 'r004', org: 'Digital Marketing India', fee: 1500,
        tags: ['no interview', 'fake certificate', 'registration fee'],
        count: 19, excerpt: 'No interview needed — your LinkedIn profile was enough. Pay security deposit ₹1500.'
    },
    {
        id: 'r005', org: 'StartUp Launchpad Co.', fee: 3000,
        tags: ['upfront payment', 'training fee', 'work from home'],
        count: 14, excerpt: 'Exclusive training kit + internship offer. One-time payment of ₹3000 required.'
    },
    {
        id: 'r006', org: 'CareerBoost Academy', fee: 750,
        tags: ['registration fee', 'certificate scam'],
        count: 61, excerpt: 'Selected for our premium internship batch. Enroll now for just ₹750.'
    },
    {
        id: 'r007', org: 'Internify Solutions', fee: 1200,
        tags: ['upfront payment', 'fake stipend', 'urgent'],
        count: 33, excerpt: 'We noticed your resume on Naukri. Secure this role today — just ₹1200 refundable deposit.'
    },
    {
        id: 'r008', org: 'TalentBridge Pvt Ltd', fee: 2200,
        tags: ['no interview', 'registration fee', 'limited slots'],
        count: 45, excerpt: 'Spot confirmed! Pay ₹2200 within 24 hours or your slot goes to the next candidate.'
    }
];

const TAG_COLORS = {
    'registration fee': '#ff4444',
    'no interview': '#ff8800',
    'work from home': '#8888ff',
    'certificate scam': '#cc44ff',
    'upfront payment': '#ff4477',
    'fake stipend': '#ff6600',
    'urgent': '#ff2222',
    'limited slots': '#ffaa00',
    'training fee': '#44aaff',
    'fake certificate': '#aa44ff',
};

function tagHtml(tag) {
    const color = TAG_COLORS[tag] || 'rgba(255,255,255,0.4)';
    return `<span class="report-tag" style="border-color:${color};color:${color}">${tag}</span>`;
}

function cardHtml(r) {
    const tags = r.tags.map(tagHtml).join('');
    return `
    <article class="report-card" data-id="${r.id}" tabindex="0" role="button" aria-label="View report for ${r.org}">
      <div class="rc-top">
        <h3 class="rc-org">${r.org}</h3>
        <span class="rc-fee">₹${r.fee.toLocaleString()}</span>
      </div>
      <p class="rc-excerpt">${r.excerpt}</p>
      <div class="rc-footer">
        <div class="rc-tags">${tags}</div>
        <span class="rc-count">${r.count} report${r.count !== 1 ? 's' : ''}</span>
      </div>
    </article>`;
}

function renderCards(list) {
    const grid = document.getElementById('reports-grid');
    const empty = document.getElementById('no-results');
    if (!grid) return;
    if (list.length === 0) {
        grid.innerHTML = '';
        if (empty) empty.hidden = false;
        return;
    }
    if (empty) empty.hidden = true;
    grid.innerHTML = list.map(cardHtml).join('');
    // click to detail
    grid.querySelectorAll('.report-card').forEach(card => {
        card.addEventListener('click', () => {
            window.location.href = `report-detail.html?id=${card.dataset.id}`;
        });
        card.addEventListener('keypress', e => {
            if (e.key === 'Enter') window.location.href = `report-detail.html?id=${card.dataset.id}`;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCards(MOCK_REPORTS);

    // animated total counter
    const countEl = document.getElementById('total-reports');
    if (countEl) {
        const target = MOCK_REPORTS.reduce((s, r) => s + r.count, 0);
        let cur = 0;
        const step = Math.ceil(target / 60);
        const t = setInterval(() => {
            cur = Math.min(cur + step, target);
            countEl.textContent = cur.toLocaleString();
            if (cur >= target) clearInterval(t);
        }, 20);
    }

    // search
    const input = document.getElementById('reports-search');
    if (input) {
        input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            if (!q) { renderCards(MOCK_REPORTS); return; }
            const filtered = MOCK_REPORTS.filter(r =>
                r.org.toLowerCase().includes(q) ||
                r.tags.some(t => t.includes(q)) ||
                r.excerpt.toLowerCase().includes(q)
            );
            renderCards(filtered);
        });
    }

    // tag filter buttons
    document.querySelectorAll('.tag-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tag = btn.dataset.tag;
            document.querySelectorAll('.tag-filter-btn').forEach(b => b.classList.remove('active'));
            if (btn.classList.contains('active-tag')) {
                btn.classList.remove('active-tag');
                renderCards(MOCK_REPORTS);
            } else {
                btn.classList.add('active-tag');
                renderCards(MOCK_REPORTS.filter(r => r.tags.includes(tag)));
            }
        });
    });
});
