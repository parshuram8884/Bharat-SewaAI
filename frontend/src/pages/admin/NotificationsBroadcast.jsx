import React, { useState } from 'react';
import {
  Bell,
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  Users,
  CheckCircle2,
  Clock,
  Radio,
  AlertTriangle,
  Calendar,
  Filter,
  Eye
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';

export function NotificationsBroadcast() {
  const { showToast } = useToast();
  
  const [channel, setChannel] = useState('All Channels (SMS, WhatsApp, Email, Push)');
  const [audience, setAudience] = useState('All Registered Citizens (~1,284,092)');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);

  const [history, setHistory] = useState([
    {
      id: 'BRD-902',
      title: 'Monsoon Agriculture Subsidy Application Deadline',
      audience: 'Rural Farming Households (~450,000)',
      channel: 'SMS + WhatsApp',
      sentCount: '448,910',
      deliveryRate: '99.7%',
      date: 'Today, 09:30 AM',
      status: 'Delivered'
    },
    {
      id: 'BRD-884',
      title: 'DigiLocker Security Protocol Maintenance Window',
      audience: 'All Registered Citizens (~1,284,092)',
      channel: 'In-App Push + Email',
      sentCount: '1,280,400',
      deliveryRate: '99.9%',
      date: '22 Jul 2024, 04:00 PM',
      status: 'Delivered'
    },
    {
      id: 'BRD-812',
      title: 'Ayushman Bharat Golden Card Renewal Alert',
      audience: 'Ayushman Beneficiaries (~15,920)',
      channel: 'WhatsApp Alert',
      sentCount: '15,890',
      deliveryRate: '99.8%',
      date: '15 Jul 2024, 11:00 AM',
      status: 'Delivered'
    },
    {
      id: 'BRD-910',
      title: 'Independence Day Special Scholarship Launch',
      audience: 'Student Demographic (Age 18-24)',
      channel: 'All Channels',
      sentCount: 'Scheduled for 10 Aug',
      deliveryRate: '-',
      date: 'Scheduled (10 Aug 2024)',
      status: 'Scheduled'
    }
  ]);

  const handleSend = (e, scheduled = false) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast('Please provide both notification title and broadcast message content.', 'error');
      return;
    }

    setIsSending(true);
    showToast(
      scheduled
        ? 'Scheduling broadcast dispatch in queue...'
        : 'Initiating bulk broadcast gateway dispatch across cellular networks...',
      'info'
    );

    setTimeout(() => {
      const newBrd = {
        id: `BRD-${Math.floor(900 + Math.random() * 99)}`,
        title,
        audience: audience.split(' (')[0],
        channel: channel.split(' (')[0],
        sentCount: scheduled ? 'Scheduled' : '1,284,000',
        deliveryRate: scheduled ? '-' : '99.4%',
        date: scheduled ? 'Scheduled for Tomorrow' : 'Just now',
        status: scheduled ? 'Scheduled' : 'Delivered'
      };
      setHistory((prev) => [newBrd, ...prev]);
      setTitle('');
      setMessage('');
      setIsSending(false);
      setPreviewModal(false);
      showToast(
        scheduled
          ? 'Notification successfully scheduled in NIC dispatch cron!'
          : 'Broadcast successfully dispatched! 99.4% delivery confirmed by cellular gateway.',
        'success'
      );
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-5">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">Citizen Notification Broadcasts</h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Dispatch high-priority SMS, WhatsApp alerts, and portal announcements to citizen demographics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
            <span>Cellular Gateway: 100% Operational</span>
          </span>
        </div>
      </div>

      {/* Broadcast Composer & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card title="Compose Broadcast Campaign" subtitle="Define target citizen segment and multi-channel payload">
            <form onSubmit={(e) => handleSend(e, false)} className="space-y-5">
              <Select
                label="Target Audience Demographics"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                options={[
                  'All Registered Citizens (~1,284,092)',
                  'Active Scheme Beneficiaries (~75,000)',
                  'Rural Farming Households (~450,000)',
                  'Pending KYC / Aadhaar Unverified (~12,400)',
                  'Women Beneficiaries (Ujjwala Yojana)',
                  'Student Demographic (Age 18-24)',
                  'Senior Citizens (Pension Scheme)'
                ]}
              />

              <Select
                label="Dispatch Channels"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                options={[
                  'All Channels (SMS, WhatsApp, Email, Push)',
                  'SMS Cellular Broadcast (High Reach)',
                  'WhatsApp Business API Alert (Interactive)',
                  'DigiLocker In-App Push Notification',
                  'Registered Email Dispatch'
                ]}
              />

              <Input
                label="Campaign Subject / Title"
                placeholder="e.g. IMPORTANT: PM-JAY Health Card Verification Required"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-on-surface">
                    Message Payload Body
                  </label>
                  <span className={`text-xs font-mono ${message.length > 160 ? 'text-amber-600 font-bold' : 'text-on-surface-variant'}`}>
                    {message.length} / 320 chars ({Math.ceil((message.length || 1) / 160)} SMS units)
                  </span>
                </div>
                <textarea
                  rows={5}
                  placeholder="Enter the message text to be delivered to citizens. Avoid abbreviations or unofficial URLs..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/40">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setPreviewModal(true)}
                  disabled={!title.trim() || !message.trim()}
                  className="font-bold flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Device Render</span>
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={(e) => handleSend(e, true)}
                  disabled={isSending || !title.trim() || !message.trim()}
                  className="font-bold flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Later</span>
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSending || !title.trim() || !message.trim()}
                  className="font-bold flex items-center gap-2 shadow-lg"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Broadcasting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Broadcast Now</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Live Mobile Mockup */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
          <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/80 flex flex-col items-center">
            <h4 className="font-heading font-bold text-sm text-on-surface mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              <span>Citizen Mobile Screen Preview</span>
            </h4>

            {/* Simulated Smartphone Frame */}
            <div className="w-full max-w-[280px] bg-slate-900 rounded-[36px] p-3 shadow-2xl border-4 border-slate-700">
              <div className="w-20 h-4 bg-slate-800 rounded-b-xl mx-auto mb-3" />
              <div className="bg-slate-100 rounded-2xl p-3.5 space-y-3 min-h-[380px] flex flex-col justify-start">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold border-b pb-1.5 border-slate-200">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>BHARAT SEWA AI ALERT</span>
                  </span>
                  <span>Now</span>
                </div>

                <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Bell className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{title || 'Campaign Title Preview'}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal break-words whitespace-pre-wrap">
                    {message || 'Your broadcast message content will appear here exactly as delivered to citizen mobile handsets.'}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 font-semibold">
                    <span>Govt of India Official</span>
                    <span className="text-primary font-bold">Open Portal &gt;</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold">Aadhaar Verified SMS Gateway</span>
                </div>
              </div>
              <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className="space-y-4">
        <h3 className="font-heading text-xl font-bold text-on-surface flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>Broadcast Campaign History Logs</span>
        </h3>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low text-xs uppercase font-semibold text-on-surface-variant border-b border-outline-variant/40">
                <tr>
                  <th className="px-6 py-3.5">Campaign ID</th>
                  <th className="px-6 py-3.5">Subject Title</th>
                  <th className="px-6 py-3.5">Target Audience</th>
                  <th className="px-6 py-3.5">Channel</th>
                  <th className="px-6 py-3.5">Sent Count</th>
                  <th className="px-6 py-3.5">Delivery Rate</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-sm">
                {history.map((brd) => (
                  <tr key={brd.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-primary">{brd.id}</td>
                    <td className="px-6 py-4 font-bold text-on-surface max-w-xs truncate" title={brd.title}>{brd.title}</td>
                    <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">{brd.audience}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold bg-surface-container px-2 py-0.5 rounded">{brd.channel}</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-on-surface">{brd.sentCount}</td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-600">{brd.deliveryRate}</td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">{brd.date}</td>
                    <td className="px-6 py-4"><Badge>{brd.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={previewModal}
        onClose={() => setPreviewModal(false)}
        title="Multi-Channel Delivery Payload Preview"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 text-sm">
          <div className="p-4 rounded-xl bg-surface-container-low border space-y-2">
            <div className="flex justify-between font-bold text-xs text-primary uppercase">
              <span>SMS Cellular Text</span>
              <span>160 Char Unit</span>
            </div>
            <p className="font-mono text-xs bg-white p-3 rounded border text-slate-800">{title}: {message}</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex justify-between font-bold text-xs text-emerald-800 uppercase">
              <span>WhatsApp Business API Verified Template</span>
              <span>Interactive</span>
            </div>
            <div className="bg-white p-3 rounded border border-emerald-200 text-slate-800 space-y-2">
              <p className="font-bold">{title}</p>
              <p className="text-xs">{message}</p>
              <div className="pt-2 border-t flex justify-end">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded">
                  View in Bharat Sewa App &rarr;
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setPreviewModal(false)}>
              Close Preview
            </Button>
            <Button
              variant="primary"
              onClick={(e) => handleSend(e, false)}
              className="font-bold flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Confirm & Broadcast</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default NotificationsBroadcast;
