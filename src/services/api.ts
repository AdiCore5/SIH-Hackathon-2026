import { 
  User, 
  Grievance, 
  GrievanceUpdate, 
  Feedback, 
  AIAnalysisResult, 
  DuplicateCheckResult, 
  Notification,
  UserRole,
  Officer,
  LocationInfo,
  GrievanceStatus
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

// Visual mock helper lists (in case backend is offline)
const MOCK_DEPARTMENTS = [
  { id: "municipal", name: "Municipal Corporation", category: "Public Infrastructure & Civic Maintenance", contact: "municipal.help@jansetu.gov.in", slaHours: 96 },
  { id: "electricity", name: "Electricity Department", category: "Power Supply & Maintenance", contact: "electricity.help@jansetu.gov.in", slaHours: 48 },
  { id: "water", name: "Water Supply Department", category: "Water Distribution & Pipelines", contact: "water.help@jansetu.gov.in", slaHours: 96 },
  { id: "roads", name: "Roads & Transport", category: "Road Maintenance & Infrastructure", contact: "roads.help@jansetu.gov.in", slaHours: 96 },
  { id: "police", name: "Police", category: "Public Safety & Security", contact: "police.help@jansetu.gov.in", slaHours: 48 },
  { id: "healthcare", name: "Healthcare", category: "Government Hospitals & Health Centers", contact: "healthcare.help@jansetu.gov.in", slaHours: 96 },
  { id: "education", name: "Education", category: "Government Schools & Examination Boards", contact: "education.help@jansetu.gov.in", slaHours: 96 },
  { id: "sanitation", name: "Sanitation", category: "Waste Management & Public Hygiene", contact: "sanitation.help@jansetu.gov.in", slaHours: 96 },
  { id: "pds", name: "Public Distribution System", category: "Ration & Food Supplies", contact: "pds.help@jansetu.gov.in", slaHours: 96 },
  { id: "revenue", name: "Revenue Department", category: "Land Records & Property Tax", contact: "revenue.help@jansetu.gov.in", slaHours: 168 },
  { id: "electricity_board", name: "Electricity Board", category: "Utility Billing & Metres", contact: "billing.electricity@jansetu.gov.in", slaHours: 48 },
  { id: "environment", name: "Environment Department", category: "Pollution Control & Forestry", contact: "env.help@jansetu.gov.in", slaHours: 168 },
  { id: "women_child", name: "Women & Child Development", category: "Social Welfare Services", contact: "wcd.help@jansetu.gov.in", slaHours: 96 },
  { id: "social_welfare", name: "Social Welfare", category: "Pension & Disability Benefits", contact: "social.help@jansetu.gov.in", slaHours: 168 },
  { id: "agriculture", name: "Agriculture", category: "Farming Subsidies & Seeds Support", contact: "agri.help@jansetu.gov.in", slaHours: 168 },
  { id: "housing", name: "Housing", category: "Government Housing Schemes", contact: "housing.help@jansetu.gov.in", slaHours: 168 },
  { id: "telecom", name: "Telecommunications", category: "Government Broadband & Telecom Network", contact: "telecom.help@jansetu.gov.in", slaHours: 96 },
  { id: "other", name: "Other", category: "General Enquiries & Miscellaneous Services", contact: "support@jansetu.gov.in", slaHours: 168 }
];

const MOCK_USERS = [
  { id: "usr_citizen", name: "Rahul Verma", email: "demo.citizen@jansetu.ai", phone: "9876543210", role: "citizen" as UserRole, city: "Vadodara", state: "Gujarat", createdAt: new Date().toISOString() },
  { id: "usr_officer", name: "Amit Sharma", email: "demo.officer@jansetu.ai", phone: "9988776655", role: "officer" as UserRole, departmentId: "municipal", city: "Vadodara", state: "Gujarat", createdAt: new Date().toISOString() },
  { id: "usr_admin", name: "Rajesh Kumar", email: "demo.admin@jansetu.ai", phone: "9123456789", role: "admin" as UserRole, city: "New Delhi", state: "Delhi", createdAt: new Date().toISOString() }
];

const MOCK_OFFICERS = [
  { id: "usr_officer", name: "Amit Sharma", departmentId: "municipal", zone: "Ward 12", email: "demo.officer@jansetu.ai", phone: "9988776655", active: true },
  { id: "off_electricity", name: "Suresh Patil", departmentId: "electricity", zone: "Zone 3", email: "suresh.electricity@jansetu.ai", phone: "9876123456", active: true },
  { id: "off_water", name: "Mahesh Patel", departmentId: "water", zone: "Zone A", email: "mahesh.water@jansetu.ai", phone: "9876543211", active: true },
  { id: "off_roads", name: "Vikram Singh", departmentId: "roads", zone: "Central Ward", email: "vikram.roads@jansetu.ai", phone: "9876543212", active: true },
  { id: "off_police", name: "Inspector Vijay", departmentId: "police", zone: "City Center Station", email: "vijay.police@jansetu.ai", phone: "9876543213", active: true }
];

// Keywords mapped to departments for local AI simulation
const KEYWORDS_DB = [
  { dept_id: "municipal", category: "Public Infrastructure", subcategory: "Street Lighting", keywords: ["streetlight", "light", "street light", "lamp", "dark", "park", "garden", "playground", "swing"] },
  { dept_id: "electricity", category: "Utilities", subcategory: "Power Failure", keywords: ["power cut", "electricity", "transformer", "voltage", "blackout", "load shedding", "current", "spike", "meter", "wire", "cable"] },
  { dept_id: "water", category: "Utilities", subcategory: "Water Leakage", keywords: ["water leakage", "no water", "pipeline", "leakage", "water pipe", "low pressure", "tap water", "water supply"] },
  { dept_id: "roads", category: "Public Infrastructure", subcategory: "Road Damage", keywords: ["road", "pothole", "highway", "bridge", "bypass", "tar", "asphalt", "flyover", "signal", "traffic light", "zebra crossing"] },
  { dept_id: "police", category: "Public Safety", subcategory: "Local Security", keywords: ["crime", "theft", "police", "robbery", "scam", "noise", "loudspeaker", "music", "fight", "assault", "harassment", "cyber"] },
  { dept_id: "education", category: "Education", subcategory: "School Maintenance", keywords: ["school", "teacher", "exam", "college", "fees", "classroom", "student", "syllabus", "midday meal"] },
  { dept_id: "healthcare", category: "Healthcare", subcategory: "Primary Care", keywords: ["hospital", "medicine", "doctor", "health", "clinic", "nurse", "patient", "ambulance", "phc", "dispensary"] },
  { dept_id: "sanitation", category: "Sanitation", subcategory: "Waste Accumulation", keywords: ["garbage", "trash", "dumping", "waste", "clean", "sweep", "drainage", "sewage", "overflow", "sewer", "gutter"] },
  { dept_id: "pds", category: "Utilities", subcategory: "PDS Grievance", keywords: ["ration", "pds", "food grains", "wheat", "rice", "sugar", "ration shop", "dealer", "bpl"] }
];

const EMERGENCY_WORDS = ["fire", "blast", "explosion", "building collapse", "live wire", "electrocution", "drowning", "accident", "bleeding", "unconscious", "violence"];

// Helper for localStorage
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
  // Broadcast update event
  window.dispatchEvent(new CustomEvent('jansetu-data-updated', { detail: { key } }));
};

// Initialize localStorage databases with mock data if not set
export const initLocalStorageData = () => {
  if (!localStorage.getItem('js_users')) {
    setLocalStorage('js_users', MOCK_USERS);
  }
  if (!localStorage.getItem('js_departments')) {
    setLocalStorage('js_departments', MOCK_DEPARTMENTS);
  }
  if (!localStorage.getItem('js_officers')) {
    setLocalStorage('js_officers', MOCK_OFFICERS);
  }
  if (!localStorage.getItem('js_grievances')) {
    const baseDate = new Date();
    const mockGrievances: Grievance[] = [
      {
        id: "JS-2026-001245",
        citizenId: "usr_citizen",
        citizenName: "Rahul Verma",
        title: "Streetlight not working",
        description: "There has been no streetlight working outside our apartment for the last 5 days. It is very dark at night and unsafe for children.",
        category: "Public Infrastructure",
        subcategory: "Street Lighting",
        departmentId: "municipal",
        location: { lat: 22.3072, lng: 73.1812, address: "Block C, Samrajya Flats, Gotri Road", city: "Vadodara", ward: "Ward 12" },
        priority: "Medium",
        aiConfidence: 94.0,
        aiSummary: "Citizen reports a non-functional streetlight near their residential building for approximately five days, potentially affecting public safety during nighttime.",
        status: "In Progress",
        assignedOfficerId: "usr_officer",
        assignedOfficerName: "Amit Sharma",
        slaDeadline: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "JS-2026-001246",
        citizenId: "usr_citizen",
        citizenName: "Priyal Patel",
        title: "Power outage in block B",
        description: "Total blackout in our block since yesterday 6 PM. No info from local helpline.",
        category: "Utilities",
        subcategory: "Power Failure",
        departmentId: "electricity",
        location: { lat: 22.3120, lng: 73.1950, address: "Block B, Alkapuri Heights", city: "Vadodara", ward: "Ward 5" },
        priority: "High",
        aiConfidence: 96.0,
        aiSummary: "Sudden total power outage reported in residential apartments since yesterday evening with no updates from local helpline support.",
        status: "Assigned",
        assignedOfficerId: "off_electricity",
        assignedOfficerName: "Suresh Patil",
        slaDeadline: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "JS-2026-001247",
        citizenId: "usr_citizen",
        citizenName: "Rohan Gupta",
        title: "Garbage not collected since 3 days",
        description: "The municipal garbage truck has not visited our street for three consecutive days. Waste piles are accumulating on roadsides causing foul smells.",
        category: "Sanitation",
        subcategory: "Waste Accumulation",
        departmentId: "municipal",
        location: { lat: 23.0225, lng: 72.5714, address: "Aura Residency, Satellite Area", city: "Ahmedabad", ward: "Ward 1" },
        priority: "Medium",
        aiConfidence: 92.0,
        aiSummary: "Accumulated uncollected domestic waste on residential streets for three consecutive days resulting in hygiene concerns and bad odor.",
        status: "Resolved",
        assignedOfficerId: "usr_officer",
        assignedOfficerName: "Amit Sharma",
        slaDeadline: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(baseDate.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "JS-2026-001248",
        citizenId: "usr_citizen",
        citizenName: "Rahul Verma",
        title: "Major water pipeline leakage",
        description: "There is a huge crack in the main water supply pipeline causing lakhs of liters of water to waste on the road. Water pressure in homes is very low.",
        category: "Utilities",
        subcategory: "Water Leakage",
        departmentId: "water",
        location: { lat: 22.3015, lng: 73.1690, address: "Main Road Cross, Vasna Road", city: "Vadodara", ward: "Ward 12" },
        priority: "High",
        aiConfidence: 95.0,
        aiSummary: "Major pipe rupture on the main public pipeline causing massive potable water wastage and drop in household water distribution pressure.",
        status: "In Progress",
        assignedOfficerId: "off_water",
        assignedOfficerName: "Mahesh Patel",
        slaDeadline: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(baseDate.getTime() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "JS-2026-001249",
        citizenId: "usr_citizen",
        citizenName: "Priyal Patel",
        title: "Pothole on main highway road",
        description: "A massive, deep pothole has formed on the highway near the bypass bridge. It is causing severe accidents and traffic jams.",
        category: "Public Infrastructure",
        subcategory: "Road Damage",
        departmentId: "roads",
        location: { lat: 22.3300, lng: 73.2200, address: "National Highway Bypass Flyover, Harni", city: "Vadodara", ward: "Ward 4" },
        priority: "High",
        aiConfidence: 97.0,
        aiSummary: "Dangerous deep pothole on a high-speed bypass highway causing structural hazards, vehicle damage, and high risk of accidents.",
        status: "Escalated",
        assignedOfficerId: "off_roads",
        assignedOfficerName: "Vikram Singh",
        slaDeadline: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(baseDate.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    setLocalStorage('js_grievances', mockGrievances);
  }
  
  if (!localStorage.getItem('js_updates')) {
    const baseDate = new Date();
    const mockUpdates: GrievanceUpdate[] = [
      { id: "u1", grievanceId: "JS-2026-001245", status: "Submitted", remark: "Grievance submitted by citizen Rahul Verma", updatedBy: "Citizen System", timestamp: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "u2", grievanceId: "JS-2026-001245", status: "AI Classified", remark: "AI auto-detected Category: Public Infrastructure, Department: Municipal Corporation, SLA: 4 Days", updatedBy: "JanSetu AI", timestamp: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "u3", grievanceId: "JS-2026-001245", status: "Assigned", remark: "Grievance auto-routed to Municipal Officer Amit Sharma (Ward 12)", updatedBy: "JanSetu Dispatcher", timestamp: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "u4", grievanceId: "JS-2026-001245", status: "In Progress", remark: "Officer visited site. Streetlight bulb replacement ordered from central inventory.", updatedBy: "Officer Amit Sharma", timestamp: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString() },
      
      { id: "u5", grievanceId: "JS-2026-001246", status: "Submitted", remark: "Grievance submitted", updatedBy: "Citizen System", timestamp: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString() },
      { id: "u6", grievanceId: "JS-2026-001246", status: "AI Classified", remark: "AI auto-detected Category: Utilities, Department: Electricity Department, SLA: 48 Hours", updatedBy: "JanSetu AI", timestamp: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString() },
      { id: "u7", grievanceId: "JS-2026-001246", status: "Assigned", remark: "Assigned to Electricity Officer Suresh Patil (Zone 3)", updatedBy: "JanSetu Dispatcher", timestamp: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString() },
      
      { id: "u8", grievanceId: "JS-2026-001247", status: "Submitted", remark: "Grievance submitted", updatedBy: "Citizen System", timestamp: new Date(baseDate.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "u9", grievanceId: "JS-2026-001247", status: "AI Classified", remark: "AI auto-detected Category: Sanitation, Department: Municipal Corporation, SLA: 4 Days", updatedBy: "JanSetu AI", timestamp: new Date(baseDate.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "u10", grievanceId: "JS-2026-001247", status: "Assigned", remark: "Assigned to Municipal Officer Amit Sharma", updatedBy: "JanSetu Dispatcher", timestamp: new Date(baseDate.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "u11", grievanceId: "JS-2026-001247", status: "In Progress", remark: "Solid waste cleanup truck routed to location.", updatedBy: "Officer Amit Sharma", timestamp: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "u12", grievanceId: "JS-2026-001247", status: "Resolved", remark: "Waste cleared and bins sanitized. Photo proof uploaded.", updatedBy: "Officer Amit Sharma", timestamp: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString() }
    ];
    setLocalStorage('js_updates', mockUpdates);
  }
  
  if (!localStorage.getItem('js_feedback')) {
    const baseDate = new Date();
    const mockFeedback: Feedback[] = [
      { id: "fb1", grievanceId: "JS-2026-001247", rating: 5, comment: "Excellent cleanup! Quick work.", reopened: false, createdAt: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString() }
    ];
    setLocalStorage('js_feedback', mockFeedback);
  }
  
  if (!localStorage.getItem('js_notifications')) {
    const baseDate = new Date();
    const mockNotifications: Notification[] = [
      { id: "n1", userId: "usr_citizen", title: "Streetlight complaint update", message: "Your grievance JS-2026-001245 is now In Progress. Officer Amit Sharma has ordered parts.", grievanceId: "JS-2026-001245", isRead: false, createdAt: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString() },
      { id: "n2", userId: "usr_citizen", title: "Water leak complaint update", message: "Your grievance JS-2026-001248 has been assigned to Officer Mahesh Patel.", grievanceId: "JS-2026-001248", isRead: false, createdAt: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString() }
    ];
    setLocalStorage('js_notifications', mockNotifications);
  }
};

initLocalStorageData();

// ==========================================
// CLIENT API BRIDGE OBJECT WITH AUTOFALLBACK
// ==========================================
export const api = {
  // Test connection or fallback
  async isServerOnline(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth: Login
  async login(email: string, password: string): Promise<{ success: boolean; token: string; user: User }> {
    const online = await this.isServerOnline();
    if (online) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (response.ok) {
          return await response.json();
        }
        const err = await response.json();
        throw new Error(err.detail || 'Failed to authenticate');
      } catch (e: any) {
        console.error("Backend login error, trying local fallback:", e);
        if (e.message && !e.message.includes('fetch')) {
          throw e; // Reraise validation errors, fallback only on network issues
        }
      }
    }
    
    // Local Fallback Authentication
    const users = getLocalStorage<User[]>('js_users', MOCK_USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && password === 'Demo@123') {
      return {
        success: true,
        token: `demo-jwt-token-${user.id}`,
        user
      };
    }
    throw new Error('Invalid email or password. Use demo credentials (e.g. demo.citizen@jansetu.ai / Demo@123)');
  },

  // Grievance: Get List
  async getGrievances(filters: { departmentId?: string; status?: string; priority?: string; search?: string } = {}): Promise<Grievance[]> {
    const online = await this.isServerOnline();
    if (online) {
      try {
        const urlParams = new URLSearchParams();
        if (filters.departmentId) urlParams.append('department_id', filters.departmentId);
        if (filters.status) urlParams.append('status', filters.status);
        if (filters.priority) urlParams.append('priority', filters.priority);
        if (filters.search) urlParams.append('search', filters.search);
        
        const response = await fetch(`${API_BASE_URL}/grievances?${urlParams.toString()}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (e) {
        console.error("Backend list error, trying local fallback:", e);
      }
    }
    
    // Local Fallback Filter
    let grievances = getLocalStorage<Grievance[]>('js_grievances', []);
    if (filters.departmentId) {
      grievances = grievances.filter(g => g.departmentId === filters.departmentId);
    }
    if (filters.status) {
      grievances = grievances.filter(g => g.status === filters.status);
    }
    if (filters.priority) {
      grievances = grievances.filter(g => g.priority === filters.priority);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      grievances = grievances.filter(g => 
        g.title.toLowerCase().includes(q) || 
        g.description.toLowerCase().includes(q) || 
        g.id.toLowerCase().includes(q)
      );
    }
    return grievances;
  },

  // Grievance: Get Single with timeline & feedback
  async getGrievance(id: string): Promise<Grievance & { timeline: GrievanceUpdate[]; feedback?: Feedback }> {
    const online = await this.isServerOnline();
    if (online) {
      try {
        const response = await fetch(`${API_BASE_URL}/grievances/${id}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (e) {
        console.error("Backend detail error, trying local fallback:", e);
      }
    }
    
    // Local Fallback detail build
    const grievances = getLocalStorage<Grievance[]>('js_grievances', []);
    const grievance = grievances.find(g => g.id === id);
    if (!grievance) throw new Error('Grievance not found');
    
    const updates = getLocalStorage<GrievanceUpdate[]>('js_updates', []);
    const timeline = updates.filter(u => u.grievanceId === id).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    const feedbacks = getLocalStorage<Feedback[]>('js_feedback', []);
    const feedback = feedbacks.find(f => f.grievanceId === id);
    
    const officers = getLocalStorage<Officer[]>('js_officers', MOCK_OFFICERS);
    const officer = officers.find(o => o.id === grievance.assignedOfficerId);
    
    return {
      ...grievance,
      citizenName: grievance.citizenName || "Rahul Verma",
      assignedOfficerName: officer ? officer.name : "Not Assigned",
      timeline,
      feedback
    };
  },

  // Grievance: Create with local AI classification
  async lodgeGrievance(description: string, location: LocationInfo, title: string, citizenId: string, evidenceUrls: string[] = []): Promise<{ success: boolean; grievance: Grievance; duplicateAlert: DuplicateCheckResult }> {
    const online = await this.isServerOnline();
    if (online) {
      try {
        const response = await fetch(`${API_BASE_URL}/grievances`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            citizen_id: citizenId,
            title,
            description,
            location,
            evidence_urls: evidenceUrls
          })
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (e) {
        console.error("Backend creation error, trying local fallback:", e);
      }
    }
    
    // Local Fallback implementation of AI classification & duplicate detection
    const cleanedText = description.toLowerCase();
    
    // 1. Category Mapping
    let bestDept = "other";
    let bestCat = "Other";
    let bestSubcat = "General Request";
    let maxMatches = 0;
    
    for (const mapping of KEYWORDS_DB) {
      const matches = mapping.keywords.filter(kw => cleanedText.includes(kw)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestDept = mapping.dept_id;
        bestCat = mapping.category;
        bestSubcat = mapping.subcategory;
      }
    }
    
    // Sub-category fine tuning
    if (bestDept === "sanitation" && cleanedText.includes("dumping")) bestSubcat = "Illegal Dumping";
    if (bestDept === "sanitation" && (cleanedText.includes("sewage") || cleanedText.includes("overflow") || cleanedText.includes("sewer"))) bestSubcat = "Sewer Overflows";
    if (bestDept === "roads" && (cleanedText.includes("signal") || cleanedText.includes("traffic"))) bestSubcat = "Traffic Signals";
    
    // 2. Emergency check
    const isEmergency = EMERGENCY_WORDS.some(ek => cleanedText.includes(ek));
    
    // 3. Priority Detection
    let priority: 'Critical' | 'High' | 'Medium' | 'Low' = 'Medium';
    let slaHours = 96; // 4 Days
    if (isEmergency) {
      priority = 'Critical';
      slaHours = 24;
    } else if (["overflow", "blackout", "leakage", "accident", "scam"].some(kw => cleanedText.includes(kw))) {
      priority = 'High';
      slaHours = 48;
    }
    
    // Confidence & SLA deadline
    const confidence = maxMatches > 0 ? Math.min(98, 85 + (maxMatches * 4)) : 85;
    const deadline = new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString();
    
    const summary = priority === 'Critical' 
      ? `🚨 EMERGENCY: Urgent ${bestCat.toLowerCase()} hazard reported: '${description.slice(0, 40)}...'`
      : `Citizen reports ${bestCat.toLowerCase()} issue: '${description.slice(0, 40)}...'`;
      
    // Set Assigned Officer
    const officers = getLocalStorage('js_officers', MOCK_OFFICERS);
    const matchedOfficer = officers.find(o => o.departmentId === bestDept);
    
    // Generate Grievance ID
    const grievances = getLocalStorage<Grievance[]>('js_grievances', []);
    const nextNum = grievances.length + 1251;
    const gid = `JS-2026-00${nextNum}`;
    
    const newGrievance: Grievance = {
      id: gid,
      citizenId,
      citizenName: "Rahul Verma",
      title,
      description,
      category: bestCat,
      subcategory: bestSubcat,
      departmentId: bestDept,
      location,
      priority,
      aiConfidence: confidence,
      aiSummary: summary,
      status: 'Assigned', // Auto routed
      assignedOfficerId: matchedOfficer?.id,
      assignedOfficerName: matchedOfficer?.name || "Not Assigned",
      slaDeadline: deadline,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      evidenceUrls
    };
    
    // Check duplicates
    let dupAlert: DuplicateCheckResult = { isDuplicate: false, similarity: 0 };
    for (const g of grievances) {
      if (g.status === "Closed" || g.status === "Resolved") continue;
      if (g.location.city.toLowerCase() === location.city.toLowerCase() && g.location.ward.toLowerCase() === location.ward.toLowerCase()) {
        const queryTokens = new Set(cleanedText.split(/\s+/));
        const matchTokens = new Set(g.description.toLowerCase().split(/\s+/));
        const intersection = [...queryTokens].filter(x => matchTokens.has(x));
        const jaccard = intersection.length / (queryTokens.size + matchTokens.size - intersection.length);
        if (jaccard > 0.35) {
          dupAlert = {
            isDuplicate: true,
            similarity: Math.round(jaccard * 100),
            matchedGrievanceId: g.id,
            message: `Similar active issue ${g.id} ('${g.title}') detected nearby in ${g.location.address || 'your ward'}.`
          };
          break;
        }
      }
    }
    
    // Save to local storage
    grievances.unshift(newGrievance);
    setLocalStorage('js_grievances', grievances);
    
    // Save updates log
    const updates = getLocalStorage<GrievanceUpdate[]>('js_updates', []);
    updates.push(
      { id: `u_n_${updates.length}`, grievanceId: gid, status: 'Submitted', remark: 'Complaint lodged by citizen.', updatedBy: 'Citizen System', timestamp: new Date().toISOString() },
      { id: `u_a_${updates.length}`, grievanceId: gid, status: 'AI Classified', remark: `AI classified Category: ${bestCat}, Dept: ${bestDept}, SLA: ${priority}`, updatedBy: 'JanSetu AI', timestamp: new Date().toISOString() },
      { id: `u_r_${updates.length}`, grievanceId: gid, status: 'Assigned', remark: `Auto-routed to Assigned Officer ${matchedOfficer?.name || 'Central Officer'}.`, updatedBy: 'JanSetu Dispatcher', timestamp: new Date().toISOString() }
    );
    setLocalStorage('js_updates', updates);
    
    return {
      success: true,
      grievance: newGrievance,
      duplicateAlert: dupAlert
    };
  },

  // Grievance: Update Status
  async updateStatus(id: string, status: string, remark: string, updatedBy: string, proofUrl?: string): Promise<boolean> {
    const online = await this.isServerOnline();
    if (online) {
      try {
        const response = await fetch(`${API_BASE_URL}/grievances/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status,
            remark,
            updated_by: updatedBy,
            proof_url: proofUrl
          })
        });
        if (response.ok) {
          return true;
        }
      } catch (e) {
        console.error("Backend status update error, trying local fallback:", e);
      }
    }
    
    // Local Fallback Update
    const grievances = getLocalStorage<Grievance[]>('js_grievances', []);
    const gIndex = grievances.findIndex((g: any) => g.id === id);
    if (gIndex !== -1) {
      const now = new Date().toISOString();
      grievances[gIndex].status = status as GrievanceStatus;
      grievances[gIndex].updatedAt = now;
      if (status === 'Resolved') {
        grievances[gIndex].resolvedAt = now;
      }
      setLocalStorage('js_grievances', grievances);
      
      // Update updates logs
      const updates = getLocalStorage<GrievanceUpdate[]>('js_updates', []);
      updates.push({
        id: `u_up_${updates.length}`,
        grievanceId: id,
        status: status as any,
        remark: remark || `Grievance status changed to ${status}`,
        updatedBy,
        timestamp: now,
        proofUrl
      });
      setLocalStorage('js_updates', updates);
      
      // Push notification
      const notifications = getLocalStorage<Notification[]>('js_notifications', []);
      notifications.unshift({
        id: `n_up_${notifications.length}`,
        userId: "usr_citizen",
        title: `Grievance ${status}`,
        message: remark || `Your grievance ${id} status has been updated to ${status}.`,
        grievanceId: id,
        isRead: false,
        createdAt: now
      });
      setLocalStorage('js_notifications', notifications);
      return true;
    }
    return false;
  },

  // Grievance: Post Feedback
  async submitFeedback(id: string, rating: number, comment: string, reopened: boolean = false): Promise<boolean> {
    const online = await this.isServerOnline();
    if (online) {
      try {
        const response = await fetch(`${API_BASE_URL}/grievances/${id}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rating,
            comment,
            reopened
          })
        });
        if (response.ok) {
          return true;
        }
      } catch (e) {
        console.error("Backend feedback error, trying local fallback:", e);
      }
    }
    
    // Local Fallback Feedback
    const feedbacks = getLocalStorage<Feedback[]>('js_feedback', []);
    feedbacks.push({
      id: `fb_${feedbacks.length}`,
      grievanceId: id,
      rating,
      comment,
      reopened,
      createdAt: new Date().toISOString()
    });
    setLocalStorage('js_feedback', feedbacks);
    
    // Update grievance status based on feedback reopen flag
    const statusChange = reopened ? 'Escalated' : 'Closed';
    const remark = reopened 
      ? `Citizen reopened and escalated. Comment: ${comment}`
      : `Citizen accepted resolution and closed the case.`;
      
    await this.updateStatus(id, statusChange, remark, 'Citizen System');
    return true;
  },

  // Chatbot Query processing
  async sendChat(message: string, grievanceId?: string): Promise<{ reply: string; intent: string; data: any }> {
    const online = await this.isServerOnline();
    if (online) {
      try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            grievance_id: grievanceId
          })
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (e) {
        console.error("Backend chat error, trying local fallback:", e);
      }
    }
    
    // Local Fallback Chat Logic
    const cleaned = message.toLowerCase();
    const grievances = getLocalStorage<Grievance[]>('js_grievances', []);
    
    // ID Check
    const idMatch = cleaned.match(/js-\d{4}-\d+/);
    if (idMatch) {
      const gid = idMatch[0].toUpperCase();
      const g = grievances.find((x: any) => x.id === gid);
      if (g) {
        return {
          reply: `Found it! Your grievance **${gid}** ('${g.title}') is currently **${g.status}**. It is assigned to: **${g.departmentId?.toUpperCase()}**. The expected resolution deadline is **${g.slaDeadline.slice(0,10)}**.`,
          intent: "track_grievance",
          data: { id: gid }
        };
      }
      return {
        reply: `I couldn't find any active grievance with ID **${gid}**. Please verify the number.`,
        intent: "track_grievance",
        data: null
      };
    }
    
    if (["lodge", "file", "complain", "register", "report"].some(k => cleaned.includes(k))) {
      return {
        reply: "To lodge a complaint, click on **'Lodge a Grievance'** in the navbar. You can type details, upload files, or click the mic button to speak your grievance.",
        intent: "lodge_grievance",
        data: null
      };
    }
    
    if (["track", "status", "progress"].some(k => cleaned.includes(k))) {
      return {
        reply: "To track your grievance, enter your Grievance ID (e.g. **JS-2026-001245**). You can also view it in **'My Grievances'**.",
        intent: "track_grievance",
        data: null
      };
    }
    
    if (["delay", "late", "slow", "escalat"].some(k => cleaned.includes(k))) {
      return {
        reply: "If a complaint exceeds its resolution deadline, it is automatically escalated. If you are unhappy with the resolution, you can click **'Reopen Grievance'** to escalate it.",
        intent: "escalation_info",
        data: null
      };
    }
    
    // Keyword routing
    for (const mapping of KEYWORDS_DB) {
      if (mapping.keywords.some(kw => cleaned.includes(kw))) {
        return {
          reply: `This issue relates to **${mapping.category}** and is managed by the **${mapping.dept_id.toUpperCase()} Department**. Would you like to file a grievance for this?`,
          intent: "department_routing",
          data: { dept_id: mapping.dept_id }
        };
      }
    }
    
    return {
      reply: "Namaste! 🙏 I'm JanSetu AI. How can I help you today? You can ask me to track a complaint (e.g. 'JS-2026-001245') or tell me about a civic problem.",
      intent: "greeting",
      data: null
    };
  },

  // Admin Analytics
  async getAdminAnalytics(): Promise<any> {
    const online = await this.isServerOnline();
    if (online) {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/analytics`);
        if (response.ok) {
          return await response.json();
        }
      } catch (e) {
        console.error("Backend analytics error, trying local fallback:", e);
      }
    }
    
    // Local Fallback Analytics
    const grievances = getLocalStorage<Grievance[]>('js_grievances', []);
    const total = grievances.length;
    const resolved = grievances.filter(g => g.status === 'Resolved' || g.status === 'Closed').length;
    const pending = grievances.filter(g => g.status !== 'Resolved' && g.status !== 'Closed' && g.status !== 'Escalated').length;
    const escalated = grievances.filter(g => g.status === 'Escalated').length;
    
    const deptPerformance: Record<string, { assigned: number; resolved: number; breached: number }> = {};
    MOCK_DEPARTMENTS.forEach(d => {
      deptPerformance[d.name] = { assigned: 0, resolved: 0, breached: 0 };
    });
    
    grievances.forEach(g => {
      let deptName = "Other";
      const matchedDept = MOCK_DEPARTMENTS.find(d => d.id === g.departmentId);
      if (matchedDept) deptName = matchedDept.name;
      
      if (!deptPerformance[deptName]) {
        deptPerformance[deptName] = { assigned: 0, resolved: 0, breached: 0 };
      }
      deptPerformance[deptName].assigned++;
      if (g.status === 'Resolved' || g.status === 'Closed') deptPerformance[deptName].resolved++;
      if (g.status === 'Escalated') deptPerformance[deptName].breached++;
    });
    
    const deptChartData = Object.keys(deptPerformance)
      .map(k => ({ department: k, ...deptPerformance[k] }))
      .filter(x => x.assigned > 0);
      
    const catCounts: Record<string, number> = {};
    grievances.forEach(g => {
      catCounts[g.category] = (catCounts[g.category] || 0) + 1;
    });
    const categoryChartData = Object.keys(catCounts).map(k => ({ name: k, value: catCounts[k] }));
    
    const monthlyTrend = [
      { month: "Apr 2026", complaints: 110, resolved: 95 },
      { month: "May 2026", complaints: 145, resolved: 120 },
      { month: "Jun 2026", complaints: 180, resolved: 165 },
      { month: "Jul 2026", complaints: 210, resolved: 195 },
      { month: "Aug 2026", complaints: total, resolved: resolved }
    ];
    
    return {
      metrics: {
        total,
        resolved,
        pending,
        escalated,
        avg_resolution_time: 1.8,
        satisfaction_rating: 4.6
      },
      department_performance: deptChartData,
      category_distribution: categoryChartData,
      monthly_trend: monthlyTrend
    };
  },

  // Reset System
  async resetSystem(): Promise<boolean> {
    const online = await this.isServerOnline();
    if (online) {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/reset`, { method: 'POST' });
        if (response.ok) {
          localStorage.removeItem('js_grievances');
          localStorage.removeItem('js_updates');
          localStorage.removeItem('js_feedback');
          localStorage.removeItem('js_notifications');
          initLocalStorageData();
          return true;
        }
      } catch (e) {
        console.error("Backend reset error, trying local fallback:", e);
      }
    }
    
    localStorage.removeItem('js_grievances');
    localStorage.removeItem('js_updates');
    localStorage.removeItem('js_feedback');
    localStorage.removeItem('js_notifications');
    initLocalStorageData();
    return true;
  },

  // OTP Sending simulation
  async sendOTP(phone: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  },

  // OTP Verification simulation
  async verifyOTP(phone: string, otp: string): Promise<{ success: boolean; token: string; user: User }> {
    const online = await this.isServerOnline();
    if (online) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'demo.citizen@jansetu.ai', password: 'Demo@123' })
        });
        if (response.ok) {
          const data = await response.json();
          if (otp === '1234') return data;
        }
      } catch (e) {
        console.error("Backend OTP verification error, trying local fallback:", e);
      }
    }

    const users = getLocalStorage<User[]>('js_users', MOCK_USERS);
    const user = users.find(u => u.phone === phone);
    if (user && otp === '1234') {
      return {
        success: true,
        token: `demo-jwt-token-${user.id}`,
        user
      };
    }
    throw new Error('Invalid OTP code. Please enter 1234 to verify the demo.');
  },

  // ==========================================
  // ADMIN POWER OPERATIONS
  // ==========================================

  // Admin Login with Access Code
  async adminLogin(email: string, password: string, accessCode: string): Promise<{ success: boolean; token: string; user: User }> {
    if (accessCode !== 'ADMIN-2026') {
      throw new Error('Invalid Admin Access Code. Use ADMIN-2026 for demo.');
    }
    const users = getLocalStorage<User[]>('js_users', MOCK_USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === 'admin');
    if (user && password === 'Demo@123') {
      return { success: true, token: `admin-jwt-token-${user.id}`, user };
    }
    throw new Error('Invalid admin credentials. Use demo.admin@jansetu.ai / Demo@123');
  },

  // Officer Management
  async getOfficers(): Promise<Officer[]> {
    return getLocalStorage<Officer[]>('js_officers', MOCK_OFFICERS);
  },

  async addOfficer(data: { name: string; departmentId: string; zone: string; email: string; phone: string }): Promise<Officer> {
    const officers = getLocalStorage<Officer[]>('js_officers', MOCK_OFFICERS);
    const newOfficer: Officer = {
      id: `off_${Date.now()}`,
      name: data.name,
      departmentId: data.departmentId,
      zone: data.zone,
      email: data.email,
      phone: data.phone,
      active: true
    };
    officers.push(newOfficer);
    setLocalStorage('js_officers', officers);
    return newOfficer;
  },

  async removeOfficer(id: string): Promise<boolean> {
    let officers = getLocalStorage<Officer[]>('js_officers', MOCK_OFFICERS);
    officers = officers.filter(o => o.id !== id);
    setLocalStorage('js_officers', officers);
    return true;
  },

  async toggleOfficerActive(id: string): Promise<boolean> {
    const officers = getLocalStorage<Officer[]>('js_officers', MOCK_OFFICERS);
    const idx = officers.findIndex(o => o.id === id);
    if (idx !== -1) {
      officers[idx].active = !officers[idx].active;
      setLocalStorage('js_officers', officers);
      return true;
    }
    return false;
  },

  // Grievance Admin Operations
  async reassignGrievance(grievanceId: string, newOfficerId: string): Promise<boolean> {
    const grievances = getLocalStorage<Grievance[]>('js_grievances', []);
    const officers = getLocalStorage<Officer[]>('js_officers', MOCK_OFFICERS);
    const gIdx = grievances.findIndex(g => g.id === grievanceId);
    const officer = officers.find(o => o.id === newOfficerId);
    if (gIdx !== -1 && officer) {
      const now = new Date().toISOString();
      grievances[gIdx].assignedOfficerId = newOfficerId;
      grievances[gIdx].assignedOfficerName = officer.name;
      grievances[gIdx].departmentId = officer.departmentId;
      grievances[gIdx].updatedAt = now;
      if (grievances[gIdx].status === 'Submitted' || grievances[gIdx].status === 'AI Classified') {
        grievances[gIdx].status = 'Assigned';
      }
      setLocalStorage('js_grievances', grievances);

      const updates = getLocalStorage<GrievanceUpdate[]>('js_updates', []);
      updates.push({
        id: `u_admin_${updates.length}`,
        grievanceId,
        status: grievances[gIdx].status,
        remark: `Admin reassigned to Officer ${officer.name} (${officer.departmentId}).`,
        updatedBy: 'Admin Command Center',
        timestamp: now
      });
      setLocalStorage('js_updates', updates);
      return true;
    }
    return false;
  },

  async forceEscalate(grievanceId: string): Promise<boolean> {
    return this.updateStatus(grievanceId, 'Escalated', 'Admin forced escalation via Command Center.', 'Admin Command Center');
  },

  async forceClose(grievanceId: string, remark: string): Promise<boolean> {
    const grievances = getLocalStorage<Grievance[]>('js_grievances', []);
    const gIdx = grievances.findIndex(g => g.id === grievanceId);
    if (gIdx !== -1) {
      const now = new Date().toISOString();
      grievances[gIdx].status = 'Closed';
      grievances[gIdx].updatedAt = now;
      grievances[gIdx].resolvedAt = now;
      setLocalStorage('js_grievances', grievances);

      const updates = getLocalStorage<GrievanceUpdate[]>('js_updates', []);
      updates.push({
        id: `u_aclose_${updates.length}`,
        grievanceId,
        status: 'Closed',
        remark: remark || 'Admin force-closed this grievance.',
        updatedBy: 'Admin Command Center',
        timestamp: now
      });
      setLocalStorage('js_updates', updates);
      return true;
    }
    return false;
  },

  async updateGrievancePriority(grievanceId: string, newPriority: 'Critical' | 'High' | 'Medium' | 'Low'): Promise<boolean> {
    const grievances = getLocalStorage<Grievance[]>('js_grievances', []);
    const gIdx = grievances.findIndex(g => g.id === grievanceId);
    if (gIdx !== -1) {
      const now = new Date().toISOString();
      const oldPriority = grievances[gIdx].priority;
      grievances[gIdx].priority = newPriority;
      grievances[gIdx].updatedAt = now;

      // Recalculate SLA
      const slaMap: Record<string, number> = { Critical: 24, High: 48, Medium: 96, Low: 168 };
      grievances[gIdx].slaDeadline = new Date(new Date(grievances[gIdx].createdAt).getTime() + slaMap[newPriority] * 60 * 60 * 1000).toISOString();
      setLocalStorage('js_grievances', grievances);

      const updates = getLocalStorage<GrievanceUpdate[]>('js_updates', []);
      updates.push({
        id: `u_apri_${updates.length}`,
        grievanceId,
        status: grievances[gIdx].status,
        remark: `Admin changed priority from ${oldPriority} to ${newPriority}.`,
        updatedBy: 'Admin Command Center',
        timestamp: now
      });
      setLocalStorage('js_updates', updates);
      return true;
    }
    return false;
  },

  // System Settings
  async getDepartments(): Promise<typeof MOCK_DEPARTMENTS> {
    return getLocalStorage('js_departments', MOCK_DEPARTMENTS);
  },

  async updateDeptSLA(deptId: string, newSlaHours: number): Promise<boolean> {
    const departments = getLocalStorage('js_departments', MOCK_DEPARTMENTS);
    const idx = departments.findIndex((d: any) => d.id === deptId);
    if (idx !== -1) {
      departments[idx].slaHours = newSlaHours;
      setLocalStorage('js_departments', departments);
      return true;
    }
    return false;
  },

  async getAuditLog(): Promise<GrievanceUpdate[]> {
    const updates = getLocalStorage<GrievanceUpdate[]>('js_updates', []);
    return updates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async exportGrievances(): Promise<string> {
    const grievances = getLocalStorage<Grievance[]>('js_grievances', []);
    return JSON.stringify(grievances, null, 2);
  },

  markNotificationAsRead(notificationId: string): boolean {
    const notifications = getLocalStorage<Notification[]>('js_notifications', []);
    const idx = notifications.findIndex(n => n.id === notificationId);
    if (idx !== -1) {
      notifications[idx].isRead = true;
      setLocalStorage('js_notifications', notifications);
      return true;
    }
    return false;
  }
};
