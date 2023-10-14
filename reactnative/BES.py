from fastapi import FastAPI
from fastapi import HTTPException
from pydantic import BaseModel
from typing import List

# from datetime import datetime

# MySQL 데이터베이스와 상호작용하기 위한 모듈
import mysql.connector

app = FastAPI()

# MySQL 연결 설정
db = mysql.connector.connect(
    host="127.0.0.1", user="jmj", password="dbdb", database="testdb"
)
print(db)


class Routine(BaseModel):
    rtn_nm: str  # 루틴명
    rtn_set: int  # 1일 반복횟수
    rtn_reps: int  # 1일 반복갯수
    rtn_sdate: str  # 시작날짜
    # rtn_time: str  # 알림시간
    rtn_tag: str  # 루틴분류태그
    rtn_day: List[str]  # 반복 요일


@app.post("/routines", status_code=201)
def create_routine(routine: Routine):
    try:
        cursor = db.cursor()
        # 리스트를 문자열로 변환
        rtn_day_str = ",".join(routine.rtn_day)
        # SQL 쿼리 생성
        query = "INSERT INTO RTN_SETTING (rtn_nm, rtn_set, rtn_reps, rtn_sdate, rtn_day, rtn_tag) VALUES (%s,%s,%s,%s,%s,%s)"
        values = (
            routine.rtn_nm,
            routine.rtn_set,
            routine.rtn_reps,
            routine.rtn_sdate,
            routine.rtn_day,
            routine.rtn_tag,
        )

        cursor.execute(query, values)

        db.commit()

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=500, detail="Failed to insert routine into the database"
            )
        cursor.close()

        return {"message": "Routine added successfully"}

    except Exception as e:
        return {"error": str(e)}
