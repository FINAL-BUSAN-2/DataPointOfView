import React from 'react';
import { View, Text } from 'react-native';

const LoginComponent: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={{
          fontSize: 24,
          color: 'black',
        }}>
        임시 reactnative프로젝트 로그인 화면
      </Text>
    </View>
  );
};

export default LoginComponent;
