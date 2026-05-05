// Accordion toggle for breakdown page
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.phrase-item');
    items.forEach(item => {
        const trigger = item.querySelector('.phrase-trigger');
        const body = item.querySelector('.phrase-body');
        if (!trigger || !body) return;
        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // close all
            items.forEach(i => {
                i.classList.remove('open');
                const b = i.querySelector('.phrase-body');
                if (b) b.style.maxHeight = '0';
            });
            if (!isOpen) {
                item.classList.add('open');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });
});
