import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraScanner from '../components/scanner/CameraScanner';
import { LegacyButtonAdapter as Button } from '../components/ui/LegacyButtonAdapter';
import { Shield, FolderOpen, FileText, CheckCircle, Clock, AlertCircle, ChevronRight, Activity } from 'lucide-react';
import { applicationTrackingService } from '../services/applicationTrackingService';
import { ApplicationStatusConfig } from '../data/applicationStatusModel';
import { notificationService } from '../services/notificationService';

export function Dashboard() {
  const navigate = useNavigate();
  
  const [documents, setDocuments] = useState([
    { id: '1', name: 'Aadhaar Card', status: 'verified', size: '1.2 MB', date: '2026-07-20' },
    { id: '2', name: 'Ration Card', status: 'verified', size: '890 KB', date: '2026-07-21' },
  ]);

  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    async function loadData() {
      const res = await applicationTrackingService.getApplications();
      if (res.success) {
        setApplications(res.data);
      }
      setUnreadNotifs(notificationService.getUnreadCount());
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleCapture = (file) => {
    const newDoc = {
      id: Date.now().toString(),
      name: file.name,
      status: 'verifying',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      date: new Date().toISOString().split('T')[0]
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setShowScanner(false);
  };

  const totalApps = applications.length;
  const inProgressApps = applications.filter(a => ApplicationStatusConfig[a.status]?.category === 'In Progress').length;
  const needsAttentionApps = applications.filter(a => ApplicationStatusConfig[a.status]?.category === 'Needs Attention').length;
  const approvedApps = applications.filter(a => ApplicationStatusConfig[a.status]?.category === 'Approved').length;

  return (
    <div className="flex-1 p-6 md:p-8 bg-neutral-950 text-neutral-100 overflow-y-auto space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-emerald-50">Citizen Dashboard</h1>
          <p className="text-sm text-neutral-400">Manage your documents securely and track active scheme applications.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/applications')} className="hidden md:flex">
            View All Applications
          </Button>
          <Button variant="primary" onClick={() => setShowScanner(!showScanner)}>
            {showScanner ? 'Close Scanner' : 'Scan New Document'}
          </Button>
        </div>
      </div>

      {showScanner && (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4">
          <CameraScanner onCapture={handleCapture} />
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-neutral-400 text-xs font-bold uppercase">Total Applications</span>
          <p className="text-2xl font-bold text-emerald-50 mt-1">{totalApps}</p>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-neutral-400 text-xs font-bold uppercase">In Progress</span>
          <p className="text-2xl font-bold text-primary mt-1">{inProgressApps}</p>
        </div>
        <div 
          onClick={() => navigate('/applications?status=Needs Attention')}
          className="p-4 rounded-2xl bg-red-950/20 border border-red-900/50 cursor-pointer hover:bg-red-950/40 transition-colors"
        >
          <span className="text-red-400 text-xs font-bold uppercase">Needs Attention</span>
          <p className="text-2xl font-bold text-red-50 mt-1">{needsAttentionApps}</p>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-neutral-400 text-xs font-bold uppercase">Approved</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{approvedApps}</p>
        </div>
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Digital Locker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-emerald-50">Your Encrypted Documents</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/20 transition-all flex items-start gap-3">
                <div className="p-2 rounded-lg bg-neutral-800 text-neutral-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-neutral-200">{doc.name}</p>
                  <p className="text-xs text-neutral-500">{doc.size} • {doc.date}</p>
                  
                  <div className="mt-2 flex items-center gap-1.5">
                    {doc.status === 'verified' ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[11px] font-semibold text-emerald-400 tracking-wide uppercase">Verified</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        <span className="text-[11px] font-semibold text-amber-400 tracking-wide uppercase">Verifying (OCR)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheme Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-emerald-50">Recent Applications</h2>
            </div>
            <button onClick={() => navigate('/applications')} className="text-xs text-primary hover:underline">View All</button>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="p-4 rounded-xl bg-neutral-900 animate-pulse h-24" />
            ) : applications.slice(0, 3).map((app) => {
              const config = ApplicationStatusConfig[app.status] || ApplicationStatusConfig.draft;
              return (
                <div 
                  key={app.id} 
                  onClick={() => navigate(`/applications/${app.id}`)}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-primary/50 cursor-pointer transition-colors group space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-bold text-neutral-200 line-clamp-1">{app.schemeName}</h3>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${
                      config.category === 'Needs Attention' ? 'bg-red-950/50 text-red-400 border border-red-500/20' :
                      config.category === 'Approved' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20' :
                      'bg-amber-950/50 text-amber-400 border border-amber-500/20'
                    }`}>
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>{new Date(app.updatedAt).toLocaleDateString()}</span>
                    <span className="text-primary group-hover:underline flex items-center">
                      Track <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
