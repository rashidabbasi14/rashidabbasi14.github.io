// Common footer component
function renderFooter() {
  const footerHTML = `
    <footer class="site-footer text-white py-5">
        <div class="container">
            <div class="row gx-4 gy-4">
                <!-- Contact Info -->
                <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
                    <h5 class="footer-heading">Contact</h5>
                    <div class="footer-contact-item mb-3">
                    <i class="fas fa-envelope footer-icon text-primary"></i>
                    <a id="footer-email" href="mailto:rashidabbasi17@gmail.com" class="footer-contact-link">
                        <span>rashidabbasi17@gmail.com</span>
                    </a>
                    </div>
                    <div class="footer-contact-item mb-3">
                    <i class="fas fa-phone footer-icon text-success"></i>
                    <a id="footer-phone" href="tel:+923313817104" class="footer-contact-link">
                        <span>+92 331 381 7104</span>
                    </a>
                    </div>
                    <div class="footer-contact-item">
                    <i class="fas fa-map-marker-alt footer-icon text-danger"></i>
                    <a id="footer-location" href="https://maps.app.goo.gl/6b4j5YXq5qJ5qJ5q9" target="_blank" rel="noopener noreferrer" class="footer-contact-link">
                        <span>Karachi, Pakistan</span>
                    </a>
                    </div>
                </div>

                <!-- About Me - Hidden on mobile -->
                <div class="col-lg-6 d-none d-md-block">
                    <h5 class="footer-heading">About Me</h5>
                    <p id="footer-about" class="mb-0 text-light-soft">Senior software developer building finance-grade web apps, APIs, and automation systems. Always focused on clean architecture and strong delivery.</p>
                </div>

                <!-- Social Links -->
                <div class="col-lg-3 col-md-6">
                    <h5 class="footer-heading">Connect With Me</h5>
                    <div class="footer-social-wrapper">
                        <div class="footer-social-row">
                            <a id="footer-facebook" href="https://www.facebook.com/rashidabbasi14" target="_blank" rel="noopener noreferrer" class="footer-social-btn" title="Facebook">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a id="footer-x" href="https://x.com/rashidabbasi17" target="_blank" rel="noopener noreferrer" class="footer-social-btn" title="X (Twitter)">
                                <i class="fab fa-x"></i>
                            </a>
                            <a id="footer-instagram" href="https://www.instagram.com/rashidabbasi14" target="_blank" rel="noopener noreferrer" class="footer-social-btn" title="Instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </div>
                        <div class="footer-social-row">
                            <a id="footer-linkedin" href="https://www.linkedin.com/in/rashid-abbasi" target="_blank" rel="noopener noreferrer" class="footer-social-btn" title="LinkedIn">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                            <a id="footer-upwork" href="https://www.upwork.com/freelancers/rashidabbasi" target="_blank" rel="noopener noreferrer" class="footer-social-btn" title="Upwork">
                                <i class="si si-upwork"></i>
                            </a>
                             <a id="footer-github" href="https://github.com/rashidabbasi14" target="_blank" rel="noopener noreferrer" class="footer-social-btn" title="GitHub">
                                <i class="fab fa-github"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Copyright -->
            <div class="row mt-4 pt-3 border-top">
                <div class="col text-center text-light-soft small">&copy; 2026 Rashid Ahmed Abbasi. All Rights Reserved.</div>
            </div>
        </div>
    </footer>
  `;

  // Safely appends the HTML string right before the closing </body> tag
  document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// Call the function to append the footer to the page
renderFooter();