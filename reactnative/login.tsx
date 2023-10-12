import React from 'react';
import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import {Linking} from 'react-native';

const kakao_url = 'http://172.16.10.195:3344/kakao/login';

const App = () => {
  const kakaoPress = () => {
    Linking.openURL(kakao_url);
  };
  const googlePress = () => {
    Alert.alert('구글 로그인', '추후 구현 예정');
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
          source={require('./android/app/src/img/login/kakao_login_large_narrow.png')}
          style={{width: '100%', height: '100%'}}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={naverPress}
        style={{width: 315, height: 75, margin: 10}}>
        <Image
          source={require('./android/app/src/img/login/naver_login.png')}
          style={{width: '100%', height: '100%', borderRadius: 12}}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={googlePress}
        style={{width: 330, height: 80, margin: 6}}>
        <Image
          source={require('./android/app/src/img/login/google_login.png')}
          style={{width: '100%', height: '100%'}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default App;
