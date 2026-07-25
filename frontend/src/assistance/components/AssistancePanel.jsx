import React, { useEffect, useState } from 'react';
import { useAssistanceUiStore } from '../../stores/assistanceUiStore';
import { assistanceService } from '../services/assistanceService';
import { translateAssistanceKey } from '../registries/assistanceContentRegistry';

// Using Phase 18 components implicitly (or standard HTML simulating them if imports get complex here)
import { Surface } from '../../design-system/foundations/Surface';
import { Typography } from '../../design-system/foundations/Typography';
import { Icon } from '../../design-system/foundations/Icon';
import { IconButton } from '../../design-system/components/IconButton';
import { Button } from '../../design-system/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../design-system/components/Card';

export const AssistancePanel = ({ rawState }) => {
  const { isPanelOpen, closePanel } = useAssistanceUiStore();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (isPanelOpen) {
      // Evaluate rules deterministically using mock context
      const results = assistanceService.getSuggestions(rawState || {
        role: 'citizen',
        module: 'applications',
        featureFlags: { 'enable-guided-assistance': true },
        preferences: { language: 'en' },
        draftLastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago mock
      });
      setSuggestions(results);
    }
  }, [isPanelOpen, rawState]);

  if (!isPanelOpen) return null;

  const lang = rawState?.preferences?.language || 'en';

  return (
    <Surface 
      as="aside"
      elevation="lg"
      className="fixed right-0 top-0 bottom-0 w-80 sm:w-96 border-l border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-default)] z-[var(--ds-zIndex-drawer)] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
    >
      <div className="flex items-center justify-between p-4 border-b border-[var(--ds-color-border-default)]">
        <div className="flex items-center gap-2 text-[var(--ds-color-primary-default)]">
          <Icon name="Sparkles" />
          <Typography variant="h3">Smart Assistance</Typography>
        </div>
        <IconButton icon="X" aria-label="Close assistance panel" onClick={closePanel} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {suggestions.length === 0 ? (
          <div className="text-center p-8 text-[var(--ds-color-text-muted)]">
            <Icon name="CheckCircle" className="mx-auto mb-2 opacity-50" size={32} />
            <Typography variant="bodySmall">
              {translateAssistanceKey('assistance.diagnostic.noRulesMatched', lang)}
            </Typography>
          </div>
        ) : (
          suggestions.map((sugg) => (
            <Card key={sugg.id} className={sugg.blocking ? 'border-[var(--ds-color-error-default)]' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-start gap-2">
                  {sugg.blocking ? <Icon name="AlertTriangle" className="text-[var(--ds-color-error-default)] mt-0.5" size={16} /> : <Icon name="Info" className="text-[var(--ds-color-primary-default)] mt-0.5" size={16} />}
                  {translateAssistanceKey(sugg.titleKey, lang)}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <Typography variant="bodySmall" className="text-[var(--ds-color-text-primary)]">
                  {translateAssistanceKey(sugg.descriptionKey, lang)}
                </Typography>
                
                {sugg.explanationKey && (
                  <div className="bg-[var(--ds-color-surface-muted)] p-2 rounded text-xs text-[var(--ds-color-text-secondary)] flex gap-2">
                    <Icon name="HelpCircle" size={14} className="shrink-0 mt-0.5" />
                    <span>{translateAssistanceKey(sugg.explanationKey, lang)}</span>
                  </div>
                )}
                
                {sugg.action && (
                  <div className="pt-2 flex gap-2">
                    <Button variant={sugg.blocking ? 'danger' : 'primary'} size="sm" className="w-full">
                      {translateAssistanceKey(sugg.action, lang)}
                    </Button>
                    {sugg.dismissible && (
                      <Button variant="ghost" size="sm">
                        {translateAssistanceKey('assistance.action.dismiss', lang)}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </Surface>
  );
};
