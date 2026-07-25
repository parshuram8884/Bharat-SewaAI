import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  ShieldCheck,
  BrainCircuit,
  Database,
  Key,
  Bell,
  CheckCircle2,
  Save,
  RefreshCw,
  Lock,
  Globe,
  Sliders
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Tabs } from '../../components/common/Tabs';
import { Input } from '../../components/common/Input';

export function Settings() {
  const { user } = useAdminAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || 'Tejas Mail');
  const [email, setEmail] = useState(user?.email || 'admin@bharatsewa.gov.in');
  const [aiThreshold, setAiThreshold] = useState('90');
  const [slaHours, setSlaHours] = useState('72');
  const [twoFactor, setTwoFactor] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Admin profile and security credentials updated successfully!', 'success');
  };

  const handleSaveSystem = (e) => {
    e.preventDefault();
    showToast('System parameters and AI triage thresholds saved to global configuration!', 'success');
  };

  const handleBackup = () => {
    showToast('Initiating encrypted database snapshot dump to NIC National Data Centre... Completed!', 'success');
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-5">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">System Configuration & Settings</h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Manage administrative profile security, AI triage confidence thresholds, API gateway protocols, and maintenance modes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleBackup}
            className="flex items-center gap-2 font-bold"
          >
            <Database className="w-4 h-4 text-primary" />
            <span>Trigger DB Backup</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'profile', label: '1. Profile & Security', icon: User },
          { id: 'system', label: '2. AI & SLA Thresholds', icon: Sliders },
          { id: 'integrations', label: '3. API Gateways', icon: Globe },
          { id: 'maintenance', label: '4. Maintenance & Backups', icon: Database },
        ]}
      />

      {/* TAB 1: PROFILE & SECURITY */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
          <div className="lg:col-span-7 space-y-6">
            <Card title="Administrative Credentials">
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <Input
                  label="Full Administrative Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Official Government Email (@gov.in or @nic.in)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                    Assigned Role & Jurisdiction
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Super Administrator • All India Central Jurisdiction"
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low p-3.5 text-sm font-bold text-on-surface cursor-not-allowed opacity-80"
                  />
                </div>

                <div className="pt-3 border-t border-outline-variant/30 flex justify-end">
                  <Button variant="primary" type="submit" className="font-bold flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    <span>Save Profile</span>
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card title="Two-Factor Authentication (2FA) Protocol">
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-outline-variant/40">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <h5 className="font-bold text-on-surface">Aadhaar Biometric & OTP 2FA</h5>
                      <p className="text-xs text-on-surface-variant">Required for accessing citizen digital locker records.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactor}
                    onChange={(e) => setTwoFactor(e.target.checked)}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-primary-fixed/20 border border-primary/20 text-xs space-y-2">
                  <p className="font-bold text-primary flex items-center gap-1.5">
                    <Key className="w-4 h-4" />
                    <span>Session Security Enforcement</span>
                  </p>
                  <p className="text-on-surface-variant">
                    All administrative sessions automatically terminate after 30 minutes of inactivity in compliance with NIC cybersecurity standards.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM & AI THRESHOLDS */}
      {activeTab === 'system' && (
        <Card title="AI Copilot & SLA Parameter Controls" subtitle="Configure automated adjudication rules and alert timings">
          <form onSubmit={handleSaveSystem} className="space-y-6 max-w-2xl animate-in fade-in">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-bold text-on-surface">
                  AI Auto-Triage Confidence Threshold ({aiThreshold}%)
                </label>
                <span className="text-xs font-mono font-bold text-primary bg-primary-fixed/30 px-2 py-0.5 rounded">
                  {aiThreshold}% Match Required
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={aiThreshold}
                onChange={(e) => setAiThreshold(e.target.value)}
                className="w-full accent-primary cursor-pointer"
              />
              <p className="text-xs text-on-surface-variant mt-1">
                Applications where AI OCR and DigiLocker data match confidence exceeds {aiThreshold}% will be automatically approved without manual officer intervention.
              </p>
            </div>

            <Input
              label="Default Citizen SLA Resolution Window (Hours)"
              type="number"
              value={slaHours}
              onChange={(e) => setSlaHours(e.target.value)}
              helperText="Applications exceeding this duration will be highlighted in red as pending SLA violations."
            />

            <div className="pt-4 border-t border-outline-variant/30 flex justify-end">
              <Button variant="primary" type="submit" className="font-bold flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span>Save System Thresholds</span>
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 3: INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          {[
            { name: 'UIDAI Aadhaar Verification Gateway', status: 'Connected • API v2.4', ping: '12ms', desc: 'Real-time biometric and demographic e-KYC cross-reference.' },
            { name: 'DigiLocker Signed Document API', status: 'Connected • SHA256 Sync', ping: '24ms', desc: 'Direct ingestion of revenue certificates, ration cards, and caste proofs.' },
            { name: 'NPCI Aadhaar Payment Bridge (APB)', status: 'Active • DBT Routing', ping: '45ms', desc: 'Automated direct benefit transfer subsidy disbursement to bank accounts.' },
            { name: 'NIC Cellular SMS & WhatsApp Gateway', status: 'Operational • 99.8% Uptime', ping: '18ms', desc: 'High-speed citizen broadcast messaging and OTP delivery.' },
          ].map((int, idx) => (
            <Card key={idx} className="flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-base text-on-surface leading-tight">{int.name}</h4>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Connected</span>
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{int.desc}</p>
              </div>
              <div className="pt-3 border-t border-outline-variant/30 flex justify-between items-center text-xs font-mono text-on-surface-variant">
                <span>Status: {int.status}</span>
                <span className="text-primary font-bold">Latency: {int.ping}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 4: MAINTENANCE */}
      {activeTab === 'maintenance' && (
        <Card title="Database Replication & Maintenance Controls" className="animate-in fade-in">
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between p-5 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="space-y-1">
                <h5 className="font-bold text-amber-900 text-base">Portal Maintenance Mode</h5>
                <p className="text-xs text-amber-800">
                  When activated, public citizen portals will display a temporary maintenance notice while administrators apply database migrations.
                </p>
              </div>
              <button
                onClick={() => {
                  setMaintenanceMode(!maintenanceMode);
                  showToast(`Maintenance mode ${!maintenanceMode ? 'ACTIVATED' : 'DEACTIVATED'}.`, !maintenanceMode ? 'warning' : 'success');
                }}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  maintenanceMode ? 'bg-amber-600 text-white shadow-md' : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100'
                }`}
              >
                {maintenanceMode ? 'Disable Mode' : 'Enable Mode'}
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h5 className="font-bold text-on-surface">Manual Database Snapshot Backup</h5>
                <p className="text-xs text-on-surface-variant mt-0.5">Last automated cron backup completed today at 04:00 AM IST.</p>
              </div>
              <Button variant="primary" onClick={handleBackup} className="font-bold">
                <Database className="w-4 h-4 mr-1.5" />
                <span>Run Snapshot Dump</span>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Settings;
