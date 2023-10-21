from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Union, Optional
from pydantic import BaseModel
from sqlalchemy import ForeignKey
from sqlalchemy import Date
from datetime import date,datetime
import time

app = FastAPI()
DATABASE_URL = "mysql://mobile:Data1q2w3e4r!!@54.180.91.68:3306/dw"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# 루틴추가_기타
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
# 루틴추가_건강
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
# 루틴추가_영양
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
#####################
# 루틴추가_기타
class ERoutineCreate(BaseModel):
    ertn_mem: str
    ertn_id: str
    ertn_nm: str
    ertn_cat: str
    ertn_tag: str
    ertn_set: int
    ertn_reps: int
    ertn_sdate: str
    ertn_time: str
    ertn_alram: int
    ertn_day: str
# 루틴추가_건강
class HRoutineCreate(BaseModel):
    hrtn_mem : str
    hrtn_id : str
    hrtn_nm : str
    hrtn_cat : str
    hrtn_tag : str
    hrtn_set : int
    hrtn_reps : int
    hrtn_sdate : str
    hrtn_time : str
    hrtn_alram : int
    hrtn_day : str
# 루틴추가_영양
class PRoutineCreate(BaseModel):
    prtn_mem : str
    prtn_id : str
    prtn_nm : str
    prtn_cat : str
    prtn_tag : str
    prtn_set : int
    prtn_reps : int
    prtn_sdate : str
    prtn_time : str
    prtn_alram : int
    prtn_day : str
    

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    
##########
###################
# 루틴추가_기타
@app.post("/eroutines", response_model=ERoutineCreate)
def create_routine(routine: ERoutineCreate, db: Session = Depends(get_db)):
    db_routine = ERoutine(
        ertn_mem=routine.ertn_mem,
        ertn_id=routine.ertn_id,
        ertn_nm=routine.ertn_nm,
        ertn_cat=routine.ertn_cat,
        ertn_tag=routine.ertn_tag,
        ertn_set=routine.ertn_set,
        ertn_reps=routine.ertn_reps,
        ertn_sdate=routine.ertn_sdate,
        ertn_time=routine.ertn_time,
        ertn_alram=routine.ertn_alram,
        ertn_day=routine.ertn_day,
    )
    db.add(db_routine)
    db.commit()
    db.refresh(db_routine)
    return db_routine
# 루틴추가_건강
@app.post("/hroutines", response_model=HRoutineCreate)
def create_routine(routine: HRoutineCreate, db: Session = Depends(get_db)):
    db_routine = HRoutine(
        hrtn_mem=routine.hrtn_mem,
        hrtn_id=routine.hrtn_id,
        hrtn_nm=routine.hrtn_nm,
        hrtn_cat=routine.hrtn_cat,
        hrtn_tag=routine.hrtn_tag,
        hrtn_set=routine.hrtn_set,
        hrtn_reps=routine.hrtn_reps,
        hrtn_sdate=routine.hrtn_sdate,
        hrtn_time=routine.hrtn_time,
        hrtn_alram=routine.hrtn_alram,
        hrtn_day=routine.hrtn_day,
    )
    db.add(db_routine)
    db.commit()
    db.refresh(db_routine)
    return db_routine
# 루틴추가_영양
@app.post("/proutines", response_model=PRoutineCreate)
def create_routine(routine: PRoutineCreate, db: Session = Depends(get_db)):
    db_routine = PRoutine(
        prtn_mem=routine.prtn_mem,
        prtn_id=routine.prtn_id,
        prtn_nm=routine.prtn_nm,
        prtn_cat=routine.prtn_cat,
        prtn_tag=routine.prtn_tag,
        prtn_set=routine.prtn_set,
        prtn_reps=routine.prtn_reps,
        prtn_sdate=routine.prtn_sdate,
        prtn_time=routine.prtn_time,
        prtn_alram=routine.prtn_alram,
        prtn_day=routine.prtn_day,
    )
    db.add(db_routine)
    db.commit()
    db.refresh(db_routine)
    return db_routine
########
#####
#### 루틴데이터받아오기
class ERoutineResponse(BaseModel):
    ertn_id: str
    ertn_time: str
    ertn_name: str
    ertn_tag: str
class HRoutineResponse(BaseModel):
    hrtn_id: str
    hrtn_time: str
    hrtn_name: str
    hrtn_tag: str
class PRoutineResponse(BaseModel):
    prtn_id: str
    prtn_time: str
    prtn_name: str
    prtn_tag: str
def get_routines_from_database(routine_type):
    with SessionLocal() as db:
        if routine_type == "ertn":
            routines = db.query(ERoutine).all()
        elif routine_type == "hrtn":
            routines = db.query(HRoutine).all()
        elif routine_type == "prtn":
            routines = db.query(PRoutine).all()
        return routines
@app.get(
    "/rtnlist",
    response_model=List[Union[ERoutineResponse, HRoutineResponse, PRoutineResponse]],
)
async def read_routines(request: Request):
    ertn_routines = get_routines_from_database("ertn")
    hrtn_routines = get_routines_from_database("hrtn")
    prtn_routines = get_routines_from_database("prtn")
    response_data = []
    for routine in ertn_routines:
        response_data.append(
            ERoutineResponse(
                ertn_id=routine.ertn_id,
                ertn_nm=routine.ertn_nm,
                ertn_tag=routine.ertn_tag,
                ertn_time=routine.ertn_time,
            )
        )
    for routine in hrtn_routines:
        response_data.append(
            HRoutineResponse(
                hrtn_id=routine.hrtn_id,
                hrtn_nm=routine.hrtn_nm,
                hrtn_tag=routine.hrtn_tag,
                hrtn_time=routine.hrtn_time,
            )
        )
    for routine in prtn_routines:
        response_data.append(
            PRoutineResponse(
                prtn_id=routine.prtn_id,
                prtn_nm=routine.prtn_nm,
                prtn_tag=routine.prtn_tag,
                prtn_time=routine.prtn_time,
            )
        )
    return response_data

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

class Mem_Detail(Base):
    __tablename__ = "mem_detail"

    mem_email = Column(String(50), primary_key=True)
    mem_name = Column(String(20))
    mem_gen = Column(String(20))
    mem_age = Column(String(20))
    mem_bir = Column(String(20))
    mem_sday = Column(Date)
    mem_delete = Column(Integer)
    mem_dday = Column(Date)
    
class Mem_DetailBase(BaseModel):
    mem_email :str
    mem_name :str
    mem_gen :Optional[str] = None
    mem_age :Optional[str] = None
    mem_bir :Optional[str] = None
    mem_sday :date
    mem_delete :int
    mem_dday :Optional[date] = None
    
class Mem_DetailInDB(Mem_DetailBase):
    class Config:
        orm_mode = True

@app.get("/login", response_model=List[Mem_DetailInDB])
def get_db_login(db: Session = Depends(get_db)):
    now = datetime.now()
    sday = now.date()
    email= 'hhh@xxxx.com'
    name= '지민지'
    age= '20~29'
    gender= 'female'
    
    existing_user = db.query(Mem_Detail).filter_by(mem_email=email).first()
    # mem_sday = datetime.strptime(sday, "%Y-%m-%d")

    if existing_user:
        # 이미 존재하는 사용자인 경우
        return [existing_user]  # 기존 사용자를 리스트에 추가하여 반환
    
    else:
        # 존재하지 않는 사용자인 경우, 추가
        new_user = Mem_Detail(mem_email=email, mem_name=name, mem_age=age, mem_gen=gender, mem_sday=sday, mem_delete=0)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return [new_user]
    

@app.get(
    "/rtnrank",
    response_model=List[Union[ERoutineResponse, HRoutineResponse, PRoutineResponse]],
)
async def rank_routines(request: Request):
    ertn_routines = get_routines_from_database("ertn")
    hrtn_routines = get_routines_from_database("hrtn")
    prtn_routines = get_routines_from_database("prtn")
    response_data = []
    for routine in ertn_routines:
        response_data.append(
            ERoutineResponse(
                ertn_nm=routine.ertn_nm,
            )
        )
    for routine in hrtn_routines:
        response_data.append(
            HRoutineResponse(
                hrtn_nm=routine.hrtn_nm,
            )
        )
    for routine in prtn_routines:
        response_data.append(
            PRoutineResponse(
                prtn_nm=routine.prtn_nm,
            )
        )
    return response_data