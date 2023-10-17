import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, validator

# sqlalchemy
from sqlalchemy import create_engine, Column, Integer, String, Date, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from datetime import datetime
from sqlalchemy import DateTime


app = FastAPI()


# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# SQLAlchemy 엔진 생성 (MySQL 데이터베이스와 연결)
DATABASE_URL = "mysql://jmj:dbdb@localhost/testdb"
engine = create_engine(DATABASE_URL)

# metadata = MetaData


# 세션 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# SQLAlchemy 모델 정의
class Routine(Base):
    __tablename__ = "RTN_SETTING"

    id = Column(Integer, primary_key=True, index=True)
    rtn_nm = Column(String(255), index=True)
    rtn_set = Column(Integer)
    rtn_reps = Column(Integer)
    rtn_tag = Column(String(255))
    rtn_day = Column(String(255))
    rtn_sdate = Column(DateTime)


class RoutineCreate(BaseModel):
    rtn_nm: str
    rtn_set: int
    rtn_reps: int
    rtn_tag: str
    rtn_day: str
    rtn_sdate: datetime

    @validator("rtn_sdate")
    def validate_datetime(cls, value):
        if not isinstance(value, datetime):
            raise ValueError("Input should be an instance of DateTime")
        return value


@app.post("/routines", response_model=RoutineCreate)
def create_routine(routine: RoutineCreate):
    logger.info("Received data: %s", routine.json())
    try:
        # 로깅: 수신된 데이터를 로그에 출력
        logger.debug("Received data: %s", routine.dict())

        # SQLAlchemy session is used as a context manager to insert data
        with SessionLocal() as db:
            db_routine = Routine(
                rtn_nm=routine.rtn_nm,
                rtn_set=routine.rtn_set,
                rtn_reps=routine.rtn_reps,
                rtn_tag=routine.rtn_tag,
                rtn_day=routine.rtn_day,
                rtn_sdate=routine.rtn_sdate,
            )

            db.add(db_routine)
            db.commit()
            db.refresh(db_routine)

        return db_routine
    except Exception as e:
        logger.error("데이터 삽입 중 오류 발생: %s", str(e))
        return {"error": "데이터 삽입 중 오류 발생"}
