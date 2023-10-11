import React, {useEffect, useState} from 'react';
import {View, Text, Linking} from 'react-native';
import LogoComponent from './logo'; // ./logo.js 파일을 가져옴
import LoginComponent from './login'; // ./login.js 파일을 가져옴
import FirstScreenComponent from './Main';

function App() {
  const [isLogoVisible, setLogoVisible] = useState(true);
  const [isLogin, setLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 상태 추가

  useEffect(() => {
    // 1초 후에 로고 화면을 숨기고 로그인 화면 보이기
    const timer = setTimeout(() => {
      setLogoVisible(false);
    }, 1000); // 1초 지연

    // URL 스키마 이벤트 핸들러 등록
    Linking.addEventListener('url', handleOpenURL);

    return () => {
      clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 해제
      Linking.removeEventListener('url', handleOpenURL); // 이벤트 리스너 해제
    };
  }, []);

  // URL 스키마 처리
  const handleOpenURL = event => {
    const url = event.url;

    // URL 디코딩을 통해 사용자 정보 추출
    const decodedUserInfo = decodeURIComponent(url.split('?user_info=')[1]);

    // 추출된 사용자 정보를 상태에 설정
    setUserInfo(decodedUserInfo);
    // 로그인 상태를 설정 (예를 들어, 사용자 정보가 있으면 로그인 상태로 간주)
    setLogin(true);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {isLogoVisible ? (
        // 로고 화면을 표시
        <LogoComponent />
      ) : isLogin ? (
        // 사용자가 로그인한 경우 다른 컴포넌트 표시 (사용자 정보를 전달할 수 있음)
        <FirstScreenComponent userInfo={userInfo} />
      ) : (
        // 사용자가 로그인하지 않은 경우 로그인 화면 표시
        <LoginComponent />
      )}
    </View>
  );
}

export default App;
