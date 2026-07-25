import React, { useState } from 'react';
import CameraScanner from '../components/scanner/CameraScanner';
import Button from '../components/common/Button';
import { Shield, FolderOpen, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function Dashboard() {
  const [documents, setDocuments] = useState([
    { id: '1', name: 'Aadhaar Card', status: 'verified', size: '1.2 MB', date: '2026-07-20' },
    { id: '2', name: 'Ration Card', status: 'verified', size: '890 KB', date: '2026-07-21' },
  ]);

  const [applications, setApplications] = useState([
    { id: 'app_1', scheme: 'PM Awas Yojana', status: 'approved', date: '2026-07-22' },
    { id: 'app_2', scheme: 'Ayushman Bharat', status: 'pending', date: '2026-07-24' },
  ]);

  const [showScanner, setShowScanner] = useState(false);

  const handleCapture = (file) => {
    // Simulating OCR Upload
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

  return (
    <div className="flex-1 p-6 md:p-8 bg-neutral-950 text-neutral-100 overflow-y-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Digital Locker & Status</h1>
          <p className="text-sm text-neutral-400">Manage your documents securely and track active scheme applications.</p>
        </div>
        <Button variant="primary" onClick={() => setShowScanner(!showScanner)}>
          {showScanner ? 'Close Scanner' : 'Scan New Document'}
        </Button>
      </div>

      {showScanner && (
        <div className="max-w-2xl mx-auto">
          <CameraScanner onCapture={handleCapture} />
        </div>
      )}

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Digital Locker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
            <FolderOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold">Your Encrypted Documents</h2>
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
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold">Application Status</h2>
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-neutral-200">{app.scheme}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    app.status === 'approved' 
                      ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-950/50 text-amber-400 border border-amber-500/20'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Submitted: {app.date}</span>
                  <button className="text-emerald-400 hover:underline">View details</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
