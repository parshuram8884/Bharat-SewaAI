import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ArrowLeft,
  Layers,
  FileText,
  CheckSquare,
  IndianRupee,
  ShieldCheck,
  Save,
  Info
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Tabs } from '../../components/common/Tabs';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';

const schemeSchema = z.object({
  code: z.string().min(2, 'Scheme code is required (e.g. PMAY-G)'),
  name: z.string().min(5, 'Full scheme title is required'),
  category: z.string().min(1, 'Please select a sector category'),
  subsidyAmount: z.string().min(1, 'Specify benefit award amount'),
  description: z.string().min(10, 'Provide a comprehensive description of the scheme'),
  minAge: z.string().optional(),
  maxIncome: z.string().optional(),
  ministry: z.string().optional(),
});

export function SchemeCreateEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { schemes, saveScheme } = useAdminData();
  const { showToast } = useToast();

  const isEdit = Boolean(id && id !== 'new');
  const existingScheme = schemes.find((s) => s.id === id);

  const [activeTab, setActiveTab] = useState('basic');
  const [selectedDocs, setSelectedDocs] = useState([
    'Aadhaar Card (Biometric Verified)',
    'Income Certificate (Tahsildar)',
    'Bank Passbook / DBT Account'
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schemeSchema),
    defaultValues: {
      code: '',
      name: '',
      category: 'Housing',
      subsidyAmount: '₹ 1,20,000 / beneficiary',
      description: '',
      minAge: '18',
      maxIncome: '₹ 3,00,000 / annum',
      ministry: 'Ministry of Rural Development',
    }
  });

  useEffect(() => {
    if (isEdit && existingScheme) {
      reset({
        code: existingScheme.code,
        name: existingScheme.name,
        category: existingScheme.category,
        subsidyAmount: existingScheme.subsidyAmount,
        description: existingScheme.description,
        minAge: existingScheme.minAge || '18',
        maxIncome: existingScheme.maxIncome || '₹ 3,00,000 / annum',
        ministry: existingScheme.ministry || 'Ministry of Rural Development',
      });
      if (existingScheme.requiredDocs) {
        setSelectedDocs(existingScheme.requiredDocs);
      }
    }
  }, [isEdit, existingScheme, reset]);

  const toggleDoc = (doc) => {
    setSelectedDocs((prev) => (prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]));
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      id: isEdit ? id : undefined,
      requiredDocs: selectedDocs,
    };
    saveScheme(payload);
    showToast(
      isEdit ? `Scheme "${data.name}" updated successfully!` : `New scheme "${data.name}" launched into live catalog!`,
      'success'
    );
    navigate('/schemes');
  };

  const availableDocs = [
    'Aadhaar Card (Biometric Verified)',
    'Income Certificate (Tahsildar)',
    'Caste / Social Category Certificate',
    'Land Ownership / BPL Ration Card',
    'Bank Passbook / DBT Account',
    'Domical / State Residency Proof',
    'Disability / Special Needs Certificate'
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Back */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-outline-variant/30 pb-4">
        <button
          onClick={() => navigate('/schemes')}
          className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scheme Catalog</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-primary-fixed/30 text-primary px-3 py-1 rounded-full">
            {isEdit ? `Editing ID: ${id}` : 'New Scheme Setup Wizard'}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-on-surface">
            {isEdit ? 'Modify Scheme Parameters' : 'Launch New Government Scheme'}
          </h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Configure eligibility criteria, subsidy disbursement rules, and required KYC document checklists.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'basic', label: '1. Basic Parameters', icon: Layers },
          { id: 'criteria', label: '2. Eligibility Criteria', icon: ShieldCheck },
          { id: 'docs', label: '3. Document Checklist', icon: CheckSquare },
          { id: 'dbt', label: '4. Benefit & DBT Rules', icon: IndianRupee },
        ]}
      />

      {/* Form Container */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* TAB 1: BASIC PARAMETERS */}
        {activeTab === 'basic' && (
          <Card title="Scheme Identification & Description" subtitle="Core catalog metadata visible to citizens">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Scheme Code / Acronym"
                placeholder="e.g. PMAY-G, PM-JAY, UJJWALA"
                error={errors.code?.message}
                {...register('code')}
              />
              <Select
                label="Sector / Category"
                error={errors.category?.message}
                options={['Housing', 'Energy', 'Healthcare', 'Social Security', 'Education', 'Agriculture']}
                {...register('category')}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Official Scheme Title"
                  placeholder="e.g. Pradhan Mantri Awas Yojana - Gramin"
                  error={errors.name?.message}
                  {...register('name')}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  Detailed Scheme Description & Objectives
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain the primary policy goal, target citizen population, and expected socio-economic impact..."
                  className={`w-full rounded-lg border bg-surface-container-lowest p-3.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.description ? 'border-error' : 'border-outline-variant focus:border-primary'
                  }`}
                  {...register('description')}
                />
                {errors.description && <p className="text-xs font-semibold text-error mt-1">{errors.description.message}</p>}
              </div>
              <Input
                label="Responsible Ministry / Department"
                placeholder="e.g. Ministry of Rural Development"
                {...register('ministry')}
              />
              <Input
                label="Benefit Award / Subsidy Value"
                placeholder="e.g. ₹ 1,20,000 / household"
                error={errors.subsidyAmount?.message}
                {...register('subsidyAmount')}
              />
            </div>
          </Card>
        )}

        {/* TAB 2: CRITERIA */}
        {activeTab === 'criteria' && (
          <Card title="Eligibility & Qualification Rules" subtitle="Automated filtering parameters for AI Triage Engine">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Minimum Applicant Age (Years)"
                placeholder="e.g. 18"
                type="number"
                {...register('minAge')}
              />
              <Input
                label="Maximum Annual Household Income Cap"
                placeholder="e.g. ₹ 3,00,000 / annum"
                {...register('maxIncome')}
              />
              <div className="sm:col-span-2 p-4 rounded-xl bg-primary-fixed/20 border border-primary/20 flex items-start gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-on-surface">AI Triage Automation Enabled</p>
                  <p className="text-on-surface-variant">
                    When citizens submit an application, the AI Triage Copilot will automatically cross-reference their DigiLocker income certificates and Aadhaar age against these rules.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* TAB 3: DOCUMENT CHECKLIST */}
        {activeTab === 'docs' && (
          <Card title="Mandatory KYC Document Checklist" subtitle="Select certificates citizens must provide via DigiLocker or upload">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableDocs.map((doc) => {
                const isChecked = selectedDocs.includes(doc);
                return (
                  <div
                    key={doc}
                    onClick={() => toggleDoc(doc)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all select-none ${
                      isChecked
                        ? 'bg-primary/5 border-primary shadow-2xs font-bold text-on-surface'
                        : 'bg-surface-container-lowest border-outline-variant/60 text-on-surface-variant hover:bg-surface-container/40 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent onClick
                        className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/40 pointer-events-none"
                      />
                      <span className="text-sm">{doc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* TAB 4: DBT RULES */}
        {activeTab === 'dbt' && (
          <Card title="Direct Benefit Transfer (DBT) Configuration" subtitle="Payment gateway and NPCI Aadhaar routing rules">
            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h5 className="font-bold">NPCI Aadhaar Payment Bridge (APB) Integrated</h5>
                  <p className="text-xs">Subsidies will be disbursed directly to the citizen's Aadhaar-seeded bank account upon application approval.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <Select
                  label="Disbursement Frequency"
                  options={['One-time Lump Sum', 'Monthly Installments', 'Quarterly Milestone Based', 'Annual Grant']}
                />
                <Select
                  label="Verification Level Required"
                  options={['Level 1: Auto AI Triage Only', 'Level 2: Tahsildar Manual Review', 'Level 3: Dual Officer Sign-off']}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40 bg-surface-container-low p-4 rounded-xl">
          <Button variant="outline" type="button" onClick={() => navigate('/schemes')}>
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="font-bold flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Save Changes' : 'Launch Scheme'}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SchemeCreateEdit;
