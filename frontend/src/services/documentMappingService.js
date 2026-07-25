// Document Mapping & Conflict Detection Service for Phase 7

import { getMappingsForDocumentType } from '../data/documentApplicationMappings';

export function transformExtractedValue(value, transformation) {
  if (value === undefined || value === null) return '';

  switch (transformation) {
    case 'number':
      return Number(value) || 0;
    case 'currencyNumber':
      return typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.]/g, '')) || 0;
    case 'uppercase':
      return String(value).toUpperCase();
    case 'trim':
      return String(value).trim();
    case 'maskedString':
      return String(value);
    default:
      return String(value);
  }
}

export function detectMappingConflicts(documentSession, applicationData = {}) {
  if (!documentSession || !documentSession.extractedFields) {
    return { mappings: [], conflictsCount: 0 };
  }

  const mappingRules = getMappingsForDocumentType(documentSession.documentType);
  const formData = applicationData.formData || {};

  const mappings = mappingRules.map((rule) => {
    const extField = documentSession.extractedFields.find((f) => f.key === rule.sourceFieldKey);
    const rawExtValue = extField ? extField.correctedValue : '';
    const transformedExtValue = transformExtractedValue(rawExtValue, rule.transformation);
    const currentAppValue = formData[rule.targetFieldId];

    let conflictType = null;
    let conflictMessage = null;

    if (currentAppValue !== undefined && currentAppValue !== null && currentAppValue !== '' && String(currentAppValue) !== String(transformedExtValue)) {
      conflictType = 'different-value';
      conflictMessage = `Extracted value (${transformedExtValue}) differs from current application value (${currentAppValue}).`;
    } else if (extField && extField.confidenceLevel === 'medium') {
      conflictType = 'low-confidence';
      conflictMessage = 'Field extracted with medium confidence. Please confirm before applying.';
    }

    return {
      rule,
      sourceFieldKey: rule.sourceFieldKey,
      sourceLabel: rule.sourceLabel,
      targetFieldId: rule.targetFieldId,
      targetLabel: rule.targetLabel,
      extractedValue: transformedExtValue,
      currentAppValue: currentAppValue !== undefined ? currentAppValue : '(Empty)',
      hasConflict: Boolean(conflictType),
      conflictType,
      conflictMessage,
      selectedDecision: conflictType ? 'keep-existing' : 'use-extracted'
    };
  });

  const conflictsCount = mappings.filter((m) => m.hasConflict).length;

  return {
    mappings,
    conflictsCount
  };
}
