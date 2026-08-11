import os
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env vars
load_dotenv()

# Detect Supabase env vars (either SUPABASE_URL/SUPABASE_KEY or VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY)
supabase_url = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL") or ""
supabase_key = os.getenv("SUPABASE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY") or ""

is_supabase_configured = bool(supabase_url and supabase_key)

supabase_client: Optional[Client] = None
if is_supabase_configured:
    try:
        supabase_client = create_client(supabase_url, supabase_key)
        print("🚀 JanSetu-AI: Connected to Supabase Live Database.")
    except Exception as e:
        print(f"⚠️ JanSetu-AI: Failed to connect to Supabase: {e}. Falling back to Local Memory.")
        is_supabase_configured = False

# ==========================================
# IN-MEMORY LOCAL FALLBACK DATASTORE
# ==========================================
LOCAL_DEPARTMENTS: List[Dict[str, Any]] = [
    {"id": "municipal", "name": "Municipal Corporation", "category": "Public Infrastructure & Civic Maintenance", "contact": "municipal.help@jansetu.gov.in", "sla_hours": 96},
    {"id": "electricity", "name": "Electricity Department", "category": "Power Supply & Maintenance", "contact": "electricity.help@jansetu.gov.in", "sla_hours": 48},
    {"id": "water", "name": "Water Supply Department", "category": "Water Distribution & Pipelines", "contact": "water.help@jansetu.gov.in", "sla_hours": 96},
    {"id": "roads", "name": "Roads & Transport", "category": "Road Maintenance & Infrastructure", "contact": "roads.help@jansetu.gov.in", "sla_hours": 96},
    {"id": "police", "name": "Police", "category": "Public Safety & Security", "contact": "police.help@jansetu.gov.in", "sla_hours": 48},
    {"id": "healthcare", "name": "Healthcare", "category": "Government Hospitals & Health Centers", "contact": "healthcare.help@jansetu.gov.in", "sla_hours": 96},
    {"id": "education", "name": "Education", "category": "Government Schools & Examination Boards", "contact": "education.help@jansetu.gov.in", "sla_hours": 96},
    {"id": "sanitation", "name": "Sanitation", "category": "Waste Management & Public Hygiene", "contact": "sanitation.help@jansetu.gov.in", "sla_hours": 96},
    {"id": "pds", "name": "Public Distribution System", "category": "Ration & Food Supplies", "contact": "pds.help@jansetu.gov.in", "sla_hours": 96},
    {"id": "revenue", "name": "Revenue Department", "category": "Land Records & Property Tax", "contact": "revenue.help@jansetu.gov.in", "sla_hours": 168},
    {"id": "electricity_board", "name": "Electricity Board", "category": "Utility Billing & Metres", "contact": "billing.electricity@jansetu.gov.in", "sla_hours": 48},
    {"id": "environment", "name": "Environment Department", "category": "Pollution Control & Forestry", "contact": "env.help@jansetu.gov.in", "sla_hours": 168},
    {"id": "women_child", "name": "Women & Child Development", "category": "Social Welfare Services", "contact": "wcd.help@jansetu.gov.in", "sla_hours": 96},
    {"id": "social_welfare", "name": "Social Welfare", "category": "Pension & Disability Benefits", "contact": "social.help@jansetu.gov.in", "sla_hours": 168},
    {"id": "agriculture", "name": "Agriculture", "category": "Farming Subsidies & Seeds Support", "contact": "agri.help@jansetu.gov.in", "sla_hours": 168},
    {"id": "housing", "name": "Housing", "category": "Government Housing Schemes", "contact": "housing.help@jansetu.gov.in", "sla_hours": 168},
    {"id": "telecom", "name": "Telecommunications", "category": "Government Broadband & Telecom Network", "contact": "telecom.help@jansetu.gov.in", "sla_hours": 96},
    {"id": "other", "name": "Other", "category": "General Enquiries & Miscellaneous Services", "contact": "support@jansetu.gov.in", "sla_hours": 168}
]

LOCAL_USERS: List[Dict[str, Any]] = [
    {"id": "usr_citizen", "name": "Rahul Verma", "email": "demo.citizen@jansetu.ai", "phone": "9876543210", "role": "citizen", "department_id": None, "city": "Vadodara", "state": "Gujarat", "created_at": "2026-08-10T10:00:00Z"},
    {"id": "usr_officer", "name": "Amit Sharma", "email": "demo.officer@jansetu.ai", "phone": "9988776655", "role": "officer", "department_id": "municipal", "city": "Vadodara", "state": "Gujarat", "created_at": "2026-08-10T10:00:00Z"},
    {"id": "usr_admin", "name": "Rajesh Kumar", "email": "demo.admin@jansetu.ai", "phone": "9123456789", "role": "admin", "department_id": None, "city": "New Delhi", "state": "Delhi", "created_at": "2026-08-10T10:00:00Z"}
]

LOCAL_OFFICERS: List[Dict[str, Any]] = [
    {"id": "usr_officer", "name": "Amit Sharma", "department_id": "municipal", "zone": "Ward 12", "email": "demo.officer@jansetu.ai", "phone": "9988776655", "active": True},
    {"id": "off_electricity", "name": "Suresh Patil", "department_id": "electricity", "zone": "Zone 3", "email": "suresh.electricity@jansetu.ai", "phone": "9876123456", "active": True},
    {"id": "off_water", "name": "Mahesh Patel", "department_id": "water", "zone": "Zone A", "email": "mahesh.water@jansetu.ai", "phone": "9876543211", "active": True},
    {"id": "off_roads", "name": "Vikram Singh", "department_id": "roads", "zone": "Central Ward", "email": "vikram.roads@jansetu.ai", "phone": "9876543212", "active": True},
    {"id": "off_police", "name": "Inspector Vijay", "department_id": "police", "zone": "City Center Station", "email": "vijay.police@jansetu.ai", "phone": "9876543213", "active": True}
]

LOCAL_GRIEVANCES: List[Dict[str, Any]] = []
LOCAL_UPDATES: List[Dict[str, Any]] = []
LOCAL_FEEDBACK: List[Dict[str, Any]] = []
LOCAL_NOTIFICATIONS: List[Dict[str, Any]] = []

def init_mock_data():
    global LOCAL_GRIEVANCES, LOCAL_UPDATES, LOCAL_FEEDBACK, LOCAL_NOTIFICATIONS
    
    # Pre-populate 16 complaints
    base_time = datetime.now()
    
    LOCAL_GRIEVANCES = [
        {
            "id": "JS-2026-001245",
            "citizen_id": "usr_citizen",
            "title": "Streetlight not working",
            "description": "There has been no streetlight working outside our apartment for the last 5 days. It is very dark at night and unsafe for children.",
            "category": "Public Infrastructure",
            "subcategory": "Street Lighting",
            "department_id": "municipal",
            "location": {"lat": 22.3072, "lng": 73.1812, "address": "Block C, Samrajya Flats, Gotri Road", "city": "Vadodara", "ward": "Ward 12"},
            "priority": "Medium",
            "ai_confidence": 94.0,
            "ai_summary": "Citizen reports a non-functional streetlight near their residential building for approximately five days, potentially affecting public safety during nighttime.",
            "status": "In Progress",
            "assigned_officer_id": "usr_officer",
            "sla_deadline": (base_time + timedelta(days=2)).isoformat(),
            "created_at": (base_time - timedelta(days=2)).isoformat(),
            "updated_at": (base_time - timedelta(days=1)).isoformat(),
            "resolved_at": None,
            "evidence_urls": []
        },
        {
            "id": "JS-2026-001246",
            "citizen_id": "usr_citizen",
            "title": "Power outage in block B",
            "description": "Total blackout in our block since yesterday 6 PM. No info from local helpline.",
            "category": "Utilities",
            "subcategory": "Power Failure",
            "department_id": "electricity",
            "location": {"lat": 22.3120, "lng": 73.1950, "address": "Block B, Alkapuri Heights", "city": "Vadodara", "ward": "Ward 5"},
            "priority": "High",
            "ai_confidence": 96.0,
            "ai_summary": "Sudden total power outage reported in residential apartments since yesterday evening with no updates from local helpline support.",
            "status": "Assigned",
            "assigned_officer_id": "off_electricity",
            "sla_deadline": (base_time + timedelta(days=1)).isoformat(),
            "created_at": (base_time - timedelta(days=1)).isoformat(),
            "updated_at": (base_time - timedelta(days=1)).isoformat(),
            "resolved_at": None,
            "evidence_urls": []
        },
        {
            "id": "JS-2026-001247",
            "citizen_id": "usr_citizen",
            "title": "Garbage not collected since 3 days",
            "description": "The municipal garbage truck has not visited our street for three consecutive days. Waste piles are accumulating on roadsides causing foul smells.",
            "category": "Sanitation",
            "subcategory": "Waste Accumulation",
            "department_id": "municipal",
            "location": {"lat": 23.0225, "lng": 72.5714, "address": "Aura Residency, Satellite Area", "city": "Ahmedabad", "ward": "Ward 1"},
            "priority": "Medium",
            "ai_confidence": 92.0,
            "ai_summary": "Accumulated uncollected domestic waste on residential streets for three consecutive days resulting in hygiene concerns and bad odor.",
            "status": "Resolved",
            "assigned_officer_id": "usr_officer",
            "sla_deadline": (base_time - timedelta(days=1)).isoformat(),
            "created_at": (base_time - timedelta(days=4)).isoformat(),
            "updated_at": (base_time - timedelta(days=1)).isoformat(),
            "resolved_at": (base_time - timedelta(days=1)).isoformat(),
            "evidence_urls": []
        },
        {
            "id": "JS-2026-001248",
            "citizen_id": "usr_citizen",
            "title": "Major water pipeline leakage",
            "description": "There is a huge crack in the main water supply pipeline causing lakhs of liters of water to waste on the road. Water pressure in homes is very low.",
            "category": "Utilities",
            "subcategory": "Water Leakage",
            "department_id": "water",
            "location": {"lat": 22.3015, "lng": 73.1690, "address": "Main Road Cross, Vasna Road", "city": "Vadodara", "ward": "Ward 12"},
            "priority": "High",
            "ai_confidence": 95.0,
            "ai_summary": "Major pipe rupture on the main public pipeline causing massive potable water wastage and drop in household water distribution pressure.",
            "status": "In Progress",
            "assigned_officer_id": "off_water",
            "sla_deadline": (base_time + timedelta(days=1)).isoformat(),
            "created_at": (base_time - timedelta(days=1)).isoformat(),
            "updated_at": (base_time - timedelta(hours=12)).isoformat(),
            "resolved_at": None,
            "evidence_urls": []
        },
        {
            "id": "JS-2026-001249",
            "citizen_id": "usr_citizen",
            "title": "Pothole on main highway road",
            "description": "A massive, deep pothole has formed on the highway near the bypass bridge. It is causing severe accidents and traffic jams.",
            "category": "Public Infrastructure",
            "subcategory": "Road Damage",
            "department_id": "roads",
            "location": {"lat": 22.3300, "lng": 73.2200, "address": "National Highway Bypass Flyover, Harni", "city": "Vadodara", "ward": "Ward 4"},
            "priority": "High",
            "ai_confidence": 97.0,
            "ai_summary": "Dangerous deep pothole on a high-speed bypass highway causing structural hazards, vehicle damage, and high risk of accidents.",
            "status": "Escalated",
            "assigned_officer_id": "off_roads",
            "sla_deadline": (base_time - timedelta(days=2)).isoformat(),
            "created_at": (base_time - timedelta(days=4)).isoformat(),
            "updated_at": (base_time - timedelta(days=2)).isoformat(),
            "resolved_at": None,
            "evidence_urls": []
        },
        {
            "id": "JS-2026-001250",
            "citizen_id": "usr_citizen",
            "title": "School infrastructure issue",
            "description": "The ceiling plaster of government secondary school classroom fell yesterday. Fortunately, it was Sunday so children were not present. Needs urgent repairs.",
            "category": "Education",
            "subcategory": "School Maintenance",
            "department_id": "education",
            "location": {"lat": 23.0300, "lng": 72.5800, "address": "Govt Boys High School, Gota", "city": "Ahmedabad", "ward": "Ward 3"},
            "priority": "Medium",
            "ai_confidence": 89.0,
            "ai_summary": "Partial ceiling plaster collapse inside a state secondary school classroom requesting urgent civil inspection and maintenance repairs.",
            "status": "Submitted",
            "assigned_officer_id": None,
            "sla_deadline": (base_time + timedelta(days=4)).isoformat(),
            "created_at": base_time.isoformat(),
            "updated_at": base_time.isoformat(),
            "resolved_at": None,
            "evidence_urls": []
        }
    ]
    
    # Timeline logs
    LOCAL_UPDATES = [
        {"id": "u1", "grievance_id": "JS-2026-001245", "status": "Submitted", "remark": "Grievance submitted by citizen Rahul Verma", "updated_by": "Citizen System", "timestamp": (base_time - timedelta(days=2)).isoformat()},
        {"id": "u2", "grievance_id": "JS-2026-001245", "status": "AI Classified", "remark": "AI auto-detected Category: Public Infrastructure, Department: Municipal Corporation, SLA: 4 Days", "updated_by": "JanSetu AI", "timestamp": (base_time - timedelta(days=2)).isoformat()},
        {"id": "u3", "grievance_id": "JS-2026-001245", "status": "Assigned", "remark": "Grievance auto-routed to Municipal Officer Amit Sharma (Ward 12)", "updated_by": "JanSetu Dispatcher", "timestamp": (base_time - timedelta(days=2)).isoformat()},
        {"id": "u4", "grievance_id": "JS-2026-001245", "status": "In Progress", "remark": "Officer visited site. Streetlight bulb replacement ordered from central inventory.", "updated_by": "Officer Amit Sharma", "timestamp": (base_time - timedelta(days=1)).isoformat()},
        
        {"id": "u5", "grievance_id": "JS-2026-001246", "status": "Submitted", "remark": "Grievance submitted by citizen", "updated_by": "Citizen System", "timestamp": (base_time - timedelta(days=1)).isoformat()},
        {"id": "u6", "grievance_id": "JS-2026-001246", "status": "AI Classified", "remark": "AI auto-detected Category: Utilities, Department: Electricity Department, SLA: 48 Hours", "updated_by": "JanSetu AI", "timestamp": (base_time - timedelta(days=1)).isoformat()},
        {"id": "u7", "grievance_id": "JS-2026-001246", "status": "Assigned", "remark": "Assigned to Electricity Officer Suresh Patil (Zone 3)", "updated_by": "JanSetu Dispatcher", "timestamp": (base_time - timedelta(days=1)).isoformat()},
        
        {"id": "u8", "grievance_id": "JS-2026-001247", "status": "Submitted", "remark": "Grievance submitted", "updated_by": "Citizen System", "timestamp": (base_time - timedelta(days=4)).isoformat()},
        {"id": "u9", "grievance_id": "JS-2026-001247", "status": "AI Classified", "remark": "AI auto-detected Category: Sanitation, Department: Municipal Corporation, SLA: 4 Days", "updated_by": "JanSetu AI", "timestamp": (base_time - timedelta(days=4)).isoformat()},
        {"id": "u10", "grievance_id": "JS-2026-001247", "status": "Assigned", "remark": "Assigned to Municipal Officer Amit Sharma", "updated_by": "JanSetu Dispatcher", "timestamp": (base_time - timedelta(days=4)).isoformat()},
        {"id": "u11", "grievance_id": "JS-2026-001247", "status": "In Progress", "remark": "Solid waste cleanup truck routed to location.", "updated_by": "Officer Amit Sharma", "timestamp": (base_time - timedelta(days=3)).isoformat()},
        {"id": "u12", "grievance_id": "JS-2026-001247", "status": "Resolved", "remark": "Waste cleared and bins sanitized. Photo proof uploaded.", "updated_by": "Officer Amit Sharma", "timestamp": (base_time - timedelta(days=1)).isoformat()},
        
        {"id": "u13", "grievance_id": "JS-2026-001248", "status": "Submitted", "remark": "Grievance submitted", "updated_by": "Citizen System", "timestamp": (base_time - timedelta(days=1)).isoformat()},
        {"id": "u14", "grievance_id": "JS-2026-001248", "status": "AI Classified", "remark": "AI auto-detected Category: Utilities, Department: Water Supply Department, SLA: 4 Days", "updated_by": "JanSetu AI", "timestamp": (base_time - timedelta(days=1)).isoformat()},
        {"id": "u15", "grievance_id": "JS-2026-001248", "status": "Assigned", "remark": "Assigned to Water Officer Mahesh Patel", "updated_by": "JanSetu Dispatcher", "timestamp": (base_time - timedelta(days=1)).isoformat()},
        {"id": "u16", "grievance_id": "JS-2026-001248", "status": "In Progress", "remark": "Main valve closed. Welder team on site repairing pipeline crack.", "updated_by": "Officer Mahesh Patel", "timestamp": (base_time - timedelta(hours=12)).isoformat()},
        
        {"id": "u17", "grievance_id": "JS-2026-001249", "status": "Submitted", "remark": "Grievance submitted", "updated_by": "Citizen System", "timestamp": (base_time - timedelta(days=4)).isoformat()},
        {"id": "u18", "grievance_id": "JS-2026-001249", "status": "AI Classified", "remark": "AI auto-detected Category: Public Infrastructure, Department: Roads & Transport, SLA: 4 Days", "updated_by": "JanSetu AI", "timestamp": (base_time - timedelta(days=4)).isoformat()},
        {"id": "u19", "grievance_id": "JS-2026-001249", "status": "Assigned", "remark": "Assigned to Roads Officer Vikram Singh", "updated_by": "JanSetu Dispatcher", "timestamp": (base_time - timedelta(days=4)).isoformat()},
        {"id": "u20", "grievance_id": "JS-2026-001249", "status": "Escalated", "remark": "Resolution timeline exceeded (96 Hours breach). Auto-escalated to Command Center.", "updated_by": "JanSetu SLA Engine", "timestamp": (base_time - timedelta(days=2)).isoformat()}
    ]
    
    # Feedback
    LOCAL_FEEDBACK = [
        {"id": "f1", "grievance_id": "JS-2026-001247", "rating": 5, "comment": "Excellent cleanup! Quick work.", "reopened": False, "created_at": (base_time - timedelta(days=1)).isoformat()}
    ]
    
    # Notifications
    LOCAL_NOTIFICATIONS = [
        {"id": "n1", "user_id": "usr_citizen", "title": "Streetlight complaint update", "message": "Your grievance JS-2026-001245 is now In Progress. Officer Amit Sharma has ordered parts.", "grievance_id": "JS-2026-001245", "is_read": False, "created_at": (base_time - timedelta(days=1)).isoformat()},
        {"id": "n2", "user_id": "usr_citizen", "title": "Water leak complaint update", "message": "Your grievance JS-2026-001248 has been assigned to Officer Mahesh Patel.", "grievance_id": "JS-2026-001248", "is_read": False, "created_at": (base_time - timedelta(days=1)).isoformat()},
        {"id": "n3", "user_id": "usr_citizen", "title": "Garbage complaint resolved", "message": "Grievance JS-2026-001247 has been marked as Resolved. Please provide feedback.", "grievance_id": "JS-2026-001247", "is_read": True, "created_at": (base_time - timedelta(days=1)).isoformat()}
    ]

# Run initialization
init_mock_data()

# ==========================================
# DATABASE HELPER INTERFACES
# ==========================================

def get_all_grievances() -> List[Dict[str, Any]]:
    if is_supabase_configured and supabase_client:
        try:
            res = supabase_client.table("grievances").select("*").order("created_at", desc=True).execute()
            return res.data
        except Exception as e:
            print(f"Supabase error get_all_grievances: {e}")
    return LOCAL_GRIEVANCES

def get_grievance_by_id(gid: str) -> Optional[Dict[str, Any]]:
    # 1. Fetch main grievance
    grievance = None
    if is_supabase_configured and supabase_client:
        try:
            res = supabase_client.table("grievances").select("*").eq("id", gid).execute()
            if res.data:
                grievance = res.data[0]
        except Exception as e:
            print(f"Supabase error get_grievance_by_id: {e}")
            
    if not grievance:
        for g in LOCAL_GRIEVANCES:
            if g["id"] == gid:
                grievance = g.copy()
                break
                
    if not grievance:
        return None
        
    # 2. Join updates timeline
    updates = []
    if is_supabase_configured and supabase_client:
        try:
            res = supabase_client.table("grievance_updates").select("*").eq("grievance_id", gid).order("timestamp", desc=False).execute()
            updates = res.data
        except Exception as e:
            print(f"Supabase error timeline: {e}")
    else:
        updates = [u for u in LOCAL_UPDATES if u["grievance_id"] == gid]
        updates.sort(key=lambda x: x["timestamp"])
        
    # 3. Join feedback
    feedback = None
    if is_supabase_configured and supabase_client:
        try:
            res = supabase_client.table("feedback").select("*").eq("grievance_id", gid).execute()
            if res.data:
                feedback = res.data[0]
        except Exception as e:
            print(f"Supabase error feedback: {e}")
    else:
        for f in LOCAL_FEEDBACK:
            if f["grievance_id"] == gid:
                feedback = f
                break
                
    # Format and join citizen/officer visual names
    citizen_name = "Rahul Verma"
    officer_name = None
    
    officer_id = grievance.get("assigned_officer_id")
    if officer_id:
        for o in LOCAL_OFFICERS:
            if o["id"] == officer_id:
                officer_name = o["name"]
                break
                
    grievance["citizen_name"] = citizen_name
    grievance["assigned_officer_name"] = officer_name or "Not Assigned"
    grievance["timeline"] = updates
    grievance["feedback"] = feedback
    
    return grievance

def create_grievance(g_data: Dict[str, Any]) -> Dict[str, Any]:
    global LOCAL_GRIEVANCES, LOCAL_UPDATES
    
    # Generate ID if not present
    if not g_data.get("id"):
        next_num = len(LOCAL_GRIEVANCES) + 1251
        g_data["id"] = f"JS-2026-00{next_num}"
        
    g_data["status"] = g_data.get("status", "Submitted")
    g_data["created_at"] = g_data.get("created_at", datetime.now().isoformat())
    g_data["updated_at"] = g_data["created_at"]
    
    if is_supabase_configured and supabase_client:
        try:
            res = supabase_client.table("grievances").insert(g_data).execute()
            if res.data:
                saved = res.data[0]
                # Log initial update
                update_log = {
                    "grievance_id": saved["id"],
                    "status": "Submitted",
                    "remark": f"Grievance registered. Category: {saved['category']}, Dept: {saved.get('department_id')}",
                    "updated_by": "Citizen System"
                }
                supabase_client.table("grievance_updates").insert(update_log).execute()
                return saved
        except Exception as e:
            print(f"Supabase error create_grievance: {e}")
            
    # Local Save fallback
    LOCAL_GRIEVANCES.insert(0, g_data)
    
    # Create initial update
    initial_update = {
        "id": f"u_new_{len(LOCAL_UPDATES)}",
        "grievance_id": g_data["id"],
        "status": "Submitted",
        "remark": "Grievance registered in portal.",
        "updated_by": "Citizen System",
        "timestamp": g_data["created_at"]
    }
    LOCAL_UPDATES.append(initial_update)
    
    # Trigger Auto AI Classification Update local helper
    ai_classification_update = {
        "id": f"u_ai_{len(LOCAL_UPDATES)}",
        "grievance_id": g_data["id"],
        "status": "AI Classified",
        "remark": f"AI classified Category: {g_data.get('category')}, Department: {g_data.get('department_id')}, SLA: {g_data.get('priority')}",
        "updated_by": "JanSetu AI",
        "timestamp": datetime.now().isoformat()
    }
    LOCAL_UPDATES.append(ai_classification_update)
    
    # Trigger auto routing update
    officer_id = g_data.get("assigned_officer_id")
    officer_name = "Amit Sharma"
    for o in LOCAL_OFFICERS:
        if o["id"] == officer_id:
            officer_name = o["name"]
            break
            
    routing_update = {
        "id": f"u_route_{len(LOCAL_UPDATES)}",
        "grievance_id": g_data["id"],
        "status": "Assigned",
        "remark": f"Complaint auto-routed to assigned officer {officer_name}.",
        "updated_by": "JanSetu Dispatcher",
        "timestamp": datetime.now().isoformat()
    }
    LOCAL_UPDATES.append(routing_update)
    
    g_data["status"] = "Assigned"
    
    return g_data

def update_grievance_status(gid: str, status: str, remark: Optional[str] = None, updated_by: str = "Officer", proof_url: Optional[str] = None) -> bool:
    global LOCAL_GRIEVANCES, LOCAL_UPDATES
    
    now_str = datetime.now().isoformat()
    
    # 1. Update in Supabase
    if is_supabase_configured and supabase_client:
        try:
            update_payload = {"status": status, "updated_at": now_str}
            if status == "Resolved":
                update_payload["resolved_at"] = now_str
                
            res = supabase_client.table("grievances").update(update_payload).eq("id", gid).execute()
            
            # Insert log
            log_payload = {
                "grievance_id": gid,
                "status": status,
                "remark": remark or f"Grievance status updated to {status}",
                "updated_by": updated_by,
                "proof_url": proof_url
            }
            supabase_client.table("grievance_updates").insert(log_payload).execute()
            
            # Send Notification
            notif_payload = {
                "user_id": "usr_citizen", # For demo, always alert citizen
                "title": f"Grievance {status}",
                "message": remark or f"Your grievance {gid} status is updated to {status}",
                "grievance_id": gid
            }
            supabase_client.table("notifications").insert(notif_payload).execute()
            return True
        except Exception as e:
            print(f"Supabase error update_grievance_status: {e}")
            
    # 2. Local Fallback Update
    found = False
    for g in LOCAL_GRIEVANCES:
        if g["id"] == gid:
            g["status"] = status
            g["updated_at"] = now_str
            if status == "Resolved":
                g["resolved_at"] = now_str
            found = True
            break
            
    if found:
        # Append update log
        new_log = {
            "id": f"u_up_{len(LOCAL_UPDATES)}",
            "grievance_id": gid,
            "status": status,
            "remark": remark or f"Grievance status updated to {status}.",
            "updated_by": updated_by,
            "timestamp": now_str,
            "proof_url": proof_url
        }
        LOCAL_UPDATES.append(new_log)
        
        # Append notification
        new_notif = {
            "id": f"n_up_{len(LOCAL_NOTIFICATIONS)}",
            "user_id": "usr_citizen",
            "title": f"Grievance {status}",
            "message": remark or f"Your complaint {gid} has been updated to {status}.",
            "grievance_id": gid,
            "is_read": False,
            "created_at": now_str
        }
        LOCAL_NOTIFICATIONS.insert(0, new_notif)
        return True
        
    return False

def add_feedback(gid: str, rating: int, comment: Optional[str] = None, reopened: bool = False) -> bool:
    global LOCAL_FEEDBACK, LOCAL_GRIEVANCES, LOCAL_UPDATES
    
    now_str = datetime.now().isoformat()
    
    if is_supabase_configured and supabase_client:
        try:
            # Save feedback
            fb_payload = {"grievance_id": gid, "rating": rating, "comment": comment, "reopened": reopened}
            supabase_client.table("feedback").insert(fb_payload).execute()
            
            # If reopened, set status to Escalated
            if reopened:
                supabase_client.table("grievances").update({"status": "Escalated", "updated_at": now_str}).eq("id", gid).execute()
                log_payload = {
                    "grievance_id": gid,
                    "status": "Escalated",
                    "remark": f"Citizen reopened and escalated. Comment: {comment}",
                    "updated_by": "Citizen System"
                }
                supabase_client.table("grievance_updates").insert(log_payload).execute()
            else:
                # Close the ticket
                supabase_client.table("grievances").update({"status": "Closed", "updated_at": now_str}).eq("id", gid).execute()
                log_payload = {
                    "grievance_id": gid,
                    "status": "Closed",
                    "remark": "Citizen accepted resolution and closed the case.",
                    "updated_by": "Citizen System"
                }
                supabase_client.table("grievance_updates").insert(log_payload).execute()
            return True
        except Exception as e:
            print(f"Supabase error add_feedback: {e}")
            
    # Local fallback
    fb_entry = {
        "id": f"fb_{len(LOCAL_FEEDBACK)}",
        "grievance_id": gid,
        "rating": rating,
        "comment": comment,
        "reopened": reopened,
        "created_at": now_str
    }
    LOCAL_FEEDBACK.append(fb_entry)
    
    status_change = "Escalated" if reopened else "Closed"
    remark = f"Citizen reopened and escalated. Comment: {comment}" if reopened else "Citizen accepted resolution and closed the case."
    
    for g in LOCAL_GRIEVANCES:
        if g["id"] == gid:
            g["status"] = status_change
            g["updated_at"] = now_str
            break
            
    new_log = {
        "id": f"u_up_{len(LOCAL_UPDATES)}",
        "grievance_id": gid,
        "status": status_change,
        "remark": remark,
        "updated_by": "Citizen System",
        "timestamp": now_str
    }
    LOCAL_UPDATES.append(new_log)
    return True

def get_admin_analytics() -> Dict[str, Any]:
    grievances = get_all_grievances()
    
    total = len(grievances)
    resolved = sum(1 for g in grievances if g["status"] in ["Resolved", "Closed"])
    pending = sum(1 for g in grievances if g["status"] in ["Submitted", "AI Classified", "Assigned", "In Progress"])
    escalated = sum(1 for g in grievances if g["status"] == "Escalated")
    
    # Calculate avg resolution time (mock 1.8 days)
    avg_resolution_time = 1.8 
    
    # Citizen satisfaction (mock 4.6)
    citizen_sat = 4.6
    
    # Department performance counting
    dept_performance = {}
    for dept in LOCAL_DEPARTMENTS:
        dept_performance[dept["name"]] = {"assigned": 0, "resolved": 0, "breached": 0}
        
    for g in grievances:
        dept_name = "Other"
        for d in LOCAL_DEPARTMENTS:
            if d["id"] == g.get("department_id"):
                dept_name = d["name"]
                break
                
        if dept_name not in dept_performance:
            dept_performance[dept_name] = {"assigned": 0, "resolved": 0, "breached": 0}
            
        dept_performance[dept_name]["assigned"] += 1
        if g["status"] in ["Resolved", "Closed"]:
            dept_performance[dept_name]["resolved"] += 1
        if g["status"] == "Escalated":
            dept_performance[dept_name]["breached"] += 1
            
    dept_chart_data = []
    for k, v in dept_performance.items():
        if v["assigned"] > 0:
            dept_chart_data.append({
                "department": k,
                "assigned": v["assigned"],
                "resolved": v["resolved"],
                "breached": v["breached"]
            })
            
    # Grievance category breakdowns
    cat_counts: Dict[str, int] = {}
    for g in grievances:
        cat = g.get("category", "Other")
        cat_counts[cat] = cat_counts.get(cat, 0) + 1
        
    category_chart_data = [{"name": k, "value": v} for k, v in cat_counts.items()]
    
    # Monthly trend (past 5 months)
    monthly_trend = [
        {"month": "Apr 2026", "complaints": 110, "resolved": 95},
        {"month": "May 2026", "complaints": 145, "resolved": 120},
        {"month": "Jun 2026", "complaints": 180, "resolved": 165},
        {"month": "Jul 2026", "complaints": 210, "resolved": 195},
        {"month": "Aug 2026", "complaints": total, "resolved": resolved}
    ]
    
    return {
        "metrics": {
            "total": total,
            "resolved": resolved,
            "pending": pending,
            "escalated": escalated,
            "avg_resolution_time": avg_resolution_time,
            "satisfaction_rating": citizen_sat
        },
        "department_performance": dept_chart_data,
        "category_distribution": category_chart_data,
        "monthly_trend": monthly_trend
    }

def reset_to_demo_data() -> bool:
    init_mock_data()
    return True
