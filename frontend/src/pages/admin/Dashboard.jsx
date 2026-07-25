import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  Layers,
  Timer,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Filter,
  Eye,
  Bot,
  TrendingUp,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export function Dashboard() {
  const { stats, applications } = useAdminData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('Last 12 Months');

  const handleGenerateReport = () => {
    showToast('Compiling comprehensive governance PDF report... Download started!', 'success');
  };

  const statCards = [
    {
      title: 'Total Citizens',
      value: (stats?.totalCitizens || 1284092).toLocaleString('en-IN'),
      change: '+12%',
      isPositive: true,
      icon: Users,
      iconBg: 'bg-primary-fixed text-primary',
      badgeBg: 'bg-green-100 text-green-700'
    },
    {
      title: 'Total Applications',
      value: (stats?.totalApplications || 0).toLocaleString('en-IN'),
      change: '+5.4%',
      isPositive: true,
      icon: FileText,
      iconBg: 'bg-secondary-fixed text-secondary',
      badgeBg: 'bg-green-100 text-green-700'
    },
    {
      title: 'Pending Approvals',
      value: (stats?.pendingApprovals || 0).toLocaleString('en-IN'),
      change: '-2.1%',
      isPositive: false,
      icon: Clock,
      iconBg: 'bg-amber-100 text-amber-800',
      badgeBg: 'bg-error-container text-error'
    },
    {
      title: 'Approved',
      value: (stats?.approvedApplications || 0).toLocaleString('en-IN'),
      change: '+18%',
      isPositive: true,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100 text-emerald-800',
      badgeBg: 'bg-green-100 text-green-700'
    },
    {
      title: 'Active Schemes',
      value: (stats?.activeSchemes || 0).toLocaleString('en-IN'),
      change: '+2 new',
      isPositive: true,
      icon: Layers,
      iconBg: 'bg-blue-100 text-blue-800',
      badgeBg: 'bg-blue-50 text-blue-700'
    },
    {
      title: 'SLA Compliance',
      value: `${stats?.slaCompliance || 99.4}%`,
      change: '+0.8%',
      isPositive: true,
      icon: Timer,
      iconBg: 'bg-purple-100 text-purple-800',
      badgeBg: 'bg-green-100 text-green-700'
    },
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const barHeights = ['40%', '55%', '45%', '75%', '65%', '85%', '95%'];

  const schemeBars = [
    { name: 'Pradhan Mantri Awas Yojana (PMAY)', count: '12,402', percent: '75%', color: 'bg-primary' },
    { name: 'Pradhan Mantri Ujjwala Yojana', count: '9,845', percent: '60%', color: 'bg-secondary' },
    { name: 'Ayushman Bharat (PM-JAY)', count: '15,920', percent: '92%', color: 'bg-emerald-600' },
    { name: 'National Old Age Pension Scheme', count: '7,135', percent: '45%', color: 'bg-amber-600' },
  ];

  const complaintCategories = [
    { label: 'Infrastructure & Connectivity', percent: '45%', color: 'bg-primary', dot: 'bg-primary' },
    { label: 'Scheme Eligibility & Subsidy', percent: '30%', color: 'bg-secondary', dot: 'bg-secondary' },
    { label: 'Staff Conduct & Delay', percent: '15%', color: 'bg-amber-600', dot: 'bg-amber-600' },
    { label: 'Others & Documentation', percent: '10%', color: 'bg-surface-container-highest', dot: 'bg-slate-400' },
  ];

  const recentApps = applications.slice(0, 5);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-outline-variant/30 pb-5">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">System Overview</h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Real-time governance metrics, AI SLA predictions, and citizen engagement analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/ai-analytics')}
            className="hidden sm:inline-flex gap-2 border-primary/30 text-primary hover:bg-primary-fixed/20 font-bold"
          >
            <Bot className="w-4 h-4 text-primary animate-bounce" />
            <span>AI Insights</span>
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={handleGenerateReport}
            className="flex items-center gap-2 font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Generate Report</span>
          </Button>
        </div>
      </div>

      {/* ANALYTIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => {
                if (card.title.includes('Citizens')) navigate('/citizens');
                else if (card.title.includes('Applications') || card.title.includes('Pending') || card.title.includes('Approved')) navigate('/applications');
                else if (card.title.includes('Schemes')) navigate('/schemes');
                else if (card.title.includes('SLA')) navigate('/reports');
              }}
              className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2.5 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${card.badgeBg}`}>
                  {card.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {card.change}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{card.title}</p>
                <h3 className="text-2xl font-heading font-extrabold text-on-surface mt-1 group-hover:text-primary transition-colors">
                  {card.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Trend - 8 Cols */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-heading text-lg font-bold text-on-surface flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Monthly Application Trend</span>
              </h4>
              <p className="text-xs text-on-surface-variant mt-0.5">Application submission velocity across states</p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-surface-container border border-outline-variant rounded-lg text-xs font-semibold text-on-surface px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
              <option>Current Year (2024)</option>
            </select>
          </div>

          {/* Simulated Bar/Line Chart */}
          <div className="h-64 w-full flex items-end gap-3 sm:gap-6 pt-4 pb-2 px-2 border-b border-outline-variant/30">
            {months.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full bg-secondary-container/30 rounded-t-xl relative overflow-hidden transition-all duration-300 group-hover:bg-secondary-container/60 flex items-end" style={{ height: barHeights[i] }}>
                  <div className="w-full bg-secondary h-2 group-hover:h-full transition-all duration-500 opacity-90 rounded-t-xl" />
                  <span className="absolute top-2 inset-x-0 text-center text-[10px] font-bold text-on-secondary-container opacity-0 group-hover:opacity-100 transition-opacity">
                    {Math.floor(parseInt(barHeights[i]) * 120)}
                  </span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">{m}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 text-xs text-on-surface-variant font-medium">
            <span>Peak activity detected in July due to monsoon agriculture subsidy deadlines.</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">+24.5% vs last year</span>
          </div>
        </div>

        {/* Resolution Rate (Gauge/Donut) - 4 Cols */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-heading text-lg font-bold text-on-surface mb-1">Resolution Rate</h4>
            <p className="text-xs text-on-surface-variant">SLA completion target within 72 hrs</p>
          </div>
          
          <div className="my-6 flex flex-col items-center justify-center relative">
            <div className="relative w-44 h-44 rounded-full border-[14px] border-surface-container-highest flex items-center justify-center shadow-inner">
              <div className="absolute inset-0 rounded-full border-[14px] border-primary border-b-transparent border-l-transparent rotate-45 transition-transform duration-1000" />
              <div className="text-center">
                <span className="text-4xl font-heading font-extrabold text-primary">82%</span>
                <p className="text-xs font-semibold text-on-surface-variant mt-1">Target: 90%</p>
              </div>
            </div>
          </div>

          <div className="w-full space-y-3 pt-2 border-t border-outline-variant/30">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-on-surface-variant">Avg. Response Time</span>
              <span className="text-on-surface font-bold bg-surface-container px-2 py-0.5 rounded">14.2 Hours</span>
            </div>
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-[82%] rounded-full transition-all duration-1000" />
            </div>
          </div>
        </div>

        {/* Applications by Scheme (Bar Chart) - 6 Cols */}
        <div className="lg:col-span-6 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-heading text-lg font-bold text-on-surface">Applications by Scheme</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">Distribution across top national initiatives</p>
            </div>
            <button
              onClick={() => navigate('/schemes')}
              className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View Schemes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-5">
            {schemeBars.map((bar, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface">{bar.name}</span>
                  <span className="font-bold text-on-surface">{bar.count} <span className="text-on-surface-variant font-normal">({bar.percent})</span></span>
                </div>
                <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full ${bar.color} rounded-full transition-all duration-700`} style={{ width: bar.percent }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complaints by Category (Pie Chart) - 6 Cols */}
        <div className="lg:col-span-6 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-heading text-lg font-bold text-on-surface">Complaints by Category</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">Grievance taxonomy Breakdown</p>
            </div>
            <button
              onClick={() => navigate('/complaints')}
              className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View Tickets</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto">
            {/* Simulated Donut Visual */}
            <div className="w-36 h-36 shrink-0 rounded-full border-[24px] border-primary relative flex items-center justify-center shadow-md">
              <div className="absolute inset-[-24px] rounded-full border-[24px] border-secondary border-t-transparent border-l-transparent rotate-[120deg]" />
              <div className="absolute inset-[-24px] rounded-full border-[24px] border-amber-600 border-b-transparent border-r-transparent rotate-[45deg]" />
              <div className="text-center font-bold text-sm text-on-surface">
                452 <span className="block text-[10px] text-on-surface-variant font-normal">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2.5 w-full">
              {complaintCategories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${cat.dot} shrink-0`} />
                    <span className="text-on-surface-variant truncate max-w-[180px] sm:max-w-xs">{cat.label}</span>
                  </div>
                  <span className="font-bold text-on-surface">{cat.percent}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY TABLE */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant/40 flex justify-between items-center bg-surface-container-low/40">
          <div>
            <h4 className="font-heading text-lg font-bold text-on-surface">Recent Applications</h4>
            <p className="text-xs text-on-surface-variant mt-0.5">Latest citizen submissions awaiting triage or processing</p>
          </div>
          <Link to="/applications" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            <span>View All ({applications.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-semibold tracking-wider border-b border-outline-variant/40">
              <tr>
                <th className="px-6 py-3.5">Application ID</th>
                <th className="px-6 py-3.5">Citizen Name</th>
                <th className="px-6 py-3.5">Scheme</th>
                <th className="px-6 py-3.5">Submission Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-sm">
              {recentApps.map((app) => (
                <tr key={app.id} className="hover:bg-surface-container-low/70 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-primary">
                    <Link to={`/applications/${app.id}`} className="hover:underline">
                      {app.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed/60 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                        {app.citizenName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <span className="font-bold text-on-surface block">{app.citizenName}</span>
                        <span className="text-xs text-on-surface-variant font-mono">{app.citizenId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-on-surface font-medium max-w-xs truncate" title={app.schemeName}>
                    {app.schemeName}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant text-xs">
                    {app.submissionDate}
                  </td>
                  <td className="px-6 py-4">
                    <Badge>{app.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/applications/${app.id}`)}
                      className="text-on-surface-variant hover:text-primary p-1.5"
                      title="Review application"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FLOATING AI ASSISTANT BUTTON */}
      <button
        onClick={() => {
          showToast('AI Administrative Copilot launched. How can I assist you with portal triage today?', 'info');
          navigate('/ai-analytics');
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border-2 border-primary-container"
        title="AI Governance Assistant"
      >
        <Bot className="w-7 h-7 animate-pulse group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}

export default Dashboard;
