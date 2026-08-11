import React, { useState } from 'react';
import { User, Shield, CheckCircle, RefreshCw, AlertTriangle, Play } from 'lucide-react';
import { UserRole } from '../types';
import { api } from '../services/api';

interface DemoBarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onGrievanceAdded: () => void;
}

export const DemoBar: React.FC<DemoBarProps> = ({ currentRole, onRoleChange, onGrievanceAdded }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await api.resetSystem();
      alert("Demo data has been reset to defaults!");
      onGrievanceAdded();
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  const handleCreateTestGrievance = async () => {
    setIsSimulating(true);
    try {
      const response = await api.lodgeGrievance(
        "There has been a large, deep pothole outside our housing society gates onGotri Bypass Highway for the last 10 days. It has already caused two minor bike accidents and creates severe traffic blocks every morning.",
        { city: "Vadodara", ward: "Ward 12", address: "Main Gate, Krishna Society, Gotri Bypass" },
        "Large pothole causing accidents and blocks",
        "usr_citizen"
      );
      alert(`Demo Grievance Lodged Successfully!\nID: ${response.grievance.id}\nPriority: ${response.grievance.priority}\nDepartment: ${response.grievance.departmentId.toUpperCase()}`);
      onGrievanceAdded();
    } catch (e) {
       console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleTriggerSLABreach = async () => {
    setIsSimulating(true);
    try {
      const grievances = await api.getGrievances();
      const roadsGrievance = grievances.find(g => g.departmentId === 'roads' && g.status !== 'Closed' && g.status !== 'Resolved');
      
      if (roadsGrievance) {
        await api.updateStatus(
          roadsGrievance.id,
          'Escalated',
          'SLA Deadline Breach (96 hours exceeded). Autoclassified for administrative escalation.',
          'JanSetu SLA Engine'
        );
        alert(`SLA Breach Simulated for ${roadsGrievance.id}!\nStatus updated to: ESCALATED.`);
        onGrievanceAdded();
      } else {
        alert("No active Roads & Transport grievance found to breach. Click 'Lodge Test Pothole' first, then trigger SLA breach!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gradient-to-r from-orange-600 to-indigo-800 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-premium hover:opacity-90 animate-bounce"
      >
        <Shield size={14} />
        JanSetu Demo Mode
      </button>
    );
  }

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white text-xs px-4 py-2 relative z-50 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-2">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
        </span>
        <span className="font-bold tracking-wider text-orange-400 uppercase">🎯 Hackathon Demo Mode Panel</span>
        <span className="text-slate-400 border-l border-slate-700 pl-2">Quickly test citizen-officer workflows offline:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Role Selectors */}
        <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          <button
            onClick={() => onRoleChange('citizen')}
            className={`px-3 py-1 rounded-md transition-all ${currentRole === 'citizen' ? 'bg-orange-500 font-bold text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Citizen View
          </button>
          <button
            onClick={() => onRoleChange('officer')}
            className={`px-3 py-1 rounded-md transition-all ${currentRole === 'officer' ? 'bg-indigo-600 font-bold text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Officer View
          </button>
          <button
            onClick={() => onRoleChange('admin')}
            className={`px-3 py-1 rounded-md transition-all ${currentRole === 'admin' ? 'bg-emerald-600 font-bold text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Admin View
          </button>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCreateTestGrievance}
            disabled={isSimulating}
            className="flex items-center gap-1 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1 rounded-md transition-all disabled:opacity-50"
            title="Automatically files the pothole complaint"
          >
            <Play size={12} className="text-orange-400" />
            Lodge Test Pothole
          </button>

          <button
            onClick={handleTriggerSLABreach}
            disabled={isSimulating}
            className="flex items-center gap-1 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1 rounded-md transition-all disabled:opacity-50"
            title="Auto-escalate roads complaint due to time limit exceed"
          >
            <AlertTriangle size={12} className="text-rose-500" />
            Simulate SLA Breach
          </button>

          <button
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-1 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1 rounded-md transition-all disabled:opacity-50"
            title="Clear all modifications and load default seed complaints"
          >
            <RefreshCw size={12} className={`text-sky-400 ${isResetting ? 'animate-spin' : ''}`} />
            Reset Data
          </button>
        </div>

        <button 
          onClick={() => setIsOpen(false)}
          className="text-slate-500 hover:text-slate-300 ml-2 font-bold px-1.5"
          title="Minimize Demo Panel"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
