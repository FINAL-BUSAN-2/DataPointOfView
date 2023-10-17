import React, {useEffect, useState} from 'react';
import {View, Text, Linking} from 'react-native';
import LogoComponent from './logo'; // ./logo.js 파일을 가져옴
import LoginComponent from './login'; // ./login.js 파일을 가져옴
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Main from './Main';
import Health from './Health';
import pill from './pill';
import Etc from './Etc';
import HplogSet from './hplogset';
import Access from './Access';
import Social from './Social';
import ChallengeInfo from './ChallengeInfo';

const Stack = createStackNavigator();

function App() {
  const [isLogoVisible, setLogoVisible] = useState(true);
  const [isLogin, setLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 상태 추가

  function SetWrapper(props) {
    return (
      <HplogSet
        {...props}
        userInfo={userInfo}
        setLogin={setLogin}
        setUserInfo={setUserInfo}
      />
    );
  }

  function MainWrapper(props) {
    return (
      <Main
        {...props}
        userInfo={userInfo}
        setLogin={setLogin}
        setUserInfo={setUserInfo}
      />
    );
  }

  function SocialWrapper(props) {
    return (
      <Social
        {...props}
        userInfo={userInfo}
        setLogin={setLogin}
        setUserInfo={setUserInfo}
      />
    );
  }

  useEffect(() => {
    // 1초 후에 로고 화면을 숨기고 로그인 화면 보이기
    const timer = setTimeout(() => {
      setLogoVisible(false);
    }, 1000); // 1초 지연

    // URL 스키마 이벤트 핸들러 등록
    const subscription = Linking.addEventListener('url', handleOpenURL);

    return () => {
      clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 해제
      subscription.remove(); // 이벤트 리스너 해제
    };
  }, []);

  // URL 스키마 처리
  const handleOpenURL = event => {
    const url = event.url;

    // URL 디코딩을 통해 사용자 정보 추출
    const decodedUserInfo = decodeURIComponent(url.split('?user_info=')[1]);

    // 추출된 사용자 정보를 상태에 설정하고 로그인 상태로 변경합니다.
    setUserInfo(decodedUserInfo);
    setLogin(true);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isLogoVisible ? (
          <Stack.Screen name="Logo" component={LogoComponent} />
        ) : !isLogin ? (
          <Stack.Screen name="Login" component={LoginComponent} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainWrapper} />
            <Stack.Screen name="hplogset" component={SetWrapper} />
            <Stack.Screen name="Health" component={Health} />
            <Stack.Screen name="pill" component={pill} />
            <Stack.Screen name="Etc" component={Etc} />
            <Stack.Screen name="Access" component={Access} />
            <Stack.Screen name="Social" component={SocialWrapper} />
            <Stack.Screen name="ChallengeInfo" component={ChallengeInfo} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
