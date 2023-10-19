from fastapi import FastAPI, Depends
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from typing import Optional


app = FastAPI()

SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://psh:dbdb@localhost/testdb"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Routine(Base):
    __tablename__ = "RTN_SETT"

    id = Column(Integer, primary_key=True, autoincrement=True)
    rtn_nm = Column(String)
    rtn_set = Column(Integer)
    rtn_reps = Column(Integer)
    rtn_sdate = Column(String)
    rtn_day = Column(String)
    rtn_tag=Column(String)

class RoutineSchema(BaseModel):
   # Pydantic model for validation and documentation (modify as needed)
   id: Optional[int] = None 
   rtn_nm: str 
   rtn_set: int 
   rtn_reps: int 
   rtn_sdate: str 
   rtn_day: str 
   rtn_tag:str 

def get_db():
  db_session=SessionLocal()
  try:
      yield db_session
  finally:
      db_session.close()

@app.post("/routines", status_code=201)  
def create_routine(routine: RoutineSchema,
                   db: Session=Depends(get_db)):
                   
  routine_db=Routine(**routine.dict())
   
  db.add(routine_db)  
   
  db.commit()  

  return {"message": "Routine added successfully"}

@app.get("/routines", response_model=List[RoutineSchema])
def read_routines(db: Session=Depends(get_db)):
    routines=db.query(Routine).all()
    
    return routines
