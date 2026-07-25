import { AssistanceRuleModel } from '../models/assistanceModels';
import { predicates } from './predicates/predicates';

export const commonRules = [
  AssistanceRuleModel.create({
    id: 'common_missing_fields_001',
    version: '1.0.0',
    name: 'assistance.common.missingFields.title',
    descriptionKey: 'assistance.common.missingFields.desc',
    explanationKey: 'assistance.common.missingFields.explanation',
    category: 'validation',
    priority: 'high',
    blocking: true,
    dismissible: false,
    condition: (context) => predicates.hasMissingFields(context),
    resultType: 'blocking-requirement'
  })
];

export const citizenRules = [
  AssistanceRuleModel.create({
    id: 'citizen_draft_reminder_001',
    version: '1.0.0',
    name: 'assistance.citizen.draftReminder.title',
    descriptionKey: 'assistance.citizen.draftReminder.desc',
    explanationKey: 'assistance.citizen.draftReminder.explanation',
    category: 'guidance',
    module: 'applications',
    roles: ['citizen'],
    priority: 'medium',
    actionKey: 'assistance.action.resume',
    condition: (context) => predicates.isRole(context, 'citizen') && predicates.hasDraftOlderThan(context, 1),
    resultType: 'guidance'
  }),
  AssistanceRuleModel.create({
    id: 'citizen_eligibility_precheck_001',
    version: '1.0.0',
    name: 'assistance.citizen.precheck.title',
    descriptionKey: 'assistance.citizen.precheck.desc',
    explanationKey: 'assistance.citizen.precheck.explanation',
    category: 'eligibility',
    module: 'schemes',
    roles: ['citizen'],
    priority: 'informational',
    actionKey: 'assistance.action.review',
    featureFlag: 'enable-demo-eligibility-precheck',
    condition: (context) => predicates.isRole(context, 'citizen') && context.module === 'schemes',
    resultType: 'eligibility-precheck'
  })
];
