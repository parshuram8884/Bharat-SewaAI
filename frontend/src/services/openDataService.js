import { analyticsDemoDataService } from './analyticsDemoDataService';

export const openDataService = {
  getOpenDataCatalogue() {
    return analyticsDemoDataService.getStore().openDataDatasets;
  },
  
  createOpenDataDatasetDraft(data) {
    const store = analyticsDemoDataService.getStore();
    const newDataset = {
      ...data,
      id: `BSAI-ODS-${Date.now()}`,
      publicationStatus: 'draft',
      publishedVersion: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.openDataDatasets.push(newDataset);
    analyticsDemoDataService.saveStore(store);
    return newDataset;
  },

  submitOpenDataForPrivacyReview(datasetId) {
    const store = analyticsDemoDataService.getStore();
    const ds = store.openDataDatasets.find(d => d.id === datasetId);
    if (ds) {
      ds.publicationStatus = 'privacy-review';
      ds.updatedAt = new Date().toISOString();
      analyticsDemoDataService.saveStore(store);
    }
  },

  completePrivacyReview(datasetId, reviewerId, decision) {
    const store = analyticsDemoDataService.getStore();
    const ds = store.openDataDatasets.find(d => d.id === datasetId);
    if (ds) {
      const review = {
        id: `BSAI-ODV-${Date.now()}`,
        datasetId,
        reviewedBy: reviewerId,
        finalDecision: decision,
        reviewedAt: new Date().toISOString()
      };
      store.openDataPrivacyReviews.push(review);
      ds.publicationStatus = decision === 'approved' ? 'approval-pending' : 'returned-for-correction';
      ds.updatedAt = new Date().toISOString();
      analyticsDemoDataService.saveStore(store);
    }
  },

  approveOpenDataDataset(datasetId, approverId) {
    const store = analyticsDemoDataService.getStore();
    const ds = store.openDataDatasets.find(d => d.id === datasetId);
    if (ds) {
      // Maker-checker enforcement
      const review = store.openDataPrivacyReviews.find(r => r.datasetId === datasetId);
      if (review && review.reviewedBy === approverId) {
          throw new Error("Maker-checker violation: Reviewer cannot approve their own review.");
      }
      ds.publicationStatus = 'approved';
      ds.updatedAt = new Date().toISOString();
      analyticsDemoDataService.saveStore(store);
    }
  },

  publishOpenDataDatasetDemo(datasetId) {
    const store = analyticsDemoDataService.getStore();
    const ds = store.openDataDatasets.find(d => d.id === datasetId);
    if (ds && ds.publicationStatus === 'approved') {
      ds.publicationStatus = 'published-demo';
      ds.publishedVersion += 1;
      ds.lastPublishedAt = new Date().toISOString();
      ds.updatedAt = new Date().toISOString();
      analyticsDemoDataService.saveStore(store);
    }
  }
};
