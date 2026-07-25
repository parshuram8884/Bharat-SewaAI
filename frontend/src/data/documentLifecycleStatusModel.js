export const DocumentLifecycleStatus = {
  DRAFT: 'draft',
  UPLOADED: 'uploaded',
  OCR_PROCESSING: 'ocr-processing',
  OCR_COMPLETE: 'ocr-complete',
  ARCHIVED: 'archived'
};

export const DocumentLifecycleStatusLabels = {
  [DocumentLifecycleStatus.DRAFT]: 'Draft',
  [DocumentLifecycleStatus.UPLOADED]: 'Uploaded',
  [DocumentLifecycleStatus.OCR_PROCESSING]: 'Processing OCR',
  [DocumentLifecycleStatus.OCR_COMPLETE]: 'Ready for Verification',
  [DocumentLifecycleStatus.ARCHIVED]: 'Archived'
};
