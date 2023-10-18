### 사용할 라이브러리
import pandas as pd
from bs4 import BeautifulSoup
import requests
from tqdm import tqdm

def makeUrl(search):
    url = f'https://search.naver.com/search.naver?where=news&query={search}&sm=tab_opt&sort=1'
    return url
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102"}

def fetch_naver_news(search):
    news = requests.get(makeUrl(search),headers=headers)
    news_html = BeautifulSoup(news.text,"html.parser")
    news_list = []
    for i in range(5) :
        title = news_html.select_one(f"#sp_nws{i+1} > div > div > a").get_text()
        href = news_html.select_one(f"#sp_nws{i+1} > div > div > a")["href"]
        img = news_html.select_one(f'#sp_nws{i+1} > div > a > img')['src']
        news_list.append({'title':title,'href':href,'img':img})
    df = pd.DataFrame(news_list)
    return(df)