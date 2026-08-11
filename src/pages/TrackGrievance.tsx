import React, { useState, useEffect } from 'react';
import { translate, Language } from '../services/i18n';
import { api } from '../services/api';
import { Grievance, GrievanceUpdate } from '../types';
import { Search, Calendar, User, Clock, AlertTriangle, ShieldCheck, Star } from 'lucide-react';

interface TrackGrievanceProps {
  lang: Language;
  preselectedGrievanceId?: string;
  onNavigate: (tab: string) => void;
}

export const TrackGrievance: React.FC<TrackGrievanceProps> = ({ lang, preselectedGrievanceId = '', onNavigate }) => {
  const [searchId, setSearchId] = useState(preselectedGrievanceId);
  const [grievance, setGrievance] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Feedback states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reopenText, setReopenText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    if (preselectedGrievanceId) {
      handleSearch(preselectedGrievanceId);
    }
  }, [preselectedGrievanceId]);

  const handleSearch = async (gid?: string) => {
    const idToSearch = gid || searchId;
    if (!idToSearch.trim()) return;

    setLoading(true);
    setError('');
    setGrievance(null);
    setFeedbackSuccess(false);

    try {
      const data = await api.getGrievance(idToSearch.trim().toUpperCase());
      setGrievance(data);
    } catch (e: any) {
      setError(e.message || "Grievance ID not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (reopened: boolean) => {
    if (!grievance) return;
    setIsSubmittingFeedback(true);
    try {
      const success = await api.submitFeedback(
        grievance.id,
        rating,
        reopened ? reopenText : comment,
        reopened
      );
      if (success) {
        setFeedbackSuccess(true);
        // Refresh details
        await handleSearch(grievance.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Helper to check if deadline has breached
  const getSLAState = () => {
    if (!grievance) return { label: "", color: "" };
    
    if (grievance.status === 'Resolved' || grievance.status === 'Closed') {
      return { label: "Resolved within SLA", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
    }
    if (grievance.status === 'Escalated') {
      return { label: "🔴 SLA BREACHED: Escalated to Command Center", color: "text-rose-700 bg-rose-50 border-rose-100" };
    }
    
    const remainingMs = new Date(grievance.slaDeadline).getTime() - Date.now();
    if (remainingMs < 0) {
      return { label: "🔴 SLA BREACHED: Overdue", color: "text-rose-700 bg-rose-50 border-rose-100" };
    }
    
    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
    return { 
      label: `⏰ SLA Status: ${remainingDays} days remaining`, 
      color: "text-orange-700 bg-orange-50 border-orange-100" 
    };
  };

  const slaState = getSLAState();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      
      {/* Search Header */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-4">{translate('track_title', lang)}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder={translate('track_search_placeholder', lang)}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 uppercase"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-slate-950 hover:bg-slate-900 text-white font-bold px-6 py-3 rounded-xl shadow-premium hover-lift flex items-center gap-2 text-sm disabled:opacity-60"
          >
            {loading ? 'Searching...' : translate('track_btn_search', lang)}
          </button>
        </div>
        {error && <p className="text-rose-500 text-xs mt-3 font-semibold">{error}</p>}
      </section>

      {/* Grievance Timeline & Details */}
      {grievance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main timeline stepper column */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 text-base mb-6 border-b border-slate-100 pb-3">
              {translate('track_timeline_title', lang)}
            </h4>
            
            {/* SLA countdown bar */}
            {slaState.label && (
              <div className={`border p-3.5 rounded-2xl mb-6 text-xs font-bold ${slaState.color}`}>
                {slaState.label}
              </div>
            )}
            
            {/* Timeline Stepper */}
            <div className="relative pl-6 space-y-6">
              
              {/* Vertical line */}
              <div className="absolute top-2 bottom-2 left-2.5 w-0.5 bg-slate-200"></div>
              
              {grievance.timeline.map((log: any, idx: number) => (
                <div key={log.id} className="relative">
                  {/* Circle dot */}
                  <span className={`absolute -left-[20px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${idx === grievance.timeline.length - 1 ? 'bg-orange-500 ring-4 ring-orange-100' : 'bg-slate-300'}`}></span>
                  
                  <div className="text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800">{log.status}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-1 leading-relaxed">{log.remark}</p>
                    {log.proofUrl && (
                      <div className="mt-2 text-[10px] text-orange-600 font-bold border border-orange-200/50 bg-orange-50/50 px-2.5 py-1 rounded w-fit">
                        📎 Resolution Proof: {log.proofUrl}
                      </div>
                    )}
                    <span className="text-[9px] text-slate-400 font-semibold block mt-1.5">Updated by: {log.updatedBy}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Timline Expectation notice */}
            {grievance.status !== 'Resolved' && grievance.status !== 'Closed' && grievance.status !== 'Escalated' && (
              <div className="mt-8 border-t border-slate-100 pt-5 flex items-center gap-2 text-[11px] text-slate-400">
                <Clock size={14} />
                <span>Next update expected before resolution deadline: {new Date(grievance.slaDeadline).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Details & Action Column */}
          <div className="flex flex-col gap-6">
            
            {/* Grievance Details Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h5 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Grievance details
              </h5>
              
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Grievance ID</span>
                  <p className="font-bold text-slate-800">{grievance.id}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Subject</span>
                  <p className="font-bold text-slate-800">{grievance.title}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Citizen</span>
                  <p className="text-slate-700">{grievance.citizenName}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Location</span>
                  <p className="text-slate-700">{grievance.location.address || `${grievance.location.city}, ${grievance.location.ward}`}</p>
                </div>
              </div>
            </div>

            {/* Officer Details Card */}
            {grievance.assignedOfficerName && grievance.status !== 'Submitted' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h5 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  {translate('track_officer_info', lang)}
                </h5>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                    <User size={20} />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">{grievance.assignedOfficerName}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{grievance.category} Department</p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">Zone: Ward 12</p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. FEEDBACK FORM (Visible only when status is 'Resolved') */}
            {grievance.status === 'Resolved' && (
              <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-premium flex flex-col gap-4">
                <h5 className="font-bold text-orange-400 text-sm flex items-center gap-1.5">
                  <Star size={16} />
                  Rate Resolution
                </h5>
                
                {feedbackSuccess ? (
                  <p className="text-xs text-emerald-400 font-bold text-center py-4">
                    ✓ Feedback submitted successfully. Ticket closed.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    <p className="text-slate-400 text-xs">{translate('feedback_title', lang)}</p>
                    
                    {/* Stars selector */}
                    <div className="flex justify-center gap-2">
                      {[1,2,3,4,5].map(star => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="text-yellow-400 hover:scale-110 transition-transform"
                        >
                          <Star size={20} fill={rating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                    
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">Add remarks</span>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Resolution comments..."
                        rows={2}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-orange-500"
                      />
                    </div>
                    
                    <button
                      onClick={() => handleSubmitFeedback(false)}
                      disabled={isSubmittingFeedback}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs"
                    >
                      {isSubmittingFeedback ? 'Submitting...' : translate('feedback_btn_submit', lang)}
                    </button>
                    
                    {/* Reopen / Escalate Action */}
                    <div className="border-t border-slate-800/80 pt-3">
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">Unsatisfied? Explain reason to escalate</span>
                      <input
                        type="text"
                        value={reopenText}
                        onChange={(e) => setReopenText(e.target.value)}
                        placeholder="Reason for reopening..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-rose-500 mb-2"
                      />
                      <button
                        onClick={() => handleSubmitFeedback(true)}
                        disabled={isSubmittingFeedback || !reopenText.trim()}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-xl text-xs disabled:opacity-50"
                      >
                        {translate('feedback_btn_reopen', lang)}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
};
