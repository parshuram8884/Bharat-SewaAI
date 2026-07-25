export const DataQualityRuleModel = {
  id: '',
  code: '',
  description: '',
  severity: '', // info, warning, high, critical
  domain: '',
  active: true
};

export const DataQualityIssueModel = {
  id: '',
  ruleId: '',
  recordId: '',
  recordType: '',
  details: '',
  status: '', // open, acknowledged, investigating, resolved-demo, ignored-with-reason, reopened
  history: [], // append-only log of status changes
  createdAt: '',
  updatedAt: ''
};
