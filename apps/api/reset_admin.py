import asyncio
from sqlalchemy import select
from app.db.session import async_session_factory
from app.models.user import User
from app.core.security import hash_password
from app.core.config import get_settings

settings = get_settings()

async def reset():
    async with async_session_factory() as db:
        result = await db.execute(
            select(User).where(User.email == settings.ADMIN_EMAIL)
        )
        user = result.scalar_one_or_none()
        if user:
            user.hashed_password = hash_password(settings.ADMIN_PASSWORD)
            await db.commit()
            print("Admin password updated successfully!")
        else:
            print("Admin user not found!")

asyncio.run(reset())
