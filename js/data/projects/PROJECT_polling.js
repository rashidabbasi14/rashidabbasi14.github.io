window.PROJECT_polling = {
  id: "PROJECT_polling",
  title: "Polling & Voting App",
  subtitle: "Secure Real-Time Opinion Gathering Engine",
  description: "A fast web-based polling mechanism using expressive backend routing to handle authenticated concurrent user voting. Focuses on absolute data accuracy, race condition prevention, and instant result charting.",
  longDescription: `
    <p>A web application built to facilitate rapid, secure opinion pooling within teams or large groups. The architectural goal was dealing cleanly with heavy write-actions during high-traffic voting spikes.</p>
    <p>Key features include:</p>
    <ul>
      <li><strong>Atomic Voting Balancers:</strong> Implements safe transaction guards to ensure individual user actions are counted accurately without race conditions under concurrency.</li>
      <li><strong>IP & User Validation Controls:</strong> Prevents vote manipulation through strict account and access validation parameters.</li>
      <li><strong>Dynamic Chart Presentation:</strong> Computes voting shares dynamically to update analytics components instantly.</li>
    </ul>
  `,
  coverImage: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80",
  images: [
    "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
  ],
  technologies: ["PHP", "Laravel", "MySQL", "JavaScript", "Chart.js"],
  projectLink: "https://github.com/rashidabbasi14/PROJECT-polling",
  liveLink: "",
  duration: "2 Weeks",
  role: "Full Stack Engineer"
};