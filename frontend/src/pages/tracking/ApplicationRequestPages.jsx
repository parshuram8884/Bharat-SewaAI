import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Upload, FolderOpen, AlertCircle, Paperclip } from 'lucide-react';
import { 
  useDocumentRequests, 
  useClarificationRequests,
  useUploadRequestedDocument,
  useSaveClarificationDraft,
  useSubmitClarification 
} from '../../hooks/useApplicationTrackingQuery';

export function DocumentRequestPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  // Simply redirect to respond page since they act identically in Phase 8
  useEffect(() => {
    navigate(`/applications/${applicationId}/documents/respond`);
  }, [applicationId, navigate]);
  return null;
}

export function ClarificationRequestPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  // Simply redirect to respond page
  useEffect(() => {
    navigate(`/applications/${applicationId}/clarification/respond`);
  }, [applicationId, navigate]);
  return null;
}

export function DocumentRespondPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reqId = searchParams.get('req');
  
  const { data: docReqsData } = useDocumentRequests(applicationId);
  const uploadMutation = useUploadRequestedDocument();
  
  const requests = docReqsData?.data || [];
  // If req parameter exists, find it. Otherwise pick first active request.
  const activeReq = reqId 
    ? requests.find(r => r.id === reqId) 
    : requests.find(r => r.status !== 'submitted' && r.status !== 'accepted');

  const [selectedLockerDoc, setSelectedLockerDoc] = useState(null);

  if (!activeReq) {
    return (
      <div className="p-8 text-center bg-background min-h-screen">
        <p className="text-sm text-on-surface-variant mt-12">No pending document requests found.</p>
        <button onClick={() => navigate(`/applications/${applicationId}`)} className="mt-4 text-primary hover:underline text-sm font-bold">Return to Application</button>
      </div>
    );
  }

  const isClosed = activeReq.status === 'submitted' || activeReq.status === 'accepted';

  const handleAttachLocker = () => {
    // Simulating selecting from Digital Locker
    const mockLockerDoc = { id: `locker-doc-${Date.now()}`, source: 'Digital Locker' };
    setSelectedLockerDoc(mockLockerDoc);
    
    uploadMutation.mutate({
      applicationId,
      requestId: activeReq.id,
      documentMetadata: mockLockerDoc
    }, {
      onSuccess: () => navigate(`/applications/${applicationId}`)
    });
  };

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const mockUploadMeta = { id: `upload-doc-${Date.now()}`, source: 'Upload', fileName: file.name };
    uploadMutation.mutate({
      applicationId,
      requestId: activeReq.id,
      documentMetadata: mockUploadMeta
    }, {
      onSuccess: () => navigate(`/applications/${applicationId}`)
    });
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-6">
      <main className="max-w-xl mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-xl font-bold text-red-600">Document Upload Request</h1>
        </header>

        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl mb-6">
          <h2 className="text-sm font-bold text-red-900 mb-2">{activeReq.title}</h2>
          <p className="text-sm text-red-800 leading-relaxed mb-4">{activeReq.description}</p>
          <div className="p-3 bg-red-100/50 rounded-xl text-xs text-red-900">
            <strong>Reason:</strong> {activeReq.reason}
          </div>
        </div>

        {isClosed ? (
          <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-2xl text-center">
            <h3 className="text-sm font-bold text-on-surface mb-2">Response Submitted</h3>
            <p className="text-xs text-on-surface-variant">You have already submitted a document for this request.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={handleAttachLocker}
              disabled={uploadMutation.isPending}
              className="w-full min-h-[56px] flex items-center justify-center gap-2 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary-container disabled:opacity-50"
            >
              <FolderOpen className="w-5 h-5" />
              Attach from Digital Locker
            </button>
            
            <div className="relative">
              <input 
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleUploadFile}
                disabled={uploadMutation.isPending}
                accept="image/*,.pdf"
              />
              <button 
                type="button"
                disabled={uploadMutation.isPending}
                className="w-full min-h-[56px] flex items-center justify-center gap-2 border-2 border-dashed border-primary text-primary font-bold text-sm rounded-xl hover:bg-primary/5 disabled:opacity-50"
              >
                <Upload className="w-5 h-5" />
                Upload File from Device
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export function ClarificationRespondPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reqId = searchParams.get('req');
  
  const { data: clarifReqsData } = useClarificationRequests(applicationId);
  const saveDraftMutation = useSaveClarificationDraft();
  const submitMutation = useSubmitClarification();

  const requests = clarifReqsData?.data || [];
  const activeReq = reqId 
    ? requests.find(r => r.id === reqId) 
    : requests.find(r => r.status !== 'submitted' && r.status !== 'reviewed');

  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    if (activeReq && activeReq.responseText) {
      setResponseText(activeReq.responseText);
    }
  }, [activeReq]);

  if (!activeReq) {
    return (
      <div className="p-8 text-center bg-background min-h-screen">
        <p className="text-sm text-on-surface-variant mt-12">No pending clarification requests found.</p>
        <button onClick={() => navigate(`/applications/${applicationId}`)} className="mt-4 text-primary hover:underline text-sm font-bold">Return to Application</button>
      </div>
    );
  }

  const isClosed = activeReq.status === 'submitted' || activeReq.status === 'reviewed';

  const handleSaveDraft = () => {
    saveDraftMutation.mutate({
      applicationId,
      requestId: activeReq.id,
      responseText,
      attachments: []
    }, {
      onSuccess: () => alert('Draft saved successfully.')
    });
  };

  const handleSubmit = () => {
    if (window.confirm('Submit this clarification to the department? You cannot edit it after submission.')) {
      submitMutation.mutate({
        applicationId,
        requestId: activeReq.id,
        responseText,
        attachments: []
      }, {
        onSuccess: () => navigate(`/applications/${applicationId}`)
      });
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-6">
      <main className="max-w-xl mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-xl font-bold text-amber-600">Provide Clarification</h1>
        </header>

        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl mb-6">
          <div className="flex items-center gap-2 text-amber-700 font-bold mb-3 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Question from Officer</span>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed font-medium mb-4">"{activeReq.question}"</p>
          <div className="p-3 bg-amber-100/50 rounded-xl text-xs text-amber-900">
            <strong>Context:</strong> {activeReq.reason}
          </div>
        </div>

        {isClosed ? (
          <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-2xl">
            <h3 className="text-sm font-bold text-on-surface mb-2">Your Submitted Response</h3>
            <p className="text-sm text-on-surface-variant p-4 bg-surface-container-low rounded-xl">
              {activeReq.responseText}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">Your Response <span className="text-red-500">*</span></label>
              <textarea 
                rows={5}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="w-full p-4 bg-surface-container-low border border-outline rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                placeholder="Type your explanation or clarification here..."
              />
            </div>

            <button className="flex items-center gap-2 text-primary font-bold text-xs p-2 rounded-lg hover:bg-primary/5 transition-colors">
              <Paperclip className="w-4 h-4" />
              Attach Supporting Files (Optional)
            </button>
            
            <div className="pt-4 flex gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={saveDraftMutation.isPending || submitMutation.isPending}
                className="flex-1 min-h-[48px] border border-outline text-primary font-bold text-sm rounded-xl hover:bg-surface-container-low"
              >
                Save Draft
              </button>
              <button
                onClick={handleSubmit}
                disabled={!responseText.trim() || saveDraftMutation.isPending || submitMutation.isPending}
                className="flex-[2] min-h-[48px] bg-primary text-on-primary font-bold text-sm rounded-xl disabled:opacity-50 hover:bg-primary-container"
              >
                Submit Response
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
