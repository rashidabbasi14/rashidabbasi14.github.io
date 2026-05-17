## Table of Contents

- [About](#about)
- [Features](#features)
- [Technical Specifications](#technical-specifications)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## About

This project serves as a personal portfolio website, showcasing projects, certifications, and employment history. It's designed to be a clean, responsive, and easily maintainable platform to present professional work and skills.

## Features

- **Dynamic Project Display**: Projects are loaded from external JavaScript files, allowing for easy updates and additions without modifying the core HTML.
- **Certifications Showcase**: Displays earned certifications with associated images.
- **Employment History**: Details past work experience.
- **Responsive Design**: Adapts to various screen sizes for optimal viewing on desktop and mobile devices.
- **Navigation Bar & Footer**: Consistent navigation and branding across all pages.
- **Favicon Support**: Custom favicons for better branding.

## Technical Specifications

This project is built using standard web technologies:

- **HTML5**: For structuring the content and defining the layout of the web pages.
- **CSS3**: For styling the application, ensuring a modern and responsive user interface.
- **JavaScript (ES6+)**: For dynamic content loading, interactive elements, and overall client-side functionality.

## Project Structure

The project is organized into the following main directories and files:

```
.github/
favicon/ # Contains various favicon sizes
js/
  common/ # Common JavaScript components like navbar and footer
  data/ # Data files for projects, certifications, employment, and personal info
    projects/ # Individual project data files
  main.js # Main JavaScript file for overall site functionality
  project.js # JavaScript for individual project pages
  projects.js # JavaScript for the projects listing page
uploads/ # Images and other media files
  certifications/ # Certification images
index.html # Main landing page
project.html # Template for individual project display
projects.html # Page listing all projects
site.webmanifest # Web manifest file
style.css # Main stylesheet
```

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

None. You only need a web browser to view the site.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rashidabbasi14/rashidabbasi14.github.io.git
   ```
2. Navigate to the project directory:
   ```bash
   cd rashidabbasi14.github.io
   ```
3. Open `index.html` in your preferred web browser.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

