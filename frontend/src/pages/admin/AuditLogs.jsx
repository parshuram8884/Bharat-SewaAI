import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  FileSpreadsheet,
  Clock,
  User,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Server
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export function AuditLogs() {
  const { showToast } = useToast();
  
  const [actorFilter, setActorFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');

  const [logs, setLogs] = useState([
    {
      id: 'AUD-99401',
      timestamp: '25 Jul 2024, 12:14:20 IST',
      actor: 'Tejas Mail (Super Admin)',
      action: 'Scheme Parameter Update',
      target: 'Scheme ID: SCH-001 (PMAY-G)',
      ip: '164.100.128.45 (NIC Secure VPN)',
      status: 'Success'
    },
    {
      id: 'AUD-99400',
      timestamp: '25 Jul 2024, 12:10:05 IST',
      actor: 'Automated AI Triage Copilot',
      action: 'Biometric Hash Verification',
      target: 'Application ID: APP-002',
      ip: '10.240.0.12 (UIDAI Internal Gateway)',
      status: 'Success'
    },
    {
      id: 'AUD-99399',
      timestamp: '25 Jul 2024, 11:55:40 IST',
      actor: 'Tejas Mail (Super Admin)',
      action: 'Document Discrepancy Flag',
      target: 'Citizen ID: CIT-003 (Rakesh Prasad)',
      ip: '164.100.128.45 (NIC Secure VPN)',
      status: 'Flagged'
    },
    {
      id: 'AUD-99398',
      timestamp: '25 Jul 2024, 10:30:12 IST',
      actor: 'Automated NIC Cron',
      action: 'Database Snapshot Dump',
      target: 'Replica Node: IN-WEST-01',
      ip: '127.0.0.1 (Localhost Cluster)',
      status: 'Success'
    },
    {
      id: 'AUD-99397',
      timestamp: '25 Jul 2024, 09:15:00 IST',
      actor: 'Rajesh Kumar (CSC Operator)',
      action: 'Attempted Unverified Login',
      target: 'Portal Auth Gateway',
      ip: '117.220.10.88 (External ISP)',
      status: 'Blocked'
    },
    {
      id: 'AUD-99396',
      timestamp: '24 Jul 2024, 16:45:22 IST',
      actor: 'Tejas Mail (Super Admin)',
      action: 'Bulk Application Approval',
      target: 'Batch: 42 Applications (Ayushman)',
      ip: '164.100.128.45 (NIC Secure VPN)',
      status: 'Success'
    }
  ]);

  const filteredLogs = useMemo(() => {
    return (logs || []).filter((log) => {
      const matchActor = actorFilter === 'All' || (log?.actor || '').toLowerCase().includes((actorFilter || '').toLowerCase());
      const matchAction = actionFilter === 'All' || (log?.action || '').toLowerCase().includes((actionFilter || '').toLowerCase());
      return matchActor && matchAction;
    });
  }, [logs, actorFilter, actionFilter]);

  const handleExport = () => {
    showToast('Exporting immutable SHA256 cryptographic audit logs to CSV...', 'success');
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Log ID',
        cell: ({ row }) => <span className="font-mono font-bold text-primary">{row.original.id}</span>
      },
      {
        accessorKey: 'timestamp',
        header: 'Timestamp (IST)',
        cell: ({ row }) => <span className="text-xs font-mono text-on-surface-variant">{row.original.timestamp}</span>
      },
      {
        accessorKey: 'actor',
        header: 'Actor / System Process',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary-fixed/40 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
              {row.original.actor.includes('Admin') ? 'AD' : row.original.actor.includes('AI') ? 'AI' : 'SYS'}
            </div>
            <span className="font-bold text-on-surface text-xs">{row.original.actor}</span>
          </div>
        )
      },
      {
        accessorKey: 'action',
        header: 'Action Executed',
        cell: ({ row }) => <span className="font-semibold text-on-surface text-xs">{row.original.action}</span>
      },
      {
        accessorKey: 'target',
        header: 'Target Entity / Record',
        cell: ({ row }) => <span className="text-xs font-mono text-on-surface-variant">{row.original.target}</span>
      },
      {
        accessorKey: 'ip',
        header: 'Network IP & Gateway',
        cell: ({ row }) => <span className="text-xs font-mono text-on-surface-variant">{row.original.ip}</span>
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const st = row.original.status;
          return (
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              st === 'Success' ? 'bg-green-100 text-green-800' : st === 'Flagged' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {st}
            </span>
          );
        }
      }
    ],
    []
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-5">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">System Audit & Security Logs</h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Immutable cryptographic trail of all administrative actions, data exports, API triages, and security events.
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
            <span>Export Audit CSV</span>
          </Button>
        </div>
      </div>

      {/* Security Status Banner */}
      <div className="p-4 rounded-2xl bg-primary-fixed/20 border border-primary/20 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-primary shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-on-surface">NIC Tamper-Proof Log Ledger Active</h4>
            <p className="text-xs text-on-surface-variant">All log records are digitally signed with SHA-256 hashes and backed up to WORM (Write Once Read Many) storage.</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
          Ledger Integrity: 100% Verified
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
            <Filter className="w-4 h-4 text-primary" />
            <span>Filter Actor:</span>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg flex-wrap">
            {['All', 'Tejas Mail', 'AI Triage', 'NIC Cron'].map((act) => (
              <button
                key={act}
                onClick={() => setActorFilter(act)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  actorFilter === act ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {act}
              </button>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-outline-variant/60 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">Action Type:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg text-xs font-bold text-on-surface px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Actions</option>
              <option value="Approval">Approvals</option>
              <option value="Parameter">Parameter Updates</option>
              <option value="Document">Document Audits</option>
              <option value="Login">Authentication Events</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-semibold text-on-surface-variant">
          Showing <span className="font-bold text-on-surface">{filteredLogs.length}</span> audit events
        </div>
      </div>

      {/* Audit Logs Table */}
      <Table
        data={filteredLogs}
        columns={columns}
        searchPlaceholder="Search Log ID, actor name, action, target ID, IP address..."
        pageSize={10}
      />
    </div>
  );
}

export default AuditLogs;
