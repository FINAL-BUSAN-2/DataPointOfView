from fastapi import FastAPI, Request, Depends, HTTPException
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import RedirectResponse
from urllib.parse import quote
import httpx

from sqlalchemy import create_engine, Column, String, Integer, func, or_
from sqlalchemy import ForeignKey, text, Table, MetaData, Float, Date, desc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Optional
from pydantic import BaseModel, validator
from datetime import date,datetime

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key='bce5bcfe36455290d51dd4258cfb2737e54b79188d9d51aa162f6ed9e6e706f3')

DATABASE_URL = "mysql+pymysql://mobile:Data1q2w3e4r!!@54.180.91.68:3306/dw"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class News_Data(Base):
    __tablename__ = "news_data"
    news_idx = Column(String(10), primary_key=True)
    news_cat = Column(String(30))
    news_title = Column(String(150))
    news_link = Column(String(200))
    news_img = Column(String(200))


class News_DataBase(BaseModel):
    news_idx: str
    news_cat: str
    news_title: str
    news_link: str
    news_img: Optional[str] = None

class News_DataInDB(News_DataBase):
    class Config:
        orm_mode = True

@app.get("/naver/news/", response_model=List[News_DataInDB])
def get_search_news(db: Session = Depends(get_db), search: str = None):
    news = db.query(News_Data).filter_by(news_cat=search).all()
    return news

