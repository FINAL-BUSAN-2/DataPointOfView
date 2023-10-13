from fastapi import FastAPI
from fastapi import HTTPException
from pydantic import BaseModel
from typing import List
import mysql.connector

app = FastAPI()

# MySQL 연결 설정
db = mysql.connector.connect(
    host="127.0.0.1",
    user="psh",
    password="dbdb",
    database="testdb"
)

class Routine(BaseModel):
    rtn_nm: str
    rtn_set: int
    rtn_reps: int
    rtn_sdate: str
    rtn_day: List[str]
    rtn_tag: str

@app.post("/routines", status_code=201)
def create_routine(routine: Routine):
    try:
        cursor = db.cursor()
        # 리스트를 문자열로 변환
        rtn_day_str = ",".join(routine.rtn_day)
        # SQL 쿼리 생성
        query = "INSERT INTO RTN_SETT (rtn_nm, rtn_set, rtn_reps, rtn_sdate, rtn_day, rtn_tag) VALUES (%s,%s,%s,%s,%s,%s)"
        values = (routine.rtn_nm, routine.rtn_set, routine.rtn_reps,
                  routine.rtn_sdate,rtn_day_str,routine.rtn_tag)
        
        cursor.execute(query ,values)
        
        db.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=500,
                                detail="Failed to insert routine into the database")
        
        return {"message": "Routine added successfully"}
    
    except Exception as e:
       return {"error": str(e)}
