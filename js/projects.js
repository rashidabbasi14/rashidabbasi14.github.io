// Render projects on the projects page
function renderProjects(allProjects) {
    const container = document.getElementById("projectsContainer");
    if (typeof allProjects !== "undefined" && allProjects.length > 0) {
        allProjects.forEach(project => {
            const col = document.createElement("div");
            col.className = "col";
            
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
            subtitle.textContent = project.subtitle;
            
            const description = document.createElement("p");
            description.className = "flex-grow-1";
            description.textContent = project.description;
            
            const tags = document.createElement("div");
            tags.className = "project-tags";
            project.technologies.forEach(tag => {
                const badge = document.createElement("span");
                badge.className = "badge bg-light text-primary me-2 mb-2";
                badge.textContent = tag;
                tags.appendChild(badge);
            });
            
            const link = document.createElement("a");
            link.href = `project.html?id=${project.id}`;
            link.className = "btn btn-outline-primary mt-3 w-100";
            link.innerHTML = "<i class=\"fas fa-arrow-right me-2\"></i>View Project";
            
            body.appendChild(title);
            body.appendChild(subtitle);
            body.appendChild(description);
            body.appendChild(tags);
            body.appendChild(link);
            
            card.appendChild(image);
            card.appendChild(body);
            col.appendChild(card);
            container.appendChild(col);
        });
    }
}

// No need to call renderProjects on DOMContentLoaded here, as it's now called from main.js
// document.addEventListener("DOMContentLoaded", renderProjects);