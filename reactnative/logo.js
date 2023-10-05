import React from 'react';
import { View, Text, Image } from 'react-native';

const LogoComponent = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {/* 1.png 이미지 추가 */}
      <Image
        source={require('./android/app/src/assets/2.png')} // 이미지 파일의 경로를 지정
        style={{
          width: 300, // 이미지의 너비 설정
          height: 300, // 이미지의 높이 설정
        }}
      />
      {/* <Text
        style={{
          fontSize: 50,
          color: 'black',
        }}>
        HP-log
      </Text>
      <Text
        style={{
          fontSize: 24,
          color: 'black',
        }}>
        Health&Pill log
      </Text> */}
    </View>
  );
};

export default LogoComponent;
