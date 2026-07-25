export const OpenDataDatasetModel = {
  id: '',
  title: '',
  description: '',
  domain: '',
  ownerDepartmentId: '',
  metricIds: [],
  dimensions: [],
  filters: {},
  refreshFrequency: '',
  licenceType: '',
  privacyReviewStatus: '', 
  publicationStatus: '', // draft, validation-pending, privacy-review, approval-pending, approved, published-demo, rejected, returned-for-correction, suspended, archived
  publishedVersion: 0,
  lastPublishedAt: '',
  downloadCountMock: 0,
  createdAt: '',
  updatedAt: ''
};

export const OpenDataPrivacyReviewModel = {
  id: '',
  datasetId: '',
  datasetVersion: 0,
  reviewedBy: '',
  minimumGroupSizeVerified: false,
  identifierRemovalVerified: false,
  freeTextRemovalVerified: false,
  dimensionRiskVerified: false,
  complementaryDisclosureVerified: false,
  dataQualityVerified: false,
  finalDecision: '',
  notes: '',
  reviewedAt: ''
};
