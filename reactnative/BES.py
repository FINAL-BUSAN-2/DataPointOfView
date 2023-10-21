import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, validator

# sqlalchemy
from sqlalchemy import ForeignKey
from sqlalchemy import create_engine
from sqlalchemy import Column, MetaData, Table, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from typing import List
from fastapi import Request
from typing import Union, Optional

# 루틴리스트관련import
from datetime import datetime, timedelta

app = FastAPI()


# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# SQLAlchemy 엔진 생성 (MySQL 데이터베이스와 연결)
# "mysql://root:dbdb@localhost:3306/dpv_db"
# "mysql://mobile:Data1q2w3e4r!!@54.180.91.68:3306/dw"
DATABASE_URL = "mysql://root:dbdb@localhost:3306/dpv_db"
##나중에 dpv_webserver주소변경 db server로
engine = create_engine(DATABASE_URL)

# meta = MetaData

# 세션 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# SQLAlchemy 모델 정의
# aws maria는 테이블명 소문자
class ERoutine(Base):
    __tablename__ = "ERTN_SETTING"
    ertn_mem = Column(String(50), nullable=True)
    ertn_id = Column(String(100), primary_key=True)
    ertn_nm = Column(String(100), nullable=True)
    ertn_cat = Column(String(20), nullable=True)
    ertn_tag = Column(String(60), nullable=True)
    ertn_set = Column(Integer, nullable=True)
    ertn_reps = Column(Integer, nullable=True)
    ertn_sdate = Column(String(10), nullable=True)
    ertn_time = Column(String(50), nullable=True)
    ertn_alram = Column(Integer, nullable=True)
    ertn_day = Column(String(50), nullable=True)
    ertn_edate = Column(String(10), nullable=True)  # 끝나는날짜추가


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
    prtn_edate = Column(String(10), nullable=True)  # 끝나는날짜추가


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
    hrtn_edate = Column(String(10), nullable=True)  # 끝나는날짜추가


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
    today = datetime.now().date()
    with SessionLocal() as db:
        e_routines = db.query(ERoutine).filter(ERoutine.ertn_sdate == today).all()
        p_routines = db.query(PRoutine).filter(PRoutine.prtn_sdate == today).all()
        h_routines = db.query(HRoutine).filter(HRoutine.hrtn_sdate == today).all()
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


####### 루틴데이터추가하기 (기타)
class RoutineCreate(BaseModel):
    ertn_nm: str
    ertn_set: int
    ertn_reps: int
    ertn_tag: str
    ertn_day: str
    ertn_sdate: str
    ertn_time: str
    ertn_id: str
    ertn_cat: str
    ertn_alram: int
    ertn_mem: str
    ertn_edate: str


@app.post("/routines")  # , response_model=RoutineCreate)
def create_routine(routine: RoutineCreate):
    try:
        # 로깅: 수신된 데이터를 로그에 출력
        # logger.debug("Received data: %s", routine.dict())
        # print("디버그")
        # SQLAlchemy session is used as a context manager to insert data

        with SessionLocal() as db:
            db_routine = ERoutine(
                ertn_mem=routine.ertn_mem,
                ertn_id="abdb@ge00012",
                ertn_nm=routine.ertn_nm,
                ertn_cat="기타",
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
            print("디버그")
            db.refresh(db_routine)

        return db_routine
    except Exception as e:
        logger.error("데이터 삽입 중 오류 발생: %s", str(e))
        # return {"error": "데이터 삽입 중 오류 발생"}


####### 루틴데이터추가하기 (영양)
class PRoutineCreate(BaseModel):
    prtn_nm: str
    prtn_set: int
    prtn_reps: int
    prtn_tag: str
    prtn_day: str
    prtn_sdate: str
    prtn_time: str
    prtn_id: str
    prtn_cat: str
    prtn_alram: int
    prtn_mem: str
    prtn_edate: str


@app.post("/p_routines")  # , response_model=RoutineCreate)
def create_routine(routine: RoutineCreate):
    try:
        # 로깅: 수신된 데이터를 로그에 출력
        # logger.debug("Received data: %s", routine.dict())
        # print("디버그")
        # SQLAlchemy session is used as a context manager to insert data

        with SessionLocal() as db:
            db_routine = ERoutine(
                prtn_mem=routine.ertn_mem,
                prtn_id="abdb@ge00012",
                prtn_nm=routine.ertn_nm,
                prtn_cat="기타",
                prtn_tag=routine.ertn_tag,
                prtn_set=routine.ertn_set,
                prtn_reps=routine.ertn_reps,
                prtn_sdate=routine.ertn_sdate,
                prtn_time=routine.ertn_time,
                prtn_alram=routine.ertn_alram,
                prtn_day=routine.ertn_day,
            )

            db.add(db_routine)
            db.commit()
            print("디버그")
            db.refresh(db_routine)

        return db_routine
    except Exception as e:
        logger.error("데이터 삽입 중 오류 발생: %s", str(e))
        # return {"error": "데이터 삽입 중 오류 발생"}
