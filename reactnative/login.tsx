import React from 'react';
import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import {Linking} from 'react-native';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';

// Google OAuth 초기화
GoogleSignin.configure({
  webClientId: '335024674100-34lg9kdndggc4k4a9tpbv5dg5kqrk3k8.apps.googleusercontent.com',
});

// Google 로그인 함수
const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    // 로그인이 성공하면 Google OAuth에서 반환된 사용자 정보를 사용할 수 있음
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // 사용자가 로그인을 취소한 경우 처리
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // 이미 로그인 진행 중인 경우 처리
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // Play 서비스를 사용할 수 없는 경우 처리
    } else {
      // 그 외의 오류 처리
    }
  }
};


const kakao_url = 'http://3.34.178.43:3344/kakao/login';

const App = () => {
  const kakaoPress = () => {
    Linking.openURL(kakao_url);
  };
  const googlePress = () => {
    signInWithGoogle();
  };
  const naverPress = () => {
    Alert.alert('네이버 로그인', '추후 구현 예정');
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}>
      <Text
        style={{
          fontSize: 32,
          marginBottom: 20,
          height: 50,
        }}>
        HP-log 로그인
      </Text>
      <TouchableOpacity
        onPress={kakaoPress}
        style={{width: 315, height: 75, margin: 10}}>
        <Image
          source={require('./images/login/kakao_login_large_narrow.png')}
          style={{width: '100%', height: '100%'}}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={naverPress}
        style={{width: 315, height: 75, margin: 10}}>
        <Image
          source={require('./images/login/naver_login.png')}
          style={{width: '100%', height: '100%', borderRadius: 12}}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={googlePress}
        style={{width: 330, height: 80, margin: 6}}>
        <Image
          source={require('./images/login/google_login.png')}
          style={{width: '100%', height: '100%'}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default App;