from fastapi import FastAPI, Request, Depends, HTTPException
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import RedirectResponse
from urllib.parse import quote
import httpx
from sqlalchemy import create_engine, Column, String, Integer, func, or_
from sqlalchemy import ForeignKey, text, Table, MetaData, Float, Date, desc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Union, Optional
from pydantic import BaseModel, validator
from datetime import date, datetime
from enum import Enum
import logging

app = FastAPI()
app.add_middleware(
    SessionMiddleware,
    secret_key="bce5bcfe36455290d51dd4258cfb2737e54b79188d9d51aa162f6ed9e6e706f3",
)

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = "mysql+pymysql://mobile:Data1q2w3e4r!!@54.180.91.68:3306/dw"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

local_host = "http://43.200.178.131:3344"


def get_db():
    try:
        db = SessionLocal()
        print("Database connected successfully")
        yield db
    except Exception as e:
        print("Error while connecting to the database: ", e)
    finally:
        db.close()


class Mem_Detail(Base):
    __tablename__ = "mem_detail"

    mem_email = Column(String(50), primary_key=True)
    mem_name = Column(String(20))
    mem_gen = Column(String(20))
    mem_age = Column(String(20))
    mem_sday = Column(Date)
    mem_delete = Column(Integer)
    mem_dday = Column(Date)


class Ertn_Setting(Base):
    __tablename__ = "ertn_setting"
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
    ertn_edate = Column(String(10), nullable=True)


# 루틴추가_건강
class Hrtn_Setting(Base):
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
    hrtn_edate = Column(String(10), nullable=True)


# 루틴추가_영양
class Prtn_Setting(Base):
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
    prtn_edate = Column(String(10), nullable=True)


class Health(Base):
    __tablename__ = "health"
    health_nm = Column(String(100), primary_key=True)
    health_tag = Column(String(60), primary_key=True)
    health_emoji = Column(String(90))


class Hrtn_Fin(Base):
    __tablename__ = "hrtn_fin"
    hrtn_id = Column(String(100), primary_key=True)
    fin_hrnt_time = Column(String(8), primary_key=True)


class Pill_Prod(Base):
    __tablename__ = "pill_prod"
    pill_cd = Column(String(20), primary_key=True)
    pill_nm = Column(String(100), nullable=False)
    pill_mnf = Column(String(80))
    pill_rv = Column(Float)
    pill_rvnum = Column(Integer)
    pill_info = Column(String(255))


class Pill_Func(Base):
    __tablename__ = "pill_func"
    func_cd = Column(String(10), primary_key=True)
    func_nm = Column(String(60), nullable=False)
    func_emoji = Column(String(90))


class Pill_Nutr(Base):
    __tablename__ = "pill_nutr"
    nutr_cd = Column(String(10), primary_key=True)
    nutr_nm = Column(String(60), nullable=False)


class Pill_Cmb(Base):
    __tablename__ = "pill_cmb"
    cmb_nutr = Column(
        String(10), ForeignKey("pill_nutr.nutr_cd"), primary_key=True, nullable=False
    )
    cmb_func = Column(
        String(10), ForeignKey("pill_func.func_cd"), primary_key=True, nullable=False
    )
    cmb_pill = Column(
        String(20), ForeignKey("pill_prod.pill_cd"), primary_key=True, nullable=False
    )


class Prtn_Fin(Base):
    __tablename__ = "prtn_fin"
    prtn_id = Column(String(100), ForeignKey("prtn_setting.prnt_id"), primary_key=True)
    fin_prtn_time = Column(String(8), primary_key=True)


class News_Data(Base):
    __tablename__ = "news_data"
    news_idx = Column(String(10), primary_key=True)
    news_cat = Column(String(30))
    news_title = Column(String(150))
    news_link = Column(String(200))
    news_img = Column(String(200))


class Pill_Func(Base):
    __tablename__ = "pill_func"
    func_cd = Column(String(10), primary_key=True)
    func_nm = Column(String(60))
    func_emoji = Column(String(90))


class Mem_DetailBase(BaseModel):
    mem_email: str
    mem_name: str
    mem_gen: Optional[str] = None
    mem_age: Optional[str] = None
    mem_sday: date
    mem_delete: int
    mem_dday: Optional[date] = None


class Mem_DetailInDB(Mem_DetailBase):
    class Config:
        orm_mode = True


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
    ertn_edate: str


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
    hrtn_edate: str


# 루틴추가_영양
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


class News_DataBase(BaseModel):
    news_idx: str
    news_cat: str
    news_title: str
    news_link: str
    news_img: Optional[str] = None


class News_DataInDB(News_DataBase):
    class Config:
        orm_mode = True


class Pill_funcBase(BaseModel):
    func_cd: str
    func_nm: str
    func_emoji: Optional[str] = None


class Pill_funcInDB(Pill_funcBase):
    class Config:
        orm_mode = True


# Kakao API 설정
KAKAO_CLIENT_ID = "d6799c7299b2afb51d1b5a38205b8a58"
KAKAO_REDIRECT_URI = f"{local_host}/kakao/callback"
LOGOUT_REDIRECT_URI = f"{local_host}/kakao/logout_callback"


# Kakao 로그인 페이지로 리다이렉트
@app.get("/kakao/login")
async def kakao_login(request: Request):
    # Kakao OAuth 로그인 URL 생성
    kakao_oauth_url = f"https://kauth.kakao.com/oauth/authorize?client_id={KAKAO_CLIENT_ID}&redirect_uri={KAKAO_REDIRECT_URI}&response_type=code"
    return RedirectResponse(kakao_oauth_url)


# Kakao 로그인 콜백 처리
@app.get("/kakao/callback")
async def kakao_callback(code: str, request: Request, db: Session = Depends(get_db)):
    # Kakao OAuth2 토큰 엔드포인트 설정
    token_endpoint = "https://kauth.kakao.com/oauth/token"

    # Kakao OAuth2 인증 코드를 사용하여 액세스 토큰 요청
    data = {
        "grant_type": "authorization_code",
        "client_id": "17f09694974ed4f10f7a0a1d1a00bfb8",
        "client_secret": "P7D4JsJNhGYnw3q94ozQKZVEttGo3IoE",
        "redirect_uri": f"{local_host}/kakao/callback",
        "code": code,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(token_endpoint, data=data)

        if response.status_code != 200:
            print(response.status_code)  # 출력 상태 코드
            print(response.text)  # 출력 응답 본문
            raise HTTPException(
                status_code=400, detail="Error requesting access token from Kakao"
            )

        token_data = response.json()
        if "error" in token_data:
            raise HTTPException(status_code=400, detail=token_data["error_description"])

    # Kakao 사용자 정보 요청
    user_info_endpoint = "https://kapi.kakao.com/v2/user/me"
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}

    async with httpx.AsyncClient() as client:
        response = await client.get(user_info_endpoint, headers=headers)

        if response.status_code != 200:
            raise HTTPException(
                status_code=400, detail="Error requesting user information from Kakao"
            )

        user_info = response.json()
        if "error" in user_info:
            raise HTTPException(status_code=400, detail=user_info["error_description"])

    now = datetime.now()
    sday = now.date()

    existing_user = (
        db.query(Mem_Detail)
        .filter_by(mem_email=user_info["kakao_account"]["email"])
        .first()
    )
    # mem_sday = datetime.strptime(sday, "%Y-%m-%d")

    request.session["access_token"] = token_data["access_token"]
    request.session["user_email"] = user_info["kakao_account"]["email"]
    request.session["user_name"] = user_info["kakao_account"]["profile"]["nickname"]
    request.session["user_age"] = user_info["kakao_account"]["age_range"]
    request.session["user_gender"] = user_info["kakao_account"]["gender"]

    encoded_user_info = quote(str(request.session["user_name"]))
    login_url_scheme = f"hplog://callback?user_info={encoded_user_info}"
    if existing_user:
        return RedirectResponse(login_url_scheme)

    else:
        # 존재하지 않는 사용자인 경우, 추가
        new_user = Mem_Detail(
            mem_email=user_info["kakao_account"]["email"],
            mem_name=user_info["kakao_account"]["profile"]["nickname"],
            mem_age=user_info["kakao_account"]["age_range"],
            mem_gen=user_info["kakao_account"]["gender"],
            mem_sday=sday,
            mem_delete=0,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return RedirectResponse(login_url_scheme)


@app.get("/kakao/logout")
async def kakao_logout(request: Request):
    # 로그아웃 처리를 위한 Kakao API 엔드포인트
    logout_endpoint = f"https://kauth.kakao.com/oauth/logout?client_id={KAKAO_CLIENT_ID}&logout_redirect_uri={LOGOUT_REDIRECT_URI}"
    return RedirectResponse(logout_endpoint)


@app.get("/kakao/logout_callback")
async def kakao_logout_callback(request: Request):
    request.session.pop("user_email", None)
    request.session.pop("user_name", None)
    request.session.pop("access_token", None)
    request.session.pop("user_age", None)
    request.session.pop("user_gender", None)
    return {"message": "로그아웃 되었습니다."}
