const fs = require('fs');
const path = require('path');

const citizenPages = [
  'BenefitListPage',
  'BenefitTrackingHubPage',
  'BenefitTimelinePage',
  'BenefitPaymentPage',
  'BenefitHistoryPage',
  'BenefitSanctionPage',
  'BenefitDownloadPage',
  'BenefitPaymentAdvicePage',
  'BenefitReportIssuePage',
  'BenefitIssueDetailPage'
];

const officerPages = [
  'PaymentOfficerDashboard',
  'PaymentOfficerQueue',
  'PaymentOfficerBatches',
  'PaymentOfficerBatchNew',
  'PaymentOfficerBatchDetail',
  'PaymentOfficerBatchReview',
  'PaymentOfficerPaymentDetail',
  'PaymentOfficerPaymentReview',
  'PaymentOfficerPaymentHistory',
  'PaymentOfficerPaymentNotes',
  'PaymentOfficerPaymentAudit',
  'PaymentOfficerWorkload',
  'PaymentOfficerNotifications'
];

const adminPages = [
  'PaymentAdminOverview',
  'PaymentAdminOfficers',
  'PaymentAdminBatches',
  'PaymentAdminConfig',
  'PaymentAdminFailureRules',
  'PaymentAdminRetryRules',
  'PaymentAdminAnalytics',
  'PaymentAdminAudit'
];

function createPage(dirPath, pageName) {
  const fullPath = path.join(__dirname, 'src', 'pages', dirPath, `${pageName}.jsx`);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, `import React from 'react';\n\nconst ${pageName} = () => {\n  return (\n    <div className="p-6">\n      <h1 className="text-2xl font-bold mb-4">${pageName}</h1>\n      <p>This is the ${pageName} component.</p>\n    </div>\n  );\n};\n\nexport default ${pageName};\n`);
}

citizenPages.forEach(p => createPage('benefits', p));
officerPages.forEach(p => createPage('officer/payments', p));
adminPages.forEach(p => createPage('admin/payments', p));

console.log('Pages scaffolded successfully.');
