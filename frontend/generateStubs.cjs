const fs = require('fs');
const path = require('path');

const citizenPages = [
  'GrievanceCreationPage',
  'GrievanceListPage',
  'GrievanceTrackingHubPage',
  'GrievanceTimelinePage',
  'GrievanceRespondPage',
  'GrievanceEvidencePage',
  'GrievanceEscalatePage',
  'GrievanceResolutionPage',
  'GrievanceReopenPage',
  'GrievanceAppealPage',
  'GrievanceFeedbackPage',
  'GrievanceDownloadPage'
];

const officerPages = [
  'OfficerGrievanceOverviewPage',
  'OfficerGrievanceQueuePage',
  'OfficerGrievanceReviewPage',
  'OfficerGrievanceNotesPage',
  'OfficerGrievanceRequestsPage',
  'OfficerGrievanceResolutionPage',
  'OfficerGrievanceAuditPage',
  'OfficerGrievanceWorkloadPage',
  'OfficerGrievanceNotificationsPage'
];

const adminPages = [
  'GrievanceAdminOverviewPage',
  'GrievanceCategoryManagementPage',
  'GrievanceSlaManagementPage',
  'GrievanceEscalationRulesPage',
  'GrievanceOfficerManagementPage',
  'GrievanceAnalyticsPage',
  'GrievanceAuditLogPage'
];

const createStubs = (dir, files) => {
  files.forEach(file => {
    const filePath = path.join(__dirname, 'src/pages', dir, file + '.jsx');
    const content = `import React from 'react';\n\nconst ${file} = () => <div className="p-8 text-xl">${file} - Coming Soon</div>;\n\nexport default ${file};\n`;
    fs.writeFileSync(filePath, content);
  });
};

createStubs('grievances', citizenPages);
createStubs('officer/grievances', officerPages);
createStubs('admin/grievances', adminPages);
console.log('Stubs created successfully');
