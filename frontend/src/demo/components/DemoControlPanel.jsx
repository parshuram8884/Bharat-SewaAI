import React, { useState } from 'react';
import { Surface } from '../../design-system/foundations/Surface';
import { Typography } from '../../design-system/foundations/Typography';
import { Button } from '../../design-system/components/Button';
import { demoResetService } from '../services/demoResetService';
import { networkSimulationService } from '../../reliability/services/networkSimulationService';
import { Icon } from '../../design-system/foundations/Icon';

export const DemoControlPanel = () => {
  const [resetMessage, setResetMessage] = useState('');
  const [networkMode, setNetworkMode] = useState(networkSimulationService.getMode());

  const handleReset = () => {
    const result = demoResetService.resetScenarioData();
    setResetMessage(`Reset successful. Cleared ${result.keysCleared} demo records.`);
    setTimeout(() => setResetMessage(''), 3000);
  };

  const handleNetworkChange = (e) => {
    const newMode = e.target.value;
    networkSimulationService.setMode(newMode);
    setNetworkMode(newMode);
  };

  return (
    <Surface elevation="md" className="p-6 max-w-2xl mx-auto mt-10 space-y-8">
      <div className="flex items-center gap-3 border-b border-[var(--ds-color-border-default)] pb-4">
        <Icon name="Settings" size={24} className="text-[var(--ds-color-primary-default)]" />
        <Typography variant="h2">Demonstration Control Panel</Typography>
      </div>

      <div className="space-y-4">
        <Typography variant="h3">Mock Network Simulation</Typography>
        <Typography variant="bodySmall" className="text-[var(--ds-color-text-secondary)] mb-2">
          Control the simulated latency and failure rate of frontend mock API requests. Does not affect real Vite assets.
        </Typography>
        
        <select 
          value={networkMode} 
          onChange={handleNetworkChange}
          className="w-full p-2 border border-[var(--ds-color-border-default)] rounded bg-[var(--ds-color-surface-default)]"
        >
          <option value="normal">Normal (Fast local demo)</option>
          <option value="slow">Slow (Added 3s latency)</option>
          <option value="timeout">Timeout (Fails after 8s)</option>
          <option value="offline">Offline (Simulates failed connection)</option>
          <option value="intermittent-failure">Intermittent Failure (50% failure rate)</option>
        </select>
      </div>

      <div className="space-y-4 pt-4 border-t border-[var(--ds-color-border-default)]">
        <Typography variant="h3">Data Reset</Typography>
        <Typography variant="bodySmall" className="text-[var(--ds-color-text-secondary)] mb-2">
          Reset all simulated drafts and local history without losing accessibility, language, or theme preferences.
        </Typography>
        
        <Button onClick={handleReset} variant="danger">
          Reset Demonstration Data
        </Button>
        
        {resetMessage && (
          <div className="mt-2 text-sm text-[var(--ds-color-success-default)] flex items-center gap-2">
            <Icon name="CheckCircle" size={16} />
            {resetMessage}
          </div>
        )}
      </div>
    </Surface>
  );
};
