from fastapi import FastAPI, Request, Depends, HTTPException
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import RedirectResponse
from urllib.parse import quote
import httpx
# ### 뉴스크롤링에 사용할 라이브러리
# import pandas as pd
# from bs4 import BeautifulSoup
# import requests

from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Union, Optional
from pydantic import BaseModel
from sqlalchemy import ForeignKey
from sqlalchemy import Date
from datetime import date,datetime
from enum import Enum


app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key='bce5bcfe36455290d51dd4258cfb2737e54b79188d9d51aa162f6ed9e6e706f3')

DATABASE_URL = "mysql+pymysql://mobile:Data1q2w3e4r!!@54.180.91.68:3306/dw"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

local_host = 'http://43.200.178.131:3344'

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Kakao API 설정
KAKAO_CLIENT_ID = "d5f43a85be784fb7ca46330a217f6d9c"
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
    mem_email :str
    mem_name :str
    mem_gen :Optional[str] = None
    mem_age :Optional[str] = None
    mem_sday :date
    mem_delete :int
    mem_dday :Optional[date] = None
    
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
        token_data = response.json()

    # Kakao 사용자 정보 요청
    user_info_endpoint = "https://kapi.kakao.com/v2/user/me"
    headers = {
        "Authorization": f"Bearer {token_data['access_token']}"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(user_info_endpoint, headers=headers)
        user_info = response.json()
    
    now = datetime.now()
    sday = now.date()
    
    existing_user = db.query(Mem_Detail).filter_by(mem_email=user_info["kakao_account"]['email']).first()
    # mem_sday = datetime.strptime(sday, "%Y-%m-%d")
    
    request.session["access_token"] = token_data["access_token"]
    request.session["user_email"] = user_info["kakao_account"]['email']
    request.session["user_name"] = user_info["kakao_account"]['profile']["nickname"]
    request.session["user_age"] = user_info["kakao_account"]['age_range']
    request.session["user_gender"] = user_info["kakao_account"]['gender']
        
    encoded_user_info = quote(str(request.session["user_name"]))
    login_url_scheme = f"hplog://callback?user_info={encoded_user_info}"
    if existing_user:
        return RedirectResponse(login_url_scheme)
    
    else:
        # 존재하지 않는 사용자인 경우, 추가
        new_user = Mem_Detail(mem_email=user_info["kakao_account"]['email'], mem_name=user_info["kakao_account"]['profile']["nickname"], mem_age=user_info["kakao_account"]['age_range'], mem_gen=user_info["kakao_account"]['gender'], mem_sday=sday, mem_delete=0)
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
                routine.ertn_sdate, "%Y-%m-%d"
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

