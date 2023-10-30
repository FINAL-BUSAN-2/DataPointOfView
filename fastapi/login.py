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


# @app.get("/naver/news/")
# def naver_news_crawling(search: str):
#     url = f'https://search.naver.com/search.naver?where=news&query={search}&sm=tab_opt&sort=0'
#     headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102"}
#     news = requests.get(url,headers=headers)
#     news_html = BeautifulSoup(news.text,"html.parser")
#     news_list = []
#     for i in range(5) :
#         title = news_html.select_one(f"#sp_nws{i+1} > div > div > a").get_text()
#         href = news_html.select_one(f"#sp_nws{i+1} > div > div > a")["href"]
#         img_element = news_html.select_one(f'#sp_nws{i+1} > div > a > img')
#         img = img_element['src'] if img_element else None
#         news_list.append({'title':title,'href':href,'img':img})
#     df = pd.DataFrame(news_list)

#     return df.to_dict(orient='records')


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


# 루틴추가_기타
@app.post("/routines")
def create_routine(routine: ERoutineCreate, request: Request):
    logger.error(f"111111111111111111111111111111")
    # 라우터에 전달된 데이터 출력
    logging.error(f"Received: {request}")
    try:
        # Create a unique ertn_id
        logging.error(f"Received routine: {routine}")
        ertn_id = generate_unique_ertn_id(routine.ertn_mem)
        logger.error(f"33333333333333333333333333")
        # logging.error(f"Received routine: {routine}")l
        with SessionLocal() as db:
            db_routine = ERTN_SETTING(
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
                ertn_edate=None,
            )
            # logging.error(f"Received routine: {routine}")
            logging.error(f"Routine to add: {db_routine}")
            logger.error(f"44444444444444444444444444444444")
            db.add(db_routine)
            logger.error(f"5555555555555555555555555555")
            db.commit()
            logger(f"6666666666666666666666666")
            # db.refresh(db_routine)
            logger.error("7777777777777777777777777")

        return db_routine
    except Exception as e:
        logger.error("데이터 삽입 중 오류 발생: %s", str(e))
        return {"error": "데이터 삽입 중 오류 발생"}


# 루틴추가_건강
@app.post("/h_routines")  # , response_model=RoutineCreate)
def create_routine(routine: HRoutineCreate, request: Request):
    try:
        if routine.hrtn_day == "":
            routine.hrtn_day = None

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
                prtn_id="",
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
def get_merged_routines_from_database(email):
    # 현재 날짜와 요일을 가져옵니다.
    now = datetime.now()
    today = now.date()
    current_day = day_name_mapping[now.strftime("%A").upper()].name
    # print(f"오늘 날짜: {today}, 요일: {current_day}")

    with SessionLocal() as db:
        e_routines = db.query(ERTN_SETTING).filter_by(ertn_mem=email).all()
        p_routines = db.query(PRTN_SETTING).filter_by(ertn_mem=email).all()
        h_routines = db.query(HRTN_SETTING).filter_by(ertn_mem=email).all()

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
# @app.get("/rtnlist")
# def rtnlist(db: Session = Depends(get_db)):
#     # ertn_setting 테이블에서 ertn_mem 값이 "qwert0175@naver.com"인 레코드 조회
#     ertn_list = (
#         db.query(ERTN_SETTING)
#         .filter(ERTN_SETTING.ertn_mem == "qwert0175@naver.com")
#         .all()
#     )
#     print(ertn_list)
#     # prtn_setting 테이블에서 prtn_mem 값이 "qwert0175@naver.com"인 레코드 조회
#     prtn_list = (
#         db.query(PRTN_SETTING)
#         .filter(PRTN_SETTING.prtn_mem == "qwert0175@naver.com")
#         .all()
#     )
#     print(prtn_list)
#     # hrtn_setting 테이블에서 hrtn_mem 값이 "qwert0175@naver.com"인 레코드 조회
#     hrtn_list = (
#         db.query(HRTN_SETTING)
#         .filter(HRTN_SETTING.hrtn_mem == "qwert0175@naver.com")
#         .all()
#     )
#     print(hrtn_list)
#     # 세 결과를 합침
#     combined_list = ertn_list + prtn_list + hrtn_list
#     print(combined_list)
#     return combined_list


@app.get("/rtnlist")
def rtnlist(userEmail: str, db: Session = Depends(get_db)):
    # 현재 날짜와 요일 얻기
    today = datetime.today().date()
    korean_days = ["월", "화", "수", "목", "금", "토", "일"]
    day_of_week = korean_days[today.weekday()]

    # ertn_setting 테이블에서 조건에 맞는 레코드 조회
    ertn_list = (
        db.query(ERTN_SETTING)
        .filter(ERTN_SETTING.ertn_mem == userEmail)
        .filter(
            (ERTN_SETTING.ertn_sdate == today)
            | (ERTN_SETTING.ertn_day.contains(day_of_week))
        )
        .all()
    )
    print(ertn_list)

    # prtn_setting 테이블에서 조건에 맞는 레코드 조회
    prtn_list = (
        db.query(PRTN_SETTING)
        .filter(PRTN_SETTING.prtn_mem == userEmail)
        .filter(
            (PRTN_SETTING.prtn_sdate == today)
            | (PRTN_SETTING.prtn_day.contains(day_of_week))
        )
        .all()
    )
    print(prtn_list)

    # hrtn_setting 테이블에서 조건에 맞는 레코드 조회
    hrtn_list = (
        db.query(HRTN_SETTING)
        .filter(HRTN_SETTING.hrtn_mem == userEmail)
        .filter(
            (HRTN_SETTING.hrtn_sdate == today)
            | (HRTN_SETTING.hrtn_day.contains(day_of_week))
        )
        .all()
    )
    print(hrtn_list)

    # 세 결과를 합침
    combined_list = ertn_list + prtn_list + hrtn_list
    print(combined_list)
    return combined_list


# # 루틴 데이터 가져오는 엔드포인트
# @app.get("/rtnlist", response_model=List[MergedRoutineResponse])
# def read_routines(request: Request, db: Session = Depends(get_db)):
#     email = request.session["user_email"]
#     merged_routines = get_merged_routines_from_database(email)
#     return merged_routines


# @app.get("/naver/news/", response_model=List[News_DataInDB])
# def get_search_news(db: Session = Depends(get_db), search: str = None):
#     news = db.query(News_Data).filter_by(news_cat=search).all()
#     return news


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


class Pill_funcBase(BaseModel):
    func_cd: str
    func_nm: str
    func_emoji: Optional[str] = None


class Pill_funcInDB(Pill_funcBase):
    class Config:
        orm_mode = True


@app.get("/pill_func/", response_model=List[Pill_funcInDB])
def get_search_pill(db: Session = Depends(get_db)):
    pill_func = db.query(PILL_FUNC(Base)).all()
    return pill_func


@app.get("/health_piechartdata")
def get_health_chart_data(db: Session = Depends(get_db)):
    # # HRTN_FIN 테이블에서 존재하는 hrtn_id 조회
    hrtn_ids_query = db.query(HRTN_FIN.hrtn_id).distinct().subquery()
    # HEALTH 테이블에서 해당 태그의 빈도수 조회 (태그: 상체/하체/코어/유산소/스트레칭/기타)
    tag_counts_query = (
        db.query(HEALTH.health_tag, func.count(HEALTH.health_tag), HEALTH.health_emoji)
        .join(HRTN_SETTING, HRTN_SETTING.hrtn_nm == HEALTH.health_nm)
        .filter(
            and_(
                HRTN_SETTING.hrtn_id.in_(hrtn_ids_query),
                HRTN_SETTING.hrtn_mem == "qwert0175@naver.com",
            )
        )
        .group_by(HEALTH.health_tag)
        .all()
    )

    # 파이 차트 데이터 구성 (태그별 빈도수와 색상 지정)
    pie_chart_data = [
        {
            "tag": tag_count[0],
            "count": tag_count[1],
            "emoji": tag_count[2],
            "color": get_color_by_tag(tag_count[0]),
        }
        for tag_count in tag_counts_query
    ]

    top_item = max(pie_chart_data, key=lambda x: x["count"])
    top_tag = top_item["tag"]
    top_emoji = top_item["emoji"]

    return {
        "pie_chart_data": pie_chart_data,
        "top_tag": top_tag,
        "top_emoji": top_emoji,
    }


def get_color_by_tag(tag):
    # 태그별로 색상 지정 로직 구현하기 (예: 상체 - 빨강색 / 하체 - 파랑색 등)
    if tag == "상체":
        return "#FF7A7A"  # 밝은 붉은색
    elif tag == "하체":
        return "#5E5A5A"  # 짙은 회색
    elif tag == "코어":
        return "#7BCCB5"  # 청록색
    elif tag == "유산소":
        return "#FFF18C"  # 연한 노랑
    elif tag == "스트레칭":
        return "#AE8BD9"  # 밝은 자주
    else:
        return "#808080"  # 기타는 회색


@app.get("/pill_piechartdata")
def get_pill_chart_data(db: Session = Depends(get_db)):
    prtn_ids_query = db.query(PRTN_FIN.prtn_id).distinct().subquery()
    func_counts_query = (
        db.query(PILL_FUNC.func_nm, func.count(PILL_FUNC.func_nm), PILL_FUNC.func_emoji)
        .filter(
            and_(
                PRTN_SETTING.prtn_id.in_(prtn_ids_query),
                PRTN_SETTING.prtn_mem == "qwert0175@naver.com",
                PILL_PROD.pill_cd == PRTN_SETTING.prtn_nm,
                PILL_CMB.cmb_pill == PILL_PROD.pill_cd,
                PILL_FUNC.func_cd == PILL_CMB.cmb_func,
            )
        )
        .group_by(PILL_FUNC.func_nm)
        .all()
    )
    pill_chart_data = [
        {
            "func": func_count[0],
            "count1": func_count[1],
            "emoji1": func_count[2],
            "color1": get_color_by_func(func_count[0]),
        }
        for func_count in func_counts_query
    ]

    top_item1 = max(pill_chart_data, key=lambda x: x["count1"])
    top_func1 = top_item1["func"]
    top_emoji1 = top_item1["emoji1"]

    return {
        "pill_chart_data": pill_chart_data,
        "top_func1": top_func1,
        "top_emoji1": top_emoji1,
    }


def get_color_by_func(func):
    # 기능별로 색상 지정 로직 구현하기
    if func == "피로감":
        return "#FF7A7A"  # 밝은 붉은색
    elif func == "눈 건강":
        return "#5E5A5A"  # 짙은 회색
    elif func == "피부 건강":
        return "#F7D7A3"  # 밝은 베이지
    elif func == "체지방":
        return "#A1D3A2"  # 밝은 녹색
    elif func == "혈관 & 혈액순환":
        return "#9055A0"  # 보라색
    elif func == "간 건강":
        return "#FFCA4D"  # 밝은 노랑
    elif func == "장 건강":
        return "#4AB4E8"  # 청록색
    elif func == "스트레스 & 수면":
        return "#FF9EDF"  # 밝은 핑크
    elif func == "면역기능":
        return "#FFD55B"  # 밝은 주황
    elif func == "혈중 콜레스테롤":
        return "#FF7F4F"  # 연한 붉은 주황
    elif func == "뼈 건강":
        return "#7BCCB5"  # 청록색
    elif func == "노화 & 항산화":
        return "#C0A875"  # 밝은 갈색
    elif func == "여성 건강":
        return "#FF96AB"  # 연한 핑크
    elif func == "소화 & 위식도 건강":
        return "#775288"  # 보라색
    elif func == "남성 건강":
        return "#5663E2"  # 짙은 파랑
    elif func == "혈압":
        return "#D8856A"  # 연한 갈색
    elif func == "운동 능력 & 근육량":
        return "#4E9378"  # 청록색
    elif func == "두뇌활동":
        return "#6CA35E"  # 연한 초록
    elif func == "혈당":
        return "#FFF18C"  # 연한 노랑
    elif func == "혈중 중성지방":
        return "#6EC28A"  # 연한 초록
    elif func == "치아 & 잇몸":
        return "#D667ED"  # 보라색
    elif func == "임산부 & 태아 건강":
        return "#71B0C5"  # 청록색
    elif func == "탈모 & 손톱 건강":
        return "#AE8BD9"  # 밝은 자주
    elif func == "관절 건강":
        return "#6D7EDB"  # 짙은 파랑
    elif func == "여성 갱년기":
        return "#FF8764"  # 연한 붉은색
    elif func == "호흡기 건강":
        return "#82FF84"  # 밝은 초록
    elif func == "갑상선 건강":
        return "#D4E4FF"  # 연한 하늘
    else:
        return "#FF817A"  # 연한 붉은색


# @app.get("/test")
# def test(db: Session = Depends(get_db)):
#     now = datetime.now()
#     today = now.date()
#     current_day = day_name_mapping[now.strftime("%A").upper()].name
#     # print(f"오늘 날짜: {today}, 요일: {current_day}")
#     testdata = (
#         db.query(func.count(HRTN_SETTING.hrtn_mem))
#         .filter(
#             and_(
#                 or_(
#                     text(f"HRTN_SETTING.hrtn_day::jsonb ? {current_day_json}"),
#                     HRTN_SETTING.hrtn_day.is_(None),
#                 ),
#                 or_(
#                     HRTN_SETTING.hrtn_edate == today, HRTN_SETTING.hrtn_edate.is_(None)
#                 ),
#                 HRTN_SETTING.hrtn_mem == "qwert0175@naver.com",
#             )
#         )
#         .all()
#     )
#     return testdata

today = datetime.today().date()
korean_days = ["월", "화", "수", "목", "금", "토", "일"]
day_of_week = korean_days[today.weekday()]


@app.get("/test2")
def test2(db: Session = Depends(get_db)):
    try:
        # today_date = datetime.today().strftime("%Y-%m-%d")  # '2023-10-29'
        # today_day = datetime.today().strftime("%a")  # '일'
        # today = datetime.today().date()
        # korean_days = ["월", "화", "수", "목", "금", "토", "일"]
        # day_of_week = korean_days[today.weekday()]
        testdata2 = (
            db.query(ERTN_SETTING)
            .filter(
                and_(
                    ERTN_SETTING.ertn_mem == "qwert0175@naver.com",
                    or_(
                        ERTN_SETTING.ertn_day.like(f"%{day_of_week}%"),
                        ERTN_SETTING.ertn_day.is_(None),
                    ),
                    or_(
                        ERTN_SETTING.ertn_edate == today,  ## 2023-10-29
                        ERTN_SETTING.ertn_edate.is_(None),
                    ),
                )
            )
            .count()
        )
        return testdata2
    except Exception as e:
        print(e)


##test
@app.get("/test3")
def test3(db: Session = Depends(get_db)):
    try:
        # today_date = datetime.today().strftime("%Y-%m-%d")  # '2023-10-29'
        # today_day = datetime.today().strftime("%a")  # '일'
        # today = datetime.today().date()
        # korean_days = ["월", "화", "수", "목", "금", "토", "일"]
        # day_of_week = korean_days[today.weekday()]
        testdata3 = (
            db.query(HRTN_SETTING).filter(
                and_(
                    HRTN_SETTING.hrtn_mem == "qwert0175@naver.com",
                    or_(
                        HRTN_SETTING.hrtn_day.like(f"%{day_of_week}%"),
                        HRTN_SETTING.hrtn_day.is_(None),
                    ),
                    or_(
                        HRTN_SETTING.hrtn_edate == today,  ## 2023-10-29
                        HRTN_SETTING.hrtn_edate.is_(None),
                    ),
                )
            )
            # .all()
            .count()
        )
        return testdata3
    except Exception as e:
        print(e)


@app.get("/test4")
def test4(db: Session = Depends(get_db)):
    try:
        # today = datetime.today().date()
        # korean_days = ["월", "화", "수", "목", "금", "토", "일"]
        # day_of_week = korean_days[today.weekday()]
        testdata4 = (
            db.query(PRTN_SETTING).filter(
                and_(
                    PRTN_SETTING.prtn_mem == "qwert0175@naver.com",
                    or_(
                        PRTN_SETTING.prtn_day.like(f"%{day_of_week}%"),
                        PRTN_SETTING.prtn_day.is_(None),
                    ),
                    or_(
                        PRTN_SETTING.prtn_edate == today,  ## 2023-10-29
                        PRTN_SETTING.prtn_edate.is_(None),
                    ),
                )
            )
            # .all()
            .count()
        )
        return testdata4
    except Exception as e:
        print(e)


## 운동루틴 count 조회
## 달성된3루틴/(운동루틴 + 영양루틴 + 기타루틴)
@app.get("/rtntotal")
def rtntotal(db: Session = Depends(get_db)):
    try:
        # today = datetime.today().date()
        # korean_days = ["월", "화", "수", "목", "금", "토", "일"]
        # day_of_week = korean_days[today.weekday()]
        ertn = (
            db.query(ERTN_SETTING)
            .filter(
                and_(
                    ERTN_SETTING.ertn_mem == "qwert0175@naver.com",
                    or_(
                        ERTN_SETTING.ertn_day.like(f"%{day_of_week}%"),
                        ERTN_SETTING.ertn_day.is_(None),
                    ),
                    or_(
                        ERTN_SETTING.ertn_edate == today,  ## 2023-10-29
                        ERTN_SETTING.ertn_edate.is_(None),
                    ),
                )
            )
            .count()
        )
        hrtn = (
            db.query(HRTN_SETTING)
            .filter(
                and_(
                    HRTN_SETTING.hrtn_mem == "qwert0175@naver.com",
                    or_(
                        HRTN_SETTING.hrtn_day.like(f"%{day_of_week}%"),
                        HRTN_SETTING.hrtn_day.is_(None),
                    ),
                    or_(
                        HRTN_SETTING.hrtn_edate == today,  ## 2023-10-29
                        HRTN_SETTING.hrtn_edate.is_(None),
                    ),
                )
            )
            .count()
        )
        prtn = (
            db.query(PRTN_SETTING)
            .filter(
                and_(
                    PRTN_SETTING.prtn_mem == "qwert0175@naver.com",
                    or_(
                        PRTN_SETTING.prtn_day.like(f"%{day_of_week}%"),
                        PRTN_SETTING.prtn_day.is_(None),
                    ),
                    or_(
                        PRTN_SETTING.prtn_edate == today,  ## 2023-10-29
                        PRTN_SETTING.prtn_edate.is_(None),
                    ),
                )
            )
            .count()
        )
        return ertn + hrtn + prtn
    except Exception as e:
        print(e)


@app.get("/fintotal")
def fintotal(db: Session = Depends(get_db)):
    try:
        hrtn_ids_query = db.query(HRTN_FIN.hrtn_id).distinct().subquery()
        ertn_ids_query = db.query(ERTN_FIN.ertn_id).distinct().subquery()
        prtn_ids_query = db.query(PRTN_FIN.prtn_id).distinct().subquery()
        efin = (
            db.query(ERTN_SETTING).filter(
                and_(
                    ERTN_SETTING.ertn_id.in_(ertn_ids_query),
                    cast(ERTN_FIN.fin_ertn_time, Date) == today,
                    ERTN_SETTING.ertn_mem == "qwert0175@naver.com",
                    or_(
                        ERTN_SETTING.ertn_day.like(f"%{day_of_week}%"),
                        ERTN_SETTING.ertn_day.is_(None),
                    ),
                    or_(
                        ERTN_SETTING.ertn_edate == today,  ## 2023-10-29
                        ERTN_SETTING.ertn_edate.is_(None),
                    ),
                )
            )
            # .all()
            .count()
        )
        hfin = (
            db.query(HRTN_SETTING).filter(
                and_(
                    HRTN_SETTING.hrtn_id.in_(hrtn_ids_query),
                    cast(HRTN_FIN.fin_hrtn_time, Date) == today,
                    HRTN_SETTING.hrtn_mem == "qwert0175@naver.com",
                    or_(
                        HRTN_SETTING.hrtn_day.like(f"%{day_of_week}%"),
                        HRTN_SETTING.hrtn_day.is_(None),
                    ),
                    or_(
                        HRTN_SETTING.hrtn_edate == today,  ## 2023-10-29
                        HRTN_SETTING.hrtn_edate.is_(None),
                    ),
                )
            )
            # .all()
            .count()
        )
        pfin = (
            db.query(PRTN_SETTING).filter(
                and_(
                    PRTN_SETTING.prtn_id.in_(prtn_ids_query),
                    cast(PRTN_FIN.fin_prtn_time, Date) == today,
                    PRTN_SETTING.prtn_mem == "qwert0175@naver.com",
                    or_(
                        PRTN_SETTING.prtn_day.like(f"%{day_of_week}%"),
                        PRTN_SETTING.prtn_day.is_(None),
                    ),
                    or_(
                        PRTN_SETTING.prtn_edate == today,  ## 2023-10-29
                        PRTN_SETTING.prtn_edate.is_(None),
                    ),
                )
            )
            # .all()
            .count()
        )
        return efin + hfin + pfin
    except Exception as e:
        print(e)


@app.get("/finfunc")
# def finfunc(userEmail: str, db: Session = Depends(get_db)):
def finfunc(db: Session = Depends(get_db)):
    try:
        hrtn_ids_query = db.query(HRTN_FIN.hrtn_id).distinct().subquery()
        ertn_ids_query = db.query(ERTN_FIN.ertn_id).distinct().subquery()
        prtn_ids_query = db.query(PRTN_FIN.prtn_id).distinct().subquery()
        ertn = (
            db.query(ERTN_SETTING).filter(
                and_(
                    ERTN_SETTING.ertn_mem == "qwert0175@naver.com",
                    or_(
                        ERTN_SETTING.ertn_day.like(f"%{day_of_week}%"),
                        ERTN_SETTING.ertn_day.is_(None),
                    ),
                    or_(
                        ERTN_SETTING.ertn_edate == today,  ## 2023-10-29
                        ERTN_SETTING.ertn_edate.is_(None),
                    ),
                )
            )
            # .all()
            .count()
        )
        hrtn = (
            db.query(HRTN_SETTING).filter(
                and_(
                    HRTN_SETTING.hrtn_mem == "qwert0175@naver.com",
                    or_(
                        HRTN_SETTING.hrtn_day.like(f"%{day_of_week}%"),
                        HRTN_SETTING.hrtn_day.is_(None),
                    ),
                    or_(
                        HRTN_SETTING.hrtn_edate == today,  ## 2023-10-29
                        HRTN_SETTING.hrtn_edate.is_(None),
                    ),
                )
            )
            # .all()
            .count()
        )
        prtn = (
            db.query(PRTN_SETTING)
            .filter(
                and_(
                    PRTN_SETTING.prtn_mem == "qwert0175@naver.com",
                    or_(
                        PRTN_SETTING.prtn_day.like(f"%{day_of_week}%"),
                        PRTN_SETTING.prtn_day.is_(None),
                    ),
                    or_(
                        PRTN_SETTING.prtn_edate == today,  ## 2023-10-29
                        PRTN_SETTING.prtn_edate.is_(None),
                    ),
                )
            )
            .all()
            # .count()
        )
        pos_e = func.position("@", ERTN_FIN.ertn_id)
        pos_h = func.position("@", HRTN_FIN.hrtn_id)
        pos_p = func.position("@", PRTN_FIN.prtn_id)
        efin = (
            db.query(ERTN_SETTING).filter(
                and_(
                    ERTN_SETTING.ertn_id.in_(ertn_ids_query),
                    and_(
                        cast(ERTN_FIN.fin_ertn_time, Date) == today,
                        func.substr(ERTN_FIN.ertn_id, 1, pos_e + 1) == "qwert0175@n",
                    ),
                    ERTN_SETTING.ertn_mem == "qwert0175@naver.com",
                    or_(
                        ERTN_SETTING.ertn_day.like(f"%{day_of_week}%"),
                        ERTN_SETTING.ertn_day.is_(None),
                    ),
                    or_(
                        ERTN_SETTING.ertn_edate == today,  ## 2023-10-29
                        ERTN_SETTING.ertn_edate.is_(None),
                    ),
                )
            )
            # .all()
            .count()
        )
        hfin = (
            db.query(HRTN_SETTING).filter(
                and_(
                    HRTN_SETTING.hrtn_id.in_(hrtn_ids_query),
                    and_(
                        cast(HRTN_FIN.fin_hrtn_time, Date) == today,
                        func.substr(HRTN_FIN.hrtn_id, 1, pos_h + 1) == "qwert0175@n",
                    ),
                    HRTN_SETTING.hrtn_mem == "qwert0175@naver.com",
                    or_(
                        HRTN_SETTING.hrtn_day.like(f"%{day_of_week}%"),
                        HRTN_SETTING.hrtn_day.is_(None),
                    ),
                    or_(
                        HRTN_SETTING.hrtn_edate == today,  ## 2023-10-29
                        HRTN_SETTING.hrtn_edate.is_(None),
                    ),
                )
            )
            # .all()
            .count()
        )
        pfin = (
            db.query(PRTN_SETTING)
            .filter(
                and_(
                    PRTN_SETTING.prtn_id.in_(prtn_ids_query),
                    and_(
                        cast(PRTN_FIN.fin_prtn_time, Date) == today,
                        func.substr(PRTN_FIN.prtn_id, 1, pos_p + 1) == "qwert0175@n",
                    ),
                    PRTN_SETTING.prtn_mem == "qwert0175@naver.com",
                    or_(
                        PRTN_SETTING.prtn_day.like(f"%{day_of_week}%"),
                        PRTN_SETTING.prtn_day.is_(None),
                    ),
                    or_(
                        PRTN_SETTING.prtn_edate == today,  ## 2023-10-29
                        PRTN_SETTING.prtn_edate.is_(None),
                    ),
                )
            )
            .all()
            # .count()
        )
        return (
            efin,
            hfin,
            pfin,
            ertn,
            hrtn,
            prtn,
        )
    except Exception as e:
        print(e)


@app.get("/testpos")
def test6(db: Session = Depends(get_db)):
    pos_p = func.position("@", PRTN_FIN.prtn_id)
    testpos = (
        db.query(PRTN_SETTING)
        .join(PRTN_FIN, PRTN_SETTING.prtn_id == PRTN_FIN.prtn_id)
        .filter(func.substr(PRTN_FIN.prtn_id, 1, pos_p + 1) == "qwert0175@n")
        .all()
    )
    return testpos


@app.get("/test6")
def test6(db: Session = Depends(get_db)):
    try:
        hrtn_ids_query = db.query(HRTN_FIN.hrtn_id).distinct().subquery()
        # today = datetime.today().date()
        # korean_days = ["월", "화", "수", "목", "금", "토", "일"]
        # day_of_week = korean_days[today.weekday()]
        testdata6 = (
            db.query(HRTN_SETTING)
            .filter(
                and_(
                    HRTN_SETTING.hrtn_id.in_(hrtn_ids_query),
                    cast(HRTN_FIN.fin_hrtn_time, Date) == today,
                    HRTN_SETTING.hrtn_mem == "qwert0175@naver.com",
                    or_(
                        HRTN_SETTING.hrtn_day.like(f"%{day_of_week}%"),
                        HRTN_SETTING.hrtn_day.is_(None),
                    ),
                    or_(
                        HRTN_SETTING.hrtn_edate == today,  ## 2023-10-29
                        HRTN_SETTING.hrtn_edate.is_(None),
                    ),
                )
            )
            .all()
            # .count()
        )
        return testdata6
    except Exception as e:
        print(e)


@app.get("/test7")
def test7(db: Session = Depends(get_db)):
    try:
        ertn_ids_query = db.query(ERTN_FIN.ertn_id).distinct().subquery()
        # today = datetime.today().date()
        # korean_days = ["월", "화", "수", "목", "금", "토", "일"]
        # day_of_week = korean_days[today.weekday()]
        testdata7 = (
            db.query(ERTN_SETTING)
            .filter(
                and_(
                    ERTN_SETTING.ertn_id.in_(ertn_ids_query),
                    cast(ERTN_FIN.fin_ertn_time, Date) == today,
                    ERTN_SETTING.ertn_mem == "qwert0175@naver.com",
                    or_(
                        ERTN_SETTING.ertn_day.like(f"%{day_of_week}%"),
                        ERTN_SETTING.ertn_day.is_(None),
                    ),
                    or_(
                        ERTN_SETTING.ertn_edate == today,  ## 2023-10-29
                        ERTN_SETTING.ertn_edate.is_(None),
                    ),
                )
            )
            .all()
            # .count()
        )
        return testdata7
    except Exception as e:
        print(e)


@app.get("/test8")
def test8(db: Session = Depends(get_db)):
    try:
        prtn_ids_query = db.query(PRTN_FIN.prtn_id).distinct().subquery()
        testdata8 = (
            db.query(PRTN_SETTING)
            .filter(
                and_(
                    PRTN_SETTING.prtn_id.in_(prtn_ids_query),
                    cast(PRTN_FIN.fin_prtn_time, Date) == today,
                    PRTN_SETTING.prtn_mem == "qwert0175@naver.com",
                    or_(
                        PRTN_SETTING.prtn_day.like(f"%{day_of_week}%"),
                        PRTN_SETTING.prtn_day.is_(None),
                    ),
                    or_(
                        PRTN_SETTING.prtn_edate == today,  ## 2023-10-29
                        PRTN_SETTING.prtn_edate.is_(None),
                    ),
                )
            )
            .all()
            # .count()
        )
        return testdata8
    except Exception as e:
        print(e)


############################################################## pill_prod((영양검색창활용)
class PILL_PROD_SEARCH(BaseModel):
    pill_cd: str
    pill_nm: str
    pill_mnf: str
    # pill_rv:Float
    # pill_rvnum:Optional[Integer] = None
    # pill_info:Optional[str] = None


@app.get("/pillsearch")
def pill_prod_search(db: Session = Depends(get_db)):
    pillsearch = db.query(PILL_PROD).all()
    return pillsearch


class HEALTH_SEARCH(BaseModel):
    health_nm: str
    health_tag: str
    health_emoji: str


@app.get("/healthsearch")
def pill_prod_search(db: Session = Depends(get_db)):
    healthsearch = db.query(HEALTH).all()
    return healthsearch