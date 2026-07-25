import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Plus,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  PauseCircle,
  Filter,
  FileSpreadsheet,
  IndianRupee,
  Users
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export function SchemeManagement() {
  const { schemes, saveScheme, deleteScheme } = useAdminData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', scheme: null });

  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      const matchCat = categoryFilter === 'All' || s.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      return matchCat && matchStatus;
    });
  }, [schemes, categoryFilter, statusFilter]);

  const handleStatusToggle = (scheme) => {
    const newStatus = scheme.status === 'Active' ? 'Paused' : 'Active';
    saveScheme({ ...scheme, status: newStatus });
    showToast(`Scheme "${scheme.code}" status updated to ${newStatus}.`, 'info');
    setConfirmModal({ isOpen: false, type: '', scheme: null });
  };

  const handleDelete = (scheme) => {
    deleteScheme(scheme.id);
    showToast(`Scheme "${scheme.name}" has been retired from active catalog.`, 'error');
    setConfirmModal({ isOpen: false, type: '', scheme: null });
  };

  const handleExport = () => {
    showToast('Exporting scheme parameters and beneficiary metrics to CSV...', 'success');
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: 'Scheme Code',
        cell: ({ row }) => (
          <span
            onClick={() => navigate(`/schemes/${row.original.id}/edit`)}
            className="font-mono font-bold text-primary hover:underline cursor-pointer"
          >
            {row.original.code}
          </span>
        )
      },
      {
        accessorKey: 'name',
        header: 'Government Scheme Name',
        cell: ({ row }) => (
          <div>
            <span className="font-bold text-on-surface block leading-tight">{row.original.name}</span>
            <span className="text-xs text-on-surface-variant line-clamp-1 max-w-xs">{row.original.description}</span>
          </div>
        )
      },
      {
        accessorKey: 'category',
        header: 'Sector / Category',
        cell: ({ row }) => (
          <span className="text-xs font-semibold bg-surface-container px-2.5 py-1 rounded-full text-on-surface">
            {row.original.category}
          </span>
        )
      },
      {
        accessorKey: 'subsidyAmount',
        header: 'Benefit Award',
        cell: ({ row }) => (
          <span className="font-bold text-emerald-600 font-mono text-xs flex items-center">
            <IndianRupee className="w-3 h-3" />
            <span>{row.original.subsidyAmount}</span>
          </span>
        )
      },
      {
        accessorKey: 'beneficiariesCount',
        header: 'Beneficiaries',
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 font-bold text-on-surface">
            <Users className="w-4 h-4 text-primary" />
            <span>{(row.original.beneficiariesCount || 0).toLocaleString('en-IN')}</span>
          </div>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <Badge>{row.original.status}</Badge>
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const scheme = row.original;
          const isPaused = scheme.status === 'Paused';
          return (
            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/schemes/${scheme.id}/edit`)}
                className="p-1.5 text-on-surface-variant hover:text-primary"
                title="Edit Scheme Rules & Eligibility"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmModal({ isOpen: true, type: isPaused ? 'activate' : 'pause', scheme })}
                className={`p-1.5 ${isPaused ? 'text-amber-600 hover:text-emerald-600' : 'text-on-surface-variant hover:text-amber-600'}`}
                title={isPaused ? 'Resume Scheme' : 'Pause Scheme'}
              >
                {isPaused ? <CheckCircle2 className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmModal({ isOpen: true, type: 'delete', scheme })}
                className="p-1.5 text-on-surface-variant hover:text-error"
                title="Retire / Delete Scheme"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          );
        }
      }
    ],
    [navigate]
  );

  const activeCount = schemes.filter((s) => s.status === 'Active').length;
  const pausedCount = schemes.filter((s) => s.status === 'Paused').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-5">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">Scheme Catalog & Governance</h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Configure national subsidy parameters, eligibility criteria, document checklists, and benefit distribution rules.
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
            <span>Export Catalog</span>
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/schemes/new')}
            className="flex items-center gap-2 font-bold shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Launch New Scheme</span>
          </Button>
        </div>
      </div>

      {/* Mini Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-primary-fixed/50 text-primary">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Total Schemes</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{schemes.length}</h4>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Operational / Active</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{activeCount}</h4>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-amber-100 text-amber-800">
            <PauseCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Paused / Under Review</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{pausedCount}</h4>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
            <Filter className="w-4 h-4 text-primary" />
            <span>Category:</span>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg flex-wrap">
            {['All', 'Housing', 'Energy', 'Healthcare', 'Social Security', 'Education'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === cat ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-outline-variant/60 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg text-xs font-bold text-on-surface px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schemes Table */}
      <Table
        data={filteredSchemes}
        columns={columns}
        searchPlaceholder="Search scheme code, name, category, description..."
        pageSize={10}
      />

      {/* Confirm Action Dialog */}
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: '', scheme: null })}
        onConfirm={() => {
          if (confirmModal.type === 'delete') handleDelete(confirmModal.scheme);
          else handleStatusToggle(confirmModal.scheme);
        }}
        title={
          confirmModal.type === 'delete'
            ? 'Retire / Delete Scheme'
            : confirmModal.type === 'pause'
            ? 'Pause Scheme Enrollment'
            : 'Resume Scheme Enrollment'
        }
        message={
          confirmModal.type === 'delete'
            ? `Are you sure you want to delete "${confirmModal.scheme?.name}"? Existing beneficiaries will remain in legacy archives, but no new applications can be accepted.`
            : confirmModal.type === 'pause'
            ? `Pausing "${confirmModal.scheme?.name}" will temporarily hide this scheme from the public citizen portal.`
            : `Resuming "${confirmModal.scheme?.name}" will allow citizens to submit new applications immediately.`
        }
        confirmText={confirmModal.type === 'delete' ? 'Delete Scheme' : confirmModal.type === 'pause' ? 'Pause Scheme' : 'Resume Scheme'}
        variant={confirmModal.type === 'activate' ? 'primary' : 'danger'}
      />
    </div>
  );
}

export default SchemeManagement;
