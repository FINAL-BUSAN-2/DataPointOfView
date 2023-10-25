from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy import create_engine, Column, String, Integer, func
from sqlalchemy import ForeignKey, text, Table, MetaData, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Union, Optional
from pydantic import BaseModel
from datetime import date, datetime

app = FastAPI()
DATABASE_URL = "mysql://mobile:Data1q2w3e4r!!@54.180.91.68:3306/dw"
# DATABASE_URL = "mysql://root:dbdb@localhost/dpv_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
metadata = MetaData()


# 루틴추가_기타
class ERTN_SETTING(Base):
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
class HRTN_SETTING(Base):
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
class PRTN_SETTING(Base):
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
    hrtn_mem: str
    hrtn_id: str
    hrtn_nm: str
    hrtn_cat: str
    hrtn_tag: str
    hrtn_set: int
    hrtn_reps: int
    hrtn_sdate: str
    hrtn_time: str
    hrtn_alram: int
    hrtn_day: str


# 루틴추가_영양
class PRoutineCreate(BaseModel):
    prtn_mem: str
    prtn_id: str
    prtn_nm: str
    prtn_cat: str
    prtn_tag: str
    prtn_set: int
    prtn_reps: int
    prtn_sdate: str
    prtn_time: str
    prtn_alram: int
    prtn_day: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


##########
###################
# 루틴추가_기타
@app.post("/routines", response_model=ERoutineCreate)
def create_routine(routine: ERoutineCreate, db: Session = Depends(get_db)):
    db_routine = ERTN_SETTING(
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
    db_routine = HRTN_SETTING(
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
    db_routine = PRTN_SETTING(
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
            routines = db.query(ERTN_SETTING).all()
        elif routine_type == "hrtn":
            routines = db.query(HRTN_SETTING).all()
        elif routine_type == "prtn":
            routines = db.query(PRTN_SETTING).all()
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