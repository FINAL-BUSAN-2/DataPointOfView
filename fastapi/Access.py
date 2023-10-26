from fastapi import FastAPI
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# app = FastAPI()
router1 = APIRouter()
router2 = APIRouter()
router3 = APIRouter()
router4 = APIRouter()
router5 = APIRouter()


@router1.get("/test")
def test(db: Session = Depends(get_db)):
    test = db.query(News_Data.news_cat)
    testdata = [
        {
            "testid": tag_count[0],
        }
        for tag_count in test
    ]
    return testdata


@router2.get("/health_piechartdata")
def get_health_chart_data(db: Session = Depends(get_db)):
    # HRTN_FIN 테이블에서 존재하는 hrtn_id 조회
    hrtn_ids_query = db.query(Hrtn_Fin.hrtn_id).distinct().subquery()

    # HEALTH 테이블에서 해당 태그의 빈도수 조회 (태그: 상체/하체/코어/유산소/스트레칭/기타)
    tag_counts_query = (
        db.query(Health.health_tag, func.count(Health.health_tag))
        .join(Mem_Detail, Mem_Detail.mem_email == Hrtn_Setting.hrtn_mem)
        .join(
            Hrtn_Setting,
            Hrtn_Setting.hrtn_nm
            == func.substr(Health.health_nm, 1, func.length(Hrtn_Setting.hrtn_nm)),
        )
        .filter(Hrtn_Fin.hrtn_id.in_(hrtn_ids_query))
        .group_by(Health.health_tag)
        .all()
    )

    # 파이 차트 데이터 구성 (태그별 빈도수와 색상 지정)
    pie_chart_data = [
        {
            "tag": tag_count[0],
            "count": tag_count[1],
            "color": get_color_by_tag(tag_count[0]),
        }
        for tag_count in tag_counts_query
    ]

    return pie_chart_data


def get_color_by_tag(tag):
    # 태그별로 색상 지정 로직 구현하기 (예: 상체 - 빨강색 / 하체 - 파랑색 등)
    if tag == "상체":
        return "#D64D40"  # 빨강색

    elif tag == "하체":
        return "#8F5550"  # 파랑색

    elif tag == "코어":
        return "#1C488A"  # 초록색

    elif tag == "유산소":
        return "#B2D667"  # 노랑색

    elif tag == "스트레칭":
        return "#808A6A"  # 보라색

    else:
        return "#808080"  # 기타는 회색으로 설정


@router3.get("/health_listdata")
def get_health_list_data(db: Session = Depends(get_db)):
    # HRTN_FIN 테이블에서 존재하는 hrtn_id 조회
    hrtn_ids_query = db.query(Hrtn_Fin.hrtn_id).distinct().subquery()

    # HEALTH 테이블에서 해당 태그의 빈도수 조회 (태그: 상체/하체/코어/유산소/스트레칭/기타)
    health_names = (
        db.query(Hrtn_Setting.hrtn_nm)
        .join(Mem_Detail, Mem_Detail.mem_email == Hrtn_Setting.hrtn_mem)
        .filter(Hrtn_Fin.hrtn_id.in_(hrtn_ids_query))
        .distinct()
        .all()
    )

    # 파이 차트 데이터 구성 (태그별 빈도수와 색상 지정)
    pie_list_data = [
        {
            "name": health_name[0],
        }
        for health_name in health_names
    ]

    return pie_list_data


@router4.get("/pill_piechartdata")
def get_pill_chart_data(db: Session = Depends(get_db)):
    func_counts_query = (
        db.query(Pill_Func.func_nm, func.count(Pill_Func.func_nm), Pill_Prod.pill_nm)
        .join(mem_detail, mem_detail.mem_email == Hrtn_Setting.hrtn_mem)
        .join(pill_cmb, Pill_Func.func_cd == pill_cmb.cmb_func)
        .join(Pill_Prod, pill_cmb.cmb_pill == Pill_Prod.pill_cd)
        .join(Prtn_Setting, Pill_Prod.pill_cd == Prtn_Setting.prtn_nm)
        .join(Prtn_Fin, Prtn_Setting.prtn_id == Prtn_Fin.prtn_id)
        .filter(Prtn_Setting.prtn_id.in_(db.query(Prtn_Fin.prtn_id)))
        .group_by(Pill_Func.func_nm, Pill_Prod.pill_nm)
        .all()
    )

    # 파이 차트 데이터 구성 (태그별 빈도수와 색상 지정)
    pill_chart_data = [
        {
            "func": func_count[0],
            "count": func_count[1],
            "color": get_color_by_func(func_count[0]),
        }
        for func_count in func_counts_query
    ]

    return pill_chart_data


def get_color_by_func(func):
    # 기능별로 색상 지정 로직 구현하기
    color_mapping = {
        "피로감": "#D64D40",  # 빨강색
        "눈 건강": "#8F5550",  # 파랑색
        "피부 건강": "#FFA500",  # 주황색
        "체지방": "#008000",  # 녹색
        "혈관 & 혈액순환": "#800080",  # 보라색
        "간 건강": "#FFFF00",  # 노랑색
        "장 건강": "#00FFFF",  # 하늘색
        "스트레스 & 수면": "#FFC0CB",  # 분홍색
        "면역기능": "#FFD700",  # 금색
        "혈중 콜레스테롤": "#FF4500",  # 오렌지색
        "뼈 건강": "#228B22",  # 초록색
        "노화 & 항산화": "#8B4513",  # 갈색
        "여성 건강": "#FF69B4",  # 핑크색
        "소화 & 위식도 건강": "#8B008B",  # 보라색
        "남성 건강": "#4B0082",  # 아이보리색
        "혈압": "#DC143C",  # 검정색
        "운동 능력 & 근육량": "#2E8B57",  # 남색
        "두뇌활동": "#00FF00",  # 연두색
        "혈당": "#FFFFE0",  # 연한 노랑색
        "혈중 중성지방": "#00008B",  # 초록색
        "치아 & 잇몸": "#9400D3",  # 보라색
        "임산부 & 태아 건강": "#87CEEB",  # 하늘색
        "탈모 & 손톱 건강": "#9370DB",  # 자주색
        "관절 건강": "#7B68EE",  # 파랑색
        "여성 갱년기": "#FA8072",  # 적색
        "호흡기 건강": "#32CD32",  # 라임색
        "갑상선 건강": "#ADFF2F",  # 초록색
        "빈혈": "#FF6347",  # 토마토색
        # 기타
    }
    # 딕셔너리에서 찾아 반환하거나 기타는 회색
    return color_mapping.get(func, "#808080")  # 기본값은 회색


@router5.get("/pill_listdata")
def get_pill_list_data(db: Session = Depends(get_db)):
    pill_names_query = (
        db.query(Pill_Prod.pill_nm)
        .join(Mem_Detail, Mem_Detail.mem_email == Hrtn_Setting.hrtn_mem)
        .join(Prtn_Setting, Pill_Prod.pill_cd == Prtn_Setting.prtn_nm)
        .join(Prtn_Fin, Prtn_Setting.prtn_id == Prtn_Fin.prtn_id)
        .filter(Prtn_Setting.prtn_id.in_(db.query(Prtn_Fin.prtn_id)))
        .distinct()
        .all()
    )

    # 파이 차트 데이터 구성 (태그별 빈도수와 색상 지정)
    pill_list_data = [
        {
            "name": pill_name[0],
        }
        for pill_name in pill_names_query
    ]

    return pill_list_data
