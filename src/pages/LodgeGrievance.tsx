import React, { useState, useEffect } from 'react';
import { translate, Language } from '../services/i18n';
import { api } from '../services/api';
import { startVoiceRecognition, stopVoiceRecognition, isVoiceSupported } from '../services/voiceService';
import { 
  FileText, Mic, MapPin, Upload, ChevronRight, CheckCircle, 
  AlertTriangle, ArrowLeft, Loader2, Sparkles, AlertCircle, Map 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LodgeGrievanceProps {
  lang: Language;
  onNavigate: (tab: string, arg?: string) => void;
}

export const LodgeGrievance: React.FC<LodgeGrievanceProps> = ({ lang, onNavigate }) => {
  // Input fields state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Vadodara');
  const [ward, setWard] = useState('Ward 12');
  const [evidenceFiles, setEvidenceFiles] = useState<{ name: string; size: string; previewUrl?: string }[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Status flags
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateData, setDuplicateData] = useState<any | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);

  // Geolocation
  const handleUseGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setAddress("Lat: " + position.coords.latitude.toFixed(4) + ", Lng: " + position.coords.longitude.toFixed(4) + " (Detected GPS)");
        },
        (error) => {
          console.error("GPS Error:", error);
          // Set mock coordinates as fallback
          setLatitude(22.3072);
          setLongitude(73.1812);
          setAddress("Krishna Flats, Gotri Road, Vadodara (Simulated GPS)");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Voice Speech-to-text
  const toggleListening = () => {
    if (isListening) {
      stopVoiceRecognition();
      setIsListening(false);
    } else {
      setIsListening(true);
      startVoiceRecognition(
        (text) => {
          setDescription(prev => prev + (prev ? ' ' : '') + text);
        },
        () => setIsListening(false),
        (err) => {
          alert(err);
          setIsListening(false);
        },
        lang
      );
    }
  };

  // Mock File upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }));
      setEvidenceFiles(prev => [...prev, ...filesArray]);
    }
  };

  // Trigger multi-step AI analysis animation
  const handleTriggerAnalysis = async () => {
    if (!description.trim()) {
      alert("Please describe your grievance in details.");
      return;
    }
    if (!title.trim()) {
      // Auto generate title
      setTitle(description.split('. ')[0].slice(0, 50));
    }

    setIsAnalyzing(true);
    setAnalysisStep(1);

    // Step-by-step progress timer triggers
    const stepsCount = 6;
    for (let i = 2; i <= stepsCount; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setAnalysisStep(i);
    }

    // Call backend API (or fallback locally)
    try {
      const response = await api.lodgeGrievance(
        description,
        { city, ward, address, lat: latitude || 22.3072, lng: longitude || 73.1812 },
        title || description.split('. ')[0].slice(0, 50),
        "usr_citizen",
        evidenceFiles.map(f => f.name)
      );

      setAnalysisResult(response.grievance);
      if (response.duplicateAlert.isDuplicate) {
        setDuplicateData(response.duplicateAlert);
        setShowDuplicateModal(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Confirm submission
  const handleSubmitGrievance = async () => {
    if (!analysisResult) return;
    
    // Play confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    setSubmissionSuccess(analysisResult);
  };

  // Join existing duplicate complaint
  const handleJoinDuplicate = () => {
    if (!duplicateData) return;
    alert(`Success!\nYou joined Grievance ${duplicateData.matchedGrievanceId}.\nYou will receive real-time notifications on your dashboard when status changes.`);
    onNavigate('dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      
      {/* 1. SUCCESS SCREEN */}
      {submissionSuccess ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 text-center shadow-premium success-pop flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
            <CheckCircle size={44} />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
            {translate('success_title', lang)}
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-md">
            {translate('success_sub', lang)}
          </p>
          
          <div className="my-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 max-w-sm w-full text-left flex flex-col gap-3.5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {translate('success_id', lang)}
              </span>
              <p className="text-xl font-black tracking-wide text-slate-900 mt-0.5">
                {submissionSuccess.id}
              </p>
            </div>
            <div className="border-t border-slate-200/60 pt-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {translate('success_next_resolution', lang)}
              </span>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                {new Date(submissionSuccess.slaDeadline).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('track', submissionSuccess.id)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow-premium hover-lift"
            >
              {translate('cta_track', lang)}
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl shadow-premium hover-lift"
            >
              {translate('btn_dashboard', lang)}
            </button>
          </div>
        </div>
      ) : isAnalyzing ? (
        
        // 2. AI ANALYSIS SCREEN
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 text-white shadow-premium text-center flex flex-col items-center py-16">
          <div className="relative mb-8">
            <Loader2 size={48} className="animate-spin text-orange-500" />
            <Sparkles size={16} className="absolute -top-1.5 -right-1.5 text-yellow-300 animate-pulse" />
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
            {translate('ai_analyzing', lang)}
          </h3>
          <p className="text-slate-400 text-xs mb-8">Mapping natural language inputs to routing algorithms...</p>
          
          <div className="max-w-md w-full text-left space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800/80">
            <div className={`flex items-center gap-3 text-xs ${analysisStep >= 1 ? 'text-orange-400 font-bold' : 'text-slate-600'}`}>
              <span>{analysisStep > 1 ? '✓' : analysisStep === 1 ? '●' : '○'}</span>
              <span>{translate('ai_step1', lang)}</span>
            </div>
            <div className={`flex items-center gap-3 text-xs ${analysisStep >= 2 ? 'text-orange-400 font-bold' : 'text-slate-600'}`}>
              <span>{analysisStep > 2 ? '✓' : analysisStep === 2 ? '●' : '○'}</span>
              <span>{translate('ai_step2', lang)}</span>
            </div>
            <div className={`flex items-center gap-3 text-xs ${analysisStep >= 3 ? 'text-orange-400 font-bold' : 'text-slate-600'}`}>
              <span>{analysisStep > 3 ? '✓' : analysisStep === 3 ? '●' : '○'}</span>
              <span>{translate('ai_step3', lang)}</span>
            </div>
            <div className={`flex items-center gap-3 text-xs ${analysisStep >= 4 ? 'text-orange-400 font-bold' : 'text-slate-600'}`}>
              <span>{analysisStep > 4 ? '✓' : analysisStep === 4 ? '●' : '○'}</span>
              <span>{translate('ai_step4', lang)}</span>
            </div>
            <div className={`flex items-center gap-3 text-xs ${analysisStep >= 5 ? 'text-orange-400 font-bold' : 'text-slate-600'}`}>
              <span>{analysisStep > 5 ? '✓' : analysisStep === 5 ? '●' : '○'}</span>
              <span>{translate('ai_step5', lang)}</span>
            </div>
            <div className={`flex items-center gap-3 text-xs ${analysisStep >= 6 ? 'text-orange-400 font-bold' : 'text-slate-600'}`}>
              <span>{analysisStep > 6 ? '✓' : analysisStep === 6 ? '●' : '○'}</span>
              <span>{translate('ai_step6', lang)}</span>
            </div>
          </div>
        </div>
      ) : analysisResult ? (
        
        // 3. AI RESULTS CONFIRMATION
        <div className="flex flex-col gap-6">
          <button 
            onClick={() => setAnalysisResult(null)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-xs font-bold w-fit"
          >
            <ArrowLeft size={14} />
            Edit Complaint details
          </button>
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Sparkles className="text-orange-500" />
              {translate('ai_results_title', lang)}
            </h3>
            
            {/* Critical emergency warning banner if isEmergency is true */}
            {analysisResult.priority === 'Critical' && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex gap-3 text-xs">
                <AlertCircle size={20} className="shrink-0 text-rose-600" />
                <div>
                  <h6 className="font-bold text-rose-900">{translate('alert_critical_title', lang)}</h6>
                  <p className="mt-1 leading-relaxed">{translate('alert_critical_sub', lang)}</p>
                  <p className="font-bold text-rose-950 mt-2">{translate('alert_emergency_contact', lang)}</p>
                </div>
              </div>
            )}
            
            {/* Analysis card details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{translate('ai_dept', lang)}</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{analysisResult.category} Department</p>
                  <p className="text-[11px] text-slate-500">Auto-routed to {analysisResult.departmentId.toUpperCase()}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{translate('ai_priority', lang)}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`h-2.5 w-2.5 rounded-full ${analysisResult.priority === 'Critical' || analysisResult.priority === 'High' ? 'bg-rose-500' : analysisResult.priority === 'Medium' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                    <span className="text-xs font-bold text-slate-800">{analysisResult.priority}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{translate('ai_sla', lang)}</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {analysisResult.priority === 'Critical' ? '24 Hours' : analysisResult.priority === 'High' ? '48 Hours' : '4 Days'}
                  </p>
                  <p className="text-[11px] text-slate-400">Estimated SLA deadline duration</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{translate('ai_confidence', lang)}</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{analysisResult.aiConfidence}% Match</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">{translate('ai_summary', lang)}</span>
              <p className="text-xs italic text-slate-700 mt-1.5 leading-relaxed">
                "{analysisResult.aiSummary}"
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 border-t border-slate-100 pt-6">
              <button
                onClick={handleSubmitGrievance}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow-premium hover-lift flex items-center gap-2"
              >
                {translate('btn_submit_grievance', lang)}
              </button>
              <button
                onClick={() => setAnalysisResult(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-6 py-3 rounded-xl shadow-premium hover-lift"
              >
                {translate('btn_edit_complaint', lang)}
              </button>
            </div>
          </div>

          {/* DUPLICATE WARNING MODAL */}
          {showDuplicateModal && duplicateData && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-lg success-pop flex flex-col gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{translate('dup_alert_title', lang)}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{translate('dup_alert_sub', lang)}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900">
                  {duplicateData.message}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    onClick={handleJoinDuplicate}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all"
                  >
                    {translate('dup_btn_join', lang)}
                  </button>
                  <button
                    onClick={() => setShowDuplicateModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-lg transition-all"
                  >
                    {translate('dup_btn_new', lang)}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        
        // 4. MAIN GRIEVANCE SUBMISSION FORM
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{translate('lodge_title', lang)}</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{translate('lodge_sub', lang)}</p>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Description Textarea with Voice Support */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Describe Grievance
                </label>
                {isVoiceSupported() && (
                  <button
                    onClick={toggleListening}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    <Mic size={12} />
                    {isListening ? translate('lodge_voice_listening', lang) : translate('lodge_voice_btn', lang)}
                  </button>
                )}
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={translate('lodge_placeholder', lang)}
                rows={5}
                className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Grievance Title / Subject (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken Streetlight"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Location Selector */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-800">
                  {translate('lodge_location_title', lang)}
                </label>
                <button
                  onClick={handleUseGeolocation}
                  className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-bold"
                >
                  <MapPin size={12} />
                  Detect Location
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold">{translate('lodge_city', lang)}</span>
                  <select 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 mt-1"
                  >
                    <option value="Vadodara">Vadodara</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Surat">Surat</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold">{translate('lodge_ward', lang)}</span>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 mt-1"
                  >
                    <option value="Ward 12">Ward 12 (Gotri)</option>
                    <option value="Ward 5">Ward 5 (Alkapuri)</option>
                    <option value="Ward 4">Ward 4 (Harni)</option>
                    <option value="Ward 1">Ward 1 (Satellite)</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <span className="text-[10px] text-slate-400 font-bold">Address / Landmark</span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Exact flat or street address"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 mt-1"
                  />
                </div>
              </div>

              {/* Map Panel Placeholder */}
              <div className="bg-slate-100 rounded-xl p-4 border border-slate-200/80 flex items-center justify-center text-slate-400 text-xs gap-2">
                <Map size={16} />
                <span>Simulated Interactive Ward Map Centered on {city} ({ward})</span>
              </div>
            </div>

            {/* Evidence File Uploader */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                {translate('lodge_evidence_title', lang)}
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-all relative">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Drag files here or click to upload</p>
                <p className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG, PDF (Max 5MB)</p>
              </div>

              {/* Files Previews */}
              {evidenceFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {evidenceFiles.map((file, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2 relative">
                      {file.previewUrl ? (
                        <img src={file.previewUrl} className="h-10 w-10 object-cover rounded-md" />
                      ) : (
                        <FileText size={18} className="text-slate-400" />
                      )}
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-800 truncate">{file.name}</p>
                        <p className="text-[9px] text-slate-400">{file.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleTriggerAnalysis}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-premium hover-lift flex items-center justify-center gap-2 mt-4"
            >
              <Sparkles size={16} />
              {translate('lodge_btn_analyze', lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
