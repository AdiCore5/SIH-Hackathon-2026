from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth Models
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    city: Optional[str] = None
    state: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    role: str
    department_id: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    created_at: str

# Location Info Pydantic Model
class LocationInfo(BaseModel):
    lat: Optional[float] = None
    lng: Optional[float] = None
    address: Optional[str] = None
    city: str
    ward: str

# Grievance Models
class GrievanceCreate(BaseModel):
    citizen_id: str
    title: str
    description: str
    location: LocationInfo
    evidence_urls: Optional[List[str]] = Field(default_factory=list)

class StatusUpdate(BaseModel):
    status: str
    remark: Optional[str] = None
    updated_by: str
    proof_url: Optional[str] = None

# Feedback Model
class FeedbackCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    reopened: Optional[bool] = False

# Chatbot Model
class ChatQuery(BaseModel):
    message: str
    grievance_id: Optional[str] = None
