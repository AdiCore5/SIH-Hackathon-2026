// Domain TypeScript Interfaces for JanSetu-AI

export type UserRole = 'citizen' | 'officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  departmentId?: string; // Specific for officers
  city?: string;
  state?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  category: string;
  contact: string;
  slaHours: number;
}

export interface Officer {
  id: string;
  name: string;
  departmentId: string;
  zone: string;
  email: string;
  phone: string;
  active: boolean;
}

export interface LocationInfo {
  lat?: number;
  lng?: number;
  address?: string;
  city: string;
  ward: string;
}

export type GrievanceStatus = 
  | 'Submitted' 
  | 'AI Classified' 
  | 'Assigned' 
  | 'In Progress' 
  | 'Awaiting Citizen' 
  | 'Resolved' 
  | 'Closed' 
  | 'Escalated';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Grievance {
  id: string; // JS-2026-XXXXXX
  citizenId: string;
  citizenName?: string; // Visual helper
  title: string;
  description: string;
  category: string;
  subcategory: string;
  departmentId: string;
  location: LocationInfo;
  priority: PriorityLevel;
  aiConfidence: number;
  aiSummary: string;
  status: GrievanceStatus;
  assignedOfficerId?: string;
  assignedOfficerName?: string; // Visual helper
  slaDeadline: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  resolvedAt?: string; // ISO string
  evidenceUrls?: string[];
}

export interface GrievanceUpdate {
  id: string;
  grievanceId: string;
  status: GrievanceStatus;
  remark?: string;
  updatedBy: string;
  timestamp: string; // ISO string
  proofUrl?: string;
}

export interface Feedback {
  id: string;
  grievanceId: string;
  rating: number; // 1 to 5
  comment?: string;
  reopened: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  grievanceId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AIAnalysisResult {
  category: string;
  subcategory: string;
  departmentId: string;
  priority: PriorityLevel;
  confidence: number;
  slaHours: number;
  summary: string;
  isEmergency: boolean;
  emergencyHelpline?: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  similarity: number;
  matchedGrievanceId?: string;
  message?: string;
}
