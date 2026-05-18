// Common navbar component
function renderNavbar() {
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold" id="navbar-brand" href="index.html">Rashid Ahmed Abbasi</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="index.html#home">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="index.html#employment">Employment</a></li>
                    <li class="nav-item"><a class="nav-link" href="projects.html">Projects</a></li>
                    <li class="nav-item"><a class="nav-link" href="index.html#certifications">Certifications</a></li>
                    <li class="nav-item"><a class="nav-link" href="index.html#contact">Contact</a></li>
                </ul>
            </div>
        </div>
    </nav>
  `;

  // Safely prepends the navbar right after the opening <body> tag
  document.body.insertAdjacentHTML('afterbegin', navbarHTML);
}

renderNavbar();