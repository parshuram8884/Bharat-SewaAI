import { componentRegistry } from '../design-system/registry/componentRegistry';
import { componentUsageRegistry } from '../design-system/registry/componentUsageRegistry';

class DesignSystemDiagnosticsService {
  runDiagnostics() {
    const issues = [];
    
    // Check for deprecated components
    componentUsageRegistry.legacy.forEach(legacy => {
      issues.push({
        id: `legacy-${legacy.componentName}`,
        type: 'deprecation',
        message: `Deprecated component ${legacy.componentName} is still in use. Replace with ${legacy.replacementId}.`,
        severity: 'warning'
      });
    });

    // We can simulate missing documentation or incomplete states
    Object.values(componentRegistry).forEach(comp => {
      if (comp.status === 'experimental') {
        issues.push({
          id: `exp-${comp.id}`,
          type: 'readiness',
          message: `Component ${comp.id} is marked as experimental and may have breaking changes.`,
          severity: 'info'
        });
      }
    });

    return issues;
  }
}

export const designSystemDiagnosticsService = new DesignSystemDiagnosticsService();
