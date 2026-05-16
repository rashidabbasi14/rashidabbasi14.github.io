// Project index - exports all projects
const allProjects = [
  { id: 1, title: "Fintech API Integration", subtitle: "Banking systems automation", description: "Designed and optimized API layers for real-time banking operations with strong security and compliance controls.", image: "https://presentationstemplate.com/wp-content/uploads/2023/09/Software-project-Proposal.jpg", tags: [".NET Core", "SQL Server", "API"] },
  { id: 2, title: "SaaS Dashboard Platform", subtitle: "Real-time analytics dashboard", description: "Implemented a monitoring dashboard that visualizes usage metrics and performance for distributed services.", image: "https://blog.masterofproject.com/wp-content/uploads/2019/10/project-plan-example-2.jpg", tags: ["React", "Node.js", "Azure"] },
  { id: 3, title: "AI Insights Pipeline", subtitle: "Predictive transaction analytics", description: "Built a data pipeline and dashboard to surface predictive insights from large-scale transaction datasets.", image: "https://img.freepik.com/free-photo/document-marketing-strategy-business-concept_53876-132231.jpg?semt=ais_hybrid&w=740&q=80", tags: ["Python", "Machine Learning", "Kafka"] },
  { id: 4, title: "AI Insights Pipeline", subtitle: "Predictive transaction analytics", description: "Built a data pipeline and dashboard to surface predictive insights from large-scale transaction datasets.", image: "https://img.freepik.com/free-photo/document-marketing-strategy-business-concept_53876-132231.jpg?semt=ais_hybrid&w=740&q=80", tags: ["Python", "Machine Learning", "Kafka"] }
];

// Function to get project by ID
function getProjectById(id) {
  return allProjects.find(p => p.id === id);
}

// Function to get all projects
function getAllProjects() {
  return allProjects;
}