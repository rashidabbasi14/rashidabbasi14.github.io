// Get project ID from URL
function getProjectId() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1;
}

// Get project data by ID
function getProjectData(id) {
    const projectName = `project${id}`;
    return window[projectName] || null;
}

// Render project details
function renderProject() {
    const projectId = getProjectId();
    const project = getProjectData(projectId);
    const container = document.getElementById('projectContent');
    
    if (!project) {
        container.innerHTML = `
            <div class="alert alert-warning text-center">
                <h4>Project Not Found</h4>
                <p>The requested project could not be found.</p>
                <a href="projects.html" class="btn btn-primary">View All Projects</a>
            </div>
        `;
        return;
    }

    // Update header
    document.getElementById('projectTitle').textContent = project.title;
    document.getElementById('projectSubtitle').textContent = project.subtitle;
    document.getElementById('projectBreadcrumb').textContent = project.title;
    document.title = `${project.title} | Rashid Ahmed Abbasi`;

    // Build gallery HTML
    let galleryHTML = `
        <div class="row g-4">
            <div class="col-lg-8">
                <div class="main-image mb-3">
                    <img id="mainImage" src="${project.coverImage}" alt="${project.title}" class="img-fluid rounded shadow-sm w-100" style="max-height: 500px; object-fit: cover;">
                </div>
                <div id="thumbnailContainer" class="d-flex gap-2 flex-wrap">
    `;

    if (project.images && project.images.length > 0) {
        project.images.forEach((img, index) => {
            const activeClass = index === 0 ? 'active' : '';
            galleryHTML += `<img src="${img}" alt="Image ${index + 1}" class="img-thumbnail thumbnail-img ${activeClass}" style="width: 100px; height: 75px; object-fit: cover; cursor: pointer;">`;
        });
    }

    galleryHTML += `
                </div>
            </div>
            
            <div class="col-lg-4">
                <div class="card shadow-sm mb-4">
                    <div class="card-body">
                        <h3 class="h5 mb-3">Project Details</h3>
                        <div class="mb-3">
                            <strong>Duration:</strong>
                            <p class="mb-0 text-light-soft">${project.duration || 'N/A'}</p>
                        </div>
                        <div class="mb-3">
                            <strong>Role:</strong>
                            <p class="mb-0 text-light-soft">${project.role || 'N/A'}</p>
                        </div>
                        <div class="mb-3">
                            <strong>Technologies:</strong>
                            <div class="mt-2">
    `;

    if (project.technologies && project.technologies.length > 0) {
        project.technologies.forEach(tech => {
            galleryHTML += `<span class="badge bg-primary me-1 mb-1">${tech}</span>`;
        });
    }

    galleryHTML += `
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="d-grid gap-2">
    `;

    if (project.projectLink) {
        galleryHTML += `<a href="${project.projectLink}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary"><i class="fab fa-github me-2"></i>View on GitHub</a>`;
    }
    if (project.liveLink) {
        galleryHTML += `<a href="${project.liveLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary"><i class="fas fa-external-link-alt me-2"></i>Live Demo</a>`;
    }
    galleryHTML += `<a href="projects.html" class="btn btn-outline-secondary"><i class="fas fa-arrow-left me-2"></i>Back to Projects</a>
                </div>
            </div>
        </div>
        
        <div class="row mt-5">
            <div class="col-12">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h2 class="h4 mb-3">Project Overview</h2>
                        <div class="project-description">${project.longDescription || project.description}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = galleryHTML;

    // Initialize image gallery
    initializeGallery();
}

// Image gallery functionality
function initializeGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail-img');
    const mainImage = document.getElementById('mainImage');
    
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                mainImage.src = this.src;
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', renderProject);