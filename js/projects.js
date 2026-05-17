// Global state for active filters
let activeFilters = [];

// Render projects on the projects page
function renderProjects(projectsToRender) {
    const container = document.getElementById("projectsContainer");
    if (!container) return;
    
    container.innerHTML = ""; // Clear existing projects

    if (typeof projectsToRender !== "undefined" && projectsToRender.length > 0) {
        projectsToRender.forEach(project => {
            if (!project || !project.title) return; // Skip invalid projects
            
            const col = document.createElement("div");
            col.className = "col";
            
            // Create an anchor tag to wrap the entire card
            const cardLink = document.createElement("a");
            cardLink.href = `project.html?id=${project.id}`;
            cardLink.className = "text-decoration-none text-reset d-block h-100"; // Keeps text styling intact and maintains layout
            
            const card = document.createElement("div");
            card.className = "card project-card shadow-sm h-100";
            
            const image = document.createElement("img");
            image.src = project.coverImage;
            image.alt = project.title;
            image.className = "card-img-top";
            
            const body = document.createElement("div");
            body.className = "card-body d-flex flex-column";
            
            const title = document.createElement("h3");
            title.className = "h5";
            title.textContent = project.title;
            
            const subtitle = document.createElement("p");
            subtitle.className = "mb-2 text-light-soft";
            subtitle.textContent = project.subtitle || "";
            
            const description = document.createElement("p");
            description.className = "flex-grow-1";
            description.textContent = project.description || "";
            
            const tags = document.createElement("div");
            tags.className = "project-tags";
            (project.technologies || []).forEach(tag => {
                const badge = document.createElement("span");
                badge.className = "badge bg-light text-primary me-2 mb-2";
                badge.textContent = tag;
                tags.appendChild(badge);
            });
            
            // Build the card hierarchy
            body.appendChild(title);
            body.appendChild(subtitle);
            body.appendChild(description);
            body.appendChild(tags);
            
            card.appendChild(image);
            card.appendChild(body);
            
            // Append the card into the anchor link, then into the column
            cardLink.appendChild(card);
            col.appendChild(cardLink);
            container.appendChild(col);
        });
    } else {
        container.innerHTML = "<p class=\"text-center text-light-soft\">No projects found matching your criteria.</p>";
    }
}

// Filter projects based on search query and active filters
// Filter projects based on search query and active filters
function filterProjects() {
    const searchInput = document.getElementById("projectSearch");
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : "";
    const allProjects = window.getProjectFiles().map(filename => window[filename]).filter(p => p);

    const filtered = allProjects.filter(project => {
        const matchesSearch = (
            project.title.toLowerCase().includes(searchQuery) ||
            project.description.toLowerCase().includes(searchQuery) ||
            (project.technologies || []).some(tech => tech.toLowerCase().includes(searchQuery))
        );

        const matchesFilters = activeFilters.length === 0 || 
                               (project.technologies || []).some(tech => activeFilters.includes(tech));

        return matchesSearch && matchesFilters;
    });

    // --- SORTING LOGIC FOR PRIORITY PROJECTS ---
    // If a project has priority === true, it gets pushed to the top
    const sortedAndFiltered = filtered.sort((a, b) => {
        const aPriority = a.priority === true ? 1 : 0;
        const bPriority = b.priority === true ? 1 : 0;
        
        return bPriority - aPriority; 
    });

    renderProjects(sortedAndFiltered);
}

// Render filter checkboxes inside the searchable dropdown
function renderFilters() {
    const filterContainer = document.getElementById("projectFilters");
    if (!filterContainer) return;
    
    filterContainer.innerHTML = "";

    const allProjects = window.getProjectFiles().map(filename => window[filename]).filter(p => p);
    const allTechnologies = allProjects.reduce((acc, project) => {
        (project.technologies || []).forEach(tech => acc.add(tech));
        return acc;
    }, new Set());

    // Sort technologies alphabetically for better user experience
    const sortedTechnologies = Array.from(allTechnologies).sort();

    sortedTechnologies.forEach(tech => {
        const itemContainer = document.createElement("div");
        itemContainer.className = "form-check dropdown-item py-1 rounded";
        itemContainer.style.cursor = "pointer";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input filter-checkbox me-2";
        checkbox.id = `tech-${tech.replace(/\s+/g, '-')}`;
        checkbox.checked = activeFilters.includes(tech);

        const label = document.createElement("label");
        label.className = "form-check-label w-100 text-truncate";
        label.htmlFor = checkbox.id;
        label.textContent = tech;
        label.style.cursor = "pointer";

        // Toggle logic when the row or checkbox is clicked
        const handleToggle = (e) => {
            // Prevent double triggers if clicking the label specifically
            if (e.target === label) return; 
            
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }

            if (checkbox.checked) {
                if (!activeFilters.includes(tech)) activeFilters.push(tech);
            } else {
                activeFilters = activeFilters.filter(filter => filter !== tech);
            }

            updateDropdownButtonLabel();
            filterProjects();
        };

        itemContainer.addEventListener("click", handleToggle);

        itemContainer.appendChild(checkbox);
        itemContainer.appendChild(label);
        filterContainer.appendChild(itemContainer);
    });

    updateDropdownButtonLabel();
}

// Dynamically updates the button label to show how many items are active
function updateDropdownButtonLabel() {
    const btn = document.getElementById("filterDropdownBtn");
    if (!btn) return;
    if (activeFilters.length === 0) {
        btn.textContent = "Filter";
    } else {
        btn.textContent = `Filter (${activeFilters.length})`;
    }
}

// Initialize projects page
function initProjects() {
    renderFilters();
    filterProjects(); // Initial render with all projects
    
    // Setup search input listener
    const searchInput = document.getElementById("projectSearch");
    if (searchInput) {
        searchInput.addEventListener("input", filterProjects);
    }
}

// Make initProjects globally available
window.initProjects = initProjects;