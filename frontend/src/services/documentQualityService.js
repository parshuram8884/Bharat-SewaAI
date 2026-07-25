// Document Quality Checking Service for Phase 7

export function analyzeDocumentQuality(fileMetadata = {}) {
  const checks = [
    { id: 'blur', label: 'Image Clarity & Sharpness', status: 'pass', message: 'Text is sharp and readable.' },
    { id: 'lighting', label: 'Lighting & Brightness', status: 'pass', message: 'Even exposure detected.' },
    { id: 'crop', label: 'Edge Detection', status: 'pass', message: 'All four document borders visible.' },
    { id: 'resolution', label: 'Resolution', status: 'pass', message: 'High resolution (300 DPI equivalent).' }
  ];

  // Simulating checks based on file name or simulated flag
  const name = (fileMetadata.fileName || '').toLowerCase();

  let overallStatus = 'good';
  let score = 92;
  let canContinue = true;
  const recommendations = [];

  if (name.includes('blur') || name.includes('poor')) {
    overallStatus = 'poor';
    score = 35;
    canContinue = false;
    checks[0] = { id: 'blur', label: 'Image Clarity & Sharpness', status: 'fail', message: 'Text appears blurry and unreadable.' };
    recommendations.push('Retake image under bright lighting without moving the camera.');
  } else if (name.includes('dark') || name.includes('glare') || name.includes('warning')) {
    overallStatus = 'warning';
    score = 68;
    canContinue = true;
    checks[1] = { id: 'lighting', label: 'Lighting & Brightness', status: 'warning', message: 'Slight glare detected near document top edge.' };
    recommendations.push('Ensure light source is not reflecting directly onto glossy paper.');
  }

  return {
    overallStatus,
    score,
    checks,
    recommendations,
    canContinue
  };
}
