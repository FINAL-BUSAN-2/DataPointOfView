import React from 'react';
import { View, Text } from 'react-native';

function LoginComponent() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={{
          fontSize: 24,
          color: 'black',
        }}>
        reactnative프로젝트 로그인 화면
      </Text>
    </View>
  );
}

export default LoginComponent;
