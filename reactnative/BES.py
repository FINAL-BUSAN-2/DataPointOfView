from fastapi import FastAPI
from fastapi import HTTPException
from pydantic import BaseModel
from typing import List
import mysql.connector  # ySQL 데이터베이스와 상호작용하기 위한 모듈

# 추가
from datetime import datetime

app = FastAPI()

# MySQL 연결 설정
db = mysql.connector.connect(
    host="127.0.0.1", user="jmj", password="dbdb", database="rtn_setting"
)


class Routine(BaseModel):
    rtn_nm: str
    rtn_set: int
    rtn_reps: int
    rtn_time: str
    rtn_day: List[str]
    rtn_sdate: datetime
    rtn_tag: str
    rtn_email: str


@app.post("/routines", status_code=201)
def create_routine(routine: Routine):
    try:
        # SQL 쿼리를 실행하기 위한 cursor 객체를 생성
        cursor = db.cursor()
        # 리스트를 문자열로 변환
        rtn_day_str = ",".join(routine.rtn_day)
        # SQL 쿼리 생성
        query = "INSERT INTO RTN_SETT (rtn_nm, rtn_set, rtn_reps,rtn_time, rtn_sdate, rtn_day, rtn_tag,rtn_email) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"
        values = (
            routine.rtn_nm,
            routine.rtn_set,
            routine.rtn_reps,
            routine.rtn_time,
            routine.rtn_sdate.strftime("%Y-%m-%d %H:%M:%S"),
            ",".join(routine.rtn_day),
            routine.rtn_tag,
            routine.rtn_email,
        )
        # 실제 SQL 쿼리를 실행
        cursor.execute(query, values)

        # 변경 사항을 데이터베이스에 반영(커밋)
        db.commit()

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=500, detail="Failed to insert routine into the database"
            )

        return {"message": "Routine added successfully"}

    except Exception as e:
        return {"error": str(e)}
