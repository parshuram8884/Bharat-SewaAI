/**
 * finalQaService.js
 * Tracks automated (build) vs manual (accessibility/responsive) mock QA runs.
 * Do not claim automated coverage for tests manually verified.
 */

export const QaChecklist = [
  {
    id: 'qa_build_1',
    category: 'build',
    title: 'Production Bundle Compilation',
    method: 'automated',
    status: 'passed',
    notes: 'vite v8.1.1 built successfully in 1.24s. Chunk warnings noted.',
    evidenceReferenceMock: 'npm run build'
  },
  {
    id: 'qa_lint_1',
    category: 'lint',
    title: 'ESLint Code Quality',
    method: 'automated',
    status: 'failed',
    notes: '340 errors (mostly unused variables), 1 warning. Not blocking for demo.',
    evidenceReferenceMock: 'npm run lint'
  },
  {
    id: 'qa_route_duplicate',
    category: 'routing',
    title: 'Duplicate Route Validation',
    method: 'automated',
    status: 'passed',
    notes: 'No overlapping static vs dynamic paths detected.',
    evidenceReferenceMock: 'routeRegistryService.findDuplicateRoutes()'
  },
  {
    id: 'qa_a11y_1',
    category: 'accessibility',
    title: 'Keyboard Navigation Review',
    method: 'manual',
    status: 'passed',
    notes: 'Accessibility readiness review completed for demonstration purposes. Focus rings visible.',
    evidenceReferenceMock: 'Manual Visual Inspection'
  },
  {
    id: 'qa_responsive_1',
    category: 'responsive',
    title: 'Mobile Viewport (360px) Review',
    method: 'manual',
    status: 'passed-with-warning',
    notes: 'Tables overflow but scroll horizontally correctly.',
    evidenceReferenceMock: 'Chrome DevTools Device Mode'
  },
  {
    id: 'qa_perf_1',
    category: 'performance',
    title: 'Lazy Loading Chunks',
    method: 'build',
    status: 'passed',
    notes: 'Largest chunk 1,030.50 kB due to mock data services included inline.',
    evidenceReferenceMock: 'npm run build analysis'
  }
];

export const finalQaService = {
  getQaChecklist() {
    return QaChecklist;
  },
  getReleaseBlockingResults() {
    return QaChecklist.filter(q => q.status === 'failed' && ['build', 'integrity'].includes(q.category));
  }
};
