import React, { useState, useMemo } from 'react';
import {
  AlertCircle,
  MessageSquare,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Send,
  User,
  AlertTriangle,
  FileSpreadsheet,
  Mic
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';

export function ComplaintsManagement() {
  const { complaints, updateComplaintStatus, addComplaintComment } = useAdminData();
  const { user } = useAdminAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  
  // Detail modal state
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Strictly filter by logged-in citizen email / name
      if (user && user.email) {
        const cEmail = (c.citizen_email || c.citizenEmail || '').toLowerCase();
        const cName = (c.citizen_name || c.citizenName || '').toLowerCase();
        const uEmail = user.email.toLowerCase();
        const uName = (user.name || '').toLowerCase();
        const uPrefix = uEmail.split('@')[0];

        const isMine =
          (cEmail && cEmail === uEmail) ||
          (cName && cName === uName) ||
          (cName && cName.includes(uPrefix));

        if (!isMine) {
          return false;
        }
      }

      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || c.priority === priorityFilter;
      return matchStatus && matchPriority;
    });
  }, [complaints, user, statusFilter, priorityFilter]);

  const handleStatusChange = (ticketId, newStatus) => {
    updateComplaintStatus(ticketId, newStatus);
    showToast(`Grievance ticket ${ticketId} status updated to ${newStatus}.`, 'success');
    if (activeTicket && activeTicket.id === ticketId) {
      setActiveTicket((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    addComplaintComment(activeTicket.id, replyText, 'Tejas Mail (Super Admin)');
    showToast('Admin response sent to citizen via SMS & portal notification.', 'success');
    setReplyText('');
  };

  const handleExport = () => {
    showToast('Exporting grievance ticket SLA logs to CSV... Download initiated.', 'success');
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: t('Complaint ID'),
        cell: ({ row }) => (
          <span
            onClick={() => setActiveTicket(row.original)}
            className="font-mono font-extrabold text-primary hover:underline cursor-pointer"
          >
            CMP-{row.original.id}
          </span>
        )
      },
      {
        accessorKey: 'citizen_name',
        header: t('Who Complained'),
        cell: ({ row }) => (
          <span className="font-bold text-on-surface">{row.original.citizen_name || 'Citizen User'}</span>
        )
      },
      {
        accessorKey: 'what_happend',
        header: t('What Happened'),
        cell: ({ row }) => (
          <span className="font-medium text-on-surface max-w-md block" title={row.original.what_happend}>
            {row.original.what_happend}
          </span>
        )
      },
      {
        accessorKey: 'status',
        header: t('Status'),
        cell: ({ row }) => <Badge>{t(row.original.status || 'In Progress')}</Badge>
      }
    ],
    [t]
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header with Action Button */}
      <div className="border-b border-outline-variant/40 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">{t('Citizen Complaints')} / जन शिकायत</h2>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
              {filteredComplaints.length} Total
            </span>
          </div>
          <p className="text-on-surface-variant font-bold text-sm mt-1">
            {t('Registered grievance complaints submitted by citizens.')}
          </p>
        </div>

        <button
          onClick={() => {
            showToast("Opening Voice Complaint Assistant...", "info");
            window.location.href = "/citizens";
          }}
          className="px-4 py-2.5 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs shadow-md flex items-center gap-2 self-start sm:self-auto cursor-pointer rural-touch-target"
        >
          <Mic className="w-4 h-4" />
          <span>Lodge Complaint via Voice</span>
        </button>
      </div>

      {/* Visual Rural Cards View */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-lowest border-2 border-dashed border-outline-variant/60 rounded-3xl space-y-3">
            <AlertCircle className="w-12 h-12 text-on-surface-variant/40 mx-auto" />
            <h3 className="font-heading font-extrabold text-lg text-on-surface">No Grievances Found</h3>
            <p className="text-xs font-semibold text-on-surface-variant max-w-sm mx-auto">
              You haven't registered any complaints. Click below to lodge a complaint using voice dictation.
            </p>
            <button
              onClick={() => window.location.href = "/citizens"}
              className="px-5 py-3 rounded-2xl bg-amber-700 text-white font-extrabold text-xs shadow-lg hover:bg-amber-800 cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <Mic className="w-4 h-4" />
              <span>Register Grievance via Voice</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredComplaints.map((comp) => (
              <div
                key={comp.id}
                onClick={() => setActiveTicket(comp)}
                className="p-5 rounded-3xl bg-surface-container-lowest border-2 border-outline-variant/60 hover:border-amber-500 transition-all cursor-pointer shadow-sm hover:shadow-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold px-3 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
                    CMP-{comp.id}
                  </span>
                  <Badge>{t(comp.status || 'In Progress')}</Badge>
                </div>

                <div>
                  <h3 className="font-heading font-extrabold text-base text-on-surface">
                    {comp.citizen_name || comp.citizenName || 'Citizen Grievance'}
                  </h3>
                  <p className="text-xs font-semibold text-on-surface-variant mt-1 line-clamp-2">
                    {comp.what_happend || comp.description || 'Public complaint registered for officer review.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs font-extrabold text-amber-900">
                  <span>Click to view resolution progress</span>
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Detail & Adjudication Modal */}
      <Modal
        isOpen={!!activeTicket}
        onClose={() => setActiveTicket(null)}
        title={`Grievance Ticket: ${activeTicket?.id}`}
        maxWidth="max-w-2xl"
      >
        {activeTicket && (
          <div className="space-y-6">
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 flex justify-between items-start gap-4 flex-wrap">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-lg text-on-surface">{activeTicket.subject}</h4>
                  <Badge>{activeTicket.priority}</Badge>
                </div>
                <p className="text-xs font-semibold text-primary">{activeTicket.category}</p>
                <p className="text-xs text-on-surface-variant">
                  Submitted by <span className="font-bold text-on-surface">{activeTicket.citizenName}</span> ({activeTicket.citizenId}) on {activeTicket.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{activeTicket.status}</Badge>
                {activeTicket.status !== 'Resolved' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(activeTicket.id, 'Resolved')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Mark Resolved
                  </Button>
                )}
              </div>
            </div>

            {/* Original Complaint Description */}
            <div className="space-y-2">
              <h5 className="font-bold text-xs text-on-surface-variant uppercase">Original Grievance Detail</h5>
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant text-sm text-on-surface leading-relaxed">
                {activeTicket.description}
              </div>
            </div>

            {/* Discussion Comments */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs text-on-surface-variant uppercase">Resolution Timeline & Responses</h5>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {(activeTicket.comments || []).map((com) => (
                  <div
                    key={com.id}
                    className={`p-3.5 rounded-xl text-xs space-y-1 border ${
                      com.author.includes('Admin')
                        ? 'bg-primary-fixed/20 border-primary/20 ml-6'
                        : 'bg-surface-container-low border-outline-variant/40 mr-6'
                    }`}
                  >
                    <div className="flex justify-between font-bold text-on-surface">
                      <span className={com.author.includes('Admin') ? 'text-primary' : ''}>{com.author}</span>
                      <span className="text-on-surface-variant font-normal">{com.date}</span>
                    </div>
                    <p className="text-sm text-on-surface pt-1">{com.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Reply Form */}
            {activeTicket.status !== 'Resolved' ? (
              <form onSubmit={handleSendReply} className="space-y-3 pt-2 border-t border-outline-variant/30">
                <Input
                  placeholder="Type official reply or resolution instructions for citizen..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" type="button" onClick={() => setActiveTicket(null)}>
                    Close
                  </Button>
                  <Button variant="primary" size="sm" type="submit" className="font-bold flex items-center gap-1.5">
                    <Send className="w-4 h-4" />
                    <span>Send Official Reply</span>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                This grievance ticket has been closed and marked as resolved.
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ComplaintsManagement;
