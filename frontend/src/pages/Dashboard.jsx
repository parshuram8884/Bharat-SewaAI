import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Badge } from '../components/common/Badge';

export function Dashboard() {
  const navigate = useNavigate();
  const { applications, complaints } = useAdminData();
  const { user } = useAdminAuth();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'applications', 'complaints'
  const [searchTerm, setSearchTerm] = useState('');
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

  // Calculate summary metrics for user
  const totalApplications = userApplications.length;
  const pendingApplications = userApplications.filter(a => (a.status || '').toLowerCase().includes('progress') || (a.status || '').toLowerCase().includes('pending')).length;
  const approvedApplications = userApplications.filter(a => a.status === 'Approved').length;

  const totalComplaints = userComplaints.length;
  const openComplaints = userComplaints.filter(c => (c.status || '').toLowerCase().includes('progress') || (c.status || '').toLowerCase().includes('open')).length;
  const resolvedComplaints = userComplaints.filter(c => c.status === 'Resolved').length;

  // Filtered lists for search
  const filteredApplications = userApplications.filter(a =>
    !searchTerm || (a.citizenName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (a.schemeName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (a.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredComplaints = userComplaints.filter(c =>
    !searchTerm || (c.citizen_name || c.citizenName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (c.what_happend || '').toLowerCase().includes(searchTerm.toLowerCase()) || String(c.id).includes(searchTerm)
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Page Banner & Header */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-secondary-container rounded-2xl p-6 md:p-8 text-on-primary shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight">
                Governance Dashboard
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
                Citizen Portal
              </span>
            </div>
            <p className="text-on-primary/80 text-sm mt-1 max-w-2xl font-medium">
              Manage scheme applications and public grievance complaints in one unified portal.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              All Panels
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'applications' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Applications ({totalApplications})
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'complaints' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" /> Complaints ({totalComplaints})
            </button>
          </div>
        </div>
      </div>

      {/* 2 Core Metric Cards (Color Panels) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Applications Card */}
        <div 
          onClick={() => setActiveTab(activeTab === 'applications' ? 'all' : 'applications')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
            activeTab === 'applications' 
              ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/30' 
              : 'bg-surface-container-lowest border-outline-variant/60 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
              <FileText className="w-6 h-6" />
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/applications'); }}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              View Tab <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Scheme Applications</span>
            <div className="flex items-baseline justify-between mt-1">
              <h2 className="text-3xl font-extrabold text-primary">{totalApplications}</h2>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                {pendingApplications} In Progress
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">{approvedApplications} applications approved</p>
          </div>
        </div>

        {/* Complaints Card */}
        <div 
          onClick={() => setActiveTab(activeTab === 'complaints' ? 'all' : 'complaints')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
            activeTab === 'complaints' 
              ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/30' 
              : 'bg-surface-container-lowest border-outline-variant/60 hover:border-amber-500/40'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-800">
              <AlertCircle className="w-6 h-6" />
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/complaints'); }}
              className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
            >
              View Tab <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Citizen Complaints</span>
            <div className="flex items-baseline justify-between mt-1">
              <h2 className="text-3xl font-extrabold text-primary">{totalComplaints}</h2>
              <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                {openComplaints} Pending
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">{resolvedComplaints} grievances resolved</p>
          </div>
        </div>

      </div>

      {/* Main Content Panels Section (Applications & Complaints) */}
      <div className="space-y-8">

        {/* 1. APPLICATIONS TAB CONTENT PANEL */}
        {(activeTab === 'all' || activeTab === 'applications') && (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm overflow-hidden">
            <div className="p-5 bg-emerald-50/50 border-b border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-600 text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-extrabold text-primary">Applications Tab Overview</h2>
                  <p className="text-xs text-on-surface-variant font-medium">Submitted scheme applications and review status</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/applications')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
              >
                Go to Applications Tab <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {filteredApplications.slice(0, 5).map((app, idx) => (
                  <div 
                    key={app.id || idx}
                    onClick={() => navigate('/applications')}
                    className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-surface-container-high">
                          {app.id}
                        </span>
                        <h4 className="font-bold text-sm text-on-surface group-hover:text-emerald-700 transition-colors">
                          {app.schemeName || app.serviceName || 'Welfare Scheme'}
                        </h4>
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-1">
                        Citizen: <span className="font-semibold text-on-surface">{app.citizenName || 'Citizen User'}</span> • {app.details || app.what_happend || 'Application submitted'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <Badge>{app.status || 'In Progress'}</Badge>
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Track <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm overflow-hidden">
            <div className="p-5 bg-amber-50/50 border-b border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-600 text-white">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-extrabold text-primary">Complaints Tab Overview</h2>
                  <p className="text-xs text-on-surface-variant font-medium">Public grievance reports and resolution tracking</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/complaints')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
              >
                Go to Complaints Tab <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {filteredComplaints.slice(0, 5).map((comp, idx) => (
                  <div 
                    key={comp.id || idx}
                    onClick={() => navigate('/complaints')}
                    className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 hover:border-amber-500/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-800 px-2 py-0.5 rounded bg-amber-100">
                          CMP-{comp.id}
                        </span>
                        <h4 className="font-bold text-sm text-on-surface group-hover:text-amber-800 transition-colors">
                          {comp.citizen_name || comp.citizenName || 'Citizen Grievance'}
                        </h4>
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-1">
                        {comp.what_happend || comp.description || 'Public complaint registered'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <Badge>{comp.status || 'In Progress'}</Badge>
                      <span className="text-xs font-bold text-amber-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Resolve <ArrowRight className="w-3.5 h-3.5" />
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
