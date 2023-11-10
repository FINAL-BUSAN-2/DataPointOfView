import pandas as pd
from bs4 import BeautifulSoup
import requests

def news_scrapping():
    news_df_list = []  # 데이터프레임을 저장할 리스트

    try:
        # URL 생성 함수
        def makeUrl(search):
            # 아래 URL은 예시이며, 실제 크롤링할 페이지의 URL로 변경해야 합니다.
            url = f'https://search.daum.net/search?w=news&nil_search=btn&DA=STC&enc=utf8&cluster=y&cluster_page=1&q={search}&sd=20231019105159&ed=20231020105159&period=d'
            return url

        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102"}

        search = ['건강기능식품','루틴','헬스케어','건강','운동법']

        for s in search:
            # 뉴스 페이지 내용 가져오기
            news = requests.get(makeUrl(s), headers=headers)
            news_html = BeautifulSoup(news.text, "html.parser")
            # 뉴스 내용 추출
            for i in range(1, 6):  # 각 페이지에서 상위 5개 뉴스 기사만 추출
                news_dict = {}  # 뉴스 정보를 저장할 딕셔너리
                try:
                    # CSS 선택자는 실제 웹사이트의 구조에 따라 변경되어야 합니다.
                    news_dict['news_idx'] = f'{search.index(s)*5 + i}'
                    news_dict['news_cat'] = s
                    news_dict['news_title'] = news_html.select_one(f"#newsColl > div:nth-child(1) > div.cont_divider > ul > li:nth-child({i+1}) > div.wrap_cont > a").get_text()
                    news_dict['news_link'] = news_html.select_one(f"#newsColl > div:nth-child(1) > div.cont_divider > ul > li:nth-child({i+1}) > div.wrap_cont > a")["href"]
                    img_element = news_html.select_one(f'#news_img_{i} > a > img')
                    news_dict['news_img'] = img_element["src"] if img_element else None

                    # 데이터프레임으로 변환하여 리스트에 추가
                    news_df_list.append(pd.DataFrame([news_dict]))

                except Exception as e:
                    print(f'Extraction error: {e}')
                    continue

        # 모든 뉴스 데이터프레임을 하나로 합치기
        news_df = pd.concat(news_df_list).reset_index(drop=True)
        return news_df

    except requests.exceptions.RequestException as e:
        print(f'HTTP Request error: {e}')
    except Exception as e:
        print(f'Error occurred: {e}')