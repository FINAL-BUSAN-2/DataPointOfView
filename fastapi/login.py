from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import RedirectResponse
from urllib.parse import quote
import httpx

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key='bce5bcfe36455290d51dd4258cfb2737e54b79188d9d51aa162f6ed9e6e706f3')

# local_host = '172.16.10.195:3344'
local_host = '192.168.0.190:3344'

# Kakao API 설정
KAKAO_CLIENT_ID = "d5f43a85be784fb7ca46330a217f6d9c"
KAKAO_REDIRECT_URI = f"http://{local_host}/kakao/callback"
LOGOUT_REDIRECT_URI = f"http://{local_host}/kakao/logout_callback"

templates = Jinja2Templates(directory="templates")

# Kakao 로그인 페이지로 리다이렉트
@app.get("/kakao/login")
async def kakao_login(request: Request):
    # Kakao OAuth 로그인 URL 생성
    kakao_oauth_url = f"https://kauth.kakao.com/oauth/authorize?client_id={KAKAO_CLIENT_ID}&redirect_uri={KAKAO_REDIRECT_URI}&response_type=code"
    return RedirectResponse(kakao_oauth_url)

# Kakao 로그인 콜백 처리
@app.get("/kakao/callback")
async def kakao_callback(code: str, request: Request):
    # Kakao OAuth2 토큰 엔드포인트 설정
    token_endpoint = "https://kauth.kakao.com/oauth/token"
    
    # Kakao OAuth2 인증 코드를 사용하여 액세스 토큰 요청
    data = {
        "grant_type": "authorization_code",
        "client_id": "17f09694974ed4f10f7a0a1d1a00bfb8",
        "client_secret": "P7D4JsJNhGYnw3q94ozQKZVEttGo3IoE",
        "redirect_uri": f"http://{local_host}/kakao/callback",
        "code": code,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(token_endpoint, data=data)
        token_data = response.json()

    # Kakao 사용자 정보 요청
    user_info_endpoint = "https://kapi.kakao.com/v2/user/me"
    headers = {
        "Authorization": f"Bearer {token_data['access_token']}"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(user_info_endpoint, headers=headers)
        user_info = response.json()
    
    request.session["access_token"] = token_data["access_token"]
    request.session["user_email"] = user_info["kakao_account"]['email']
    request.session["user_name"] = user_info["kakao_account"]['profile']["nickname"]
    request.session["user_age"] = user_info["kakao_account"]['age_range']
        
    encoded_user_info = quote(str(request.session["user_name"]))
    login_url_scheme = f"hplog://callback?user_info={encoded_user_info}"

    return RedirectResponse(login_url_scheme)

@app.get("/kakao/logout")
async def kakao_logout(request: Request):
    # 로그아웃 처리를 위한 Kakao API 엔드포인트
    logout_endpoint = f"https://kauth.kakao.com/oauth/logout?client_id={KAKAO_CLIENT_ID}&logout_redirect_uri={LOGOUT_REDIRECT_URI}"
    return RedirectResponse(logout_endpoint)
    
@app.get("/kakao/logout_callback")
async def kakao_logout_callback(request: Request):
    request.session.pop("user_email", None)
    request.session.pop("user_name", None)
    request.session.pop("access_token", None)
    return {"message": "로그아웃 되었습니다."}

@app.get("/")
async def root(request: Request):
    return templates.TemplateResponse("login.html",{"request": request})

@app.get("/kakao")
async def root(request: Request):
    return templates.TemplateResponse("login.html",{"request": request})