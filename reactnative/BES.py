import logging
from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy import create_engine, Column, String, Integer, func, Table, Date
from sqlalchemy import ForeignKey, text, Table, MetaData, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Union, Optional
from pydantic import BaseModel, validator
from datetime import date, datetime
from sqlalchemy import ForeignKey, desc
from typing import List
from fastapi import Request
from typing import Union, Optional

# 루틴리스트관련import
from datetime import datetime, timedelta
from enum import Enum

app = FastAPI()
DATABASE_URL = "mysql://mobile:Data1q2w3e4r!!@54.180.91.68:3306/dw"
# DATABASE_URL = "mysql://root:dbdb@localhost/dpv_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
metadata = MetaData()


# SQLAlchemy 모델 정의
# 루틴추가_기타
class ERoutine(Base):
    __tablename__ = "ertn_setting"
    ertn_mem = Column(String(50), ForeignKey("mem_detail.mem_email"), primary_key=True)
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


# 루틴추가_건강
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

    ## mem_detail테이블


class MemDetail(Base):
    __tablename__ = "mem_detail"
    mem_email = Column(String, primary_key=True)
    mem_name = Column(String)
    mem_gen = Column(String)
    mem_age = Column(String)
    mem_sday = Column(Date)
    mem_delete = Column(Integer)
    mem_dday = Column(Date)


##################################################################
class HRTN_SETTING(Base):
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


class HEALTH(Base):
    __tablename__ = "HEALTH"
    health_nm = Column(String(100), primary_key=True)
    health_tag = Column(String(60), primary_key=True)
    health_emoji = Column(String(90))


class HRTN_FIN(Base):
    __tablename__ = "HRTN_FIN"
    hrtn_id = Column(String(100), primary_key=True)
    fin_hrnt_time = Column(String(8), primary_key=True)


class PILL_PROD(Base):
    __tablename__ = "PILL_PROD"
    pill_cd = Column(String(20), primary_key=True)
    pill_nm = Column(String(100), nullable=False)
    pill_mnf = Column(String(80))
    pill_rv = Column(Float)
    pill_rvnum = Column(Integer)
    pill_info = Column(String(255))


class PILL_FUNC(Base):
    __tablename__ = "PILL_FUNC"
    func_cd = Column(String(10), primary_key=True)
    func_nm = Column(String(60), nullable=False)
    func_emoji = Column(String(90))


class PILL_NUTR(Base):
    __tablename__ = "PILL_NUTR"
    nutr_cd = Column(String(10), primary_key=True)
    nutr_nm = Column(String(60), nullable=False)


class PILL_CMB(Base):
    __tablename__ = "PILL_CMB"
    cmb_nutr = Column(
        String(10), ForeignKey("pill_nutr.nutr_cd"), primary_key=True, nullable=False
    )
    cmb_func = Column(
        String(10), ForeignKey("pill_func.func_cd"), primary_key=True, nullable=False
    )
    cmb_pill = Column(
        String(20), ForeignKey("pill_prod.pill_cd"), primary_key=True, nullable=False
    )


class PRTN_FIN(Base):
    __tablename__ = "PRTN_FIN"
    prtn_id = Column(String(100), ForeignKey("prtn_setting.prnt_id"), primary_key=True)
    fin_prtn_time = Column(String(8), primary_key=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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
    mem_email: str
    mem_name: str
    mem_gen: Optional[str] = None
    mem_age: Optional[str] = None
    mem_bir: Optional[str] = None
    mem_sday: date
    mem_delete: int
    mem_dday: Optional[date] = None


class Mem_DetailInDB(Mem_DetailBase):
    class Config:
        orm_mode = True


@app.get("/login", response_model=List[Mem_DetailInDB])
def get_db_login(db: Session = Depends(get_db)):
    now = datetime.now()
    sday = now.date()
    email = "hhh@xxxx.com"
    name = "지민지"
    age = "20~29"
    gender = "female"

    existing_user = db.query(Mem_Detail).filter_by(mem_email=email).first()
    # mem_sday = datetime.strptime(sday, "%Y-%m-%d")

    if existing_user:
        # 이미 존재하는 사용자인 경우
        return [existing_user]  # 기존 사용자를 리스트에 추가하여 반환

    else:
        # 존재하지 않는 사용자인 경우, 추가
        new_user = Mem_Detail(
            mem_email=email,
            mem_name=name,
            mem_age=age,
            mem_gen=gender,
            mem_sday=sday,
            mem_delete=0,
        )
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


class Pill_func(Base):
    __tablename__ = "pill_func"
    func_cd = Column(String(10), primary_key=True)
    func_nm = Column(String(60))
    func_emoji = Column(String(90))


class Pill_funcBase(BaseModel):
    func_cd: str
    func_nm: str
    func_emoji: Optional[str] = None


class Pill_funcInDB(Pill_funcBase):
    class Config:
        orm_mode = True


@app.get("/pill_func/", response_model=List[Pill_funcInDB])
def get_search_pill(db: Session = Depends(get_db)):
    pill_func = db.query(Pill_func).all()
    return pill_func


@app.get("/health_piechartdata")
def get_health_chart_data(db: Session = Depends(get_db)):
    # HRTN_FIN 테이블에서 존재하는 hrtn_id 조회
    hrtn_ids_query = db.query(HRTN_FIN.hrtn_id).distinct().subquery()

    # HEALTH 테이블에서 해당 태그의 빈도수 조회 (태그: 상체/하체/코어/유산소/스트레칭/기타)
    tag_counts_query = (
        db.query(HEALTH.health_tag, func.count(HEALTH.health_tag))
        .join(
            HRTN_SETTING,
            HRTN_SETTING.hrtn_nm
            == func.substr(HEALTH.health_nm, 1, func.length(HRTN_SETTING.hrtn_nm)),
        )
        .filter(HRTN_FIN.hrtn_id.in_(hrtn_ids_query))
        .group_by(HEALTH.health_tag)
        .all()
    )

    # 파이 차트 데이터 구성 (태그별 빈도수와 색상 지정)
    pie_chart_data = [
        {
            "tag": tag_count[0],
            "count": tag_count[1],
            "color": get_color_by_tag(tag_count[0]),
        }
        for tag_count in tag_counts_query
    ]

    return pie_chart_data


def get_color_by_tag(tag):
    # 태그별로 색상 지정 로직 구현하기 (예: 상체 - 빨강색 / 하체 - 파랑색 등)
    if tag == "상체":
        return "#D64D40"  # 빨강색

    elif tag == "하체":
        return "#8F5550"  # 파랑색

    elif tag == "코어":
        return "#1C488A"  # 초록색

    elif tag == "유산소":
        return "#B2D667"  # 노랑색

    elif tag == "스트레칭":
        return "#808A6A"  # 보라색

    else:
        return "#808080"  # 기타는 회색으로 설정


@app.get("/health_listdata")
def get_health_list_data(db: Session = Depends(get_db)):
    # HRTN_FIN 테이블에서 존재하는 hrtn_id 조회
    hrtn_ids_query = db.query(HRTN_FIN.hrtn_id).distinct().subquery()

    # HEALTH 테이블에서 해당 태그의 빈도수 조회 (태그: 상체/하체/코어/유산소/스트레칭/기타)
    health_names = (
        db.query(HRTN_SETTING.hrtn_nm)
        .filter(HRTN_FIN.hrtn_id.in_(hrtn_ids_query))
        .distinct()
        .all()
    )

    # 파이 차트 데이터 구성 (태그별 빈도수와 색상 지정)
    pie_list_data = [
        {
            "name": health_name[0],
        }
        for health_name in health_names
    ]

    return pie_list_data


@app.get("/pill_piechartdata")
def get_pill_chart_data(db: Session = Depends(get_db)):
    func_counts_query = (
        db.query(PILL_FUNC.func_nm, func.count(PILL_FUNC.func_nm), PILL_PROD.pill_nm)
        .join(PILL_CMB, PILL_FUNC.func_cd == PILL_CMB.cmb_func)
        .join(PILL_PROD, PILL_CMB.cmb_pill == PILL_PROD.pill_cd)
        .join(PRTN_SETTING, PILL_PROD.pill_cd == PRTN_SETTING.prtn_nm)
        .join(PRTN_FIN, PRTN_SETTING.prtn_id == PRTN_FIN.prtn_id)
        .filter(PRTN_SETTING.prtn_id.in_(db.query(PRTN_FIN.prtn_id)))
        .group_by(PILL_FUNC.func_nm, PILL_PROD.pill_nm)
        .all()
    )

    # 파이 차트 데이터 구성 (태그별 빈도수와 색상 지정)
    pill_chart_data = [
        {
            "func": func_count[0],
            "count": func_count[1],
            "color": get_color_by_func(func_count[0]),
        }
        for func_count in func_counts_query
    ]

    return pill_chart_data


def get_color_by_func(func):
    # 기능별로 색상 지정 로직 구현하기
    color_mapping = {
        "피로감": "#D64D40",  # 빨강색
        "눈 건강": "#8F5550",  # 파랑색
        "피부 건강": "#FFA500",  # 주황색
        "체지방": "#008000",  # 녹색
        "혈관 & 혈액순환": "#800080",  # 보라색
        "간 건강": "#FFFF00",  # 노랑색
        "장 건강": "#00FFFF",  # 하늘색
        "스트레스 & 수면": "#FFC0CB",  # 분홍색
        "면역기능": "#FFD700",  # 금색
        "혈중 콜레스테롤": "#FF4500",  # 오렌지색
        "뼈 건강": "#228B22",  # 초록색
        "노화 & 항산화": "#8B4513",  # 갈색
        "여성 건강": "#FF69B4",  # 핑크색
        "소화 & 위식도 건강": "#8B008B",  # 보라색
        "남성 건강": "#4B0082",  # 아이보리색
        "혈압": "#DC143C",  # 검정색
        "운동 능력 & 근육량": "#2E8B57",  # 남색
        "두뇌활동": "#00FF00",  # 연두색
        "혈당": "#FFFFE0",  # 연한 노랑색
        "혈중 중성지방": "#00008B",  # 초록색
        "치아 & 잇몸": "#9400D3",  # 보라색
        "임산부 & 태아 건강": "#87CEEB",  # 하늘색
        "탈모 & 손톱 건강": "#9370DB",  # 자주색
        "관절 건강": "#7B68EE",  # 파랑색
        "여성 갱년기": "#FA8072",  # 적색
        "호흡기 건강": "#32CD32",  # 라임색
        "갑상선 건강": "#ADFF2F",  # 초록색
        "빈혈": "#FF6347",  # 토마토색
        # 기타
    }
    # 딕셔너리에서 찾아 반환하거나 기타는 회색
    return color_mapping.get(func, "#808080")  # 기본값은 회색


@app.get("/pill_listdata")
def get_pill_list_data(db: Session = Depends(get_db)):
    pill_names_query = (
        db.query(PILL_PROD.pill_nm)
        .join(PRTN_SETTING, PILL_PROD.pill_cd == PRTN_SETTING.prtn_nm)
        .join(PRTN_FIN, PRTN_SETTING.prtn_id == PRTN_FIN.prtn_id)
        .filter(PRTN_SETTING.prtn_id.in_(db.query(PRTN_FIN.prtn_id)))
        .distinct()
        .all()
    )

    # 파이 차트 데이터 구성 (태그별 빈도수와 색상 지정)
    pill_list_data = [
        {
            "name": pill_name[0],
        }
        for pill_name in pill_names_query
    ]

    return pill_list_data


############################################### mem_detail 정보 받아오기
# FastAPI 엔드포인트
@app.get("/get_mem_name")
def get_mem_name():
    db = SessionLocal()
    email = ""  # 여기에서 사용할 이메일을 지정
    mem_detail = db.query(MemDetail).filter(MemDetail.mem_email == email).first()
    if mem_detail:
        mem_name = mem_detail.mem_name
        logging.info(f"Received mem_name: {mem_name}")
        return {"mem_name": mem_name}
    logging.warning(f"No data found for email: {email}")
    return {"mem_name": "No data found for email: {email}"}


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
                hrtn_mem=routine.hrtn_mem,  # 로그인아이디필요
                hrtn_id="",
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
        # logger.error("데이터 삽입 중 오류 발생: %s", str(e))
        return {"error": "데이터 삽입 중 오류 발생"}


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
                prtn_mem=routine.prtn_mem,  # 로그인아이디필요
                prtn_id="",
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
        # logger.error("데이터 삽입 중 오류 발생: %s", str(e))
        return {"error": "데이터 삽입 중 오류 발생"}


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
                ertn_mem=routine.ertn_mem,  # 로그인아이디필요
                ertn_id=ertn_id,
                ertn_nm=routine.ertn_nm,
                ertn_cat="기타",
                ertn_tag="기타",
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
        # logger.error("데이터 삽입 중 오류 발생: %s", str(e))
        return {"error": "데이터 삽입 중 오류 발생"}
