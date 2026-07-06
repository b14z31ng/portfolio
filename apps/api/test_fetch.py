import asyncio
from sqlalchemy import select
from app.db.session import async_session_factory
from app.models.profile import Resume

async def main():
    async with async_session_factory() as session:
        result = await session.execute(select(Resume))
        resumes = result.scalars().all()
        for r in resumes:
            print(f"ID: {r.id} | Title: {r.title} | File URL: {r.file_url}")

if __name__ == "__main__":
    asyncio.run(main())
