import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Filter,
  UserCheck,
  CheckSquare,
  AlertCircle,
  FileSpreadsheet,
  Layers
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Select } from '../../components/common/Select';

export function ApplicationsList() {
  const { applications, schemes, approveApplication, rejectApplication, assignReviewer } = useAdminData();
  const { user } = useAdminAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('All');
  const [schemeFilter, setSchemeFilter] = useState('All');
  const [selectedApps, setSelectedApps] = useState([]);
  
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', appId: null });

  const filteredApps = useMemo(() => {
    return (applications || []).filter((app) => {
      // Strictly filter by logged-in citizen email / name
      if (user && user.email) {
        const cName = (app?.citizenName || '').toLowerCase();
        const uEmail = (user.email || '').toLowerCase();
        const uName = (user.name || '').toLowerCase();
        const uPrefix = uEmail.split('@')[0];

        const isMine = (cName && cName === uName) || (cName && cName.includes(uPrefix));
        if (!isMine) {
          return false;
        }
      }

      const matchStatus = statusFilter === 'All' || app?.status === statusFilter;
      const matchScheme = schemeFilter === 'All' || (app?.schemeName || '').toLowerCase().includes((schemeFilter || '').toLowerCase());
      return matchStatus && matchScheme;
    });
  }, [applications, user, statusFilter, schemeFilter]);

  const handleApprove = (appId) => {
    approveApplication(appId, 'Tejas Mail', 'Approved via quick action table.');
    showToast(`Application ${appId} approved successfully! Notification dispatched to citizen.`, 'success');
    setConfirmModal({ isOpen: false, type: '', appId: null });
  };

  const handleReject = (appId) => {
    rejectApplication(appId, 'Tejas Mail', 'Rejected via quick action table.');
    showToast(`Application ${appId} rejected. Citizen notified with reason.`, 'error');
    setConfirmModal({ isOpen: false, type: '', appId: null });
  };

  const handleBulkApprove = () => {
    selectedApps.forEach((id) => approveApplication(id, 'Tejas Mail', 'Bulk batch approval'));
    showToast(`Successfully approved ${selectedApps.length} applications in batch!`, 'success');
    setSelectedApps([]);
  };

  const handleBulkReject = () => {
    selectedApps.forEach((id) => rejectApplication(id, 'Tejas Mail', 'Bulk batch rejection'));
    showToast(`Rejected ${selectedApps.length} applications in batch.`, 'error');
    setSelectedApps([]);
  };

  const handleExport = () => {
    showToast('Generating Excel report for filtered scheme applications... Download initiated.', 'success');
  };

  const toggleSelect = (id) => {
    setSelectedApps((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedApps.length === filteredApps.length) {
      setSelectedApps([]);
    } else {
      setSelectedApps(filteredApps.map((a) => a.id));
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: () => (
          <input
            type="checkbox"
            checked={filteredApps.length > 0 && selectedApps.length === filteredApps.length}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/40 cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedApps.includes(row.original.id)}
            onChange={() => toggleSelect(row.original.id)}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/40 cursor-pointer"
          />
        )
      },
      {
        accessorKey: 'id',
        header: 'Application ID',
        cell: ({ row }) => (
          <Link
            to={`/applications/${row.original.id}`}
            className="font-mono font-bold text-primary hover:underline"
          >
            {row.original.id}
          </Link>
        )
      },
      {
        accessorKey: 'citizenName',
        header: 'Applicant Citizen',
        cell: ({ row }) => (
          <div>
            <span className="font-bold text-on-surface block">{row.original.citizenName}</span>
            <span className="text-xs text-on-surface-variant font-mono">{row.original.citizenId}</span>
          </div>
        )
      },
      {
        accessorKey: 'schemeName',
        header: 'Target Scheme',
        cell: ({ row }) => (
          <span className="font-semibold text-on-surface max-w-xs block truncate" title={row.original.schemeName}>
            {row.original.schemeName}
          </span>
        )
      },
      {
        accessorKey: 'submissionDate',
        header: 'Submitted On',
        cell: ({ row }) => <span className="text-xs font-mono text-on-surface-variant">{row.original.submissionDate}</span>
      },
      {
        accessorKey: 'assignedReviewer',
        header: 'Reviewer',
        cell: ({ row }) => (
          <span className="text-xs font-medium bg-surface-container px-2 py-1 rounded">
            {row.original.assignedReviewer || 'Unassigned'}
          </span>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <Badge>{row.original.status}</Badge>
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Action</div>,
        cell: ({ row }) => {
          const app = row.original;
          const isPending = app.status.includes('Pending') || app.status.includes('Investigation');
          return (
            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/applications/${app.id}`)}
                className="p-1.5 text-on-surface-variant hover:text-primary"
                title="Review full application & verify documents"
              >
                <Eye className="w-4 h-4" />
              </Button>
              {isPending && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmModal({ isOpen: true, type: 'approve', appId: app.id })}
                    className="p-1.5 text-on-surface-variant hover:text-emerald-600"
                    title="Quick Approve"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmModal({ isOpen: true, type: 'reject', appId: app.id })}
                    className="p-1.5 text-on-surface-variant hover:text-error"
                    title="Quick Reject"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          );
        }
      }
    ],
    [selectedApps, filteredApps, navigate]
  );

  const pendingCount = applications.filter((a) => a.status.includes('Pending') || a.status.includes('Investigation')).length;
  const approvedCount = applications.filter((a) => a.status === 'Approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-5">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">Scheme Applications</h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Review citizen submissions, verify uploaded certificates, and manage eligibility approvals.
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
            <span>Export Excel</span>
          </Button>
        </div>
      </div>

      {/* Mini Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-primary-fixed/50 text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Total Submitted</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{applications.length}</h4>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-amber-100 text-amber-800">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Pending Triage</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{pendingCount}</h4>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Approved</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{approvedCount}</h4>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-error-container text-error">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Rejected</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{rejectedCount}</h4>
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
            {['All', 'Pending Review', 'Under Investigation', 'Documents Requested', 'Approved', 'Rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-outline-variant/60 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">Scheme:</span>
            <select
              value={schemeFilter}
              onChange={(e) => setSchemeFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg text-xs font-bold text-on-surface px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary max-w-[200px]"
            >
              <option value="All">All Schemes</option>
              <option value="Awas">Pradhan Mantri Awas Yojana</option>
              <option value="Ujjwala">Pradhan Mantri Ujjwala Yojana</option>
              <option value="Ayushman">Ayushman Bharat (PM-JAY)</option>
              <option value="Pension">National Old Age Pension</option>
            </select>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedApps.length > 0 && (
        <div className="sticky top-20 z-30 bg-primary text-on-primary px-6 py-3.5 rounded-xl shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-top-2 border border-primary-container">
          <div className="flex items-center gap-3 font-bold text-sm">
            <CheckSquare className="w-5 h-5 text-secondary-fixed" />
            <span>{selectedApps.length} applications selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleBulkApprove}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold border-none"
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              <span>Bulk Approve</span>
            </Button>
            <Button
              size="sm"
              onClick={handleBulkReject}
              className="bg-error hover:bg-error-container text-on-error font-bold border-none"
            >
              <XCircle className="w-4 h-4 mr-1" />
              <span>Bulk Reject</span>
            </Button>
            <button
              onClick={() => setSelectedApps([])}
              className="text-xs underline text-on-primary/70 hover:text-on-primary ml-2 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <Table
        data={filteredApps}
        columns={columns}
        searchPlaceholder="Search Application ID, citizen name, scheme title..."
        pageSize={10}
      />

      {/* Confirm Action Dialog */}
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: '', appId: null })}
        onConfirm={() => {
          if (confirmModal.type === 'approve') handleApprove(confirmModal.appId);
          else handleReject(confirmModal.appId);
        }}
        title={confirmModal.type === 'approve' ? 'Approve Application' : 'Reject Application'}
        message={
          confirmModal.type === 'approve'
            ? `Are you sure you want to approve application ${confirmModal.appId}? This will trigger an SMS/WhatsApp notification to the citizen confirming their subsidy award.`
            : `Are you sure you want to reject application ${confirmModal.appId}? The citizen will be notified to correct discrepancies if resubmitting.`
        }
        confirmText={confirmModal.type === 'approve' ? 'Approve Application' : 'Reject Application'}
        variant={confirmModal.type === 'approve' ? 'primary' : 'danger'}
      />
    </div>
  );
}

export default ApplicationsList;
