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
  Layers,
  Plus,
  Mic
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../hooks/useTranslation';
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
  const { t } = useTranslation();

  const [statusFilter, setStatusFilter] = useState('All');
  const [schemeFilter, setSchemeFilter] = useState('All');
  const [selectedApps, setSelectedApps] = useState([]);
  
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', appId: null });

  const filteredApps = useMemo(() => {
    return (applications || []).filter((app) => {
      // Strictly filter by logged-in citizen email / name foreign key
      if (user && user.email) {
        const cEmail = (app?.citizenEmail || app?.citizen_email || '').toLowerCase().trim();
        const cName = (app?.citizenName || app?.citizen_name || '').toLowerCase().trim();
        const uEmail = (user.email || '').toLowerCase().trim();
        const uName = (user.name || '').toLowerCase().trim();
        const uPrefix = uEmail.split('@')[0];

        const isMine = 
          (cEmail && cEmail === uEmail) || 
          (cName && cName === uName) || 
          (cName && uPrefix && cName.includes(uPrefix));

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
        header: t('Application ID'),
        cell: ({ row }) => (
          <span className="font-mono font-bold text-primary">
            {row.original.id}
          </span>
        )
      },
      {
        accessorKey: 'citizenName',
        header: t('Citizen Name'),
        cell: ({ row }) => (
          <span className="font-bold text-on-surface block">{row.original.citizenName || 'Citizen User'}</span>
        )
      },
      {
        accessorKey: 'schemeName',
        header: t('Service / Scheme'),
        cell: ({ row }) => (
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 block font-heading">
            {row.original.schemeName || row.original.serviceName || 'Government Scheme'}
          </span>
        )
      },
      {
        accessorKey: 'details',
        header: t('What Happened / Application Details'),
        cell: ({ row }) => (
          <span className="text-xs text-on-surface-variant line-clamp-2 max-w-md block" title={row.original.details || row.original.what_happend}>
            {row.original.details || row.original.what_happend || 'Application submitted via AI Assistant.'}
          </span>
        )
      },
      {
        accessorKey: 'status',
        header: t('Status'),
        cell: ({ row }) => <Badge>{t(row.original.status || 'In Progress')}</Badge>
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('Action')}</div>,
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
    [selectedApps, filteredApps, navigate, t]
  );

  const pendingCount = applications.filter((a) => a.status.includes('Pending') || a.status.includes('Investigation')).length;
  const approvedCount = applications.filter((a) => a.status === 'Approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 relative">
      {/* Page Header with Audio Assistance */}
      <div className="border-b border-outline-variant/40 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">{t('Applications')} / मेरे आवेदन</h2>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
              {filteredApps.length} Total
            </span>
          </div>
          <p className="text-on-surface-variant font-bold mt-1 text-sm">
            {t('Track and review your submitted scheme applications and government welfare services.')}
          </p>
        </div>

        <button
          onClick={() => navigate('/citizens')}
          className="px-4 py-2.5 rounded-2xl bg-primary text-white font-extrabold text-xs shadow-md hover:bg-primary-container flex items-center gap-2 self-start sm:self-auto cursor-pointer rural-touch-target"
        >
          <Plus className="w-4 h-4" />
          <span>Apply New Scheme</span>
        </button>
      </div>

      {/* Visual Rural Cards View */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-lowest border-2 border-dashed border-outline-variant/60 rounded-3xl space-y-3">
            <FileText className="w-12 h-12 text-on-surface-variant/40 mx-auto" />
            <h3 className="font-heading font-extrabold text-lg text-on-surface">No Applications Found</h3>
            <p className="text-xs font-semibold text-on-surface-variant max-w-sm mx-auto">
              You haven't submitted any scheme applications yet. Click below to apply via AI Voice Assistant.
            </p>
            <button
              onClick={() => navigate('/citizens')}
              className="px-5 py-3 rounded-2xl bg-emerald-700 text-white font-extrabold text-xs shadow-lg hover:bg-emerald-800 cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <Mic className="w-4 h-4" />
              <span>Apply Now via Voice Assistant</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApps.map((app) => {
              const statusColor = (app.status || '').toLowerCase().includes('approved')
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                : (app.status || '').toLowerCase().includes('reject')
                ? 'bg-red-50 border-red-500 text-red-950'
                : 'bg-amber-50 border-amber-500 text-amber-950';

              return (
                <div
                  key={app.id}
                  className={`p-5 rounded-3xl border-2 transition-all shadow-sm hover:shadow-md space-y-3 ${statusColor}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold px-3 py-1 rounded-xl bg-white border border-black/10 shadow-xs">
                      {app.id}
                    </span>
                    <Badge>{t(app.status || 'In Progress')}</Badge>
                  </div>

                  <div>
                    <h3 className="font-heading font-extrabold text-base text-on-surface">
                      {app.schemeName || app.serviceName || 'Welfare Scheme'}
                    </h3>
                    <p className="text-xs font-semibold text-on-surface-variant mt-1 line-clamp-2">
                      {app.details || app.what_happend || 'Application under government office review.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs font-extrabold">
                    <span className="text-on-surface-variant">Applicant: {app.citizenName || 'Citizen User'}</span>
                    <button
                      onClick={() => navigate(`/applications/${app.id}`)}
                      className="px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-container font-extrabold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('View Details')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationsList;
