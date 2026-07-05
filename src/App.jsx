import React, { useRef, useState } from 'react';

const App = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file.name);
    setIsUploading(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:3001/api/review', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setFeedback(data.feedback);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-800">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 text-center">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Let's make your resume shine.
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-lg mx-auto">
            Upload your current draft, and we'll provide gentle, actionable feedback to help you stand out.
          </p>
        </div>

        <div className="bg-indigo-50/50 border-2 border-dashed border-indigo-100 rounded-xl p-10">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-3 px-8 rounded-full shadow-sm transition-all"
          >
            {isUploading ? 'Analyzing...' : 'Choose File'}
          </button>
          <p className="mt-4 text-sm text-slate-400">Supported formats: PDF, DOCX</p>
        </div>

        {/* AI Feedback Display */}
        {feedback && (
          <div className="mt-8 text-left bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h2 className="text-2xl font-bold mb-2">Resume Score: {feedback.score}/100</h2>
            <p className="text-slate-600 mb-6">{feedback.summary}</p>
            
            <h3 className="font-semibold text-emerald-700 mb-2">Strengths</h3>
            <ul className="list-disc pl-5 mb-6 text-sm text-slate-700">
              {feedback.strengths.map((item, i) => <li key={i}>{item}</li>)}
            </ul>

            <h3 className="font-semibold text-amber-700 mb-2">Areas for Improvement</h3>
            <ul className="list-disc pl-5 text-sm text-slate-700">
              {feedback.improvements.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;