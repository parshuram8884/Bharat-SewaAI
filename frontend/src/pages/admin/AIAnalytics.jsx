import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Zap,
  Send,
  ArrowUpRight,
  BarChart3,
  Users,
  BrainCircuit,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export function AIAnalytics() {
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [aiHistory, setAiHistory] = useState([
    {
      id: 1,
      prompt: 'Analyze application processing bottlenecks across northern states.',
      response:
        '**AI Diagnostic Finding:** Pradhan Mantri Awas Yojana (PMAY) applications in Uttar Pradesh and Bihar show an average delay of 4.2 days during the Land Ownership verification step.\n\n**Root Cause:** Manual verification of rural land records (Khatauni) by local Tahsildar offices.\n\n**Actionable Recommendation:** Activate automated API handshake with UP Bhulekh and Bihar Bhumi state land registry servers to reduce verification time from 4 days to <3 seconds.',
      tag: 'Bottleneck Identified',
      tagColor: 'bg-amber-100 text-amber-800'
    }
  ]);

  const handleAiQuery = (customPrompt) => {
    const promptText = customPrompt || query;
    if (!promptText.trim()) return;

    setIsAnalyzing(true);
    setQuery('');
    showToast('AI Governance Copilot processing neural analysis...', 'info');

    setTimeout(() => {
      let responseText = '';
      let tag = 'Predictive Insight';
      let tagColor = 'bg-blue-100 text-blue-800';

      if (promptText.toLowerCase().includes('demand') || promptText.toLowerCase().includes('monsoon')) {
        responseText =
          '**Predictive Scheme Demand:** Based on historical weather patterns and agricultural census data, demand for **PM Kisan Samman Nidhi** is projected to spike by **+35% in July 2024**.\n\n**Server Load Recommendation:** Auto-scale DigiLocker e-KYC microservices in Maharashtra and Madhya Pradesh clusters by 2.5x to prevent gateway timeouts.';
        tag = 'Demand Spike Projected';
        tagColor = 'bg-purple-100 text-purple-800';
      } else if (promptText.toLowerCase().includes('sentiment') || promptText.toLowerCase().includes('grievance')) {
        responseText =
          '**Citizen Sentiment Analysis:** Overall portal satisfaction is at an all-time high of **88% (4.6/5.0)**.\n\n**Key Positive Driver:** Rapid 15-minute Aadhaar biometric approval for LPG subsidies.\n**Area of Friction:** 12% of complaints cite confusion over income certificate expiration dates.';
        tag = 'Sentiment Report';
        tagColor = 'bg-emerald-100 text-emerald-800';
      } else if (promptText.toLowerCase().includes('fraud') || promptText.toLowerCase().includes('duplicate')) {
        responseText =
          '**AI Security & Fraud Radar:** Detected and blocked **14 attempted duplicate applications** across pension schemes where multiple citizen profiles shared identical biometric hashes.\n\n**Action Taken:** Automatic account flagging and alert sent to UIDAI verification officers.';
        tag = 'Fraud Prevented';
        tagColor = 'bg-rose-100 text-rose-800';
      } else {
        responseText =
          `**AI Governance Synthesis for:** "${promptText}"\n\n**System Assessment:** Portal metrics indicate robust performance across all 14 state nodes. Average SLA completion rate stands at 94.2%.\n\n**Recommended Optimization:** Enable continuous background e-KYC syncing during off-peak hours (02:00 - 04:00 IST) to further optimize database query throughput.`;
      }

      setAiHistory((prev) => [
        { id: Date.now(), prompt: promptText, response: responseText, tag, tagColor },
        ...prev
      ]);
      setIsAnalyzing(false);
      showToast('AI Analysis generated successfully!', 'success');
    }, 1200);
  };

  const quickChips = [
    'Analyze application bottleneck in Uttar Pradesh',
    'Predict scheme demand for Monsoon 2024',
    'Summarize citizen grievance sentiment & feedback',
    'Run fraud & duplicate Aadhaar detection scan'
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary text-on-primary">
              <Bot className="w-6 h-6 animate-pulse" />
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">AI Governance Intelligence</h2>
          </div>
          <p className="text-on-surface-variant font-medium mt-1">
            Predictive scheme demand forecasting, automated bottleneck diagnostics, and real-time SLA copilot.
          </p>
        </div>
        <Button
          variant="outline"
          size="md"
          onClick={() => {
            showToast('Re-training AI models on latest 24hr governance metrics...', 'info');
          }}
          className="font-bold flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4 text-primary" />
          <span>Refresh AI Models</span>
        </Button>
      </div>

      {/* AI Copilot Interactive Console */}
      <div className="bg-gradient-to-br from-primary-fixed/30 via-surface-container-lowest to-secondary-fixed/20 border-2 border-primary/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BrainCircuit className="w-64 h-64 text-primary" />
        </div>

        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-on-primary font-bold text-xs shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>AI Administrative Copilot active</span>
          </div>
          <h3 className="text-2xl font-heading font-extrabold text-on-surface">
            Ask the AI anything about portal triage or state analytics
          </h3>
          <p className="text-sm text-on-surface-variant font-medium">
            Type a governance query below or select a preset diagnostic prompt to test real-time AI reasoning.
          </p>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAiQuery();
          }}
          className="relative max-w-3xl z-10"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Why are agriculture subsidies spiking in Maharashtra?"
            disabled={isAnalyzing}
            className="w-full pl-5 pr-32 py-4 rounded-2xl border-2 border-primary/40 bg-surface-container-lowest text-base text-on-surface placeholder:text-on-surface-variant/60 shadow-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isAnalyzing || !query.trim()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>Analyze</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Preset Quick Chips */}
        <div className="flex items-center gap-2 flex-wrap relative z-10 pt-1">
          <span className="text-xs font-bold text-on-surface-variant">Try Prompt:</span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleAiQuery(chip)}
              disabled={isAnalyzing}
              className="px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/80 hover:border-primary hover:bg-primary-fixed/20 text-xs font-bold text-on-surface transition-all shadow-2xs active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* AI Predictive Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-primary-fixed text-primary font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              +4.5% vs Human
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">AI Auto-Triage Rate</p>
            <h4 className="text-2xl font-heading font-extrabold text-on-surface mt-0.5">94.2%</h4>
            <p className="text-xs text-on-surface-variant mt-1">Instant Level-1 verification</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-800 font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              1 Active Alert
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Avg. Delay Bottleneck</p>
            <h4 className="text-2xl font-heading font-extrabold text-on-surface mt-0.5">4.2 Days</h4>
            <p className="text-xs text-amber-700 font-bold mt-1">Land Records in UP & Bihar</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-rose-100 text-rose-800 font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              100% Blocked
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Fraud & Duplicate Radar</p>
            <h4 className="text-2xl font-heading font-extrabold text-on-surface mt-0.5">14 Blocked</h4>
            <p className="text-xs text-on-surface-variant mt-1">Aadhaar hash collision check</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              High Trust
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Citizen Sentiment Score</p>
            <h4 className="text-2xl font-heading font-extrabold text-on-surface mt-0.5">4.6 / 5.0</h4>
            <p className="text-xs text-emerald-700 font-bold mt-1">88% positive satisfaction</p>
          </div>
        </div>
      </div>

      {/* AI Analysis Feed & History */}
      <div className="space-y-4">
        <h3 className="font-heading text-xl font-bold text-on-surface flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-primary" />
          <span>Generated Intelligence Dossiers</span>
        </h3>

        <div className="space-y-6">
          {aiHistory.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-md space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between gap-4 border-b border-outline-variant/30 pb-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                    AI
                  </div>
                  <span className="font-bold text-base text-on-surface">Query: "{item.prompt}"</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${item.tagColor}`}>
                  {item.tag}
                </span>
              </div>

              <div className="text-sm text-on-surface leading-relaxed whitespace-pre-line font-medium bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
                {item.response}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast('Report insight exported to ministerial clipboard!', 'success')}
                  className="text-xs font-bold"
                >
                  Export Insight
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => showToast('AI automated recommendation executed! State API protocols updated.', 'success')}
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  <span>Execute Automated Fix</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIAnalytics;
