import React, {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import LogoComponent from './logo'; // ./logo.js 파일을 가져옴
import LoginComponent from './login'; // ./login.js 파일을 가져옴
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Main from './Main';
import Health from './Health';
import Etc from './Etc';
import HplogSet from './hplogset';
import Access from './Access';
import Social from './Social';
import NewsInfo from './NewsInfo';
import Search from './search';
import Pill from './Pill';

const Stack = createStackNavigator();

function App() {
  const [isLogoVisible, setLogoVisible] = useState(true);
  const [isLogin, setLogin] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
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
    const decodedUserInfo = decodeURIComponent(url.split('?')[1]);
    const decodedUserName = decodedUserInfo.split('&')[0].split('=')[1];
    const decodedUserEmail = decodedUserInfo.split('&')[1].split('=')[1];

    // 추출된 사용자 정보를 상태에 설정하고 로그인 상태로 변경합니다.
    setUserName(decodedUserName);
    setUserEmail(decodedUserEmail);
    setLogin(true);
  };

  function SetWrapper(props) {
    return (
      <HplogSet
        {...props}
        userName={userName}
        userEmail={userEmail}
        setLogin={setLogin}
        setUserName={setUserName}
        setUserEmail={setUserEmail}
      />
    );
  }

  function MainWrapper(props) {
    return (
      <Main
        {...props}
        userName={userName}
        userEmail={userEmail}
        setLogin={setLogin}
        setUserName={setUserName}
        setUserEmail={setUserEmail}
      />
    );
  }
  function AccessWrapper(props) {
    return (
      <Access
        {...props}
        userName={userName}
        userEmail={userEmail}
        setLogin={setLogin}
        setUserName={setUserName}
        setUserEmail={setUserEmail}
      />
    );
  }

  function SocialWrapper(props) {
    return (
      <Social
        {...props}
        userName={userName}
        userEmail={userEmail}
        setLogin={setLogin}
        setUserName={setUserName}
        setUserEmail={setUserEmail}
      />
    );
  }

  function EtcWrapper(props) {
    return <Etc {...props} userName={userName} userEmail={userEmail} />;
  }

  function HealthWrapper(props) {
    return (
      <Health
        {...props}
        userName={userName}
        userEmail={userEmail}
        setLogin={setLogin}
        setUserName={setUserName}
        setUserEmail={setUserEmail}
      />
    );
  }

  function PillWrapper(props) {
    return (
      <Pill
        {...props}
        userName={userName}
        userEmail={userEmail}
        setLogin={setLogin}
        setUserName={setUserName}
        setUserEmail={setUserEmail}
      />
    );
  }

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
            <Stack.Screen name="Health" component={HealthWrapper} />
            <Stack.Screen name="pill" component={PillWrapper} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Etc" component={EtcWrapper} />

            <Stack.Screen name="Access" component={AccessWrapper} />
            <Stack.Screen name="Social" component={SocialWrapper} />
            <Stack.Screen name="NewsInfo" component={NewsInfo} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
