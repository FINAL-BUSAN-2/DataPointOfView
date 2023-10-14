import React, {Component, useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackPageList} from './CommonType';
import axios from 'axios';

type HplogSetProps = {
  navigation: StackNavigationProp<RootStackPageList, 'hplogset'>;
  userInfo: string;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setUserInfo: React.Dispatch<React.SetStateAction<string | null>>;
};

const HplogSet: React.FC<HplogSetProps> = ({
  navigation,
  userInfo,
  setLogin,
  setUserInfo,
}) => {
  const handleBackPress = () => {
    navigation.goBack();
  };

  const notyetPress = () => {
    Alert.alert('아직', '미구현');
  };

  const logOut = async () => {
    try {
      const response = await axios.get('http://3.34.178.43:3344/kakao/logout');

      if (response.data && response.data.message) {
        Alert.alert('message', response.data.message); // "로그아웃 되었습니다." 메시지 표시
        setLogin(false);
        setUserInfo(null);
      }
    } catch (error) {
      Alert.alert('로그아웃 오류', '로그아웃 중 문제가 발생했습니다.');
    }
  };
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleBackPress()}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TouchableOpacity onPress={notyetPress} style={styles.settButton}>
          <Text style={styles.buttonText}>화면 디자인</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logOut} style={styles.settButton}>
          <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={notyetPress} style={styles.settButton}>
          <Text style={styles.buttonText}>회원정보수정</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={notyetPress} style={styles.settButton}>
          <Text style={styles.buttonText}>탈퇴</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(231,230,230)',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgb(43,58,85)', //rgb(43,58,85)
    borderBottomWidth: 0,
    borderBottomColor: '#ddd',
  },

  settButton: {
    width: '100%',
    height: 100,
    backgroundColor: '#CE7777',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },

  buttonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default HplogSet;
