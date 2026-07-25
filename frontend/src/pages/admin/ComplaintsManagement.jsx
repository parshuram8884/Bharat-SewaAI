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
  FileSpreadsheet
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';

export function ComplaintsManagement() {
  const { complaints, updateComplaintStatus, addComplaintComment } = useAdminData();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  
  // Detail modal state
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || c.priority === priorityFilter;
      return matchStatus && matchPriority;
    });
  }, [complaints, statusFilter, priorityFilter]);

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
        header: 'Ticket ID',
        cell: ({ row }) => (
          <span
            onClick={() => setActiveTicket(row.original)}
            className="font-mono font-bold text-primary hover:underline cursor-pointer"
          >
            {row.original.id}
          </span>
        )
      },
      {
        accessorKey: 'citizenName',
        header: 'Complainant',
        cell: ({ row }) => (
          <div>
            <span className="font-bold text-on-surface block">{row.original.citizenName}</span>
            <span className="text-xs text-on-surface-variant font-mono">{row.original.citizenId}</span>
          </div>
        )
      },
      {
        accessorKey: 'subject',
        header: 'Grievance Subject & Category',
        cell: ({ row }) => (
          <div>
            <span className="font-bold text-on-surface block max-w-xs truncate" title={row.original.subject}>
              {row.original.subject}
            </span>
            <span className="text-xs font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
              {row.original.category}
            </span>
          </div>
        )
      },
      {
        accessorKey: 'date',
        header: 'Submitted On',
        cell: ({ row }) => <span className="text-xs font-mono text-on-surface-variant">{row.original.date}</span>
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => <Badge>{row.original.priority}</Badge>
      },
      {
        accessorKey: 'status',
        header: 'Ticket Status',
        cell: ({ row }) => <Badge>{row.original.status}</Badge>
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const ticket = row.original;
          const isOpen = ticket.status === 'Open' || ticket.status === 'In Progress';
          return (
            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTicket(ticket)}
                className="p-1.5 text-on-surface-variant hover:text-primary"
                title="View ticket discussion & resolve"
              >
                <Eye className="w-4 h-4" />
              </Button>
              {isOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStatusChange(ticket.id, 'Resolved')}
                  className="p-1.5 text-on-surface-variant hover:text-emerald-600 font-bold text-xs"
                  title="Mark Resolved"
                >
                  <CheckCircle2 className="w-4 h-4 mr-0.5" />
                  <span>Resolve</span>
                </Button>
              )}
            </div>
          );
        }
      }
    ],
    []
  );

  const openCount = complaints.filter((c) => c.status === 'Open' || c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const highCount = complaints.filter((c) => c.priority === 'High' && c.status !== 'Resolved').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-5">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">Citizen Grievance Management</h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Triage public complaints, track SLA response times, and provide official resolutions to citizens.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleExport}
            className="flex items-center gap-2 font-bold"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Grievance CSV</span>
          </Button>
        </div>
      </div>

      {/* Mini Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-amber-100 text-amber-800">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Open / In Progress</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{openCount}</h4>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Resolved Tickets</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{resolvedCount}</h4>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-error-container text-error">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">High Priority Alerts</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{highCount}</h4>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
            <Filter className="w-4 h-4 text-primary" />
            <span>Status:</span>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg flex-wrap">
            {['All', 'Open', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-outline-variant/60 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg text-xs font-bold text-on-surface px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grievances Table */}
      <Table
        data={filteredComplaints}
        columns={columns}
        searchPlaceholder="Search Ticket ID, citizen name, subject, category..."
        pageSize={10}
      />

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
