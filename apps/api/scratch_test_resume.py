import asyncio
from app.db.session import async_session_factory
from app.models.profile import Resume

async def test_insert():
    async with async_session_factory() as session:
        try:
            new_resume = Resume(
                title="Test Resume",
                file_url="/uploads/test.pdf",
                file_name="test.pdf",
                file_size=100,
                mime_type="application/pdf",
                created_by="test@example.com",
                updated_by="test@example.com",
            )
            session.add(new_resume)
            await session.commit()
            print("Successfully inserted resume!")
            
            # Now delete it to clean up
            await session.delete(new_resume)
            await session.commit()
            print("Successfully cleaned up!")
        except Exception as e:
            print("Error:", str(e))
            raise

if __name__ == "__main__":
    asyncio.run(test_insert())
