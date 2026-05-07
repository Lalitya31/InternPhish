// Submit Report — auto-tag detection + success state
const SCAM_TAGS = {
    'registration fee': /registrati?on\s*fee|reg\.?\s*fee/i,
    'no interview': /no\s*interview|without\s*interview|skip\s*interview/i,
    'work from home': /work\s*from\s*home|wfh|remote/i,
    'certificate scam': /certificate\s*guaranteed|certificate\s*provided/i,
    'upfront payment': /upfront\s*payment|advance\s*payment|pay\s*first/i,
    'fake stipend': /huge\s*stipend|high\s*stipend|guaranteed\s*stipend|earn\s*₹/i,
    'urgent': /urgent|hurry|limited\s*time|expires|24\s*hour/i,
    'limited slots': /limited\s*slot|only\s*\d+\s*slot|few\s*slot/i,
    'training fee': /training\s*fee|training\s*cost|course\s*fee/i,
};

function detectTags(message) {
    const detected = [];
    for (const [tag, re] of Object.entries(SCAM_TAGS)) {
        if (re.test(message)) detected.push(tag);
    }
    return detected;
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
};

function renderAutoTags(tags) {
    const container = document.getElementById('auto-tags');
    if (!container) return;
    if (tags.length === 0) {
        container.innerHTML = '<span class="no-tags">No scam patterns detected yet</span>';
        return;
    }
    container.innerHTML = tags.map(tag => {
        const color = TAG_COLORS[tag] || '#aaa';
        return `<span class="report-tag" style="border-color:${color};color:${color}">${tag}</span>`;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const messageField = document.getElementById('scam-message');
    const tagsHiddenInput = document.getElementById('detected-tags');

    if (messageField) {
        messageField.addEventListener('input', () => {
            const tags = detectTags(messageField.value);
            renderAutoTags(tags);
            if (tagsHiddenInput) tagsHiddenInput.value = tags.join(',');
        });
    }

    const form = document.getElementById('submit-form');
    const formSection = document.getElementById('form-section');
    const successSection = document.getElementById('success-section');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-primary');
            if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }

            const data = {
                org: form.querySelector('#org-name')?.value?.trim(),
                message: form.querySelector('#scam-message')?.value?.trim(),
                fee: form.querySelector('#fee')?.value?.trim(),
                notes: form.querySelector('#notes')?.value?.trim(),
                tags: (tagsHiddenInput?.value || '').split(',').filter(Boolean),
            };

            // Simulate API call
            await new Promise(r => setTimeout(r, 900));

            // Show success state
            if (formSection) formSection.hidden = true;
            if (successSection) successSection.hidden = false;

            // Scroll to top of success
            if (successSection) successSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // "Submit another" button
    const anotherBtn = document.getElementById('submit-another');
    if (anotherBtn) {
        anotherBtn.addEventListener('click', () => {
            if (form) form.reset();
            renderAutoTags([]);
            if (formSection) formSection.hidden = false;
            if (successSection) successSection.hidden = true;
            const btn = form?.querySelector('.btn-primary');
            if (btn) { btn.disabled = false; btn.textContent = 'Submit Report'; }
        });
    }

    // initial render
    renderAutoTags([]);
});
