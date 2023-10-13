from fastapi import FastAPI
from fastapi import HTTPException
from pydantic import BaseModel
from typing import List
import mysql.connector  # MySQL 데이터베이스와 상호작용하기 위한 모듈

# connection pool
from mysql.connector.pooling import MySQLConnectionPool

# MySQL 연결 설정
# Connection pool 생성
db_pool = MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,
    host="127.0.0.1",
    user="jmj",
    password="dbdb",
    database="testdb",
)

from datetime import datetime

app = FastAPI()


class Routine(BaseModel):
    rtn_nm: str  # 루틴명
    rtn_set: int  # 1일 반복횟수
    rtn_reps: int  # 1일 반복갯수
    rtn_time: str  # 알림시간
    rtn_day: List[str]  # 반복 요일
    rtn_sdate: str  # 시작날짜
    rtn_tag: str  # 루틴분류태그


@app.post("/routines", status_code=201)
def create_routine(routine: Routine):
    try:
        db_conn = db_pool.get_connection()  # Pool에서 Connection 가져오기

        # SQL 쿼리를 실행하기 위한 cursor 객체를 생성
        cursor = db_conn.cursor()
        # 리스트를 문자열로 변환``
        rtn_day_str = ",".join(routine.rtn_day)
        # SQL 쿼리 생성
        query = "INSERT INTO rtn_setting (rtn_nm, rtn_set, rtn_reps,rtn_time, rtn_day, rtn_sdate, rtn_tag) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        values = (
            routine.rtn_nm,
            routine.rtn_set,
            routine.rtn_reps,
            routine.rtn_time,
            routine.rtn_day,
            datetime.fromisoformat(routine.rtn_sdate),  # 문자열을 datetime 객체로 변환
            routine.rtn_sdate.strftime("%Y-%m-%d %H:%M:%S"),
            routine.rtn_tag,
        )
        # 실제 SQL 쿼리를 실행
        cursor.execute(query, values)

        # 변경 사항을 데이터베이스에 반영(커밋)
        db_conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=500, detail="Failed to insert routine into the database"
            )

        cursor.close()
        db_conn.close()

        return {"message": "Routine added successfully"}

    except Exception as e:
        return {"error": str(e)}
