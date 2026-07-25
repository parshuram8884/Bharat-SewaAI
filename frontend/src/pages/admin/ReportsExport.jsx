import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  BarChart2,
  Share2,
  Eye,
  RefreshCw,
  FileCode,
  FileCheck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Select } from '../../components/common/Select';

export function ReportsExport() {
  const { showToast } = useToast();
  
  const [selectedTemplate, setSelectedTemplate] = useState('Executive Summary & SLA Performance');
  const [dateRange, setDateRange] = useState('Last 30 Days (Current Month)');
  const [format, setFormat] = useState('PDF Document (.pdf)');
  const [stateFilter, setStateFilter] = useState('All States (National Report)');
  const [isGenerating, setIsGenerating] = useState(false);

  const [generatedReports, setGeneratedReports] = useState([
    {
      id: 'REP-2024-089',
      title: 'Monthly SLA Compliance & Citizen Triage Audit',
      template: 'Executive Summary & SLA Performance',
      dateRange: 'July 1 - July 24, 2024',
      format: 'PDF',
      size: '4.2 MB',
      generatedBy: 'Tejas Mail',
      timestamp: 'Today, 11:42 AM',
      status: 'Ready'
    },
    {
      id: 'REP-2024-084',
      title: 'Q1 DBT Subsidy Fund Utilization Dump',
      template: 'Scheme Disbursement & DBT Audit Report',
      dateRange: 'April 1 - June 30, 2024',
      format: 'EXCEL',
      size: '18.5 MB',
      generatedBy: 'Automated NIC Cron',
      timestamp: 'Yesterday, 02:00 AM',
      status: 'Ready'
    },
    {
      id: 'REP-2024-071',
      title: 'Rural Housing Demographic Penetration Index',
      template: 'Citizen Demographic & Inclusion Index',
      dateRange: 'Full Year 2023 - 2024',
      format: 'CSV',
      size: '42.1 MB',
      generatedBy: 'Tejas Mail',
      timestamp: '18 Jul 2024',
      status: 'Ready'
    }
  ]);

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    showToast(`Compiling ${selectedTemplate} (${format})... Extracting 1.2M records.`, 'info');

    setTimeout(() => {
      const newRep = {
        id: `REP-2024-${Math.floor(100 + Math.random() * 899)}`,
        title: `${selectedTemplate} - ${dateRange}`,
        template: selectedTemplate,
        dateRange,
        format: format.includes('PDF') ? 'PDF' : format.includes('Excel') ? 'EXCEL' : 'CSV',
        size: `${(2 + Math.random() * 15).toFixed(1)} MB`,
        generatedBy: 'Tejas Mail (Super Admin)',
        timestamp: 'Just now',
        status: 'Ready'
      };
      setGeneratedReports((prev) => [newRep, ...prev]);
      setIsGenerating(false);
      showToast('Report compilation completed! Available for immediate download.', 'success');
    }, 1500);
  };

  const handleDownload = (rep) => {
    showToast(`Downloading secure signed file: ${rep.title} (${rep.size})...`, 'success');
  };

  const templates = [
    {
      name: 'Executive Summary & SLA Performance',
      desc: 'State-wise processing times, approval velocities, and officer SLA adherence ratings.',
      icon: Clock,
      color: 'bg-primary-fixed text-primary'
    },
    {
      name: 'Scheme Disbursement & DBT Audit Report',
      desc: 'Financial subsidy outflows, NPCI Aadhaar bank bridge status, and fund utilization analysis.',
      icon: FileSpreadsheet,
      color: 'bg-emerald-100 text-emerald-800'
    },
    {
      name: 'Citizen Demographic & Inclusion Index',
      desc: 'Rural vs urban penetration, gender parity metrics, and marginalized category coverage.',
      icon: BarChart2,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'Grievance & Complaint Redressal Log',
      desc: 'Ticket closure velocity, escalation trends, and root cause taxonomy breakdown.',
      icon: FileCheck,
      color: 'bg-amber-100 text-amber-800'
    }
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-5">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">Governance Reports & Analytics Export</h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Generate audit-ready national data exports, customized ministerial briefs, and financial DBT summaries.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => showToast('Syncing latest 15-minute cron database replica...', 'info')}
            className="font-bold flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-primary" />
            <span>Sync Replica</span>
          </Button>
        </div>
      </div>

      {/* Report Generator Wizard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card title="Step 1: Select Report Template" subtitle="Choose an analytical framework for data extraction">
            <div className="grid grid-cols-1 gap-3.5">
              {templates.map((t) => {
                const isSelected = selectedTemplate === t.name;
                const Icon = t.icon;
                return (
                  <div
                    key={t.name}
                    onClick={() => setSelectedTemplate(t.name)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary'
                        : 'bg-surface-container-lowest border-outline-variant/60 hover:bg-surface-container/40'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${t.color} shrink-0 mt-0.5`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm text-on-surface">{t.name}</h4>
                        {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card title="Step 2: Filter Parameters & Export Format" subtitle="Configure scope and output structure">
            <form onSubmit={handleGenerate} className="space-y-5">
              <Select
                label="Time Period / Date Range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                options={[
                  'Last 7 Days (Real-time Pulse)',
                  'Last 30 Days (Current Month)',
                  'Q1 2024 (Apr - Jun)',
                  'Q2 2024 (Jul - Sep)',
                  'Full Financial Year 2023 - 2024',
                  'Custom Date Range (Selected)'
                ]}
              />

              <Select
                label="Geographical Jurisdiction Scope"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                options={[
                  'All States (National Report)',
                  'Maharashtra State Node',
                  'Uttar Pradesh State Node',
                  'Bihar State Node',
                  'Delhi NCT Node',
                  'Karnataka State Node',
                  'Tamil Nadu State Node'
                ]}
              />

              <Select
                label="Output File Format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                options={[
                  'PDF Document (.pdf) - Best for presentation',
                  'Excel Spreadsheet (.xlsx) - Best for pivot tables',
                  'CSV Data Dump (.csv) - Best for raw ingestion',
                  'JSON API Payload (.json) - Best for system sync'
                ]}
              />

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-on-surface">
                  <span>Estimated Data Payload:</span>
                  <span className="text-primary font-mono">~ 45,000 records</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Digital Signature:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>NIC Automated Watermark</span>
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                type="submit"
                disabled={isGenerating}
                className="w-full justify-center py-3.5 font-bold shadow-lg text-base"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    <span>Compiling Data Dump...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    <span>Generate & Download Report</span>
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Generated Reports Archive */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-heading text-xl font-bold text-on-surface flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Generated Reports Archive</span>
          </h3>
          <span className="text-xs text-on-surface-variant">Stored on secure encrypted cloud storage for 90 days</span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low text-xs uppercase font-semibold text-on-surface-variant border-b border-outline-variant/40">
                <tr>
                  <th className="px-6 py-3.5">Report ID</th>
                  <th className="px-6 py-3.5">Report Title & Template</th>
                  <th className="px-6 py-3.5">Date Scope</th>
                  <th className="px-6 py-3.5">Format</th>
                  <th className="px-6 py-3.5">Generated By</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-sm">
                {generatedReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-primary">{rep.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-on-surface block leading-tight">{rep.title}</span>
                      <span className="text-xs text-on-surface-variant">{rep.template}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">{rep.dateRange}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        rep.format === 'PDF' ? 'bg-rose-100 text-rose-800' : rep.format === 'EXCEL' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {rep.format} • {rep.size}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">{rep.generatedBy}</td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">{rep.timestamp}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(rep)}
                        className="font-bold text-xs"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        <span>Download</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsExport;
