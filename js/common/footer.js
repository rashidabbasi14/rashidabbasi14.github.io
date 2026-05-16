// Common footer component
function renderFooter() {
  return `
    <footer class="site-footer text-white py-5">
        <div class="container">
            <div class="row gx-4 gy-4 align-items-start">
                <div class="col-md-3">
                    <h5>Contact</h5>
                    <p class="mb-1">Email: <a href="mailto:your-email@example.com" class="footer-link">your-email@example.com</a></p>
                    <p class="mb-1">Phone: <span>+92 300 000 0000</span></p>
                    <p class="mb-0">Based in <span>Karachi, Pakistan</span></p>
                </div>
                <div class="col-md-6 text-center">
                    <h5>About Me</h5>
                    <p class="mb-0 text-light-soft">Senior software developer building finance-grade web apps, APIs, and automation systems. Always focused on clean architecture and strong delivery.</p>
                </div>
                <div class="col-md-3">
                    <h5>Connect</h5>
                    <div class="row gx-3 gy-3 mb-3">
                        <a href="#" target="_blank" rel="noopener noreferrer" class="col-md-4 mr-2 btn btn-outline-light btn-sm footer-btn"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" target="_blank" rel="noopener noreferrer" class="col-md-4 mr-2 btn btn-outline-light btn-sm footer-btn"><i class="fab fa-x"></i></a>
                        <a href="#" target="_blank" rel="noopener noreferrer" class="col-md-4 mr-2 btn btn-outline-light btn-sm footer-btn"><i class="fab fa-instagram"></i></a>
                    </div>
                    <div class="row gx-3 gy-3">
                        <a href="#" target="_blank" rel="noopener noreferrer" class="col-md-4 mr-2 btn btn-outline-light btn-sm footer-btn"><i class="si si-upwork"></i></a>
                        <a href="#" target="_blank" rel="noopener noreferrer" class="col-md-4 mr-2 btn btn-outline-light btn-sm footer-btn"><i class="fab fa-linkedin-in"></i></a>
                        <a href="#" target="_blank" rel="noopener noreferrer" class="col-md-4 mr-2 btn btn-outline-light btn-sm footer-btn"><i class="fab fa-github"></i></a>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col text-center text-light-soft small">&copy; 2026 Rashid Ahmed Abbasi. All Rights Reserved.</div>
            </div>
        </div>
    </footer>
  `;
}