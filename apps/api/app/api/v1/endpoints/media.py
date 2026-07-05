import os
import uuid
import shutil
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from app.core.deps import get_current_user
from app.core.config import get_settings
from app.models.user import User

router = APIRouter()

settings = get_settings()

# Initialize Cloudinary if credentials are provided
cloudinary_configured = False
if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True
    )
    cloudinary_configured = True

# Store uploads relative to the apps/api/uploads folder (fallback)
UPLOAD_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))),
    "uploads"
)
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Upload an image (to Cloudinary if configured, otherwise local fallback)."""
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image",
        )
    
    # Try to upload to Cloudinary first
    if cloudinary_configured:
        try:
            # We pass file.file to upload directly from memory
            upload_result = cloudinary.uploader.upload(
                file.file,
                folder="portfolio_projects",
                resource_type="image"
            )
            return {
                "url": upload_result.get("secure_url"),
                "filename": upload_result.get("public_id"),
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Cloudinary upload failed: {str(e)}"
            )

    # Local fallback
    file_ext = os.path.splitext(file.filename)[1]
    new_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, new_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file locally: {str(e)}"
        )
        
    return {
        "url": f"/uploads/{new_filename}",
        "filename": new_filename,
    }
