export const componentUsageRegistry = {
  migrated: [],
  legacy: [
    { componentName: 'PrimaryButton', duplicateFiles: ['src/components/ui/Button.jsx'], replacementId: 'Button', notes: 'Needs adapter' },
    { componentName: 'ActionCard', duplicateFiles: ['src/components/common/ActionCard.jsx'], replacementId: 'Card', notes: 'Uses specialized props' }
  ]
};
