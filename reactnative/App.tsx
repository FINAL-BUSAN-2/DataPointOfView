import React, {useEffect, useState} from 'react';
import {View, Text, Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/elements';

import LogoComponent from './logo'; // ./logo.js 파일을 가져옴
import LoginComponent from './login'; // ./login.js 파일을 가져옴
import Main from './Main';
import Health from './Health';
import Pill from './Pill';
import Etc from './Etc';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Logo"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Logo" component={LogoComponent} />
        <Stack.Screen name="Login" component={LoginComponent} />
        <Stack.Screen name="Main" component={Main} />
        {/* Main 컴포넌트에 page의 로직이 포함되어 있어야 함 */}
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
};

export default App;
