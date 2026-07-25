import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateGrievanceDraft } from '../../hooks/useGrievanceQuery';
import { grievanceTypes } from '../../data/grievanceTypeConfigs';

const GrievanceCreationPage = () => {
  const navigate = useNavigate();
  const createDraft = useCreateGrievanceDraft();
  
  const [formData, setFormData] = useState({
    type: 'service-delivery',
    title: '',
    description: '',
    departmentId: 'general',
    category: 'other'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    
    setIsSubmitting(true);
    try {
      // Actually creating a draft first in our flow, then user can submit it, but for simplicity here we just create it and redirect to tracking hub where they can formally submit.
      // Wait, standard flow is form -> submit -> done. Let's just create draft and redirect to tracking hub to show it as draft/submit it.
      const draft = await createDraft.mutateAsync(formData);
      navigate(`/grievances/${draft.id}`);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <button onClick={() => navigate('/grievances')} className="text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Grievances
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Raise a Grievance</h1>
        <p className="text-slate-500 mt-1">Please provide details about your issue.</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-8 text-sm">
        <p className="font-medium">Demonstration Notice</p>
        <p className="mt-1">
          This system is fully mocked. No real data is transmitted to government authorities.
          Do NOT enter any real personal identifiable information (PII), Aadhaar, or Bank Account numbers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Issue Classification</h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Grievance Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value, category: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {Object.values(grievanceTypes).map(type => (
                <option key={type.key} value={type.key}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Department</label>
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="general">General Administration</option>
              <option value="agriculture">Agriculture Department</option>
              <option value="finance">Finance Department</option>
              <option value="revenue">Revenue Department</option>
              <option value="it-support">IT Support</option>
              <option value="vigilance">Vigilance</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Issue Details</h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Grievance Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Brief summary of your issue"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Please explain the issue in detail..."
              rows={5}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={1000}
              required
            />
            <p className="text-xs text-slate-500 mt-1">Do not include full Aadhaar or bank account numbers.</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                required
              />
            </div>
            <div className="text-sm text-slate-700">
              <p className="font-medium text-slate-900">Declaration</p>
              <p>I confirm that the information provided is accurate to the best of my knowledge. I consent to having this complaint processed in the Bharat Sewa AI demonstration mode.</p>
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/grievances')}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!agreed || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? 'Creating...' : 'Create Grievance'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GrievanceCreationPage;
