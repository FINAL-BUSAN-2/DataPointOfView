import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import LogoComponent from './logo'; // ./logo.js 파일을 가져옴
import LoginComponent from './login';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/elements';
import Main from './Main';
import Health from './Health';
import pill from './pill';
import test2 from './test2';

const Stack = createStackNavigator();

const LocalMain = () => {
  const [isLogoVisible, setLogoVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoVisible(false);
    }, 1500); // 1.5초 지연

    return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 해제
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {isLogoVisible ? (
        // 로고 화면을 표시
        <LogoComponent />
      ) : (
        // 로그인 화면을 표시
        <LoginComponent />
      )}
    </View>
  );
};

const App = () => {
  return (
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
          name="pill"
          component={pill}
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
          name="test2"
          component={test2}
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
};

export default App;
