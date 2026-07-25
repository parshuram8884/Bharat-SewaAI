import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  FileText,
  FolderOpen,
  Clock,
  MessageSquare,
  Lock,
  Unlock,
  Download,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Plus,
  Send
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Tabs } from '../../components/common/Tabs';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';

export function CitizenDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { citizens, applications, updateCitizenStatus } = useAdminData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '' });
  const [noteText, setNoteText] = useState('');
  const [citizenNotes, setCitizenNotes] = useState([
    { id: 1, author: 'NIC automated check', date: '10 days ago', text: 'Aadhaar biometric verification confirmed via UIDAI API gateway.' },
    { id: 2, author: 'Tejas Mail (Super Admin)', date: '3 days ago', text: 'Citizen verified for agriculture subsidy schemes.' }
  ]);

  const citizen = citizens.find((c) => c.id === id) || citizens[0]; // fallback to first if id not found
  const citizenApps = applications.filter((app) => app.citizenId === citizen.id || app.citizenName === citizen.name);

  const isSuspended = citizen.status === 'Suspended';

  const handleStatusToggle = () => {
    const newStatus = isSuspended ? 'Active' : 'Suspended';
    updateCitizenStatus(citizen.id, newStatus);
    showToast(`Citizen profile status changed to ${newStatus}.`, 'info');
    setConfirmModal({ isOpen: false, type: '' });
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setCitizenNotes([
      { id: Date.now(), author: 'Tejas Mail (Super Admin)', date: 'Just now', text: noteText },
      ...citizenNotes
    ]);
    setNoteText('');
    showToast('Admin note saved to citizen dossier.', 'success');
  };

  const handleDownloadDoc = (docName) => {
    showToast(`Downloading secure encrypted copy of ${docName}...`, 'success');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Navigation Back */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => navigate('/citizens')}
          className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Citizens Directory</span>
        </button>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => showToast('Aadhaar biometric re-verification request triggered via UIDAI.', 'info')}
            className="font-bold"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
            <span>Re-verify KYC</span>
          </Button>
          <Button
            variant={isSuspended ? 'primary' : 'danger'}
            size="sm"
            onClick={() => setConfirmModal({ isOpen: true, type: isSuspended ? 'activate' : 'suspend' })}
            className="font-bold flex items-center gap-1.5"
          >
            {isSuspended ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{isSuspended ? 'Activate Account' : 'Suspend Account'}</span>
          </Button>
        </div>
      </div>

      {/* Citizen Header Profile Card */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary-fixed/60 border-2 border-primary-container flex items-center justify-center font-heading font-extrabold text-3xl text-primary shrink-0 shadow-sm">
            {citizen.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-heading font-extrabold text-on-surface">{citizen.name}</h2>
              <Badge>{citizen.status}</Badge>
              <Badge>{citizen.verification}</Badge>
            </div>
            <p className="text-xs font-mono font-bold text-primary">Citizen ID: {citizen.id}</p>
            <div className="flex items-center gap-4 text-xs text-on-surface-variant pt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-outline" />
                {citizen.phone}
              </span>
              {citizen.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-outline" />
                  {citizen.email}
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-outline" />
                {citizen.district}, {citizen.state}
              </span>
            </div>
          </div>
        </div>

        <div className="flex md:flex-col items-end gap-2 text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-outline-variant/30 justify-between">
          <div>
            <p className="text-[11px] text-on-surface-variant uppercase font-semibold">Digital Locker Status</p>
            <p className="text-sm font-bold text-emerald-600 flex items-center justify-end gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>{citizen.documents?.length || 4} Verified Documents</span>
            </p>
          </div>
          <span className="text-xs text-on-surface-variant font-mono">Registered: {citizen.registeredDate || '12 Jan 2023'}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'profile', label: 'Profile & Family', icon: User },
          { id: 'locker', label: 'Digital Locker', icon: FolderOpen, count: citizen.documents?.length || 4 },
          { id: 'applications', label: 'Scheme Applications', icon: FileText, count: citizenApps.length },
          { id: 'notes', label: 'Dossier Notes & Logs', icon: MessageSquare, count: citizenNotes.length }
        ]}
      />

      {/* TAB CONTENT 1: PROFILE & FAMILY */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          <div className="lg:col-span-6 space-y-6">
            <Card title="Personal & Demographic Information">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <dt className="text-xs font-semibold text-on-surface-variant uppercase">Full Legal Name</dt>
                  <dd className="font-bold text-on-surface mt-0.5">{citizen.name}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-on-surface-variant uppercase">Date of Birth</dt>
                  <dd className="font-bold text-on-surface mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    {citizen.dob}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-on-surface-variant uppercase">Gender</dt>
                  <dd className="font-bold text-on-surface mt-0.5">{citizen.gender}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-on-surface-variant uppercase">Aadhaar Number (Masked)</dt>
                  <dd className="font-mono font-bold text-primary mt-0.5">{citizen.aadhaarMasked}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold text-on-surface-variant uppercase">Registered Residential Address</dt>
                  <dd className="font-bold text-on-surface mt-0.5">{citizen.address}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-on-surface-variant uppercase">District</dt>
                  <dd className="font-bold text-on-surface mt-0.5">{citizen.district}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-on-surface-variant uppercase">State</dt>
                  <dd className="font-bold text-on-surface mt-0.5">{citizen.state}</dd>
                </div>
              </dl>
            </Card>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <Card title="Linked Family Members (Ration / Household)">
              {citizen.family && citizen.family.length > 0 ? (
                <div className="divide-y divide-outline-variant/30 text-sm">
                  {citizen.family.map((fam, idx) => (
                    <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary-container/50 text-on-secondary-container flex items-center justify-center font-bold text-xs">
                          {fam.relation[0]}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{fam.name}</p>
                          <p className="text-xs text-on-surface-variant">{fam.relation} • Age {fam.age}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-medium text-primary bg-primary-fixed/30 px-2 py-1 rounded">
                        {fam.aadhaar}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant py-4 text-center">No family records linked yet.</p>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: DIGITAL LOCKER */}
      {activeTab === 'locker' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between gap-4 bg-primary-fixed/20 p-4 rounded-xl border border-primary/20">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-on-surface">Digital Locker Governance Protocol</h4>
                <p className="text-xs text-on-surface-variant">All documents listed below are digitally signed by issuing government authorities via DigiLocker API.</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast('Requesting refreshed certificates from State Revenue Dept...', 'info')}
              className="text-xs font-bold"
            >
              Sync DigiLocker
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(citizen.documents || []).map((doc) => (
              <div
                key={doc.id}
                className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-secondary-container/30 text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-on-surface leading-tight">{doc.name}</h5>
                      <p className="text-xs font-mono text-on-surface-variant mt-0.5">ID: {doc.id}</p>
                    </div>
                  </div>
                  <Badge>{doc.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-outline-variant/30 text-on-surface-variant">
                  <span>Issued: {doc.uploadedDate}</span>
                  <button
                    onClick={() => handleDownloadDoc(doc.name)}
                    className="font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4 animate-in fade-in">
          {citizenApps.length > 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low text-xs uppercase font-semibold text-on-surface-variant border-b border-outline-variant/40">
                  <tr>
                    <th className="px-6 py-3.5">Application ID</th>
                    <th className="px-6 py-3.5">Scheme Name</th>
                    <th className="px-6 py-3.5">Submitted On</th>
                    <th className="px-6 py-3.5">Assigned Reviewer</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 text-sm">
                  {citizenApps.map((app) => (
                    <tr key={app.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-primary">
                        <Link to={`/applications/${app.id}`} className="hover:underline">
                          {app.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-bold text-on-surface">{app.schemeName}</td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">{app.submissionDate}</td>
                      <td className="px-6 py-4 text-xs">{app.assignedReviewer}</td>
                      <td className="px-6 py-4"><Badge>{app.status}</Badge></td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/applications/${app.id}`)}
                          className="text-xs font-bold"
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Card className="text-center py-12">
              <FileText className="w-12 h-12 text-outline mx-auto opacity-50 mb-2" />
              <p className="font-bold text-base text-on-surface">No Applications Found</p>
              <p className="text-xs text-on-surface-variant">This citizen has not applied for any government schemes yet.</p>
            </Card>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: NOTES & LOGS */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          <div className="lg:col-span-7 space-y-4">
            <Card title="Admin Dossier Notes">
              <form onSubmit={handleAddNote} className="space-y-3 mb-6 pb-6 border-b border-outline-variant/30">
                <Input
                  placeholder="Add a confidential administrative note or verification remark..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button variant="primary" size="sm" type="submit" className="font-bold flex items-center gap-1.5">
                    <Send className="w-4 h-4" />
                    <span>Post Note</span>
                  </Button>
                </div>
              </form>

              <div className="space-y-4">
                {citizenNotes.map((note) => (
                  <div key={note.id} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
                    <div className="flex items-center justify-between text-xs text-on-surface-variant">
                      <span className="font-bold text-primary">{note.author}</span>
                      <span>{note.date}</span>
                    </div>
                    <p className="text-sm text-on-surface font-medium pt-1">{note.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <Card title="System Activity Audit Trail">
              <div className="space-y-4 text-xs">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="font-bold text-on-surface">Aadhaar Biometric Sync Completed</p>
                    <p className="text-on-surface-variant">UIDAI Gateway • 10 days ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-bold text-on-surface">Profile Created & Verified</p>
                    <p className="text-on-surface-variant">CSC Center #402 • 12 Jan 2023</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Confirm Status Dialog */}
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: '' })}
        onConfirm={handleStatusToggle}
        title={isSuspended ? 'Activate Citizen Account' : 'Suspend Citizen Account'}
        message={
          isSuspended
            ? `Activating ${citizen.name}'s account will restore their ability to submit scheme applications and access digital locker services.`
            : `Are you sure you want to suspend ${citizen.name}'s account? This will block new applications pending investigation.`
        }
        confirmText={isSuspended ? 'Activate Profile' : 'Suspend Profile'}
        variant={isSuspended ? 'primary' : 'danger'}
      />
    </div>
  );
}

export default CitizenDetail;
