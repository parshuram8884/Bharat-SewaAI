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
      {/* Clean Page Header */}
      <div className="border-b border-outline-variant/30 pb-5">
        <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">{t('Applications')}</h2>
        <p className="text-on-surface-variant font-medium mt-1 text-sm">
          {t('Track and review your submitted scheme applications and government welfare services.')}
        </p>
      </div>

      {/* Applications Table */}
      <Table
        data={filteredApps}
        columns={columns}
        searchPlaceholder={t('Search Application ID, citizen name, service title...')}
        pageSize={10}
      />
    </div>
  );
}

export default ApplicationsList;
