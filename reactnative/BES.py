from fastapi import FastAPI
from fastapi import Depends
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker, aliased, Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey, text, Table, MetaData, Float
import select
import logging

# SQLAlchemy 연결 설정
DATABASE_URL = "mysql://root:dbdb@localhost/dpv_db"
engine = create_engine(DATABASE_URL, echo=True)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
metadata = MetaData()


def get_db_session():
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()


# 모델 정의 (HRTN_SETTING, HEALTH, HRTN_FIN)
class HRTN_SETTING(Base):
    __tablename__ = "HRTN_SETTING"
    hrtn_mem = Column(String(50), ForeignKey("mem_detail.mem_email"), nullable=False)
    hrtn_id = Column(String(100), primary_key=True)
    hrtn_nm = Column(String(100), nullable=False)
    hrtn_cat = Column(String(20), nullable=False)
    hrtn_tag = Column(String(60), nullable=False)
    hrtn_set = Column(Integer, nullable=False)
    hrtn_reps = Column(Integer, nullable=False)


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


class PRTN_SETTING(Base):
    __tablename__ = "PRTN_SETTING"
    prtn_mem = Column(String(50), ForeignKey("mem_detail.mem_email"), nullable=False)
    prtn_id = Column(String(100), primary_key=True, nullable=False)
    prtn_nm = Column(String(100), ForeignKey("pill_prod.pill_cd"), nullable=False)
    prtn_cat = Column(String(20), nullable=False)
    prtn_tag = Column(String(60), nullable=False)
    prtn_set = Column(Integer, nullable=False)
    prtn_reps = Column(Integer, nullable=False)
    prtn_sdate = Column(String(10), nullable=False)
    prtn_time = Column(String(50), nullable=False)
    prtn_alram = Column(Integer, nullable=False)
    prtn_day = Column(String(50))


class PRTN_FIN(Base):
    __tablename__ = "PRTN_FIN"
    prtn_id = Column(String(100), ForeignKey("prtn_setting.prnt_id"), primary_key=True)
    fin_prtn_time = Column(String(8), primary_key=True)


app = FastAPI()


@app.get("/health_piechartdata")
def get_health_chart_data(db: Session = Depends(get_db_session)):
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
def get_health_list_data(db: Session = Depends(get_db_session)):
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
def get_pill_chart_data(db: Session = Depends(get_db_session)):
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
def get_pill_list_data(db: Session = Depends(get_db_session)):
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
