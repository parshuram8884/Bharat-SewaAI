import React from 'react';
import { PageHeader } from '../../design-system/patterns/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardSubtitle } from '../../design-system/components/Card';
import { Typography } from '../../design-system/foundations/Typography';
import { Icon } from '../../design-system/foundations/Icon';

export default function DesignSystemOverviewPage() {
  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="Design System Overview" 
        subtitle="Frontend guidelines and standardisation for Bharat Sewa AI (Phase 18)" 
        className="px-0 pt-0 pb-6 border-b-0 bg-transparent -mx-4 md:-mx-8 mb-6"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card interactive>
          <CardHeader>
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-2">
              <Icon name="Component" />
            </div>
            <CardTitle>Components</CardTitle>
            <CardSubtitle>Reusable standard components</CardSubtitle>
          </CardHeader>
          <CardContent>
            <Typography variant="bodySmall" className="text-[var(--ds-color-text-secondary)]">
              Browse the catalogue of buttons, inputs, cards and other standard components.
            </Typography>
          </CardContent>
        </Card>

        <Card interactive>
          <CardHeader>
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-2">
              <Icon name="ArrowRightLeft" />
            </div>
            <CardTitle>Migration Tracker</CardTitle>
            <CardSubtitle>Track standardisation progress</CardSubtitle>
          </CardHeader>
          <CardContent>
            <Typography variant="bodySmall" className="text-[var(--ds-color-text-secondary)]">
              View deprecated components and migration coverage across the application.
            </Typography>
          </CardContent>
        </Card>

        <Card interactive>
          <CardHeader>
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-2">
              <Icon name="Stethoscope" />
            </div>
            <CardTitle>Diagnostics</CardTitle>
            <CardSubtitle>Code quality and rules</CardSubtitle>
          </CardHeader>
          <CardContent>
            <Typography variant="bodySmall" className="text-[var(--ds-color-text-secondary)]">
              Run automated checks to find deprecated usages and invalid prop combinations.
            </Typography>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Typography variant="h3" className="mb-4">Principles</Typography>
        <div className="bg-[var(--ds-color-surface-default)] p-6 rounded-lg border border-[var(--ds-color-border-default)]">
          <ul className="space-y-4">
            <li className="flex gap-3">
              <Icon name="CheckCircle2" className="text-[var(--ds-color-success-default)] shrink-0" />
              <div>
                <Typography variant="label">Preserve Functionality</Typography>
                <Typography variant="bodySmall" className="text-[var(--ds-color-text-secondary)] mt-1">Do not rewrite working screens unnecessarily. Extract reusable patterns incrementally.</Typography>
              </div>
            </li>
            <li className="flex gap-3">
              <Icon name="CheckCircle2" className="text-[var(--ds-color-success-default)] shrink-0" />
              <div>
                <Typography variant="label">Accessibility First</Typography>
                <Typography variant="bodySmall" className="text-[var(--ds-color-text-secondary)] mt-1">Components must support keyboard navigation, high contrast, and reduced motion.</Typography>
              </div>
            </li>
            <li className="flex gap-3">
              <Icon name="CheckCircle2" className="text-[var(--ds-color-success-default)] shrink-0" />
              <div>
                <Typography variant="label">Composition over Configuration</Typography>
                <Typography variant="bodySmall" className="text-[var(--ds-color-text-secondary)] mt-1">Avoid over-engineering. Use standard HTML semantics where possible.</Typography>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
