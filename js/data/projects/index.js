// Project index - exports project filenames (without .js extension)
const projectFiles = [
  'WEBHR_mobile_application',
  'SL_dmt_conversion',
  'QCEPTS_american_bank_loan',
  'FFC_asset_management_system', 
  'FAST_FYP_culprit_tracking_system',
  'FAST_inventory_management',
  'FAST_timetable_notifier',
  'PROJECT_polling',
  'PROJECT_split_wiser',
  'PROJECT_pakistan_investment_analytics',
  'PROJECT_income_tax_calculator',
  'PROJECT_menu',
  'CN_jira_techspec_automation',
  'CN_codeninja_hub',
  'rashidabbasi14_github_io',
  'PROJECT_vendure'
];

// Function to get all project filenames
function getProjectFiles() {
  return projectFiles;
}

// Function to get project filenames with full path
function getProjectFilePaths() {
  return projectFiles.map(file => `js/data/projects/${file}.js`);
}