import React, { useRef, useState } from 'react';
import { Camera, RefreshCw, Upload, Check } from 'lucide-react';
import Button from '../common/Button';

export function CameraScanner({ onCapture }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleConfirm = () => {
    if (selectedFile && onCapture) {
      onCapture(selectedFile);
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/40">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="hidden"
      />

      {!previewUrl ? (
        <div className="text-center space-y-4 py-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Camera className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-neutral-200">Capture or Upload Documents</p>
            <p className="text-xs text-neutral-500">Supports Aadhaar, Ration Card, or Certificates (PDF/PNG/JPG)</p>
          </div>
          <Button variant="primary" onClick={triggerUpload}>
            <Upload className="w-4 h-4 mr-2" /> Upload Document
          </Button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="relative border border-neutral-800 rounded-xl overflow-hidden max-h-64 bg-neutral-900 flex items-center justify-center">
            {selectedFile?.type.startsWith('image/') ? (
              <img src={previewUrl} alt="Document preview" className="object-contain max-h-64 w-full" />
            ) : (
              <div className="p-12 text-sm text-neutral-400">PDF File Selected: {selectedFile?.name}</div>
            )}
          </div>
          <div className="flex gap-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" /> Retake
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleConfirm}>
              <Check className="w-4 h-4 mr-2" /> Confirm OCR
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CameraScanner;
