from airflow import DAG
import pendulum
from airflow.decorators import task, dag

# 해당 함수들이 있는 모듈을 가져옵니다.
from news_scrapping import news_scrapping
from airflow_load2 import setLoad

@dag(
    dag_id='dags_news_scrapping', #대그이름
    schedule='0 * * * *', # 매 시간마다 실행 (테스트용)
    start_date=pendulum.datetime(2023, 10, 24, tz='Asia/Seoul'),
    catchup=False,
)

def news_scrapping_dag():
    
    # t1 : 뉴스 스크래핑
    @task()
    def task_scrapping(): #태스크이름
        return news_scrapping()
    
    
    # t2 : 데이터베이스 로드
    @task()
    def task_load(task_scrapping_out):
        return setLoad(task_scrapping_out)
    
    # task 실행 및 데이터 전달
    task_scrapping_out = task_scrapping()
    task_load_out = task_load(task_scrapping_out)
    
    #task_scrapping_out >> task_load_out  # 의존성 설정
    
# DAG 인스턴스 생성
news_dag = news_scrapping_dag()
