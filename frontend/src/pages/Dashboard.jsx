import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink,
  Mic,
  Volume2,
  Sparkles,
  Sprout,
  GraduationCap,
  Home,
  HeartPulse,
  FileCheck,
  Megaphone
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { Badge } from '../components/common/Badge';

export function Dashboard() {
  const navigate = useNavigate();
  const { applications, complaints } = useAdminData();
  const { user } = useAdminAuth();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'applications', 'complaints'
  const [searchTerm, setSearchTerm] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Audio Readout (TTS) for rural citizens
  const speakSummary = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const text = `Namaste ${user?.name || 'Citizen'}. You have ${totalApplications} scheme applications and ${totalComplaints} registered complaints. Click any category card to apply for government welfare services.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Filter items belonging to logged in citizen using Gmail address foreign key
  const isMine = (item) => {
    if (!user || !user.email) return true;
    const uEmail = (user.email || '').toLowerCase().trim();
    const uName = (user.name || '').toLowerCase().trim();
    const uPrefix = uEmail.split('@')[0];

    const cEmail = (item.citizen_email || item.citizenEmail || '').toLowerCase().trim();
    const cName = (item.citizen_name || item.citizenName || '').toLowerCase().trim();

    return (cEmail && cEmail === uEmail) || (cName && cName === uName) || (cName && uPrefix && cName.includes(uPrefix));
  };

  const userApplications = (applications || []).filter(isMine);
  const userComplaints = (complaints || []).filter(isMine);

  // Summary metrics for citizen
  const totalApplications = userApplications.length;
  const pendingApplications = userApplications.filter(a => (a.status || '').toLowerCase().includes('progress') || (a.status || '').toLowerCase().includes('pending')).length;
  const approvedApplications = userApplications.filter(a => a.status === 'Approved').length;

  const totalComplaints = userComplaints.length;
  const openComplaints = userComplaints.filter(c => (c.status || '').toLowerCase().includes('progress') || (c.status || '').toLowerCase().includes('open')).length;
  const resolvedComplaints = userComplaints.filter(c => c.status === 'Resolved').length;

  // Visual Category Cards for Rural Citizens
  const categoryCards = [
    { title: 'Agriculture & Farmers', icon: Sprout, color: 'from-amber-600 to-amber-800', desc: 'Crop relief, PM-Kisan, Irrigation grants', link: '/citizens' },
    { title: 'Student & Education', icon: GraduationCap, color: 'from-blue-600 to-blue-800', desc: 'Scholarships, Migration certificates', link: '/citizens' },
    { title: 'Housing & Sanitation', icon: Home, color: 'from-orange-600 to-orange-800', desc: 'PMAY Awas, Toilet construction relief', link: '/citizens' },
    { title: 'Health & Ayushman', icon: HeartPulse, color: 'from-emerald-600 to-emerald-800', desc: 'Ayushman Gold card, Medical aid', link: '/citizens' },
    { title: 'Certificates & Income', icon: FileCheck, color: 'from-purple-600 to-purple-800', desc: 'Income, Caste, Domicile certificates', link: '/citizens' },
    { title: 'Public Grievances', icon: Megaphone, color: 'from-red-600 to-red-800', desc: 'Report village issues, Water/Road help', link: '/complaints' },
  ];

  const filteredApplications = userApplications.filter(a =>
    !searchTerm || (a.citizenName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (a.schemeName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (a.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredComplaints = userComplaints.filter(c =>
    !searchTerm || (c.citizen_name || c.citizenName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (c.what_happend || '').toLowerCase().includes(searchTerm.toLowerCase()) || String(c.id).includes(searchTerm)
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      
      {/* Rural Hero Banner with Voice Search */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-secondary rounded-3xl p-6 md:p-8 text-on-primary shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-amber-950 shadow-xs flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-orange-500 via-white to-green-700 border border-black/20" />
                  <span>{t('Citizen Portal')} • Jan Sewa</span>
                </span>
                <button
                  type="button"
                  onClick={speakSummary}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold backdrop-blur-md transition-all cursor-pointer ${
                    isSpeaking ? 'bg-emerald-400 text-emerald-950 animate-pulse' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? 'Speaking...' : t('Listen Instructions')}</span>
                </button>
              </div>
              <h1 className="font-heading text-2xl md:text-4xl font-extrabold tracking-tight mt-2 text-white">
                Namaste, {user?.name || 'Citizen'}!
              </h1>
              <p className="text-on-primary/90 text-sm md:text-base font-semibold mt-1 max-w-2xl">
                {t('Manage scheme applications and public grievance complaints in one unified portal.')}
              </p>
            </div>

            {/* Voice Search Button Trigger */}
            <button
              onClick={() => navigate('/citizens')}
              className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2.5 cursor-pointer rural-touch-target active:scale-95 transition-all border border-emerald-400 rural-voice-active"
            >
              <Mic className="w-5 h-5 animate-bounce" />
              <span>{t('Bol Kar Sewa Paayein')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Big Visual Category Cards for Rural Citizens */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-extrabold text-on-surface flex items-center gap-2">
            <span>{t('Schemes & Services')} / मुख्य सेवाएं</span>
          </h2>
          <span className="text-xs font-bold text-primary">Click any card to apply</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryCards.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(cat.link)}
                className="p-5 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant/60 hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-lg group flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                      {t(cat.title)}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium line-clamp-1">{cat.desc}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30 text-xs font-extrabold text-primary">
                  <span>Apply / आवेदन करें</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 Core Metric Cards (Applications & Complaints) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Applications Card */}
        <div 
          onClick={() => setActiveTab(activeTab === 'applications' ? 'all' : 'applications')}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${
            activeTab === 'applications' 
              ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/30' 
              : 'bg-surface-container-lowest border-outline-variant/60 hover:border-emerald-500'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 font-bold">
              <FileText className="w-6 h-6 text-emerald-800" />
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/applications'); }}
              className="text-xs font-extrabold text-emerald-800 hover:underline flex items-center gap-1"
            >
              {t('View Tab')} <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">{t('Scheme Applications')}</span>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-extrabold text-primary">{totalApplications}</h2>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                {pendingApplications} {t('In Progress')}
              </span>
            </div>
            <p className="text-xs font-bold text-emerald-700 pt-1">{approvedApplications} {t('applications approved')}</p>
          </div>
        </div>

        {/* Complaints Card */}
        <div 
          onClick={() => setActiveTab(activeTab === 'complaints' ? 'all' : 'complaints')}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${
            activeTab === 'complaints' 
              ? 'bg-amber-50/90 border-amber-600 ring-2 ring-amber-500/30' 
              : 'bg-surface-container-lowest border-outline-variant/60 hover:border-amber-500'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-800 font-bold">
              <Megaphone className="w-6 h-6 text-amber-800" />
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/complaints'); }}
              className="text-xs font-extrabold text-amber-800 hover:underline flex items-center gap-1"
            >
              {t('View Tab')} <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">{t('Citizen Complaints')}</span>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-extrabold text-primary">{totalComplaints}</h2>
              <span className="text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                {openComplaints} {t('Pending')}
              </span>
            </div>
            <p className="text-xs font-bold text-amber-800 pt-1">{resolvedComplaints} {t('grievances resolved')}</p>
          </div>
        </div>

      </div>

      {/* Main Content Panels Section (Applications & Complaints) */}
      <div className="space-y-8">

        {/* 1. APPLICATIONS TAB CONTENT PANEL */}
        {(activeTab === 'all' || activeTab === 'applications') && (
          <div className="bg-surface-container-lowest rounded-2xl border-2 border-outline-variant/60 shadow-sm overflow-hidden">
            <div className="p-5 bg-emerald-50/70 border-b border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-700 text-white font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-extrabold text-primary">{t('Applications Tab Overview')}</h2>
                  <p className="text-xs text-on-surface-variant font-bold">{t('Submitted scheme applications and review status')}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/applications')}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto rural-touch-target"
              >
                {t('Go to Applications Tab')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {filteredApplications.slice(0, 5).map((app, idx) => (
                  <div 
                    key={app.id || idx}
                    onClick={() => navigate('/applications')}
                    className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:border-emerald-500 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-primary px-2.5 py-0.5 rounded-lg bg-surface-container-high">
                          {app.id}
                        </span>
                        <h4 className="font-bold text-sm text-on-surface group-hover:text-emerald-700 transition-colors">
                          {app.schemeName || app.serviceName || 'Welfare Scheme'}
                        </h4>
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-1 font-medium">
                        {t('Citizen')}: <span className="font-bold text-on-surface">{app.citizenName || 'Citizen User'}</span> • {app.details || app.what_happend || 'Application submitted'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <Badge>{t(app.status || 'In Progress')}</Badge>
                      <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        {t('Track')} <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. COMPLAINTS TAB CONTENT PANEL */}
        {(activeTab === 'all' || activeTab === 'complaints') && (
          <div className="bg-surface-container-lowest rounded-2xl border-2 border-outline-variant/60 shadow-sm overflow-hidden">
            <div className="p-5 bg-amber-50/70 border-b border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-700 text-white font-bold">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-extrabold text-primary">{t('Complaints Tab Overview')}</h2>
                  <p className="text-xs text-on-surface-variant font-bold">{t('Public grievance reports and resolution tracking')}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/complaints')}
                className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-extrabold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto rural-touch-target"
              >
                {t('Go to Complaints Tab')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {filteredComplaints.slice(0, 5).map((comp, idx) => (
                  <div 
                    key={comp.id || idx}
                    onClick={() => navigate('/complaints')}
                    className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:border-amber-500 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-amber-900 px-2.5 py-0.5 rounded-lg bg-amber-100">
                          CMP-{comp.id}
                        </span>
                        <h4 className="font-bold text-sm text-on-surface group-hover:text-amber-800 transition-colors">
                          {comp.citizen_name || comp.citizenName || 'Citizen Grievance'}
                        </h4>
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-1 font-medium">
                        {comp.what_happend || comp.description || 'Public complaint registered'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <Badge>{t(comp.status || 'In Progress')}</Badge>
                      <span className="text-xs font-extrabold text-amber-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        {t('Resolve')} <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;
