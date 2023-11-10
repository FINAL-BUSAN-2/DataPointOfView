import findspark
import pandas as pd
from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.functions import current_timestamp, from_utc_timestamp

def setLoad(news_df):

    def create_session(appName:str):
        return SparkSession \
                .builder \
                .appName(appName) \
                .getOrCreate()


    def mysql_write(df:DataFrame, mode:str, domain:str, port:str, schema:str, table:str, user:str, password:str):

        df.write \
            .format("jdbc") \
            .mode(mode) \
            .option("encoding", "UTF-8") \
            .option("driver", "com.mysql.jdbc.Driver") \
            .option("url", f"jdbc:mysql://{domain}:{port}/{schema}?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8") \
            .option("dbtable", table) \
            .option("user", user) \
            .option("password", password) \
            .save()
    
        
    # 스파크 세션 생성
    spark = create_session("spark_test")
    # 판다스 데이터 Spark 데이터프레임으로 변경
    # ****************** 데이터프레임 입력 ******************
    pandas_df = news_df
    df = spark.createDataFrame(pandas_df)
    
    # 'load_time' 컬럼을 추가 -> load 시간 기록
    df_load = df.withColumn("load_time", from_utc_timestamp(current_timestamp(), 'Asia/Seoul'))
    
    # mysql 설정 변수
    db_domain = "54.180.91.68"
    db_port = "3306"
    database = "dw"
    table = "news_data"
    user = "batch"
    password = "Data1q2w3e4r!!"
    write_mode = "append"

    # mysql 데이터 저장
    mysql_write(df_load, write_mode, db_domain, db_port, database, table, user, password)