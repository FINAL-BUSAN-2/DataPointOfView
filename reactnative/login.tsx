import React from 'react';
import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import {Linking} from 'react-native';

const kakao_url = 'http://43.200.178.131:3344/kakao/login';

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
        backgroundColor: '#fff',
      }}>
      <Image
        source={require('./android/app/src/img/logorec.png')}
        style={{
          width: '45%',
          height: '20%',
          marginBottom: '15%',
        }}
      />
      <View style={{alignItems: 'center', top: 50}}>
        <Text
          style={{
            fontSize: 24,
            marginBottom: 10,
            height: 50,
            color: 'rgb(171,170,170)',
          }}>
          웰 라 벨 로그인
        </Text>
        <TouchableOpacity
          onPress={kakaoPress}
          style={{width: 315, height: 75, margin: 10}}>
          <Image
            source={require('./images/login/kakao_login_large_narrow.png')}
            style={{width: '100%', height: '100%'}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;
