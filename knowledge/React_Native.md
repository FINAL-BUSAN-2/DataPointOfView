<div align="right">
<a href="https://github.com/FINAL-BUSAN-2/DataPointOfView/tree/develop#2-%ED%8C%80-%EA%B5%AC%EC%84%B1--role">메인 화면 이동</a>
</div>
<br>

<a id ="mini_home"></a>
* [React Native Windows - Android](#rn_and)
* [React Native Mac - IOS](#rn_ios)

<br><br>

<a id="rn_and"></a>

# React Native 세팅 (Windows)

<br>

## 0. React Native 공식 가이드라인 참고

> https://reactnative.dev/docs/environment-setup?guide=native

## 1. window package 관리자 설정(powershell 에서 실행) (https://chocolatey.org/install#individual)

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

## 2. node.js lts 버전 설치, openjdk 설치

```powershell
# PowerShell 관리자 권한으로 실행하여 아래 명령어 작성
choco install -y nodejs-lts microsoft-openjdk11
```

## 3. Java 경로 확인

```
윈도우 메뉴 에서 내 PC 검색 후 > 속성 클릭 > 오른쪽 상당 고급 시스템 설정 클릭 > 고급 탭에서 환경변수 버튼 클릭 > 시스템 변수(s) 컴포넌트에서 Path 변수 클릭 > C:\Program Files\Microsoft\jdk-11.0.20.8-hotspot\bin 확인
```

## 4. Android Studio 설치


1. 크롬에서 해당 경로로 이동
(https://developer.android.com/studio)

2. 웹 화면에 초록색 다운로드 버튼 클릭 (Downlopad Android Studio Giraffe) 후 맨 밑에 agree 후 다운


## 5. Hyper-V setting 

> 참고 : https://android-developers.googleblog.com/2018/07/android-emulator-amd-processor-hyper-v.html

1. 윈도우 제어판 들어가기 (시작 메뉴에서 제어판 검색)
2. 프로그램 제거로 들어가기
3. 왼쪽 windows 기능 켜기/끄기 클릭
4. Windows 하이퍼바이저 플랫폼 또는 Windows Hypervisor Platform 체크 후 완료

## 6. Android Studio 에서 가상 기기 만들기

> 참고 : https://developer.android.com/studio/run/managing-avds?hl=ko

1. Android Studio 를 실행했을 때 Welcoe to Android Studio 에서 More Actions 선택 후 Virtual Device Manager 선택
2. Create Virtual Device... 선택
3. Pixel 2 선택 후 Next
4. x86 Images 선택 후 Tiramisu (Extension Level 5) Download(이름 옆 다운로드 아이콘 클릭)
5. Next 후 AVD Name 에 적당한 이름으로 지어준 후 finish
6. Actions 탭 에서 실행 버튼 클릭 후 예뮬레이터 실행
7. 동작 확인 완료 후 예뮬레이터 종료

## 7. Android SDK 환경 변수 설정


1. 윈도우 메뉴 에서 내 PC 검색 후
2. 속성 클릭
3. 오른쪽 상당 고급 시스템 설정 클릭
4. 고급 탭에서 환경변수 버튼 클릭
5. xxx 에 대한 사용자 변수(U) 컴포넌트에서 새로 만들기
6. 변수 이름 : ANDROID_HOME / 변수 값 : C:\Users\컴퓨터이름\AppData\Local\Android\Sdk 기입 후 확인
7. Power Shell 에서 아래와 같이 작성하여 환경 변수가 잘 적용 됐는지 확인
```powershell
Get-ChildItem -Path Env:\
```

## 8. Path 에 Android platform-tools 추가

1. 윈도우 메뉴 에서 내 PC 검색 후 
2. 속성 클릭
3. 오른쪽 상당 고급 시스템 설정 클릭 
4. 고급 탭에서 환경변수 버튼 클릭 
5. 시스템 변수(s) 컴포넌트에서 Path 변수 클릭 
6. 편집 클릭 
7. 새로 만들기 후 C:\Users\컴퓨터이름\AppData\Local\Android\Sdk\platform-tools 기입 
8. 확인

## 9. 바탕화면 Git 폴더에 React_test 폴더 생성
## 10. visual studio code 실행 후 React_test 폴더 오픈
## 11.  ctrl + ~ 터미널 open
## 12. 미리 설치 돼 있는 react-native 제거

```powershell
npm uninstall -g react-native-cli @react-native-community/cli
```

## 13. React-native 프로젝트 생성

```powershell
npx react-native@latest init testProject
```

## 14. vscode 에서 ctrl + ~ 터미널 open 해서 "cd testProject" 프로젝트 디렉토리 진입 후 npm start (React Native Metro 실행)

## 15. npm start 후 영어 a - 키 입력

<div align="right">
<a href="https://github.com/FINAL-BUSAN-2/DataPointOfView/tree/develop#2-%ED%8C%80-%EA%B5%AC%EC%84%B1--role">메인 화면 이동</a>
<br>

[목차로 이동](#mini_home)


</div>
<br>
<br><br>



<a id="rn_ios"></a>
# React Native 세팅 (Mac)

<br>

## 1. Home-brew 설치

```zsh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## 2. 노드 설치

```zsh
brew install node
```

## 3. 워치맨 설치

```zsh
brew install watchman
```

## 4. 루비 설치

```zsh
brew install rbenv ruby-build
```

## 5. 루비 버전 세팅

```zsh
rbenv init
echo `eval "$(rbenv init - zsh)"` >> ~/.zshrc
rbenv install -l  # (최신 버전 설치)
rbenv global version
```


## 6. cocoapods 설치

```zsh
sudo gem install cocoapods
```


## 7. pod install

```zsh
cd ios
pod install
```
```zsh
# 에러시 아래 버전 변경 후 실행
sudo gem uninstall activesupport
sudo gem install activesupport -v 7.0.8
```

## 8. 프로젝트 npm install 또는 init

## 9. 프로젝트 실행

```zsh
npm start 
# 이 후 i

# simulator boot error 시

# Simulator를 열고 Settings -> 'Simulator lifetime' 에서 When Simulator starts boots the most recently used simulator 체크해제 후 실행
```

<div align="right">
<a href="https://github.com/FINAL-BUSAN-2/DataPointOfView/tree/develop#2-%ED%8C%80-%EA%B5%AC%EC%84%B1--role">메인 화면 이동</a>
<br>

[목차로 이동](#mini_home)


</div>


