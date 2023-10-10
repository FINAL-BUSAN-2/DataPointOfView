import React from 'react';
import {View, Image, ImageSourcePropType, StyleSheet} from 'react-native';

const LogoComponent: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* 2.png 이미지 추가 */}
      <Image
        source={require('./android/app/src/img/red.png')} // 이미지 파일의 경로를 지정
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
  },
});

export default LogoComponent;
