function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.body.appendChild(script);
    });
}

async function init() {
    // Always load myData, navbar, and footer first
    await loadScript("js/common/navbar.js");
    await loadScript("js/common/footer.js");
    await loadScript("js/data/my-data.js");

    // Populate all data from myData
    if (typeof myData !== "undefined") {
        populateFromMyData(myData);
        if (Array.isArray(myData.skills)) {
            renderSkills(myData.skills);
        }
    }

    const path = window.location.pathname.split("/").pop();
    await loadScript("js/data/projects/index.js");
    await Promise.all(window.getProjectFilePaths().map(loadScript));
    
    if (path === "index.html" || path === "") {
        await loadScript("js/data/employment-data.js");
        await loadScript("js/data/certifications-data.js");
        
        renderEmployment(typeof employmentData !== "undefined" ? employmentData : []);
        const allProjects = window.getProjectFiles().map(filename => window[filename]);
        renderProjectsCarousel("projectContent", allProjects, "No project entries found.", "projectCarousel");
        renderCertificationCarousel("certificationContent", typeof certificationsData !== "undefined" ? certificationsData : [], "No certification entries found.", "certCarousel");

    } else if (path === "projects.html") {
        await loadScript("js/projects.js");
        // Initialize projects after a small delay to ensure all scripts are loaded
        setTimeout(() => {
            if (typeof initProjects === "function") {
                initProjects();
            }
        }, 500);
    } else if (path === "project.html") {
        await loadScript("js/project.js");
        if (typeof renderProject === "function") {
            renderProject();
        }
    }
}

function setupContactForm(email) {
    try {
        const form = document.getElementById("contactForm");
        if (!form) return;

        form.action = `https://formsubmit.co/${email}`;
        form.method = "POST";
        form.setAttribute("data-email", email);

        const redirectInput = document.createElement("input");
        redirectInput.type = "hidden";
        redirectInput.name = "_next";
        redirectInput.value = window.location.href;
        form.appendChild(redirectInput);

        const honeypot = document.createElement("input");
        honeypot.type = "hidden";
        honeypot.name = "_honey";
        honeypot.value = "";
        form.appendChild(honeypot);

        form.addEventListener("submit", (e) => {
            const messageDiv = document.getElementById("formMessage");
            const submitBtn = form.querySelector("button[type=\"submit\"]");
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = "<i class=\"fas fa-spinner fa-spin me-2\"></i>Sending...";

            messageDiv.className = "alert alert-info";
            messageDiv.textContent = "Sending your message...";
            messageDiv.style.display = "block";

            setTimeout(() => {
            }, 100);
        });
    } catch (e) {
        console.warn("setupContactForm error", e);
    }
}

function populateFromMyData(data) {
    try {
        if (data.name && data.title) {
            document.title = `${data.name} | ${data.title}`;
        }

        const navbarBrand = document.getElementById("navbar-brand");
        if (navbarBrand && data.name) navbarBrand.textContent = data.name;

        const headerImage = document.getElementById("header-image");
        if (headerImage && data.image) headerImage.src = data.image;

        const headerTagline = document.getElementById("header-tagline");
        if (headerTagline && data.tagline) headerTagline.textContent = data.tagline;

        const headerDescription = document.getElementById("header-description");
        if (headerDescription && data.description) headerDescription.textContent = data.description;

        const aboutContent = document.getElementById("about-content");
        if (aboutContent && data.aboutMe) aboutContent.innerHTML = data.aboutMe;

        const educationContent = document.getElementById("education-content");
        if (educationContent && Array.isArray(data.education)) {
            educationContent.innerHTML = "";
            data.education.forEach((edu, index) => {
                const item = document.createElement("div");
                item.className = "timeline-item" + (index > 0 ? " mt-3 pt-3 border-top" : "");
                
                const yearDiv = document.createElement("div");
                yearDiv.className = "timeline-date";
                yearDiv.textContent = `Graduated ${edu.year}`;
                
                const degreeStrong = document.createElement("strong");
                degreeStrong.textContent = edu.degree;
                
                const instPara = document.createElement("p");
                instPara.className = "mb-0";
                instPara.textContent = edu.institution;
                
                item.appendChild(yearDiv);
                item.appendChild(degreeStrong);
                item.appendChild(instPara);
                educationContent.appendChild(item);
            });
        }

        const footerAbout = document.getElementById("footer-about");
        if (footerAbout && data.footerAboutMe) footerAbout.textContent = data.footerAboutMe;

        const setIf = (id, url) => {
            const el = document.getElementById(id);
            if (el && url) el.href = url;
        };

        if (data.social) {
            setIf("hero-facebook", data.social.facebook);
            setIf("hero-x", data.social.x);
            setIf("hero-instagram", data.social.instagram);
            setIf("hero-upwork", data.social.upwork);
            setIf("hero-linkedin", data.social.linkedin);
            setIf("hero-github", data.social.github);

            setIf("footer-facebook", data.social.facebook);
            setIf("footer-x", data.social.x);
            setIf("footer-instagram", data.social.instagram);
            setIf("footer-upwork", data.social.upwork);
            setIf("footer-linkedin", data.social.linkedin);
            setIf("footer-github", data.social.github);
        }

        const emailEl = document.getElementById("footer-email");
        if (emailEl && data.email) { emailEl.textContent = data.email; emailEl.href = `mailto:${data.email}`; }

        const phoneEl = document.getElementById("footer-phone");
        if (phoneEl && data.phone) phoneEl.textContent = data.phone;

        const locEl = document.getElementById("footer-location");
        if (locEl && data.location) locEl.textContent = data.location;

        setupContactForm(data.email);
    } catch (e) {
        console.warn("populateFromMyData error", e);
    }
}

function createTagList(tags = []) {
    const wrapper = document.createElement("div");
    wrapper.className = "project-tags";
    tags.forEach(tag => {
        const badge = document.createElement("span");
        badge.className = "badge bg-light text-primary me-2 mb-2";
        badge.textContent = tag;
        wrapper.appendChild(badge);
    });
    return wrapper;
}

function createCard(item) {
    // If a URL exists, make the root element an anchor tag; otherwise, keep it a div
    const card = document.createElement(item.url ? "a" : "div");
    card.className = "card project-card shadow-sm h-100 text-decoration-none text-reset"; 
    
    // Configure link attributes if it's an anchor tag
    if (item.url) {
        card.href = item.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
    }

    const body = document.createElement("div");
    body.className = "card-body";

    if (item.image) {
        card.classList.add("has-image");
        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.title || item.name || "Card image";
        image.className = "card-img-top";
        card.appendChild(image);
    }

    const title = document.createElement("h3");
    title.className = "h5";
    title.textContent = item.title || item.name || "Untitled";
    body.appendChild(title);

    if (item.subtitle) {
        const subtitle = document.createElement("p");
        subtitle.className = "mb-2 text-light-soft";
        subtitle.textContent = item.subtitle;
        body.appendChild(subtitle);
    }

    if (item.description) {
        const description = document.createElement("p");
        description.textContent = item.description;
        body.appendChild(description);
    }

    if (Array.isArray(item.tags) && item.tags.length) {
        body.appendChild(createTagList(item.tags));
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

// Returns true when the viewport is narrower than Bootstrap's md breakpoint
function isMobile() {
    return window.innerWidth < 768;
}

function renderCards(containerId, data, emptyMessage) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = `<div class=\"alert alert-secondary text-center\">${emptyMessage}</div>`;
        return;
    }
    const row = document.createElement("div");
    row.className = "row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4";
    data.forEach(item => {
        const col = document.createElement("div");
        col.className = "col";
        col.appendChild(createCard(item));
        row.appendChild(col);
    });
    container.appendChild(row);
}

function renderProjectsCarousel(containerId, data, emptyMessage, carouselId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = `<div class="alert alert-secondary text-center">${emptyMessage}</div>`;
        return;
    }
    const sortedData = [...data].sort((a, b) => (b.priority === true) - (a.priority === true));

    // 1 card per slide on mobile, 3 on desktop
    const slideSize = isMobile() ? 1 : 3;
    const slides = chunkArray(sortedData, slideSize);

    const carousel = document.createElement("div");
    carousel.className = "carousel slide project-carousel";
    carousel.id = carouselId;
    carousel.setAttribute("data-bs-ride", "carousel");
    carousel.setAttribute("data-bs-interval", "8000"); // Increased speed (was 12000)
    carousel.setAttribute("data-bs-pause", "false");

    const inner = document.createElement("div");
    inner.className = "carousel-inner";
    slides.forEach((slideItems, index) => {
        const item = document.createElement("div");
        item.className = `carousel-item${index === 0 ? " active" : ""}`;
        const row = document.createElement("div");
        row.className = "row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4";

        slideItems.forEach(entry => {
            const col = document.createElement("div");
            col.className = "col";
            col.appendChild(createProjectCard(entry));
            row.appendChild(col);
        });

        item.appendChild(row);
        inner.appendChild(item);
    });
    carousel.appendChild(inner);

    if (slides.length > 1) {
        const indicators = document.createElement("div");
        indicators.className = "carousel-indicators mt-4";
        slides.forEach((_, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.setAttribute("data-bs-target", `#${carouselId}`);
            button.setAttribute("data-bs-slide-to", index);
            button.setAttribute("aria-label", `Slide ${index + 1}`);
            if (index === 0) {
                button.className = "active";
                button.setAttribute("aria-current", "true");
            }
            indicators.appendChild(button);
        });
        carousel.appendChild(indicators);
    }

    container.appendChild(carousel);
}

function createProjectCard(item) {
    // Changed from a 'div' to an 'a' tag to make the entire card clickable
    const card = document.createElement("a");
    card.href = `project.html?id=${item.id}`;
    // Added Bootstrap utilities to clear default link colors and underlines
    card.className = "card project-card shadow-sm h-100 text-decoration-none text-reset";
    
    if (item.coverImage) {
        const image = document.createElement("img");
        image.src = item.coverImage;
        image.alt = item.title || item.name || "Card image";
        image.className = "card-img-top";
        card.appendChild(image);
    }
    
    const body = document.createElement("div");
    body.className = "card-body d-flex flex-column";
    
    const title = document.createElement("h3");
    title.className = "h5";
    title.textContent = item.title || item.name || "Untitled";
    body.appendChild(title);
    
    if (item.subtitle) {
        const subtitle = document.createElement("p");
        subtitle.className = "mb-2 text-light-soft";
        subtitle.textContent = item.subtitle;
        body.appendChild(subtitle);
    }
    
    if (item.description) {
        const description = document.createElement("p");
        description.className = "flex-grow-1";
        description.textContent = item.description;
        body.appendChild(description);
    }
    
    if (Array.isArray(item.technologies) && item.technologies.length) {
        body.appendChild(createTagList(item.technologies));
    }
    
    // The "View Project" button elements have been completely removed from here
    
    card.appendChild(body);
    return card;
}

function renderCertificationCarousel(containerId, data, emptyMessage, carouselId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = `<div class=\"alert alert-secondary text-center\">${emptyMessage}</div>`;
        return;
    }

    // 1 card per slide on mobile, 3 on desktop
    const slideSize = isMobile() ? 1 : 3;
    const slides = chunkArray(data, slideSize);

    const carousel = document.createElement("div");
    carousel.className = "carousel slide project-carousel";
    carousel.id = carouselId;
    carousel.setAttribute("data-bs-ride", "carousel");
    carousel.setAttribute("data-bs-interval", "8000"); // Increased speed (was 12000)
    carousel.setAttribute("data-bs-pause", "false");

    const inner = document.createElement("div");
    inner.className = "carousel-inner";
    slides.forEach((slideItems, index) => {
        const item = document.createElement("div");
        item.className = `carousel-item${index === 0 ? " active" : ""}`;
        const row = document.createElement("div");
        row.className = "row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4";

        slideItems.forEach(entry => {
            const col = document.createElement("div");
            col.className = "col";
            col.appendChild(createCard(entry));
            row.appendChild(col);
        });

        item.appendChild(row);
        inner.appendChild(item);
    });
    carousel.appendChild(inner);

    if (slides.length > 1) {
        const indicators = document.createElement("div");
        indicators.className = "carousel-indicators mt-4";
        slides.forEach((_, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.setAttribute("data-bs-target", `#${carouselId}`);
            button.setAttribute("data-bs-slide-to", index);
            button.setAttribute("aria-label", `Slide ${index + 1}`);
            if (index === 0) {
                button.className = "active";
                button.setAttribute("aria-current", "true");
            }
            indicators.appendChild(button);
        });
        carousel.appendChild(indicators);
    }

    container.appendChild(carousel);
}

function renderSkills(skillCategories) {
    const container = document.getElementById("skills-content");
    if (!container) return;
    container.innerHTML = "";
    if (!Array.isArray(skillCategories) || skillCategories.length === 0) {
        container.innerHTML = "<p class='text-light-soft'>No skills data available.</p>";
        return;
    }
    
    const titleContainer = document.createElement("div");
    titleContainer.className = "d-flex justify-content-between align-items-center mb-3";

    const title = document.createElement("h5");
    title.className = "text-light mb-0";
    title.textContent = "Skills & Technologies";
    titleContainer.appendChild(title);
    
    const wrapper = document.createElement("div");
    wrapper.className = "skills-wrapper";
    
    const visibleCategories = skillCategories.slice(0, 3);
    const hiddenCategories = skillCategories.slice(3);
    
    visibleCategories.forEach(category => {
        const section = createSkillSection(category);
        wrapper.appendChild(section);
    });
    
    if (hiddenCategories.length > 0) {
        const collapseBtn = document.createElement("button");
        collapseBtn.className = "btn btn-outline-light btn-sm";
        collapseBtn.type = "button";
        collapseBtn.setAttribute("data-bs-toggle", "collapse");
        collapseBtn.setAttribute("data-bs-target", "#moreSkillsCollapse");
        collapseBtn.innerHTML = "All Skills <i class='fas fa-chevron-down ms-1'></i>";
        titleContainer.appendChild(collapseBtn);
        
        const collapseWrapper = document.createElement("div");
        collapseWrapper.className = "collapse mt-3";
        collapseWrapper.id = "moreSkillsCollapse";
        
        hiddenCategories.forEach(category => {
            const section = createSkillSection(category);
            collapseWrapper.appendChild(section);
        });
        
        container.appendChild(titleContainer);
        container.appendChild(wrapper);
        container.appendChild(collapseWrapper);
    } else {
        container.appendChild(titleContainer);
        container.appendChild(wrapper);
    }
}

function createSkillSection(category) {
    const section = document.createElement("div");
    section.className = "skill-section mt-1 row gy-3 gy-md-0 align-items-center"; // Added gy-3 for mobile vertical spacing
    
    const itemsContainer = document.createElement("div");
    // Changed col-10 to col-12 col-md-10
    itemsContainer.className = "skill-items d-flex flex-wrap gap-2 justify-content-md-start col-12 col-md-10";
    
    if (category.items && Array.isArray(category.items)) {
        category.items.forEach(item => {
            const skillItem = document.createElement("div");
            skillItem.className = "text-center";
            skillItem.style.margin = "4px";
            
            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.name;
            img.className = ""; // Fixed border visibility
            img.style.width = "35px";
            img.style.height = "35px";
            img.style.objectFit = "cover";
            img.onerror = function() {
                this.style.display = "none";
                const fallback = document.createElement("div");
                fallback.className = "d-flex align-items-center justify-content-center";
                fallback.style.width = "35px";
                fallback.style.height = "35px";
                fallback.style.background = "rgba(71, 184, 255, 0.2)";
                fallback.style.fontSize = "12px";
                fallback.style.fontWeight = "600";
                fallback.textContent = item.name.substring(0, 2).toUpperCase();
                fallback.title = item.name;
                skillItem.insertBefore(fallback, name); // Safely insert fallback before text element
            };
            
            const name = document.createElement("p");
            name.className = "mb-0 mt-1 text-light-soft small";
            name.style.fontSize = "12px";
            name.textContent = item.name;
            
            skillItem.appendChild(img);
            skillItem.appendChild(name);
            itemsContainer.appendChild(skillItem);
        });
    }
    
    const categoryHeader = document.createElement("div");
    // Changed col-2 to col-12 col-md-2, added adaptive text alignments
    categoryHeader.className = "mb-2 mb-md-0 col-12 col-md-2 text-center text-md-start";
    
    const categoryTitle = document.createElement("h6");
    categoryTitle.className = "mb-0 text-light fw-bold";
    categoryTitle.textContent = category.name;
    
    categoryHeader.appendChild(categoryTitle);
    
    // Append order matters: header first (top on mobile, left on desktop)
    section.appendChild(categoryHeader);
    section.appendChild(itemsContainer);
    
    return section;
}

function renderEmployment(data) {
    const container = document.getElementById("employmentContent");
    container.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = "<div class=\"alert alert-secondary text-center\">No employment history available.</div>";
        return;
    }

    const getInitials = (text) => {
        if (!text) return "";
        return text.split(/\s+/).map(w => w[0] || "").join("").slice(0,2).toUpperCase();
    };

    const createAvatar = (item, size = 64) => {
        const wrap = document.createElement("div");
        wrap.className = "me-3 flex-shrink-0";
        wrap.style.width = size + "px";
        wrap.style.height = size + "px";

        if (item && item.image) {
            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.company || item.title || "Avatar";
            img.className = "rounded-circle";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            wrap.appendChild(img);
        } else {
            const initials = getInitials(item && item.company ? item.company : (item && item.title ? item.title : "?"));
            wrap.style.display = "flex";
            wrap.style.alignItems = "center";
            wrap.style.justifyContent = "center";
            wrap.style.borderRadius = "50%";
            wrap.style.backgroundColor = "#0d6efd";
            wrap.style.color = "#fff";
            wrap.style.fontWeight = "600";
            wrap.style.fontSize = Math.max(14, Math.floor(size / 3)) + "px";
            wrap.textContent = initials || "?";
        }
        return wrap;
    };

    const [current, ...previous] = data;
    
    const headerCol = container.parentElement.querySelector(".row.mb-4 .col");
    let headerBtn = document.getElementById("employmentToggleBtn");
    if (previous.length) {
        if (headerCol) headerCol.classList.add("d-flex", "justify-content-between", "align-items-center");
        if (!headerBtn) {
            headerBtn = document.createElement("button");
            headerBtn.id = "employmentToggleBtn";
            headerBtn.className = "btn btn-outline-primary";
            headerBtn.type = "button";
            headerBtn.setAttribute("data-bs-toggle", "collapse");
            headerBtn.setAttribute("data-bs-target", "#employmentCollapse");
            headerBtn.setAttribute("aria-expanded", "false");
            headerBtn.setAttribute("aria-controls", "employmentCollapse");
            headerBtn.textContent = "All roles";
            if (headerCol) headerCol.appendChild(headerBtn);
        } else {
            headerBtn.style.display = "";
            headerBtn.setAttribute("data-bs-target", "#employmentCollapse");
            headerBtn.setAttribute("aria-controls", "#employmentCollapse");
        }
    } else {
        if (headerBtn) headerBtn.remove();
        if (headerCol) headerCol.classList.remove("d-flex", "justify-content-between", "align-items-center");
    }
    const currentCard = document.createElement("div");
    currentCard.className = "card shadow-sm mb-3";
    const cb = document.createElement("div");
    cb.className = "card-body";

    const row = document.createElement("div");
    row.className = "row g-3 align-items-center";

    const colImg = document.createElement("div");
    colImg.className = "col-auto";
    colImg.appendChild(createAvatar(current, 72));

    const colMain = document.createElement("div");
    colMain.className = "col-md-9";
    const h3 = document.createElement("h3");
    h3.className = "h5 mb-1";
    h3.textContent = current.title || "Current Role";
    const pinfo = document.createElement("p");
    pinfo.className = "mb-0 text-light-soft";
    pinfo.textContent = `${current.company || ""} ${current.duration ? "| " + current.duration : ""}`;
    colMain.appendChild(h3);
    colMain.appendChild(pinfo);

    row.appendChild(colImg);
    row.appendChild(colMain);

    cb.appendChild(row);
    if (current.description) {
        const desc = document.createElement("p");
        desc.className = "mt-3 mb-0";
        desc.textContent = current.description;
        cb.appendChild(desc);
    }
    currentCard.appendChild(cb);
    container.appendChild(currentCard);

    if (previous.length) {
        const collapseWrapper = document.createElement("div");
        collapseWrapper.className = "collapse";
        collapseWrapper.id = "employmentCollapse";
        previous.forEach(item => {
            const card = document.createElement("div");
            card.className = "card shadow-sm mb-3";
            const body = document.createElement("div");
            body.className = "card-body";
            const r = document.createElement("div");
            r.className = "row g-3 align-items-center";

            const colA = document.createElement("div");
            colA.className = "col-auto";
            colA.appendChild(createAvatar(item, 56));

            const colB = document.createElement("div");
            colB.className = "col-12 col-md";
            const h4 = document.createElement("h4");
            h4.className = "h6 mb-1";
            h4.textContent = item.title || "Role";
            const p = document.createElement("p");
            p.className = "mb-0 text-light-soft";
            p.textContent = `${item.company || ""} ${item.duration ? "| " + item.duration : ""}`;
            colB.appendChild(h4);
            colB.appendChild(p);

            r.appendChild(colA);
            r.appendChild(colB);

            if (item.description) {
                const descCol = document.createElement("div");
                descCol.className = "col-12";
                const desc = document.createElement("p");
                desc.className = "mt-2 mb-0";
                desc.textContent = item.description;
                descCol.appendChild(desc);
                r.appendChild(descCol);
            }

            body.appendChild(r);
            card.appendChild(body);
            collapseWrapper.appendChild(card);
        });
        container.appendChild(collapseWrapper);

        const collapseEl = document.getElementById("employmentCollapse");
        const toggleBtn = document.getElementById("employmentToggleBtn");
        if (collapseEl && toggleBtn) {
            collapseEl.addEventListener("shown.bs.collapse", () => {
                toggleBtn.textContent = "Hide roles";
                toggleBtn.setAttribute("aria-expanded", "true");
            });
            collapseEl.addEventListener("hidden.bs.collapse", () => {
                toggleBtn.textContent = "All roles";
                toggleBtn.setAttribute("aria-expanded", "false");
            });
        }
    }
}

window.addEventListener("DOMContentLoaded", init);

// Rebuild carousels on resize so mobile/desktop slide count stays correct
let _carouselResizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(_carouselResizeTimer);
    _carouselResizeTimer = setTimeout(() => {
        const path = window.location.pathname.split("/").pop();
        if (path !== "index.html" && path !== "") return;

        const allProjects = window.getProjectFiles
            ? window.getProjectFiles().map(filename => window[filename])
            : [];
        if (allProjects.length) {
            renderProjectsCarousel("projectContent", allProjects, "No project entries found.", "projectCarousel");
        }
        if (typeof certificationsData !== "undefined") {
            renderCertificationCarousel("certificationContent", certificationsData, "No certification entries found.", "certCarousel");
        }
    }, 250);
});

// Event Listener for searching tags within the dropdown
document.addEventListener("DOMContentLoaded", () => {
    const tagSearchInput = document.getElementById("tagSearchInput");
    
    if (tagSearchInput) {
        tagSearchInput.addEventListener("input", (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const items = document.querySelectorAll("#projectFilters .dropdown-item");

            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.classList.remove("d-none");
                    item.classList.add("d-flex");
                } else {
                    item.classList.remove("d-flex");
                    item.classList.add("d-none");
                }
            });
        });
    }
});