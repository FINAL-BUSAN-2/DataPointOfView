import React, {useEffect, useState} from 'react';
import {View, Text, Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/elements';

//컴포넌트 import
import LogoComponent from './logo'; // ./logo.tsx 파일을 가져옴
import LoginComponent from './login'; // ./login.tsx 파일을 가져옴
import Main from './Main'; //Main.tsx 메인화면
import Health from './Health'; //Health.tsx 건강루틴추가
import Pill from './Pill'; //Pill.tsx 영양루틴추가
import Etc from './Etc'; // Etc.tsx 기타루틴추가

const Stack = createStackNavigator();

function App() {
  const [isLogoVisible, setLogoVisible] = useState(true);
  const [isLogin, setLogin] = useState(false); //true일경우 로그인상태
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
        <Main userInfo={userInfo} />
      ) : (
        // 사용자가 로그인하지 않은 경우 로그인 화면 표시
        <LoginComponent />
      )}
    </View>

<NavigationContainer>
<Stack.Navigator screenOptions={{headerShown: false}}>
  <Stack.Screen name="LocalMain" component={LocalMain} />
  <Stack.Screen name="Main" component={Main} />
  <Stack.Screen
    name="Health"
    component={Health}
    options={({navigation}) => ({
      headerShown: true,
      headerLeft: props => (
        <HeaderBackButton
          {...props}
          onPress={() => navigation.goBack()}
        />
      ),
      headerTitle: '건강 루틴 추가',
    })}
  />
  <Stack.Screen
    name="Pill"
    component={Pill}
    options={({navigation}) => ({
      headerShown: true,
      headerLeft: props => (
        <HeaderBackButton
          {...props}
          onPress={() => navigation.goBack()}
        />
      ),
      headerTitle: '영양 루틴 추가',
    })}
  />
  <Stack.Screen
    name="Etc"
    component={Etc}
    options={({navigation}) => ({
      headerShown: true,
      headerLeft: props => (
        <HeaderBackButton
          {...props}
          onPress={() => navigation.goBack()}
        />
      ),
      headerTitle: '기타 루틴 추가',
    })}
  />
</Stack.Navigator>
</NavigationContainer>




  );
}

export default App;
