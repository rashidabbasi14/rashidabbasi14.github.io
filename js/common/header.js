// Function to dynamically load global dependencies into the document <head>
function loadGlobalHead() {
  const headHTML = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rashid Ahmed Abbasi | Software Engineer</title>
    <link rel="icon" type="image/x-icon" href="favicon/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png">
    <link rel="android-chrome-192x192" sizes="192x192" href="favicon/android-chrome-192x192.png">
    <link rel="android-chrome-512x512" sizes="512x512" href="favicon/android-chrome-512x512.png">
    <link rel="manifest" href="site.webmanifest">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-icons-font@v10/font/simple-icons.min.css">
    
    <link href="style.css" rel="stylesheet">

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
  `;
  
  document.head.insertAdjacentHTML('beforeend', headHTML);
}

// Common navbar component
function renderNavbar() {
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold" id="navbar-brand" href="#">Rashid Ahmed Abbasi</a>
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

// Execute the component rendering sequence
loadGlobalHead();
renderNavbar();