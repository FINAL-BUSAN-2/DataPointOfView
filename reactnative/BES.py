# from fastapi import FastAPI
# from fastapi import HTTPException
# from fastapi import Depends
# from pydantic import BaseModel
# from typing import List
# import mysql.connector
from fastapi import FastAPI, Request, Depends, HTTPException
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import RedirectResponse
from urllib.parse import quote
import httpx
### 뉴스크롤링에 사용할 라이브러리
import pandas as pd
from bs4 import BeautifulSoup
import requests
### DB사용하기
from sqlalchemy import create_engine, Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List
from pydantic import BaseModel

app = FastAPI()

# # MySQL 연결 설정
# def get_db():
#     db = mysql.connector.connect(
#         host="127.0.0.1",
#         user="psh",
#         password="dbdb",
#         database="testdb"
    # )
    # try:
    #     yield db
    # finally:
    #     db.close()
        
# class Routine(BaseModel):
#     rtn_nm: str
#     rtn_set: int
#     rtn_reps: int
#     rtn_sdate: str
#     rtn_day: List[str]
#     rtn_tag: str

# @app.post("/routines", status_code=201)
# def create_routine(routine: Routine, db=Depends(get_db)):
#     with db.cursor() as cursor:
#         # 리스트를 문자열로 변환
#         rtn_day_str = ",".join(routine.rtn_day)
#         # SQL 쿼리 생성
#         query = "INSERT INTO RTN_SETT (rtn_nm, rtn_set, rtn_reps, rtn_sdate, rtn_day, rtn_tag) VALUES (%s,%s,%s,%s,%s,%s)"
#         values = (routine.rtn_nm, routine.rtn_set, routine.rtn_reps,
#                   routine.rtn_sdate,rtn_day_str,routine.rtn_tag)

        
#         cursor.execute(query ,values)
        
#     db.commit()
    
#     if cursor.rowcount == 0:
#             raise HTTPException(status_code=500,
#                                 detail="Failed to insert routine into the database")
    
#     return {"message": "Routine added successfully"}


DATABASE_URL = "mysql://root:dbdb@localhost/testdb"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "NEWS_DATA"
    index = Column(String(10), primary_key=True)
    news_cat = Column(String(30))
    news_title = Column(String(150))
    news_link = Column(String(200))
    news_img = Column(String(200))

class UserBase(BaseModel):
    index: str
    news_cat: str
    news_title: str
    news_link: str
    news_img: str

class UserInDB(UserBase):
    class Config:
        orm_mode = True
    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/naver/news/", response_model=List[UserInDB])
def get_search_news(db: Session = Depends(get_db), search: str = None):
    news = db.query(User).filter_by(news_cat=search).all()
    return news
