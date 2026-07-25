import React, { useState, useEffect } from 'react';
import { User, Languages, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const LANGUAGES = [
  { id: 'English', label: 'English', native: 'English' },
  { id: 'Hindi', label: 'Hindi', native: 'हिंदी' },
  { id: 'Marathi', label: 'Marathi', native: 'मराठी' },
  { id: 'Gujarati', label: 'Gujarati', native: 'ગુજરાતી' },
  { id: 'Bengali', label: 'Bengali', native: 'বাংলা' },
  { id: 'Tamil', label: 'Tamil', native: 'தமிழ்' },
  { id: 'Telugu', label: 'Telugu', native: 'తెలుగు' },
];

export function CitizenOnboardingModal() {
  const { user, updateUserProfile } = useAdminAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || !user.email) return;
    const isCompletedLocal = localStorage.getItem(`onboarding_completed_${user.email}`) === 'true';

    // Open modal ONLY for brand new first-time users who have NEVER completed onboarding
    if (!user.hasCompletedOnboarding && !isCompletedLocal) {
      setFullName(user.name && user.name !== 'Citizen User' ? user.name : user.email.split('@')[0]);
      setSelectedLanguage(user.language || 'English');
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsSubmitting(true);
    await updateUserProfile({
      name: fullName.trim(),
      language: selectedLanguage
    });
    setIsSubmitting(false);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary-fixed/40 rounded-2xl text-primary mb-1">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-on-surface">
            Welcome to Bharat Sewa AI!
          </h2>
          <p className="text-sm font-medium text-on-surface-variant">
            Please complete your profile to customize your AI Assistant experience.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Input 1: Full Name */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary" />
              <span>Your Full Name</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rajesh Kumar"
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          {/* Input 2: Preferred Language */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-primary" />
              <span>Preferred AI Conversation Language</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary bg-primary-fixed/30 text-primary shadow-sm font-bold'
                        : 'border-outline-variant/60 bg-surface-container-low text-on-surface hover:border-primary/50'
                    }`}
                  >
                    <span className="text-xs font-bold block">{lang.label}</span>
                    <span className="text-sm font-extrabold text-primary">{lang.native}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!fullName.trim() || isSubmitting}
            className="w-full py-3.5 px-4 bg-primary hover:bg-primary-container text-on-primary font-bold text-sm rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>{isSubmitting ? 'Saving to Database...' : 'Save Profile & Start AI Assistant'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
}

export default CitizenOnboardingModal;
