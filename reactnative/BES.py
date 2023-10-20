import logging
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import ForeignKey
from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List
from pydantic import BaseModel, validator

from typing import List
from fastapi import Request

app = FastAPI()

DATABASE_URL = "mysql://root:dbdb@localhost/dpv_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


######################################### 루틴리스트


# SQLAlchemy 모델 정의
class ERoutine(Base):
    __tablename__ = "ERTN_SETTING"
    ertn_mem = Column(String(50), ForeignKey("mem_detail.mem_email"), primary_key=True)
    ertn_id = Column(String(50), primary_key=True)
    ertn_nm = Column(String(100), nullable=False)
    ertn_cat = Column(String(20), nullable=False)
    ertn_tag = Column(String(60), nullable=False)
    ertn_set = Column(Integer, nullable=False)
    ertn_reps = Column(Integer, nullable=False)
    ertn_sdate = Column(String(10), nullable=False)
    ertn_time = Column(String(50), nullable=False)
    ertn_alram = Column(Integer, nullable=False)
    ertn_day = Column(String(50))


class PRoutine(Base):
    __tablename__ = "PRTN_SETTING"
    prtn_mem = Column(String(50), ForeignKey("mem_detail.mem_email"), primary_key=True)
    prtn_id = Column(String(50), primary_key=True)
    prtn_nm = Column(String(100), nullable=False)
    prtn_cat = Column(String(20), nullable=False)
    prtn_tag = Column(String(60), nullable=False)
    prtn_set = Column(Integer, nullable=False)
    prtn_reps = Column(Integer, nullable=False)
    prtn_sdate = Column(String(10), nullable=False)
    prtn_time = Column(String(50), nullable=False)
    prtn_alram = Column(Integer, nullable=False)
    prtn_day = Column(String(50))


class HRoutine(Base):
    __tablename__ = "HRTN_SETTING"
    hrtn_mem = Column(String(50), ForeignKey("mem_detail.mem_email"), primary_key=True)
    hrtn_id = Column(String(50), primary_key=True)
    hrtn_nm = Column(String(100), nullable=False)
    hrtn_cat = Column(String(20), nullable=False)
    hrtn_tag = Column(String(60), nullable=False)
    hrtn_set = Column(Integer, nullable=False)
    hrtn_reps = Column(Integer, nullable=False)
    hrtn_sdate = Column(String(10), nullable=False)
    hrtn_time = Column(String(50), nullable=False)
    hrtn_alram = Column(Integer, nullable=False)
    hrtn_day = Column(String(50))


#### 루틴데이터받아오기
class ERoutineResponse(BaseModel):
    ertn_time: str
    ertn_name: str
    ertn_tag: str


class PRoutineResponse(BaseModel):
    prtn_time: str
    prtn_name: str
    prtn_tag: str


class HRoutineResponse(BaseModel):
    hrtn_time: str
    hrtn_name: str
    hrtn_tag: str


# 루틴3가지 통합 모델 정의
class MergedRoutineResponse(BaseModel):
    rtn_time: str
    rtn_name: str
    rtn_tag: str


# 데이터베이스에서 루틴 데이터 가져오는 함수
def get_merged_routines_from_database():
    with SessionLocal() as db:
        e_routines = db.query(ERoutine).all()
        p_routines = db.query(PRoutine).all()
        h_routines = db.query(HRoutine).all()

        merged_routines = []

        for routine in e_routines:
            merged_routines.append(
                MergedRoutineResponse(
                    rtn_time=routine.ertn_time,
                    rtn_name=routine.ertn_nm,
                    rtn_tag=routine.ertn_tag,
                )
            )

        for routine in p_routines:
            merged_routines.append(
                MergedRoutineResponse(
                    rtn_time=routine.prtn_time,
                    rtn_name=routine.prtn_nm,
                    rtn_tag=routine.prtn_tag,
                )
            )

        for routine in h_routines:
            merged_routines.append(
                MergedRoutineResponse(
                    rtn_time=routine.hrtn_time,
                    rtn_name=routine.hrtn_nm,
                    rtn_tag=routine.hrtn_tag,
                )
            )
        # 시간을 기준으로 오름차순
        merged_routines.sort(key=lambda x: x.rtn_time)

        return merged_routines


# 루틴 데이터 가져오는 엔드포인트
@app.get("/rtnlist", response_model=List[MergedRoutineResponse])
async def read_routines(request: Request):
    merged_routines = get_merged_routines_from_database()
    return merged_routines


################################################## 뉴스
class User(Base):
    __tablename__ = "news_data"
    news_idx = Column(String(10), primary_key=True)
    news_cat = Column(String(30))
    news_title = Column(String(150))
    news_link = Column(String(200))
    news_img = Column(String(200))


class UserBase(BaseModel):
    news_idx: str
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
