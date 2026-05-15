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

    const [current, ...previous] = data;
    const currentCard = document.createElement('div');
    currentCard.className = 'card shadow-sm mb-3';
    currentCard.innerHTML = `
        <div class="card-body">
            <div class="row g-3 align-items-center">
                <div class="col-md-9">
                    <h3 class="h5 mb-1">${current.title || 'Current Role'}</h3>
                    <p class="mb-0 text-light-soft">${current.company || ''} ${current.duration ? '| ' + current.duration : ''}</p>
                </div>
                ${previous.length ? `
                <div class="col-md-3 text-md-end">
                    <button class="btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#employmentCollapse" aria-expanded="false" aria-controls="employmentCollapse">
                        View previous roles
                    </button>
                </div>
                ` : ''}
            </div>
            ${current.description ? `<p class="mt-3 mb-0">${current.description}</p>` : ''}
        </div>
    `;
    container.appendChild(currentCard);

    if (previous.length) {
        const collapseWrapper = document.createElement('div');
        collapseWrapper.className = 'collapse';
        collapseWrapper.id = 'employmentCollapse';
        previous.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card shadow-sm mb-3';
            card.innerHTML = `
                <div class="card-body">
                    <div class="row">
                        <div class="col-12">
                            <h4 class="h6 mb-1">${item.title || 'Role'}</h4>
                            <p class="mb-0 text-light-soft">${item.company || ''} ${item.duration ? '| ' + item.duration : ''}</p>
                            ${item.description ? `<p class="mt-2 mb-0">${item.description}</p>` : ''}
                        </div>
                    </div>
                </div>
            `;
            collapseWrapper.appendChild(card);
        });
        container.appendChild(collapseWrapper);
    }
}

window.addEventListener('DOMContentLoaded', init);