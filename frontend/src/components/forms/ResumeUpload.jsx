import { useRef, useState } from 'react';

/**
 * ResumeUpload – drag-and-drop + click-to-upload resume field.
 * Calls onFile(file) when a valid PDF is selected.
 */
export function ResumeUpload({ onFile, currentFileName }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const validateAndSelect = (file) => {
    setError('');
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are accepted.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5 MB.');
      return;
    }
    onFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSelect(file);
  };

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        id="resume-upload-dropzone"
        aria-label="Upload resume PDF"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all duration-200 ${
          dragging
            ? 'border-brand-500 bg-brand-50'
            : 'border-dark-300 bg-white hover:border-dark-400 hover:bg-dark-50'
        }`}
      >
        <svg className="h-10 w-10 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div className="text-center">
          <p className="text-sm font-medium text-dark-700">
            {currentFileName ? (
              <span className="text-brand-600">{currentFileName}</span>
            ) : (
              <>Drop your resume here, or <span className="text-brand-600 underline">browse</span></>
            )}
          </p>
          <p className="text-xs text-dark-400 mt-1">PDF only · Max 5 MB</p>
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => validateAndSelect(e.target.files?.[0])}
      />
    </div>
  );
}
