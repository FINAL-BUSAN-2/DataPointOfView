{/*앱실행>페이지전환 기본코드*/}
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import LogoComponent from './logo'; // ./logo.js 파일을 가져옴
import LoginComponent from './login'; // ./login.js 파일을 가져옴
import TimeComponent from './datetimepicker'

function App() {
  const [isLogoVisible, setLogoVisible] = useState(true);

  useEffect(() => {
    // 1.5초 후에 로고 화면을 숨기고 로그인 화면 보이기
    const timer = setTimeout(() => {
      setLogoVisible(false);
    }, 1500); // 1.5초 지연

    return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 해제
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isLogoVisible ? (
        // 로고 화면을 표시
        <LogoComponent />
      ) : (
        // 로그인 화면을 표시
        <TimeComponent />
      )}
    </View>
  );
}

export default App;