from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from bson import ObjectId
from datetime import datetime

# Modelo para mensajes
class Message(BaseModel):
    de: EmailStr
    para: EmailStr
    asunto: str = Field(..., max_length=80)
    timestamp: int = int(datetime.timestamp(datetime.now()))
    contenido: str
    adjunto: Optional[str] = None