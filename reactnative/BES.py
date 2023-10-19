# import logging
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel, validator

# # sqlalchemy
# from sqlalchemy import create_engine
# from sqlalchemy import Column, MetaData, Table, Integer, String
# from sqlalchemy.orm import sessionmaker, Session
# from sqlalchemy.ext.declarative import declarative_base

# from typing import List
# from fastapi import Request

# app = FastAPI()


# # 로깅 설정
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # SQLAlchemy 엔진 생성 (MySQL 데이터베이스와 연결)
# DATABASE_URL = "mysql://root:dbdb@localhost/testdb"
# ##나중에 dpv_webserver주소변경 db server로
# engine = create_engine(DATABASE_URL)

# # meta = MetaData

# # 세션 생성
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base = declarative_base()


# # SQLAlchemy 모델 정의
# class Routine(Base):
#     __tablename__ = "RTN_SETTING"

#     id = Column(Integer, primary_key=True, index=True)
#     rtn_nm = Column(String(255), index=True)
#     rtn_set = Column(Integer)
#     rtn_reps = Column(Integer)
#     rtn_tag = Column(String(255))
#     rtn_day = Column(String(255))
#     rtn_sdate = Column(String(10))
#     rtn_time = Column(String(8))


# class RoutineCreate(BaseModel):
#     rtn_nm: str
#     rtn_set: int
#     rtn_reps: int
#     rtn_tag: str
#     rtn_day: str
#     rtn_sdate: str
#     rtn_time: str

# class News(Base):
#     __tablename__ = "NEWS_DATA"
#     index = Column(String(10), primary_key=True)
#     news_cat = Column(String(30))
#     news_title = Column(String(150))
#     news_link = Column(String(200))
#     news_img = Column(String(200))

# class NewsCreate(BaseModel):
#     index: str
#     news_cat: str
#     news_title: str
#     news_link: str
#     news_img: str

# @app.post("/routines", response_model=RoutineCreate)
# def create_routine(routine: RoutineCreate):
#     logger.info("Received data: %s", routine.json())
#     try:
#         # 로깅: 수신된 데이터를 로그에 출력
#         logger.debug("Received data: %s", routine.dict())

#         # SQLAlchemy session is used as a context manager to insert data
#         with SessionLocal() as db:
#             db_routine = Routine(
#                 rtn_nm=routine.rtn_nm,
#                 rtn_set=routine.rtn_set,
#                 rtn_reps=routine.rtn_reps,
#                 rtn_tag=routine.rtn_tag,
#                 rtn_day=routine.rtn_day,
#                 rtn_sdate=routine.rtn_sdate,
#                 rtn_time=routine.rtn_time,
#                 ##rtn_email=> 로그인정보에서 받아옴 request.session["user_email"] ,rtn_id => 메일아이디+0000001 이런형식
#             )

#             db.add(db_routine)
#             db.commit()
#             db.refresh(db_routine)

#         return db_routine
#     except Exception as e:
#         logger.error("데이터 삽입 중 오류 발생: %s", str(e))
#         return {"error": "데이터 삽입 중 오류 발생"}


# #### 루틴데이터받아오기
# class RoutineResponse(BaseModel):
#     rtn_time: str
#     rtn_name: str
#     rtn_tag: str


# def get_rtn_from_database():
#     with SessionLocal() as db:
#         routines = db.query(Routine).all()
#         return routines


# # 루틴 데이터를 반환하는 엔드포인트 정의
# # @app.get("/rtnlist", response_model=List[RoutineResponse])
# # async def read_routines(request: Request):
# #    routines = get_rtn_from_database()
# #    return {"routines": routines}


# # @app.get("/rtnlist", response_model=List[RoutineResponse])
# # async def read_routines(request: Request):
# #     routines = get_rtn_from_database()
# #     rtn_names = [routine.rtn_nm for routine in routines]
# #     rtn_tags = [routine.rtn_tag for routine in routines]
# #     rtn_times = [routine.rtn_time for routine in routines]

# #     return {"rtn_names": rtn_names, "rtn_tags": rtn_tags, "rtn_times": rtn_times}


# @app.get("/rtnlist", response_model=List[RoutineResponse])
# async def read_routines(request: Request):
#     routines = get_rtn_from_database()

#     response_data = []

#     for routine in routines:
#         response_data.append(
#             RoutineResponse(
#                 id=routine.id,
#                 rtn_name=routine.rtn_nm,
#                 rtn_tag=routine.rtn_tag,
#                 rtn_time=routine.rtn_time,
#             )
#         )

#     return response_data

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List
from pydantic import BaseModel

app = FastAPI()

DATABASE_URL = "mysql://root:dbdb@localhost/testdb"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


class Routine(Base):
    __tablename__ = "RTN_SETTING"

    id = Column(Integer, primary_key=True, index=True)
    rtn_nm = Column(String(255), index=True)
    rtn_set = Column(Integer)
    rtn_reps = Column(Integer)
    rtn_tag = Column(String(255))
    rtn_day = Column(String(255))
    rtn_sdate = Column(String(10))
    rtn_time = Column(String(8))


class RoutineCreate(BaseModel):
    rtn_nm: str
    rtn_set: int
    rtn_reps: int
    rtn_tag: str
    rtn_day: str
    rtn_sdate: str
    rtn_time: str


class User(Base):
    __tablename__ = "NEWS_DATA"
    index = Column(String(10), primary_key=True)
    news_cat = Column(String(30))
    news_title = Column(String(150))
    news_link = Column(String(200))
    news_img = Column(String(200))


class UserBase(BaseModel):
    index: str
    news_cat: str
    news_title: str
    news_link: str
    news_img: str


class UserInDB(UserBase):
    class Config:
        orm_mode = True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/routines", response_model=RoutineCreate)
def create_routine(routine: RoutineCreate, db: Session = Depends(get_db)):
    db_routine = Routine(
        rtn_nm=routine.rtn_nm,
        rtn_set=routine.rtn_set,
        rtn_reps=routine.rtn_reps,
        rtn_tag=routine.rtn_tag,
        rtn_day=routine.rtn_day,
        rtn_sdate=routine.rtn_sdate,
        rtn_time=routine.rtn_time,
    )
    db.add(db_routine)
    db.commit()
    db.refresh(db_routine)
    return db_routine


@app.get("/naver/news/", response_model=List[UserInDB])
def get_search_news(db: Session = Depends(get_db), search: str = None):
    news = db.query(User).filter_by(news_cat=search).all()
    return news
