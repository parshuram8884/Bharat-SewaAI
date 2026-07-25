// Independent Application Validation Module for Bharat Sewa AI Phase 6

import { SCHEME_FORM_SCHEMAS } from '../data/applicationFormSchemas';
import { MOCK_SCHEMES } from '../data/mockSchemesData';

export function validateApplication(application) {
  const errors = [];
  const warnings = [];
  const missingFields = [];
  const missingDocuments = [];
  const incompleteSections = [];

  if (!application) {
    return {
      isValid: false,
      errors: ['Application record not found.'],
      warnings: [],
      missingFields: [],
      missingDocuments: [],
      incompleteSections: []
    };
  }

  const schema = SCHEME_FORM_SCHEMAS[application.schemeId] || SCHEME_FORM_SCHEMAS['pm-kisan'];
  const formData = application.formData || {};
  const uploadedDocs = application.uploadedDocuments || [];

  // 1. Validate Form Fields
  schema.sections.forEach((sec) => {
    let sectionHasMissing = false;
    sec.fields.forEach((field) => {
      if (field.required) {
        const val = formData[field.id];
        if (val === undefined || val === null || val === '' || val === false) {
          missingFields.push(field.label || field.id);
          errors.push(`Missing required field: ${field.label}`);
          sectionHasMissing = true;
        }
      }
    });
    if (sectionHasMissing) {
      incompleteSections.push(sec.title);
    }
  });

  // 2. Validate Required Documents
  const scheme = MOCK_SCHEMES.find((s) => s.id === application.schemeId) || MOCK_SCHEMES[0];
  const reqDocs = scheme.requiredDocuments || [];

  reqDocs.forEach((docReq) => {
    const attached = uploadedDocs.find(
      (d) => d.requirementId === docReq.id || d.name.toLowerCase().includes(docReq.name.toLowerCase())
    );
    if (!attached) {
      missingDocuments.push(docReq.name);
      errors.push(`Required document missing: ${docReq.name}`);
    }
  });

  // 3. Validate Declaration
  if (!application.declaration?.confirmed) {
    errors.push('Declaration and consent checkboxes must be accepted.');
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    missingFields,
    missingDocuments,
    incompleteSections
  };
}
