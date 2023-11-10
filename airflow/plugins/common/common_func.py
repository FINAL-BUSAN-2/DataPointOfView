import pandas as pd

def get_sftp() :
    print('sftp 작업을 시작합니다.')
    
def regist(name, sex, *args):
    print(f'이름:{name}',
          f'성별:{sex}',
          f'기타옵션들:{args}')
    
def dfMaker(dict_name):
    news_df = pd.DataFrame(dict_name)
    return news_df

from pyspark.sql import SparkSession

def create_session(appName:str) -> SparkSession:
    return SparkSession \
            .builder \
            .appName(appName) \
            .getOrCreate()