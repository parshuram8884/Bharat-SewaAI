import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  Eye,
  Trash2,
  Lock,
  Unlock,
  Filter,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  FileSpreadsheet
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';

export function CitizensList() {
  const { citizens, updateCitizenStatus, deleteCitizen } = useAdminData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  
  // Confirm dialog state
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', citizen: null });
  // New Citizen Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCitizen, setNewCitizen] = useState({ name: '', phone: '', state: 'Maharashtra', email: '' });

  const filteredCitizens = useMemo(() => {
    return citizens.filter((c) => {
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchState = stateFilter === 'All' || c.state === stateFilter;
      return matchStatus && matchState;
    });
  }, [citizens, statusFilter, stateFilter]);

  const handleStatusToggle = (citizen) => {
    const newStatus = citizen.status === 'Active' ? 'Suspended' : 'Active';
    updateCitizenStatus(citizen.id, newStatus);
    showToast(`Citizen profile ${citizen.id} (${citizen.name}) changed to ${newStatus}.`, 'info');
    setConfirmModal({ isOpen: false, type: '', citizen: null });
  };

  const handleDelete = (citizen) => {
    deleteCitizen(citizen.id);
    showToast(`Citizen profile ${citizen.id} permanently deleted.`, 'error');
    setConfirmModal({ isOpen: false, type: '', citizen: null });
  };

  const handleAddCitizenSubmit = (e) => {
    e.preventDefault();
    if (!newCitizen.name || !newCitizen.phone) {
      showToast('Please provide Name and Phone number.', 'error');
      return;
    }
    showToast(`New citizen profile created for ${newCitizen.name}. Aadhaar invitation sent!`, 'success');
    setIsAddModalOpen(false);
    setNewCitizen({ name: '', phone: '', state: 'Maharashtra', email: '' });
  };

  const handleExportCSV = () => {
    showToast('Exporting 1,284,092 citizen records to secure encrypted CSV... Download starting.', 'success');
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Citizen ID',
        cell: ({ row }) => (
          <span
            onClick={() => navigate(`/citizens/${row.original.id}`)}
            className="font-mono font-bold text-primary hover:underline cursor-pointer"
          >
            {row.original.id}
          </span>
        )
      },
      {
        accessorKey: 'name',
        header: 'Citizen Details',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-fixed/50 border border-primary-container flex items-center justify-center font-bold text-primary shrink-0">
              {row.original.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <span className="font-bold text-on-surface block leading-tight">{row.original.name}</span>
              <span className="text-xs text-on-surface-variant font-mono">{row.original.aadhaarMasked}</span>
            </div>
          </div>
        )
      },
      {
        accessorKey: 'phone',
        header: 'Contact Info',
        cell: ({ row }) => (
          <div className="space-y-0.5 text-xs">
            <div className="flex items-center gap-1.5 text-on-surface font-mono font-medium">
              <Phone className="w-3.5 h-3.5 text-on-surface-variant" />
              <span>{row.original.phone}</span>
            </div>
            {row.original.email && (
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate max-w-[160px]">{row.original.email}</span>
              </div>
            )}
          </div>
        )
      },
      {
        accessorKey: 'state',
        header: 'State / District',
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <span className="font-bold text-sm text-on-surface block">{row.original.state}</span>
            <span className="text-xs text-on-surface-variant flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {row.original.district}
            </span>
          </div>
        )
      },
      {
        accessorKey: 'verification',
        header: 'KYC / Aadhaar',
        cell: ({ row }) => <Badge>{row.original.verification}</Badge>
      },
      {
        accessorKey: 'status',
        header: 'Account Status',
        cell: ({ row }) => <Badge>{row.original.status}</Badge>
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const citizen = row.original;
          const isSuspended = citizen.status === 'Suspended';
          return (
            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/citizens/${citizen.id}`)}
                className="p-1.5 text-on-surface-variant hover:text-primary"
                title="View Full Profile & Digital Locker"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmModal({ isOpen: true, type: isSuspended ? 'activate' : 'suspend', citizen })}
                className={`p-1.5 ${isSuspended ? 'text-amber-600 hover:text-emerald-600' : 'text-on-surface-variant hover:text-amber-600'}`}
                title={isSuspended ? 'Activate Account' : 'Suspend Account'}
              >
                {isSuspended ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmModal({ isOpen: true, type: 'delete', citizen })}
                className="p-1.5 text-on-surface-variant hover:text-error"
                title="Delete Citizen Record"
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

  const activeCount = citizens.filter((c) => c.status === 'Active').length;
  const verifiedCount = citizens.filter((c) => c.verification === 'Verified').length;
  const suspendedCount = citizens.filter((c) => c.status === 'Suspended').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-5">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">Citizen Directory</h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Manage registered citizen accounts, KYC verification status, and digital locker governance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleExportCSV}
            className="flex items-center gap-2 font-bold"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 font-bold shadow-md hover:shadow-lg"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Citizen</span>
          </Button>
        </div>
      </div>

      {/* Mini Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-primary-fixed/50 text-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Total Citizens</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{citizens.length}</h4>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Active Profiles</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{activeCount}</h4>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-700">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Aadhaar Verified</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{verifiedCount}</h4>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex items-center gap-3 shadow-2xs">
          <div className="p-3 rounded-lg bg-error-container text-error">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Suspended</p>
            <h4 className="text-xl font-heading font-extrabold text-on-surface">{suspendedCount}</h4>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
            <Filter className="w-4 h-4 text-primary" />
            <span>Filter Status:</span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-lg">
            {['All', 'Active', 'Suspended'].map((st) => (
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
            <span className="text-xs font-bold text-on-surface-variant">State:</span>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg text-xs font-bold text-on-surface px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All States / Districts</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Bihar">Bihar</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-semibold text-on-surface-variant">
          Showing <span className="font-bold text-on-surface">{filteredCitizens.length}</span> of <span className="font-bold text-on-surface">{citizens.length}</span> records
        </div>
      </div>

      {/* Citizens Table */}
      <Table
        data={filteredCitizens}
        columns={columns}
        searchPlaceholder="Search by Citizen ID, name, Aadhaar number, phone, email, state..."
        pageSize={10}
      />

      {/* Confirm Action Dialog */}
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: '', citizen: null })}
        onConfirm={() => {
          if (confirmModal.type === 'delete') handleDelete(confirmModal.citizen);
          else handleStatusToggle(confirmModal.citizen);
        }}
        title={
          confirmModal.type === 'delete'
            ? 'Delete Citizen Profile'
            : confirmModal.type === 'suspend'
            ? 'Suspend Citizen Account'
            : 'Activate Citizen Account'
        }
        message={
          confirmModal.type === 'delete'
            ? `Are you sure you want to permanently delete ${confirmModal.citizen?.name} (${confirmModal.citizen?.id})? This will remove their digital locker records and cannot be undone.`
            : confirmModal.type === 'suspend'
            ? `Suspending ${confirmModal.citizen?.name}'s account will prevent them from applying for new government schemes or accessing their digital locker.`
            : `Activating ${confirmModal.citizen?.name}'s account will restore full access to government schemes and digital locker services.`
        }
        confirmText={
          confirmModal.type === 'delete' ? 'Delete Profile' : confirmModal.type === 'suspend' ? 'Suspend Account' : 'Activate Account'
        }
        variant={confirmModal.type === 'activate' ? 'primary' : 'danger'}
      />

      {/* Add Citizen Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Citizen Profile"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddCitizenSubmit} className="space-y-4">
          <Input
            label="Full Legal Name"
            placeholder="e.g. Rahul Verma"
            value={newCitizen.name}
            onChange={(e) => setNewCitizen({ ...newCitizen, name: e.target.value })}
            required
          />
          <Input
            label="Mobile Number"
            placeholder="+91 9876543210"
            value={newCitizen.phone}
            onChange={(e) => setNewCitizen({ ...newCitizen, phone: e.target.value })}
            required
          />
          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="rahul.v@gmail.com"
            value={newCitizen.email}
            onChange={(e) => setNewCitizen({ ...newCitizen, email: e.target.value })}
          />
          <Select
            label="State of Residence"
            value={newCitizen.state}
            onChange={(e) => setNewCitizen({ ...newCitizen, state: e.target.value })}
            options={['Maharashtra', 'Uttar Pradesh', 'Bihar', 'Delhi', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'West Bengal', 'Rajasthan']}
          />
          <div className="pt-4 border-t border-outline-variant/40 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit font-bold">
              Register Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CitizensList;
