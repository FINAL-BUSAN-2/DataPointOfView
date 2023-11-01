from fastapi import FastAPI, Request, Depends, HTTPException, File, UploadFile
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
from urllib.parse import quote
import httpx

from sqlalchemy import create_engine, Column, String, Integer, func, or_, and_
from sqlalchemy import ForeignKey, text, Table, MetaData, Float, Date, desc, cast
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.sql import null
from typing import List, Union, Optional
from pydantic import BaseModel, validator
from datetime import date, datetime
from enum import Enum
import logging
import pdb

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
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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


class Mem_Detail(Base):
    __tablename__ = "mem_detail"

    mem_email = Column(String(50), primary_key=True)
    mem_name = Column(String(20))
    mem_gen = Column(String(20))
    mem_age = Column(String(20))
    mem_sday = Column(Date)
    mem_delete = Column(Integer)
    mem_dday = Column(Date)


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

    encodedUserName = quote(request.session["user_name"])
    encodedUserEmail = quote(request.session["user_email"])

    login_url_scheme = (
        f"hplog://callback?name={encodedUserName}&user_email={encodedUserEmail}"
    )
    if existing_user:
        return RedirectResponse(login_url_scheme)

    else:
        # 존재하지 않는 사용자인 경우, 추가
        new_user = Mem_Detail(
            mem_email=user_info["kakao_account"]["email"],
            mem_name=user_info["kakao_account"]["profile"]["nickname"],
            mem_age=user_info["kakao_account"]["age_range"]
            if user_info
            and "kakao_account" in user_info
            and "age_range" in user_info["kakao_account"]
            else None,
            mem_gen=user_info["kakao_account"]["gender"]
            if user_info
            and "kakao_account" in user_info
            and "gender" in user_info["kakao_account"]
            else None,
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
    return {"message": "로그아웃 되었습니다."}


# 루틴추가_기타
class ERTN_SETTING(Base):
    __tablename__ = "ertn_setting"
    ertn_mem = Column(String(50), ForeignKey("mem_detail.mem_email"), primary_key=True)
    ertn_id = Column(String(50), primary_key=True)
    ertn_nm = Column(String(100), nullable=False)  # nullable=False
    ertn_cat = Column(String(20), nullable=False)  # nullable=False
    ertn_tag = Column(String(60), nullable=False)  # nullable=False
    ertn_set = Column(Integer, nullable=False)  # nullable=False
    ertn_reps = Column(Integer, nullable=False)  # nullable=False
    ertn_sdate = Column(String(10), nullable=False)  # nullable=False
    ertn_time = Column(String(50), nullable=False)  # nullable=False
    ertn_alram = Column(Integer, nullable=False)  # nullable=False
    ertn_day = Column(String(50), nullable=True)
    ertn_edate = Column(String(10), nullable=True)


# 루틴추가_건강
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
    hrtn_day = Column(String(50), nullable=False)
    hrtn_edate = Column(String(10), nullable=True)


# 루틴추가_영양
class PRTN_SETTING(Base):
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
    prtn_day = Column(String(50), nullable=False)
    prtn_edate = Column(String(10), nullable=True)


class HEALTH(Base):
    __tablename__ = "health"
    health_nm = Column(String(100), primary_key=True)
    health_tag = Column(String(60), primary_key=True)
    health_emoji = Column(String(90))


class HRTN_FIN(Base):
    __tablename__ = "hrtn_fin"
    hrtn_id = Column(String(100), primary_key=True)
    fin_hrtn_time = Column(String(8), primary_key=True)


class PILL_PROD(Base):
    __tablename__ = "pill_prod"
    pill_cd = Column(String(20), primary_key=True)
    pill_nm = Column(String(100), nullable=False)
    pill_mnf = Column(String(80))
    pill_rv = Column(Float)
    pill_rvnum = Column(Integer)
    pill_info = Column(String(255))


class PILL_SIDEEFF(Base):
    __tablename__ = "pill_sideeff"
    sideeff_cd1 = Column(String(10), primary_key=True)
    sideeff_nm1 = Column(String(90), nullable=False)
    sideeff_cd2 = Column(String(10), primary_key=True)
    sideeff_nm2 = Column(String(90), nullable=False)
    sideeff_txt = Column(String(255), nullable=False)
    sideeff_caution = Column(String(255), nullable=False)


class PILL_FUNC(Base):
    __tablename__ = "pill_func"
    func_cd = Column(String(10), primary_key=True)
    func_nm = Column(String(60))
    func_emoji = Column(String(90))


class PILL_NUTR(Base):
    __tablename__ = "pill_nutr"
    nutr_cd = Column(String(10), primary_key=True)
    nutr_nm = Column(String(60), nullable=False)


class PILL_CMB(Base):
    __tablename__ = "pill_cmb"
    cmb_nutr = Column(String(10), primary_key=True, nullable=False)
    cmb_func = Column(String(10), primary_key=True, nullable=False)
    cmb_pill = Column(String(20), primary_key=True, nullable=False)


class PRTN_FIN(Base):
    __tablename__ = "prtn_fin"
    prtn_id = Column(String(100), primary_key=True)
    fin_prtn_time = Column(String(8), primary_key=True)


class ERTN_FIN(Base):
    __tablename__ = "ertn_fin"
    ertn_id = Column(String(100), primary_key=True)
    fin_ertn_time = Column(String(8), primary_key=True)


##### 로그인정보 (이메일)
def get_current_user_email(request: Request):
    user_email = request.session.get("user_email")
    if not user_email:
        raise HTTPException(status_code=400, detail="User not logged in")
    return user_email


############################################# 루틴추가
# 루틴추가_기타
class ERoutineCreate(BaseModel):
    ertn_mem: str
    ertn_id: str
    ertn_nm: str
    ertn_cat: str
    ertn_tag: str
    ertn_set: int
    ertn_reps: int
    ertn_sdate: Optional[str] = None
    ertn_time: Optional[str] = None
    ertn_alram: Optional[int] = 0
    ertn_day: Optional[str] = None
    ertn_edate: Optional[str] = None


# ertn_id 생성
def generate_unique_ertn_id(ertn_mem):
    at_index = ertn_mem.find("@")

    if at_index != -1:
        first_part = ertn_mem[:at_index]  # "@" 앞부분 추출
        first_char_after_at = ertn_mem[at_index + 1]  # "@" 다음 첫 문자 추출

        # 기존에 생성된 ertn_id 중에서 가장 큰 값을 찾아 숫자 부분을 증가시킴
        with SessionLocal() as db:
            max_ertn_id = (
                db.query(ERTN_SETTING.ertn_id)
                .filter(ERTN_SETTING.ertn_mem == ertn_mem)
                .order_by(desc(ERTN_SETTING.ertn_id))
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


# 루틴추가_건강
class HRoutineCreate(BaseModel):
    hrtn_mem: str
    hrtn_id: str
    hrtn_nm: str
    hrtn_cat: str
    hrtn_tag: str
    hrtn_set: int
    hrtn_reps: int
    hrtn_sdate: Optional[str] = None
    hrtn_time: Optional[str] = None
    hrtn_alram: Optional[int] = 0
    hrtn_day: Optional[str] = None
    hrtn_edate: Optional[str] = None


# hrtn_id 생성
def generate_unique_hrtn_id(hrtn_mem):
    at_index = hrtn_mem.find("@")

    if at_index != -1:
        first_part = hrtn_mem[:at_index]  # "@" 앞부분 추출
        first_char_after_at = hrtn_mem[at_index + 1]  # "@" 다음 첫 문자 추출

        # 기존에 생성된 ertn_id 중에서 가장 큰 값을 찾아 숫자 부분을 증가시킴
        with SessionLocal() as db:
            max_hrtn_id = (
                db.query(HRTN_SETTING.hrtn_id)
                .filter(HRTN_SETTING.hrtn_mem == hrtn_mem)
                .order_by(desc(HRTN_SETTING.hrtn_id))
                .first()
            )
            if max_hrtn_id:
                max_number = int(
                    max_hrtn_id[0][len(first_part) + 1 + 1 + 1 :]
                )  # "@" 이후부터 숫자 부분 추출
                new_number = max_number + 1
            else:
                new_number = 1

            # hrtn_id 생성
            hrtn_id = f"{first_part}@{first_char_after_at}h{new_number:07}"
    else:
        raise ValueError("Invalid ertn_mem format")

    return hrtn_id


# 루틴추가_영양
class PRoutineCreate(BaseModel):
    prtn_mem: str
    prtn_id: str
    prtn_nm: str
    prtn_cat: str
    prtn_tag: str
    prtn_set: int
    prtn_reps: int
    prtn_sdate: Optional[str] = None
    prtn_time: Optional[str] = None
    prtn_alram: Optional[int] = 0
    prtn_day: Optional[str] = None
    prtn_edate: Optional[str] = None


# prtn_id 생성
def generate_unique_prtn_id(prtn_mem):
    at_index = prtn_mem.find("@")

    if at_index != -1:
        first_part = prtn_mem[:at_index]  # "@" 앞부분 추출
        first_char_after_at = prtn_mem[at_index + 1]  # "@" 다음 첫 문자 추출

        # 기존에 생성된 ertn_id 중에서 가장 큰 값을 찾아 숫자 부분을 증가시킴
        with SessionLocal() as db:
            max_prtn_id = (
                db.query(PRTN_SETTING.prtn_id)
                .filter(PRTN_SETTING.prtn_mem == prtn_mem)
                .order_by(desc(PRTN_SETTING.prtn_id))
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


@app.post("/routines")
def create_routine(routine: ERoutineCreate, db: Session = Depends(get_db)):
    try:
        ertn_id = generate_unique_ertn_id(routine.ertn_mem)

        db_routine = ERTN_SETTING(
            ertn_mem=routine.ertn_mem,
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
            ertn_edate=None,
        )

        db.add(db_routine)
        db.commit()

        return db_routine

    except Exception as e:
        logger.error("Error during routine insertion: %s", str(e))
        return {"error": "데이터 삽입 중 오류 발생"}


# # 루틴추가_기타
# @app.post("/routines")
# def create_routine(routine: ERoutineCreate, request: Request):
#     logger.error(f"111111111111111111111111111111")
#     # 라우터에 전달된 데이터 출력
#     logging.error(f"Received: {request}")
#     try:
#         # Create a unique ertn_id
#         logging.error(f"Received routine: {routine}")
#         ertn_id = generate_unique_ertn_id(routine.ertn_mem)
#         logger.error(f"33333333333333333333333333")
#         # logging.error(f"Received routine: {routine}")l
#         with SessionLocal() as db:
#             db_routine = ERTN_SETTING(
#                 ertn_mem=routine.ertn_mem,  # 로그인아이디필요
#                 ertn_id=ertn_id,
#                 ertn_nm=routine.ertn_nm,
#                 ertn_cat="기타",
#                 ertn_tag="기타",
#                 ertn_set=routine.ertn_set,
#                 ertn_reps=routine.ertn_reps,
#                 ertn_sdate=routine.ertn_sdate,
#                 ertn_time=routine.ertn_time,
#                 ertn_alram=routine.ertn_alram,
#                 ertn_day=routine.ertn_day,
#                 ertn_edate=None,
#             )
#             # logging.error(f"Received routine: {routine}")
#             logging.error(f"Routine to add: {db_routine}")
#             logger.error(f"44444444444444444444444444444444")
#             db.add(db_routine)
#             logger.error(f"5555555555555555555555555555")
#             db.commit()
#             logger(f"6666666666666666666666666")
#             # db.refresh(db_routine)
#             logger.error("7777777777777777777777777")

#         return db_routine
#     except Exception as e:
#         logger.error("데이터 삽입 중 오류 발생: %s", str(e))
#         return {"error": "데이터 삽입 중 오류 발생"}


# 루틴추가_건강
@app.post("/h_routines")  # , response_model=RoutineCreate)
def create_routine(routine: HRoutineCreate, request: Request):
    try:
        hrtn_id = generate_unique_hrtn_id(routine.hrtn_mem)
        with SessionLocal() as db:
            db_routine = HRTN_SETTING(
                hrtn_mem=routine.hrtn_mem,
                hrtn_id=hrtn_id,
                hrtn_nm=routine.hrtn_nm,
                hrtn_cat="건강",
                hrtn_tag=routine.hrtn_tag,
                hrtn_set=routine.hrtn_set,
                hrtn_reps=routine.hrtn_reps,
                hrtn_sdate=routine.hrtn_sdate,
                hrtn_time=routine.hrtn_time,
                hrtn_alram=routine.hrtn_alram,
                hrtn_day=routine.hrtn_day,
                hrtn_edate=None,
            )
            logger.error("-----------------------------------")
            logging.error(f"Routine to add: {db_routine}")
            db.add(db_routine)
            db.commit()
            # db.refresh(db_routine)
            return db_routine
    except Exception as e:
        logger.error("데이터 삽입 중 오류 발생: %s", str(e))
        return {"error": "데이터 삽입 중 오류 발생"}


# 루틴추가_영양
@app.post("/p_routines")  # , response_model=RoutineCreate)
def create_routine(routine: PRoutineCreate, request: Request):
    try:
        prtn_id = generate_unique_prtn_id(routine.prtn_mem)
        with SessionLocal() as db:
            db_routine = PRTN_SETTING(
                prtn_mem=routine.prtn_mem,  # 로그인아이디필요
                prtn_id=prtn_id,
                prtn_nm=routine.prtn_nm,
                prtn_cat="영양",
                prtn_tag="영양",
                prtn_set=routine.prtn_set,
                prtn_reps=routine.prtn_reps,
                prtn_sdate=routine.prtn_sdate,
                prtn_time=routine.prtn_time,
                prtn_alram=routine.prtn_alram,
                prtn_day=routine.prtn_day,
                prtn_edate=None,
            )
            db.add(db_routine)
            db.commit()
            # db.refresh(db_routine)
        return db_routine
    except Exception as e:
        logger.error("데이터 삽입 중 오류 발생: %s", str(e))
        return {"error": "데이터 삽입 중 오류 발생"}


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


class Pill_funcBase(BaseModel):
    func_cd: str
    func_nm: str
    func_emoji: Optional[str] = None


class Pill_funcInDB(Pill_funcBase):
    class Config:
        orm_mode = True


############################################################## pill_prod((영양검색창활용)
class PILL_PROD_SEARCH(BaseModel):
    pill_cd: str
    pill_nm: str
    pill_mnf: str


@app.get("/pillsearch")
def pill_prod_search(
    q: Optional[str] = None, db: Session = Depends(get_db)
):  # 'q'는 검색어입니다.
    query = (
        db.query(PILL_PROD.pill_cd, PILL_PROD.pill_nm, PILL_FUNC.func_emoji)
        .join(PILL_CMB, PILL_PROD.pill_cd == PILL_CMB.cmb_pill)
        .join(PILL_FUNC, PILL_CMB.cmb_func == PILL_FUNC.func_cd)
    )

    if q:
        query = query.filter(PILL_PROD.pill_nm.like(f"%{q}%"))  # 검색어에 따른 필터링

    results = query.all()

    return [
        {
            "pill_cd": item[0],
            "pill_nm": item[1],
            "func_emoji": item[2],
        }
        for item in results
    ]


# @app.get("/pillsearch")
# def pill_prod_search(db: Session = Depends(get_db)):
#     pillsearch = db.query(PILL_PROD).all()
#     return pillsearch


# @app.get("/pillsearch")
# def pill_prod_search(db: Session = Depends(get_db)):
#     results = (
#         db.query(PILL_PROD.pill_cd, PILL_PROD.pill_nm, PILL_FUNC.func_emoji)
#         .join(PILL_CMB, PILL_PROD.pill_cd == PILL_CMB.cmb_pill)
#         .join(PILL_FUNC, PILL_CMB.cmb_func == PILL_FUNC.func_cd)
#         .all()
#     )

#     return [
#         {
#             "pill_cd": item[0],
#             "pill_nm": item[1],
#             "func_emoji": item[2],
#         }
#         for item in results
#     ]


class HEALTH_SEARCH(BaseModel):
    health_nm: str
    health_tag: str
    health_emoji: str


@app.get("/healthsearch")
def pill_prod_search(db: Session = Depends(get_db)):
    healthsearch = db.query(HEALTH).all()
    return healthsearch
