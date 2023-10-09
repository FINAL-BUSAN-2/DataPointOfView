<div align="right">
<a href="https://github.com/FINAL-BUSAN-2/DataPointOfView/tree/develop#2-%ED%8C%80-%EA%B5%AC%EC%84%B1--role">메인 화면 이동</a>
</div>
<br>

# Spark 로컬 세팅법 (Windows)

<br>

## 1. jdk 설치 

> 참고 : https://jdk.java.net/java-se-ri/8-MR3
> Windows 10 i586 Java Development Kit (md5) 92 MB 다운

> knowledge > assets 안 java-1.8.0-openjdk 활용

## 2. pyspark 설치

```bash
# jupyter 안에서 설치 할 경우 !pip install pyspark
pip install pyspark
```

## 3. findspark 설치

```bash
# jupyter 안에서 설치 할 경우 !pip install findspark
pip install findspark
```

## 4. mysql-connector.jar 세팅

```python
# python idle (window 키 > idle 검색) 

import sys

# 하기 결과에서 site-packages 경로 확인
print(sys.path)
```

## 5. site-packages 경로에 pyspark 폴더 안으로 mysql-connector.jar 복붙 

> https://dev.mysql.com/downloads/connector/j/

mysql-connector-j-8.1.0.zip  파일 압축 해제 후 폴더 안의 mysql-connector jar 파일만 복붙

## 6. DB 의 유저 권한 설정

```sql
grant all privileges on *.* to 'user'@'%';

flush privileges; 
```

## 7. 공유 코드 설정 변수 조정 후 실행

```python
import findspark
import pandas as pd
from pyspark.sql import SparkSession, DataFrame


def create_session(appName:str):
    '''
    # Spark 세션 만드는 함수
    # appName : 스파크 세션의 이름 지정 변수
    # return : pyspark.sql.SparkSession
    '''
    return SparkSession \
            .builder \
            .appName(appName) \
            .getOrCreate()

def mysql_select(spark:SparkSession, domain:str, port:str, schema:str, query:str, user:str, password:str):
    '''
    # mysql 조회 함수
    # spark : SparkSession
    # domain : DB 서버 IP
    # port : DB 서버 포트
    # schema : MySQL Database 명
    # query : 조회 SQL
    # user : DB 유저
    # password : DB 비밀번호
    # return : pyspark.sql.DataFrame
    '''
    return spark \
        .read \
        .format("jdbc") \
        .option("driver", "com.mysql.cj.jdbc.Driver") \
        .option("url", f"jdbc:mysql://{domain}:{port}/{schema}?serverTimezone=UTC") \
        .option("query", query) \
        .option("user", user) \
        .option("password", password) \
        .load()
def mysql_write(df:DataFrame, mode:str, domain:str, port:str, schema:str, table:str, user:str, password:str):
    '''
    # mysql 데이터 저장 함수
    # df : pyspark.sql.DataFrame
    # mode : 데이터 저장 방식 지정 'overwrite', 'append', 'ignore'
    # domain : DB 서버 IP
    # port : DB 서버 포트
    # schema : MySQL Database 명
    # table : 테이블 명
    # user : DB 유저
    # password : DB 비밀번호
    '''
    df.write \
        .format("jdbc") \
        .mode(mode) \
        .option("driver", "com.mysql.cj.jdbc.Driver") \
        .option("url", f"jdbc:mysql://{domain}:{port}/{schema}?serverTimezone=UTC") \
        .option("dbtable", table) \
        .option("user", user) \
        .option("password", password) \
        .save()
# spark 경로 설정
findspark.init()
# 판다스로 데이터 조회
pandas_df = pd.read_excel('/Users/Desktop/건기식_원료.xlsx')
# 스파크 세션 생성
spark = create_session("spark_test")
# 판다스 데이터 Spark 데이터프레임으로 변경
df = spark.createDataFrame(pandas_df)
# mysql 설정 변수
db_domain = "localhost"
db_port = "3306"
database = "test"
table = "testtest"
sql = f"""
    SELECT * 
    FROM TESTTEST
"""
user = "och"
password = "1234"
write_mode = "overwrite"

# mysql 데이터 저장
mysql_write(df, write_mode, db_domain, db_port, database, table, user, password)
# mysql 데이터 조회
mysql_df = mysql_select(spark, db_domain, db_port, database, sql, user, password)
mysql_df.show()
```

<br><br>


<div align="right">
<a href="https://github.com/FINAL-BUSAN-2/DataPointOfView/tree/develop#2-%ED%8C%80-%EA%B5%AC%EC%84%B1--role">메인 화면 이동</a>
</div>