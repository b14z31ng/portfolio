import asyncio
from app.db.session import async_session_factory
from sqlalchemy import select
from app.models.publication import Publication

async def test():
    async with async_session_factory() as session:
        try:
            query = select(Publication).order_by(
                Publication.sort_order.asc(),
                Publication.year.desc().nulls_last()
            )
            res = await session.execute(query)
            print("Query executed successfully!")
        except Exception as e:
            print("Error executing query:", str(e))
            raise

if __name__ == "__main__":
    asyncio.run(test())
