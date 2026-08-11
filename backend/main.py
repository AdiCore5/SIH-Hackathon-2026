from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from datetime import datetime

import database
from models import UserLogin, UserRegister, UserResponse, GrievanceCreate, StatusUpdate, FeedbackCreate, ChatQuery, LocationInfo
import services.ai_service as ai_service

app = FastAPI(
    title="JanSetu-AI Backend",
    description="AI-powered citizen grievance routing and tracking API",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "supabase_connected": database.is_supabase_configured
    }

# ==========================================
# AUTH ENDPOINTS
# ==========================================

@app.post("/api/auth/login")
def login(payload: UserLogin):
    email = payload.email.lower()
    password = payload.password
    
    # 1. Standard Hackathon Credentials Authentication
    found_user = None
    for u in database.LOCAL_USERS:
        if u["email"].lower() == email:
            found_user = u
            break
            
    if not found_user:
        # Check other preloaded mock emails
        if email == "priyal.patel@gmail.com":
            found_user = database.LOCAL_USERS[3]
        elif email == "rohan.gupta@gmail.com":
            found_user = database.LOCAL_USERS[4]
            
    if not found_user or password != "Demo@123":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Use demo credentials (e.g. demo.citizen@jansetu.ai / Demo@123)"
        )
        
    return {
        "success": True,
        "token": f"demo-jwt-token-{found_user['id']}",
        "user": found_user
    }

# ==========================================
# GRIEVANCE ENDPOINTS
# ==========================================

@app.get("/api/grievances")
def get_grievances(
    role: Optional[str] = None,
    department_id: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None
):
    all_g = database.get_all_grievances()
    filtered = []
    
    for g in all_g:
        # Filter by department
        if department_id and g.get("department_id") != department_id:
            continue
            
        # Filter by status
        if status and g.get("status") != status:
            continue
            
        # Filter by priority
        if priority and g.get("priority") != priority:
            continue
            
        # Filter by search string (title or description)
        if search:
            q = search.lower()
            if q not in g["title"].lower() and q not in g["description"].lower() and q not in g["id"].lower():
                continue
                
        filtered.append(g)
        
    return filtered

@app.get("/api/grievances/{id}")
def get_grievance(id: str):
    g = database.get_grievance_by_id(id)
    if not g:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grievance ID {id} not found."
        )
    return g

@app.post("/api/grievances")
def lodge_grievance(payload: GrievanceCreate):
    # 1. Run AI analysis
    location_dict = payload.location.dict()
    analysis = ai_service.analyze_grievance(payload.description, location_dict)
    
    # 2. Check for Duplicates
    all_active = [g for g in database.get_all_grievances() if g["status"] not in ["Resolved", "Closed"]]
    dup_check = ai_service.detect_duplicates(payload.description, location_dict, all_active)
    
    # Generate unique ID JS-2026-00XXXX
    next_num = len(database.LOCAL_GRIEVANCES) + 1251
    gid = f"JS-2026-00{next_num}"
    
    # Set default routing officer
    assigned_officer = None
    dept_id = analysis["department_id"]
    for o in database.LOCAL_OFFICERS:
        if o["department_id"] == dept_id:
            assigned_officer = o["id"]
            break
            
    # Compile complaint document
    grievance = {
        "id": gid,
        "citizen_id": payload.citizen_id,
        "title": payload.title,
        "description": payload.description,
        "category": analysis["category"],
        "subcategory": analysis["subcategory"],
        "department_id": dept_id,
        "location": location_dict,
        "priority": analysis["priority"],
        "ai_confidence": analysis["confidence"],
        "ai_summary": analysis["summary"],
        "status": "Assigned", # Auto-assigned after classification
        "assigned_officer_id": assigned_officer,
        "sla_deadline": analysis["sla_deadline"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "resolved_at": None,
        "evidence_urls": payload.evidence_urls
    }
    
    saved_g = database.create_grievance(grievance)
    return {
        "success": True,
        "grievance": saved_g,
        "duplicate_alert": dup_check
    }

@app.patch("/api/grievances/{id}/status")
def patch_status(id: str, payload: StatusUpdate):
    success = database.update_grievance_status(
        gid=id,
        status=payload.status,
        remark=payload.remark,
        updated_by=payload.updated_by,
        proof_url=payload.proof_url
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grievance ID {id} not found."
        )
    return {"success": True, "message": f"Status updated to {payload.status}."}

@app.post("/api/grievances/{id}/feedback")
def submit_feedback(id: str, payload: FeedbackCreate):
    success = database.add_feedback(
        gid=id,
        rating=payload.rating,
        comment=payload.comment,
        reopened=payload.reopened
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grievance ID {id} not found."
        )
    return {"success": True, "message": "Feedback submitted successfully."}

# ==========================================
# AI SERVICE ENDPOINTS
# ==========================================

@app.post("/api/ai/analyze")
def analyze_text(payload: Dict[str, Any]):
    description = payload.get("description", "")
    location = payload.get("location", {"city": "Vadodara", "ward": "Ward 12"})
    if not description:
        raise HTTPException(status_code=400, detail="Missing description text.")
        
    analysis = ai_service.analyze_grievance(description, location)
    return analysis

@app.post("/api/ai/detect-duplicates")
def check_duplicates(payload: Dict[str, Any]):
    description = payload.get("description", "")
    location = payload.get("location", {"city": "Vadodara", "ward": "Ward 12"})
    if not description:
         raise HTTPException(status_code=400, detail="Missing description text.")
         
    all_active = [g for g in database.get_all_grievances() if g["status"] not in ["Resolved", "Closed"]]
    dup_check = ai_service.detect_duplicates(description, location, all_active)
    return dup_check

@app.post("/api/chat")
def chat_assistant(payload: ChatQuery):
    grievances = database.get_all_grievances()
    chat_response = ai_service.process_chatbot_query(
        message=payload.message,
        grievance_id=payload.grievance_id,
        grievances=grievances
    )
    return chat_response

# ==========================================
# ADMIN & SYSTEM ENDPOINTS
# ==========================================

@app.get("/api/admin/analytics")
def get_analytics():
    analytics = database.get_admin_analytics()
    return analytics

@app.post("/api/admin/reset")
def reset_system():
    success = database.reset_to_demo_data()
    return {"success": success, "message": "System database reset to seed data defaults."}
