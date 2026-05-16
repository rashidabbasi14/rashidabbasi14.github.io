// Project index - exports project filenames (without .js extension)
const projectFiles = [
  'project1',
  'project2',
  'project3',
  'project4',
  'project5'
];

// Function to get all project filenames
function getProjectFiles() {
  return projectFiles;
}

// Function to get project filenames with full path
function getProjectFilePaths() {
  return projectFiles.map(file => `js/data/projects/${file}.js`);
}