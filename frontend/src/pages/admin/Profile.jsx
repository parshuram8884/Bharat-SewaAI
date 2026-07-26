import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Globe, 
  CheckCircle2, 
  Save, 
  Shield, 
  FileText, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export function Profile() {
  const { user, updateUserProfile } = useAdminAuth();
  const { applications, complaints } = useAdminData();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [name, setName] = useState(user?.name || 'Citizen User');
  const [language, setLanguage] = useState(user?.language || 'English');
  const [isSaving, setIsSaving] = useState(false);

  // Filter user applications & complaints by Gmail address
  const uEmail = (user?.email || '').toLowerCase().trim();
  const uName = (user?.name || '').toLowerCase().trim();
  const uPrefix = uEmail.split('@')[0];

  const isMine = (item) => {
    if (!user || !user.email) return true;
    const cEmail = (item.citizen_email || item.citizenEmail || '').toLowerCase().trim();
    const cName = (item.citizen_name || item.citizenName || '').toLowerCase().trim();
    return (cEmail && cEmail === uEmail) || (cName && cName === uName) || (cName && uPrefix && cName.includes(uPrefix));
  };

  const myApps = (applications || []).filter(isMine);
  const myComps = (complaints || []).filter(isMine);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile({ name, language });
      showToast('Profile updated successfully! Working language set to ' + language, 'success');
    } catch (err) {
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const languagesList = [
    { code: 'English', label: 'English' },
    { code: 'Hindi', label: 'Hindi (हिंदी)' },
    { code: 'Marathi', label: 'Marathi (मराठी)' },
    { code: 'Gujarati', label: 'Gujarati (ગુજરાતી)' },
    { code: 'Bengali', label: 'Bengali (বাংলা)' },
    { code: 'Tamil', label: 'Tamil (தமிழ்)' },
    { code: 'Telugu', label: 'Telugu (తెలుగు)' }
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-secondary-container rounded-2xl p-6 md:p-8 text-on-primary shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-2xl font-bold shrink-0 shadow-md">
            {user?.avatar ? (
              <img src={user.avatar} alt="User Profile" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <span>{(user?.name || 'CU').substring(0, 2).toUpperCase()}</span>
            )}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight text-white truncate">
                {user?.name || 'Citizen User'}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit mx-auto sm:mx-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Citizen
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-on-primary/90 font-medium pt-1">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg border border-white/15">
                <Mail className="w-4 h-4 text-emerald-300" />
                <span className="font-semibold">{user?.email || 'citizen@gmail.com'}</span>
              </span>

              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg border border-white/15">
                <Globe className="w-4 h-4 text-blue-300" />
                Working Language: <span className="font-bold text-white">{user?.language || 'English'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Profile Form & Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Edit Profile & Language Selection */}
        <div className="lg:col-span-7 space-y-6">
          <Card title={t('Citizen Profile & Language Preferences')}>
            <form onSubmit={handleSaveProfile} className="space-y-5">
              
              {/* Gmail Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant uppercase">
                  {t('Signed-In Gmail Address')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/70" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || 'citizen@gmail.com'}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant/60 bg-surface-container-low text-sm font-bold text-on-surface cursor-not-allowed opacity-90"
                  />
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  {t('Your applications and grievance tickets are tied to this Gmail address.')}
                </p>
              </div>

              {/* Citizen Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-xs font-bold text-on-surface-variant uppercase">
                  {t('Full Name')}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/70" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              {/* Working Language Selection */}
              <div className="space-y-1.5">
                <label htmlFor="language" className="block text-xs font-bold text-on-surface-variant uppercase">
                  {t('Working Language (Voice & AI Assistant)')}
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/70" />
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer appearance-none"
                  >
                    {languagesList.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  {t('The Sewa AI voice assistant will speak and process requests in your selected working language.')}
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-outline-variant/30 flex justify-end">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSaving}
                  className="font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? t('Saving Updates...') : t('Save Profile Changes')}</span>
                </Button>
              </div>

            </form>
          </Card>
        </div>

        {/* Right Column: Account Stats & Security Info */}
        <div className="lg:col-span-5 space-y-6">
          <Card title={t('Activity & Linked Account Records')}>
            <div className="space-y-4">
              
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-600 text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-emerald-950">{t('Submitted Applications')}</h5>
                    <p className="text-xs text-emerald-700 font-medium">{t('Bound to your Gmail key')}</p>
                  </div>
                </div>
                <span className="text-2xl font-extrabold text-emerald-800">{myApps.length}</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-amber-600 text-white">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-amber-950">{t('Registered Complaints')}</h5>
                    <p className="text-xs text-amber-700 font-medium">{t('Public grievance reports')}</p>
                  </div>
                </div>
                <span className="text-2xl font-extrabold text-amber-800">{myComps.length}</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>{t('Aadhaar & e-KYC Verification')}</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  {t('Your profile is verified and linked to DigiLocker for automated OCR document verification.')}
                </p>
              </div>

            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}

export default Profile;
