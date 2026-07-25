/**
 * Simple multilingual dictionary to ensure frontend-only explainability 
 * without requiring heavy i18n frameworks in this phase.
 */

export const assistanceContentRegistry = {
  en: {
    'assistance.citizen.draftReminder.title': 'Continue Draft Application',
    'assistance.citizen.draftReminder.desc': 'You have an incomplete application saved. Would you like to resume?',
    'assistance.citizen.draftReminder.explanation': 'Shown because your draft was last updated less than 7 days ago.',
    
    'assistance.citizen.precheck.title': 'Demo Eligibility Pre-check',
    'assistance.citizen.precheck.desc': 'Based on your selected profile, you might qualify for this scheme.',
    'assistance.citizen.precheck.explanation': 'Shown because the selected service matches your mock age profile.',
    'assistance.citizen.precheck.disclaimer': 'This result is based only on locally configured demonstration rules and is not an official eligibility decision.',
    
    'assistance.officer.reviewPending.title': 'Cases Require Review',
    'assistance.officer.reviewPending.desc': 'There are applications waiting in your queue.',
    'assistance.officer.reviewPending.explanation': 'Shown because you have cases marked as "In Progress" or "Needs Attention".',
    
    'assistance.common.missingFields.title': 'Missing Information',
    'assistance.common.missingFields.desc': 'Some required fields are missing before you can submit.',
    'assistance.common.missingFields.explanation': 'Shown because the current form section is incomplete.',
    
    'assistance.action.resume': 'Resume Draft',
    'assistance.action.review': 'Review Now',
    'assistance.action.dismiss': 'Dismiss',
    
    'assistance.diagnostic.noRulesMatched': 'No active guidance suggestions at the moment.'
  },
  hi: {
    'assistance.citizen.draftReminder.title': 'अपूर्ण आवेदन जारी रखें',
    'assistance.citizen.draftReminder.desc': 'आपका एक अधूरा आवेदन सहेजा गया है। क्या आप जारी रखना चाहेंगे?',
    'assistance.citizen.draftReminder.explanation': 'यह इसलिए दिखाया गया है क्योंकि आपका ड्राफ्ट हाल ही में अपडेट किया गया था।',
    'assistance.citizen.precheck.title': 'डेमो पात्रता प्री-चेक',
    'assistance.common.missingFields.title': 'अपूर्ण जानकारी',
    'assistance.diagnostic.noRulesMatched': 'इस समय कोई सक्रिय मार्गदर्शन नहीं है।'
  },
  mr: {
    'assistance.citizen.draftReminder.title': 'अपूर्ण अर्ज सुरू ठेवा',
    'assistance.citizen.draftReminder.desc': 'तुमचा एक अपूर्ण अर्ज सेव्ह केला आहे. तुम्ही पुढे चालू ठेवू इच्छिता का?',
    'assistance.citizen.draftReminder.explanation': 'हा दाखवला आहे कारण तुमचा मसुदा अलीकडेच अद्यतनित केला गेला होता.',
    'assistance.citizen.precheck.title': 'डेमो पात्रता पूर्व-तपासणी',
    'assistance.common.missingFields.title': 'अपूर्ण माहिती',
    'assistance.diagnostic.noRulesMatched': 'सध्या कोणतेही सक्रिय मार्गदर्शन नाही.'
  }
};

export const translateAssistanceKey = (key, language = 'en') => {
  const dictionary = assistanceContentRegistry[language] || assistanceContentRegistry['en'];
  return dictionary[key] || assistanceContentRegistry['en'][key] || key;
};
