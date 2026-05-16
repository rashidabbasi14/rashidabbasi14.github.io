function init() {
    // Populate contact links first (contact-data.js defines `contactData`)
    if (typeof contactData !== 'undefined') {
        populateContact(contactData);
    }

    renderEmployment(typeof employmentData !== 'undefined' ? employmentData : []);
    renderCarousel('projectContent', typeof projectsData !== 'undefined' ? projectsData : [], 'No project entries found.', 'projectCarousel');
    renderCarousel('certificationContent', typeof certificationsData !== 'undefined' ? certificationsData : [], 'No certification entries found.', 'certCarousel');
}

function setupContactForm(email) {
    try {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.action = `https://formsubmit.co/${email}`;
        form.method = 'POST';
        form.setAttribute('data-email', email);

        // Add hidden field for redirect
        const redirectInput = document.createElement('input');
        redirectInput.type = 'hidden';
        redirectInput.name = '_next';
        redirectInput.value = window.location.href;
        form.appendChild(redirectInput);

        // Add honeypot for spam protection
        const honeypot = document.createElement('input');
        honeypot.type = 'hidden';
        honeypot.name = '_honey';
        honeypot.value = '';
        form.appendChild(honeypot);

        form.addEventListener('submit', (e) => {
            const messageDiv = document.getElementById('formMessage');
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';

            messageDiv.className = 'alert alert-info';
            messageDiv.textContent = 'Sending your message...';
            messageDiv.style.display = 'block';

            // Form will submit normally after a brief delay
            setTimeout(() => {
                // This allows the user to see the sending message
            }, 100);
        });
    } catch (e) {
        console.warn('setupContactForm error', e);
    }
}

function populateContact(data) {
    try {
        // header hero links
        const setIf = (id, url) => {
            const el = document.getElementById(id);
            if (el && url) el.href = url;
        };

        setIf('hero-facebook', data.social.facebook);
        setIf('hero-x', data.social.x);
        setIf('hero-instagram', data.social.instagram);
        setIf('hero-upwork', data.social.upwork);
        setIf('hero-linkedin', data.social.linkedin);
        setIf('hero-github', data.social.github);

        // footer links
        setIf('footer-facebook', data.social.facebook);
        setIf('footer-x', data.social.x);
        setIf('footer-instagram', data.social.instagram);
        setIf('footer-upwork', data.social.upwork);
        setIf('footer-linkedin', data.social.linkedin);
        setIf('footer-github', data.social.github);

        // contact info
        const emailEl = document.getElementById('footer-email');
        if (emailEl && data.email) { emailEl.textContent = data.email; emailEl.href = `mailto:${data.email}`; }

        const phoneEl = document.getElementById('footer-phone');
        if (phoneEl && data.phone) phoneEl.textContent = data.phone;

        const locEl = document.getElementById('footer-location');
        if (locEl && data.location) locEl.textContent = data.location;

        // setup contact form
        setupContactForm(data.email);
    } catch (e) {
        console.warn('populateContact error', e);
    }
}

function createTagList(tags = []) {
    const wrapper = document.createElement('div');
    wrapper.className = 'project-tags';
    tags.forEach(tag => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-light text-primary me-2 mb-2';
        badge.textContent = tag;
        wrapper.appendChild(badge);
    });
    return wrapper;
}

function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card project-card shadow-sm h-100';
    const body = document.createElement('div');
    body.className = 'card-body';

    if (item.image) {
        card.classList.add('has-image');
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.title || item.name || 'Card image';
        image.className = 'card-img-top';
        card.appendChild(image);
    }

    const title = document.createElement('h3');
    title.className = 'h5';
    title.textContent = item.title || item.name || 'Untitled';
    body.appendChild(title);

    if (item.subtitle) {
        const subtitle = document.createElement('p');
        subtitle.className = 'mb-2 text-light-soft';
        subtitle.textContent = item.subtitle;
        body.appendChild(subtitle);
    }

    if (item.description) {
        const description = document.createElement('p');
        description.textContent = item.description;
        body.appendChild(description);
    }

    if (Array.isArray(item.tags) && item.tags.length) {
        body.appendChild(createTagList(item.tags));
    }

    if (item.url) {
        const action = document.createElement('a');
        action.href = item.url;
        action.target = '_blank';
        action.rel = 'noopener noreferrer';
        action.className = 'btn btn-outline-primary mt-3 w-100';
        action.textContent = item.urlLabel || 'View Certificate';
        body.appendChild(action);
    }

    card.appendChild(body);
    return card;
}

function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

function renderCards(containerId, data, emptyMessage) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = `<div class="alert alert-secondary text-center">${emptyMessage}</div>`;
        return;
    }
    const row = document.createElement('div');
    row.className = 'row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4';
    data.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col';
        col.appendChild(createCard(item));
        row.appendChild(col);
    });
    container.appendChild(row);
}

function renderCarousel(containerId, data, emptyMessage, carouselId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = `<div class="alert alert-secondary text-center">${emptyMessage}</div>`;
        return;
    }

    const slides = chunkArray(data, 3);
    const carousel = document.createElement('div');
    carousel.className = 'carousel slide project-carousel';
    carousel.id = carouselId;
    carousel.setAttribute('data-bs-ride', 'carousel');
    carousel.setAttribute('data-bs-interval', '12000');
    carousel.setAttribute('data-bs-pause', 'false');

    const inner = document.createElement('div');
    inner.className = 'carousel-inner';
    slides.forEach((slideItems, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item${index === 0 ? ' active' : ''}`;
        const row = document.createElement('div');
        row.className = 'row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4';

        slideItems.forEach(entry => {
            const col = document.createElement('div');
            col.className = 'col';
            col.appendChild(createCard(entry));
            row.appendChild(col);
        });

        item.appendChild(row);
        inner.appendChild(item);
    });
    carousel.appendChild(inner);

    if (slides.length > 1) {
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators mt-4';
        slides.forEach((_, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('data-bs-target', `#${carouselId}`);
            button.setAttribute('data-bs-slide-to', index);
            button.setAttribute('aria-label', `Slide ${index + 1}`);
            if (index === 0) {
                button.className = 'active';
                button.setAttribute('aria-current', 'true');
            }
            indicators.appendChild(button);
        });
        carousel.appendChild(indicators);
    }

    container.appendChild(carousel);
}

function renderEmployment(data) {
    const container = document.getElementById('employmentContent');
    container.innerHTML = '';
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<div class="alert alert-secondary text-center">No employment history available.</div>';
        return;
    }

    // helper: get initials from company/title
    const getInitials = (text) => {
        if (!text) return '';
        return text.split(/\s+/).map(w => w[0] || '').join('').slice(0,2).toUpperCase();
    };

    const createAvatar = (item, size = 64) => {
        const wrap = document.createElement('div');
        wrap.className = 'me-3 flex-shrink-0';
        wrap.style.width = size + 'px';
        wrap.style.height = size + 'px';

        if (item && item.image) {
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.company || item.title || 'Avatar';
            img.className = 'rounded-circle';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            wrap.appendChild(img);
        } else {
            const initials = getInitials(item && item.company ? item.company : (item && item.title ? item.title : '?'));
            wrap.style.display = 'flex';
            wrap.style.alignItems = 'center';
            wrap.style.justifyContent = 'center';
            wrap.style.borderRadius = '50%';
            wrap.style.backgroundColor = '#0d6efd';
            wrap.style.color = '#fff';
            wrap.style.fontWeight = '600';
            wrap.style.fontSize = Math.max(14, Math.floor(size / 3)) + 'px';
            wrap.textContent = initials || '?';
        }
        return wrap;
    };

    const [current, ...previous] = data;
    
    // Manage header toggle button placement (idempotent)
    const headerCol = container.parentElement.querySelector('.row.mb-4 .col');
    let headerBtn = document.getElementById('employmentToggleBtn');
    if (previous.length) {
        if (headerCol) headerCol.classList.add('d-flex', 'justify-content-between', 'align-items-center');
        if (!headerBtn) {
            headerBtn = document.createElement('button');
            headerBtn.id = 'employmentToggleBtn';
            headerBtn.className = 'btn btn-outline-primary';
            headerBtn.type = 'button';
            headerBtn.setAttribute('data-bs-toggle', 'collapse');
            headerBtn.setAttribute('data-bs-target', '#employmentCollapse');
            headerBtn.setAttribute('aria-expanded', 'false');
            headerBtn.setAttribute('aria-controls', 'employmentCollapse');
            headerBtn.textContent = 'View previous roles';
            if (headerCol) headerCol.appendChild(headerBtn);
        } else {
            headerBtn.style.display = '';
            headerBtn.setAttribute('data-bs-target', '#employmentCollapse');
            headerBtn.setAttribute('aria-controls', 'employmentCollapse');
        }
    } else {
        if (headerBtn) headerBtn.remove();
        if (headerCol) headerCol.classList.remove('d-flex', 'justify-content-between', 'align-items-center');
    }
    const currentCard = document.createElement('div');
    currentCard.className = 'card shadow-sm mb-3';
    const cb = document.createElement('div');
    cb.className = 'card-body';

    const row = document.createElement('div');
    row.className = 'row g-3 align-items-center';

    const colImg = document.createElement('div');
    colImg.className = 'col-auto';
    colImg.appendChild(createAvatar(current, 72));

    const colMain = document.createElement('div');
    colMain.className = 'col-md-9';
    const h3 = document.createElement('h3');
    h3.className = 'h5 mb-1';
    h3.textContent = current.title || 'Current Role';
    const pinfo = document.createElement('p');
    pinfo.className = 'mb-0 text-light-soft';
    pinfo.textContent = `${current.company || ''} ${current.duration ? '| ' + current.duration : ''}`;
    colMain.appendChild(h3);
    colMain.appendChild(pinfo);

    row.appendChild(colImg);
    row.appendChild(colMain);

    // header-level toggle button is managed separately

    cb.appendChild(row);
    if (current.description) {
        const desc = document.createElement('p');
        desc.className = 'mt-3 mb-0';
        desc.textContent = current.description;
        cb.appendChild(desc);
    }
    currentCard.appendChild(cb);
    container.appendChild(currentCard);

    if (previous.length) {
        const collapseWrapper = document.createElement('div');
        collapseWrapper.className = 'collapse';
        collapseWrapper.id = 'employmentCollapse';
        previous.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card shadow-sm mb-3';
            const body = document.createElement('div');
            body.className = 'card-body';
            const r = document.createElement('div');
            r.className = 'row g-3 align-items-center';

            const colA = document.createElement('div');
            colA.className = 'col-auto';
            colA.appendChild(createAvatar(item, 56));

            const colB = document.createElement('div');
            colB.className = 'col-12 col-md';
            const h4 = document.createElement('h4');
            h4.className = 'h6 mb-1';
            h4.textContent = item.title || 'Role';
            const p = document.createElement('p');
            p.className = 'mb-0 text-light-soft';
            p.textContent = `${item.company || ''} ${item.duration ? '| ' + item.duration : ''}`;
            colB.appendChild(h4);
            colB.appendChild(p);

            r.appendChild(colA);
            r.appendChild(colB);

            if (item.description) {
                const descCol = document.createElement('div');
                descCol.className = 'col-12';
                const desc = document.createElement('p');
                desc.className = 'mt-2 mb-0';
                desc.textContent = item.description;
                descCol.appendChild(desc);
                r.appendChild(descCol);
            }

            body.appendChild(r);
            card.appendChild(body);
            collapseWrapper.appendChild(card);
        });
        container.appendChild(collapseWrapper);

        // Wire up collapse events to toggle header button text
        const collapseEl = document.getElementById('employmentCollapse');
        const toggleBtn = document.getElementById('employmentToggleBtn');
        if (collapseEl && toggleBtn) {
            collapseEl.addEventListener('shown.bs.collapse', () => {
                toggleBtn.textContent = 'Hide previous roles';
                toggleBtn.setAttribute('aria-expanded', 'true');
            });
            collapseEl.addEventListener('hidden.bs.collapse', () => {
                toggleBtn.textContent = 'View previous roles';
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
        }
    }
}

window.addEventListener('DOMContentLoaded', init);