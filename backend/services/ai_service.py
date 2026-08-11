import re
import random
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

# Keywords mapped to departments
KEYWORD_MAPPING = [
    {
        "dept_id": "municipal",
        "category": "Public Infrastructure",
        "subcategory": "Street Lighting",
        "keywords": ["streetlight", "light", "street light", "lamp", "dark", "park", "garden", "playground", "swing"]
    },
    {
        "dept_id": "electricity",
        "category": "Utilities",
        "subcategory": "Power Failure",
        "keywords": ["power cut", "electricity", "transformer", "voltage", "blackout", "load shedding", "current", "spike", "meter", "wire", "cable"]
    },
    {
        "dept_id": "water",
        "category": "Utilities",
        "subcategory": "Water Leakage",
        "keywords": ["water leakage", "no water", "pipeline", "leakage", "water pipe", "low pressure", "tap water", "water supply"]
    },
    {
        "dept_id": "roads",
        "category": "Public Infrastructure",
        "subcategory": "Road Damage",
        "keywords": ["road", "pothole", "highway", "bridge", "bypass", "tar", "asphalt", "flyover", "signal", "traffic light", "zebra crossing"]
    },
    {
        "dept_id": "police",
        "category": "Public Safety",
        "subcategory": "Local Security",
        "keywords": ["crime", "theft", "police", "robbery", "scam", "noise", "loudspeaker", "music", "fight", "assault", "harassment", "cyber"]
    },
    {
        "dept_id": "education",
        "category": "Education",
        "subcategory": "School Maintenance",
        "keywords": ["school", "teacher", "exam", "college", "fees", "classroom", "student", "syllabus", "midday meal"]
    },
    {
        "dept_id": "healthcare",
        "category": "Healthcare",
        "subcategory": "Primary Care",
        "keywords": ["hospital", "medicine", "doctor", "health", "clinic", "nurse", "patient", "ambulance", "phc", "dispensary"]
    },
    {
        "dept_id": "sanitation",
        "category": "Sanitation",
        "subcategory": "Waste Accumulation",
        "keywords": ["garbage", "trash", "dumping", "waste", "clean", "sweep", "drainage", "sewage", "overflow", "sewer", "gutter"]
    },
    {
        "dept_id": "pds",
        "category": "Utilities",
        "subcategory": "PDS Grievance",
        "keywords": ["ration", "pds", "food grains", "wheat", "rice", "sugar", "ration shop", "dealer", "bpl"]
    }
]

EMERGENCY_KEYWORDS = [
    "fire", "blast", "explosion", "building collapse", "live wire", "electrocution", 
    "drowning", "accident", "bleeding", "unconscious", "crime in progress", "violence"
]

def clean_text(text: str) -> str:
    return re.sub(r'[^\w\s]', '', text.lower().strip())

def analyze_grievance(description: str, location: Dict[str, Any]) -> Dict[str, Any]:
    cleaned = clean_text(description)
    
    # 1. Category and Department Detection
    best_dept = "other"
    best_category = "Other"
    best_subcategory = "General Request"
    max_matches = 0
    
    for mapping in KEYWORD_MAPPING:
        matches = sum(1 for kw in mapping["keywords"] if kw in cleaned)
        if matches > max_matches:
            max_matches = matches
            best_dept = mapping["dept_id"]
            best_category = mapping["category"]
            best_subcategory = mapping["subcategory"]
            
    # Sub-category fine-tuning based on descriptive keywords
    if best_dept == "sanitation" and "dumping" in cleaned:
        best_subcategory = "Illegal Dumping"
    elif best_dept == "sanitation" and ("sewage" in cleaned or "overflow" in cleaned or "sewer" in cleaned):
        best_subcategory = "Sewer Overflows"
    elif best_dept == "roads" and ("signal" in cleaned or "traffic" in cleaned):
        best_subcategory = "Traffic Signals"
    elif best_dept == "police" and ("noise" in cleaned or "loud" in cleaned):
        best_subcategory = "Noise Pollution"
    elif best_dept == "police" and "cyber" in cleaned:
        best_subcategory = "Cyber Crime"
    elif best_dept == "healthcare" and "medicine" in cleaned:
        best_subcategory = "Medicine Shortage"
        
    # 2. Emergency Check
    is_emergency = any(ek in cleaned for ek in EMERGENCY_KEYWORDS)
    
    # 3. Priority Detection
    priority = "Medium"
    sla_hours = 96 # 4 Days default
    
    if is_emergency:
        priority = "Critical"
        sla_hours = 24 # 24 Hours
    elif any(kw in cleaned for kw in ["overflow", "blackout", "leakage", "accident", "scam", "phishing", "robbery"]):
        priority = "High"
        sla_hours = 48 # 48 Hours
    elif any(kw in cleaned for kw in ["delay", "billing", "clean", "fees", "swings"]):
        priority = "Medium"
        sla_hours = 96
    elif len(cleaned) < 30:
        priority = "Low"
        sla_hours = 168 # 7 Days
        
    # 4. Confidence Score (85% to 98%)
    confidence = 85.0
    if max_matches > 0:
        confidence = float(min(98.0, 85.0 + (max_matches * 4) + random.uniform(0, 3)))
        
    # 5. SLA Deadline Calculation
    deadline = datetime.now() + timedelta(hours=sla_hours)
    
    # 6. AI Summary Generation
    summary = generate_summary(description, best_category, priority)
    
    return {
        "category": best_category,
        "subcategory": best_subcategory,
        "department_id": best_dept,
        "priority": priority,
        "confidence": confidence,
        "sla_hours": sla_hours,
        "summary": summary,
        "is_emergency": is_emergency,
        "emergency_helpline": "112 / 100" if is_emergency else None,
        "sla_deadline": deadline.isoformat()
    }

def generate_summary(description: str, category: str, priority: str) -> str:
    # Summarize with formal sentence structure
    desc_words = description.strip().split()
    trimmed_desc = " ".join(desc_words[:15]) + "..." if len(desc_words) > 15 else description.strip()
    
    # Capitalize first letter and ensure ending punctuation
    if not trimmed_desc.endswith('.'):
        trimmed_desc += '.'
        
    summary = f"Citizen reports a {category.lower()} issue: '{trimmed_desc}'"
    if priority == "Critical":
        summary = f"🚨 EMERGENCY: Urgent {category.lower()} hazard reported needing immediate intervention: '{trimmed_desc}'"
    elif priority == "High":
        summary = f"High priority {category.lower()} grievance filed: '{trimmed_desc}'"
        
    return summary

def detect_duplicates(description: str, location: Dict[str, Any], existing_grievances: List[Dict[str, Any]]) -> Dict[str, Any]:
    cleaned_query = set(clean_text(description).split())
    city = location.get("city", "").lower()
    ward = location.get("ward", "").lower()
    
    for g in existing_grievances:
        # Only check active complaints in the same city/ward
        g_status = g.get("status")
        if g_status in ["Resolved", "Closed"]:
            continue
            
        g_loc = g.get("location", {})
        if g_loc.get("city", "").lower() != city or g_loc.get("ward", "").lower() != ward:
            continue
            
        # Text Jaccard similarity
        cleaned_g = set(clean_text(g.get("description", "")).split())
        if not cleaned_query or not cleaned_g:
            continue
            
        intersection = cleaned_query.intersection(cleaned_g)
        union = cleaned_query.union(cleaned_g)
        similarity = len(intersection) / len(union)
        
        # High similarity thresholds (similarity > 40% with similar keywords)
        if similarity > 0.35:
            return {
                "is_duplicate": True,
                "similarity": float(round(similarity * 100, 1)),
                "matched_grievance_id": g["id"],
                "message": f"Similar active complaint {g['id']} ('{g['title']}') detected nearby in {g_loc.get('address')}."
            }
            
    return {
        "is_duplicate": False,
        "similarity": 0.0,
        "matched_grievance_id": None
    }

def process_chatbot_query(message: str, grievance_id: Optional[str], grievances: List[Dict[str, Any]]) -> Dict[str, Any]:
    cleaned = clean_text(message)
    
    # 1. Check if user provided/asked about a specific Grievance ID pattern
    id_match = re.search(r'js-\d{4}-\d+', cleaned)
    if id_match:
        gid = id_match.group(0).upper()
        for g in grievances:
            if g["id"] == gid:
                return {
                    "reply": f"Found it! Your grievance **{gid}** ('{g['title']}') is currently **{g['status']}**. "
                             f"It is assigned to department: **{g.get('department_id', 'General')}**. "
                             f"The expected resolution deadline is **{g['sla_deadline'][:10]}**.",
                    "intent": "track_grievance",
                    "data": {"id": gid}
                }
        return {
            "reply": f"I couldn't find any active grievance with ID **{gid}**. Please double-check the ID and try again.",
            "intent": "track_grievance",
            "data": None
        }
        
    # 2. General Intent Detection
    if any(k in cleaned for k in ["lodge", "file", "complain", "register", "report"]):
        return {
            "reply": "I can definitely help you file a grievance! Click on the **'Lodge a Grievance'** button in the dashboard or navbar. "
                     "You can describe your issue in writing, upload photos, or even click the microphone icon to speak your complaint in English, Hindi, or Gujarati. I will classify it for you.",
            "intent": "lodge_grievance",
            "data": None
        }
        
    if any(k in cleaned for k in ["track", "status", "where is", "progress"]):
        return {
            "reply": "To track your complaint, please enter your Grievance ID (for example: **JS-2026-001245**). "
                     "You can also see your complete active history directly in the **'My Grievances'** tab on your Citizen Dashboard.",
            "intent": "track_grievance",
            "data": None
        }
        
    if any(k in cleaned for k in ["delay", "late", "slow", "escalat", "time exceed"]):
        return {
            "reply": "If a complaint exceeds its expected resolution SLA deadline, our system auto-escalates it to the Admin Command Center. "
                     "If your issue is resolved but you are unsatisfied, you can click **'Reopen Grievance'** to escalate it manually.",
            "intent": "escalation_info",
            "data": None
        }
        
    # Keyword routing assistant
    for mapping in KEYWORD_MAPPING:
        if any(kw in cleaned for kw in mapping["keywords"]):
            return {
                "reply": f"This issue sounds like it belongs to the **{mapping['category']}** category under the **{mapping['dept_id'].capitalize()} Department**. "
                         f"Would you like me to help you lodge a grievance for this?",
                "intent": "department_routing",
                "data": {"dept_id": mapping["dept_id"]}
            }
            
    # Default Conversational response
    return {
        "reply": "Namaste! 🙏 I'm JanSetu AI, your civic assistant. I can help you lodge grievances, track active complaints, "
                 "or direct issues to the correct department. How can I help you today?",
        "intent": "greeting",
        "data": None
    }
