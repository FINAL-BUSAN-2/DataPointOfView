import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, validator

# sqlalchemy
from sqlalchemy import ForeignKey, desc
from sqlalchemy import create_engine
from sqlalchemy import Column, MetaData, Table, Integer, String, or_
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from typing import List
from fastapi import Request
from typing import Union, Optional

# 루틴리스트관련import
from datetime import datetime, timedelta
from enum import Enum

app = FastAPI()


# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# SQLAlchemy 엔진 생성 (MySQL 데이터베이스와 연결)
# "mysql://root:dbdb@localhost:3306/dpv_db"
# "mysql://mobile:Data1q2w3e4r!!@54.180.91.68:3306/dw"
DATABASE_URL = "mysql://mobile:Data1q2w3e4r!!@54.180.91.68:3306/dw"
##나중에 dpv_webserver주소변경 db server로
engine = create_engine(DATABASE_URL)

# meta = MetaData

# 세션 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# SQLAlchemy 모델 정의
# aws maria는 테이블명 소문자
class ERoutine(Base):
    __tablename__ = "ertn_setting"
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
    __tablename__ = "prtn_setting"
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
    __tablename__ = "hrtn_setting"
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


####################################################### 루틴리스트 받아오기
#### 루틴데이터받아오기
class ERoutineResponse(BaseModel):
    ertn_time: str
    ertn_name: str
    ertn_tag: str
    ertn_sdate: str
    ertn_day: str


class PRoutineResponse(BaseModel):
    prtn_time: str
    prtn_name: str
    prtn_tag: str
    prtn_sdate: str
    prtn_day: str


class HRoutineResponse(BaseModel):
    hrtn_time: str
    hrtn_name: str
    hrtn_tag: str
    hrtn_sdate: str
    hrtn_day: str


# 루틴3가지 통합 모델 정의
class MergedRoutineResponse(BaseModel):
    rtn_time: str
    rtn_name: str
    rtn_tag: str
    rtn_sdate: str
    rtn_day: str


# 데이터베이스에서 루틴 데이터 가져오는 함수
class Weekday(Enum):
    월 = 0
    화 = 1
    수 = 2
    목 = 3
    금 = 4
    토 = 5
    일 = 6


# Define a mapping from English to Korean day names
day_name_mapping = {
    "MONDAY": Weekday.월,
    "TUESDAY": Weekday.화,
    "WEDNESDAY": Weekday.수,
    "THURSDAY": Weekday.목,
    "FRIDAY": Weekday.금,
    "SATURDAY": Weekday.토,
    "SUNDAY": Weekday.일,
}


# 데이터베이스에서 루틴 데이터 가져오는 함수
def get_merged_routines_from_database():
    # 현재 날짜와 요일을 가져옵니다.
    now = datetime.now()
    today = now.date()
    current_day = day_name_mapping[now.strftime("%A").upper()].name
    # print(f"오늘 날짜: {today}, 요일: {current_day}")

    with SessionLocal() as db:
        e_routines = db.query(ERoutine).all()
        p_routines = db.query(PRoutine).all()
        h_routines = db.query(HRoutine).all()

        merged_routines = []

        for routine in e_routines:
            routine_start_date = datetime.strptime(
                routine.ertn_sdate, "%Y-%m-%d"
            ).date()  # 형식을 맞추기 위해 날짜 형식을 지정
            # print(f"루틴 시작 날짜: {routine_start_date}")
            if today >= routine_start_date:
                if routine.ertn_day:
                    # 반복 요일 문자열을 파싱합니다.
                    repeat_days = [day.strip() for day in routine.ertn_day.split(",")]
                    # print(f"반복 요일: {repeat_days}")
                    if current_day in repeat_days or today == routine_start_date:
                        merged_routines.append(
                            MergedRoutineResponse(
                                rtn_time=routine.ertn_time,
                                rtn_name=routine.ertn_nm,
                                rtn_tag=routine.ertn_tag,
                                rtn_sdate=routine.ertn_sdate,
                                rtn_day=routine.ertn_day,
                            )
                        )
                        # 루틴 정보 출력
                        # print(f"루틴이 merged_routines에 추가되었습니다: {routine.ertn_nm}")
                elif today == routine_start_date:
                    merged_routines.append(
                        MergedRoutineResponse(
                            rtn_time=routine.ertn_time,
                            rtn_name=routine.ertn_nm,
                            rtn_tag=routine.ertn_tag,
                            rtn_sdate=routine.ertn_sdate,
                            rtn_day=routine.ertn_day,
                        )
                    )

        for routine in p_routines:
            routine_start_date = datetime.strptime(
                routine.prtn_sdate, "%Y-%m-%d"
            ).date()  # 형식을 맞추기 위해 날짜 형식을 지정
            # print(f"루틴 시작 날짜: {routine_start_date}")
            if today >= routine_start_date:
                if routine.prtn_day:
                    # 반복 요일 문자열을 파싱합니다.
                    repeat_days = [day.strip() for day in routine.prtn_day.split(",")]
                    # print(f"반복 요일: {repeat_days}")
                    if current_day in repeat_days or today == routine_start_date:
                        merged_routines.append(
                            MergedRoutineResponse(
                                rtn_time=routine.prtn_time,
                                rtn_name=routine.prtn_nm,
                                rtn_tag=routine.prtn_tag,
                                rtn_sdate=routine.prtn_sdate,
                                rtn_day=routine.prtn_day,
                            )
                        )
                        # 루틴 정보 출력
                        # print(f"루틴이 merged_routines에 추가되었습니다: {routine.prtn_nm}")
                elif today == routine_start_date:
                    merged_routines.append(
                        MergedRoutineResponse(
                            rtn_time=routine.prtn_time,
                            rtn_name=routine.prtn_nm,
                            rtn_tag=routine.prtn_tag,
                            rtn_sdate=routine.prtn_sdate,
                            rtn_day=routine.prtn_day,
                        )
                    )

        for routine in h_routines:
            routine_start_date = datetime.strptime(
                routine.hrtn_sdate, "%Y-%m-%d"
            ).date()  # 형식을 맞추기 위해 날짜 형식을 지정
            # print(f"루틴 시작 날짜: {routine_start_date}")
            if today >= routine_start_date:
                if routine.hrtn_day:
                    # 반복 요일 문자열을 파싱합니다.
                    repeat_days = [day.strip() for day in routine.hrtn_day.split(",")]
                    # print(f"반복 요일: {repeat_days}")
                    if current_day in repeat_days or today == routine_start_date:
                        merged_routines.append(
                            MergedRoutineResponse(
                                rtn_time=routine.hrtn_time,
                                rtn_name=routine.hrtn_nm,
                                rtn_tag=routine.hrtn_tag,
                                rtn_sdate=routine.hrtn_sdate,
                                rtn_day=routine.hrtn_day,
                            )
                        )
                        # 루틴 정보 출력
                        # print(f"루틴이 merged_routines에 추가되었습니다: {routine.hrtn_nm}")
                elif today == routine_start_date:
                    merged_routines.append(
                        MergedRoutineResponse(
                            rtn_time=routine.hrtn_time,
                            rtn_name=routine.hrtn_nm,
                            rtn_tag=routine.hrtn_tag,
                            rtn_sdate=routine.hrtn_sdate,
                            rtn_day=routine.hrtn_day,
                        )
                    )

                    # 루틴 정보 출력
                    # print(f"루틴이 merged_routines에 추가되었습니다: {routine.hrtn_nm}")

        merged_routines.sort(key=lambda x: (x.rtn_sdate, x.rtn_time))
        # print(f"merged_routines에 포함된 전체 루틴 수: {len(merged_routines)}")

    return merged_routines


# 루틴 데이터 가져오는 엔드포인트
@app.get("/rtnlist", response_model=List[MergedRoutineResponse])
async def read_routines(request: Request):
    merged_routines = get_merged_routines_from_database()
    return merged_routines


#############################################################루틴추가하기
####### 루틴데이터추가( 건강)
class HRoutineCreate(BaseModel):
    hrtn_nm: str
    hrtn_set: int
    hrtn_reps: int
    hrtn_tag: str
    hrtn_day: str
    hrtn_sdate: str
    hrtn_time: str
    hrtn_id: str
    hrtn_cat: str
    hrtn_alram: int
    hrtn_mem: str
    hrtn_edate: str


# hrtn_id 생성
def generate_unique_hrtn_id(hrtn_mem):
    at_index = hrtn_mem.find("@")

    if at_index != -1:
        first_part = hrtn_mem[:at_index]  # "@" 앞부분 추출
        first_char_after_at = hrtn_mem[at_index + 1]  # "@" 다음 첫 문자 추출

        # 기존에 생성된 ertn_id 중에서 가장 큰 값을 찾아 숫자 부분을 증가시킴
        with SessionLocal() as db:
            max_prtn_id = (
                db.query(HRoutine.hrtn_id)
                .filter(HRoutine.hrtn_mem == hrtn_mem)
                .order_by(desc(HRoutine.hrtn_id))
                .first()
            )
            if max_prtn_id:
                max_number = int(
                    max_prtn_id[0][len(first_part) + 1 + 1 + 1 :]
                )  # "@" 이후부터 숫자 부분 추출
                new_number = max_number + 1
            else:
                new_number = 1

            # hrtn_id 생성
            hrtn_id = f"{first_part}@{first_char_after_at}h{new_number:07}"
    else:
        raise ValueError("Invalid ertn_mem format")

    return hrtn_id


@app.post("/h_routines")  # , response_model=RoutineCreate)
def create_routine(routine: HRoutineCreate):
    try:
        with SessionLocal() as db:
            db_routine = HRoutine(
                hrtn_mem=routine.hrtn_mem,
                hrtn_id="abdb@ge00016",
                hrtn_nm=routine.hrtn_nm,
                hrtn_cat="건강",
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


# prtn_id 생성
def generate_unique_prtn_id(prtn_mem):
    at_index = prtn_mem.find("@")

    if at_index != -1:
        first_part = prtn_mem[:at_index]  # "@" 앞부분 추출
        first_char_after_at = prtn_mem[at_index + 1]  # "@" 다음 첫 문자 추출

        # 기존에 생성된 ertn_id 중에서 가장 큰 값을 찾아 숫자 부분을 증가시킴
        with SessionLocal() as db:
            max_prtn_id = (
                db.query(PRoutine.prtn_id)
                .filter(PRoutine.prtn_mem == prtn_mem)
                .order_by(desc(PRoutine.prtn_id))
                .first()
            )
            if max_prtn_id:
                max_number = int(
                    max_prtn_id[0][len(first_part) + 1 + 1 + 1 :]
                )  # "@" 이후부터 숫자 부분 추출
                new_number = max_number + 1
            else:
                new_number = 1

            # prtn_id 생성
            prtn_id = f"{first_part}@{first_char_after_at}p{new_number:07}"
    else:
        raise ValueError("Invalid ertn_mem format")

    return prtn_id


@app.post("/p_routines")  # , response_model=RoutineCreate)
def create_routine(routine: PRoutineCreate):
    try:
        with SessionLocal() as db:
            db_routine = PRoutine(
                prtn_mem=routine.prtn_mem,
                prtn_id="abdb@gh0000001",
                prtn_nm=routine.prtn_nm,
                prtn_cat="영양",
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
            print("디버그")
            db.refresh(db_routine)

        return db_routine
    except Exception as e:
        logger.error("데이터 삽입 중 오류 발생: %s", str(e))
        # return {"error": "데이터 삽입 중 오류 발생"}


####### 루틴데이터추가(기타)
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


# ertn_id 생성
def generate_unique_ertn_id(ertn_mem):
    at_index = ertn_mem.find("@")

    if at_index != -1:
        first_part = ertn_mem[:at_index]  # "@" 앞부분 추출
        first_char_after_at = ertn_mem[at_index + 1]  # "@" 다음 첫 문자 추출

        # 기존에 생성된 ertn_id 중에서 가장 큰 값을 찾아 숫자 부분을 증가시킴
        with SessionLocal() as db:
            max_ertn_id = (
                db.query(ERoutine.ertn_id)
                .filter(ERoutine.ertn_mem == ertn_mem)
                .order_by(desc(ERoutine.ertn_id))
                .first()
            )
            if max_ertn_id:
                max_number = int(
                    max_ertn_id[0][len(first_part) + 1 + 1 + 1 :]
                )  # "@" 이후부터 숫자 부분 추출
                new_number = max_number + 1
            else:
                new_number = 1

            # ertn_id를 생성
            ertn_id = f"{first_part}@{first_char_after_at}e{new_number:07}"
    else:
        raise ValueError("Invalid ertn_mem format")

    return ertn_id


@app.post("/routines")
def create_routine(routine: RoutineCreate):
    try:
        # Create a unique ertn_id
        ertn_id = generate_unique_ertn_id(routine.ertn_mem)

        with SessionLocal() as db:
            db_routine = ERoutine(
                ertn_mem=routine.ertn_mem,
                ertn_id=ertn_id,  # Use the generated ertn_id
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
            db.refresh(db_routine)

        return db_routine
    except Exception as e:
        logger.error("데이터 삽입 중 오류 발생: %s", str(e))
        return {"error": "데이터 삽입 중 오류 발생"}
