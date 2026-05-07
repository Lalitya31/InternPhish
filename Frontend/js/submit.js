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

    // Offer letter file input handling
    const offerFileInput = document.getElementById('offer-file');
    const offerFileName = document.getElementById('offer-file-name');
    let selectedOfferFile = null;
    if (offerFileInput) {
        offerFileInput.addEventListener('change', (e) => {
            const f = offerFileInput.files && offerFileInput.files[0];
            const errorEl = document.getElementById('offer-file-error');
            const clearInvalid = () => {
                offerFileInput.value = '';
                selectedOfferFile = null;
                if (offerFileName) offerFileName.textContent = 'No file selected';
                const preview = document.getElementById('offer-preview');
                if (preview) { preview.src = ''; preview.hidden = true; }
            };
            if (f) {
                // basic validation: extension + mime + size
                const allowedExt = ['pdf','doc','docx','png','jpg','jpeg'];
                const allowedMime = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                const ext = (f.name.split('.').pop() || '').toLowerCase();
                const isImage = f.type.startsWith('image/');
                const extAllowed = allowedExt.includes(ext);
                const mimeAllowed = allowedMime.includes(f.type) || isImage;
                if (!extAllowed || !mimeAllowed) {
                    if (errorEl) errorEl.textContent = 'Invalid file type. Accepts PDF, DOC, DOCX, PNG, JPG.';
                    clearInvalid();
                    return;
                }
                if (f.size > 10 * 1024 * 1024) {
                    if (errorEl) errorEl.textContent = 'File too large. Maximum 10MB allowed.';
                    clearInvalid();
                    return;
                }
                // valid
                if (errorEl) errorEl.textContent = '';
                selectedOfferFile = f;
                const name = f.name.length > 40 ? f.name.slice(0, 36) + '…' : f.name;
                if (offerFileName) offerFileName.textContent = name;
                // show image preview for images
                const preview = document.getElementById('offer-preview');
                if (isImage && preview) {
                    const url = URL.createObjectURL(f);
                    preview.src = url;
                    preview.hidden = false;
                    // store url to revoke later
                    preview.dataset.objectUrl = url;
                } else if (preview) {
                    preview.src = '';
                    preview.hidden = true;
                }
            } else {
                if (errorEl) errorEl.textContent = '';
                clearInvalid();
            }
        });
    }

    // drag & drop support
    const dropzone = document.getElementById('offer-dropzone');
    const preview = document.getElementById('offer-preview');
    if (dropzone) {
        ['dragenter','dragover'].forEach(ev => {
            dropzone.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); dropzone.classList.add('dragover'); }, false);
        });
        ['dragleave','drop','dragend'].forEach(ev => {
            dropzone.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); dropzone.classList.remove('dragover'); }, false);
        });
        dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            if (!dt) return;
            const f = dt.files && dt.files[0];
            if (!f) return;
            // assign file to input and trigger change handler
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(f);
            offerFileInput.files = dataTransfer.files;
            const event = new Event('change', { bubbles: true });
            offerFileInput.dispatchEvent(event);
        });
        // keyboard support: Enter/Space opens file picker
        dropzone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                offerFileInput.click();
            }
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

            const org = form.querySelector('#org-name')?.value?.trim();
            const message = form.querySelector('#scam-message')?.value?.trim();
            const fee = form.querySelector('#fee')?.value?.trim();
            const notes = form.querySelector('#notes')?.value?.trim();
            const tags = (tagsHiddenInput?.value || '').split(',').filter(Boolean);

            // Build FormData for submission (ready for real API)
            const formData = new FormData();
            formData.append('org', org || '');
            formData.append('message', message || '');
            formData.append('fee', fee || '');
            formData.append('notes', notes || '');
            formData.append('tags', JSON.stringify(tags));
            if (selectedOfferFile) {
                // limit client-side size to 10MB
                if (selectedOfferFile.size > 10 * 1024 * 1024) {
                    alert('Selected file exceeds 10MB limit. Please choose a smaller file.');
                    if (btn) { btn.disabled = false; btn.textContent = 'Submit Report'; }
                    return;
                }
                formData.append('offer_file', selectedOfferFile, selectedOfferFile.name);
            }

            // Simulate API call (replace with fetch POST to your API endpoint)
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
            // reset file preview
            if (offerFileName) offerFileName.textContent = 'No file selected';
            selectedOfferFile = null;
            const preview = document.getElementById('offer-preview');
            if (preview) {
                if (preview.dataset.objectUrl) URL.revokeObjectURL(preview.dataset.objectUrl);
                preview.src = '';
                preview.hidden = true;
                delete preview.dataset.objectUrl;
            }
        });
    }

    // initial render
    renderAutoTags([]);
});
