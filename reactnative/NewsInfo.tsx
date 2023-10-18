import React, {Component, useEffect, useState} from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackPageList} from './CommonType';

type NewsInfoProps = {
  navigation: StackNavigationProp<RootStackPageList, 'NewsInfo'>;
};

const NewsInfo: React.FC<NewsInfoProps> = ({navigation}) => {
  const handleBackPress = () => {
    navigation.goBack();
  };
  // 개인 페이지 이동 함수
  const movetest3 = () => {
    navigation.navigate('Access');
  };
  // 소셜 페이지 이동 함수
  const movetest4 = () => {
    navigation.navigate('Social');
  };

  const goHplogSet = async () => {
    navigation.navigate('hplogset');
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleBackPress()}>
            <Text style={styles.backButton}>{'<'}</Text>
          </TouchableOpacity>
        </View>
        {/* 네비게이션바 */}
        <View style={styles.navBarContainer}>
          {/* 소셜 */}
          <TouchableOpacity onPress={movetest4}>
            <View style={styles.upTab}>
              <Image
                source={require('./android/app/src/img/thumb_up.png')}
                style={styles.upIcon}
              />
              <Text>소셜</Text>
            </View>
          </TouchableOpacity>
          {/* 홈 */}
          <TouchableOpacity
            onPress={() => {
              console.log('호잇');
              navigation.reset({
                index: 0,
                routes: [{name: 'Main'}],
              });
            }}>
            <View style={styles.homeTab}>
              <Image
                source={require('./android/app/src/img/home.png')}
                style={styles.homeIcon}
              />
              <Text style={styles.homeText}>홈</Text>
            </View>
          </TouchableOpacity>
          {/* 개인 */}
          <TouchableOpacity onPress={movetest3}>
            <View style={styles.accTab}>
              <Image
                source={require('./android/app/src/img/accessibility.png')}
                style={styles.accIcon}
              />
              <Text>개인</Text>
            </View>
          </TouchableOpacity>
        </View>
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

  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },

  navBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    elevation: 50, // for Android
  },

  // 추천
  upTab: {
    alignItems: 'center',
    justifyContent: 'center',
    left: 15,
  },

  // 추천 아이콘
  upIcon: {
    width: 35,
    height: 35,
  },

  homeTab: {
    bottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(43,58,85,0.7)',
  },

  homeIcon: {
    width: 80,
    height: 80,
  },

  homeText: {
    bottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },

  accTab: {
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
  },

  accIcon: {
    width: 35,
    height: 35,
  },
});

export default NewsInfo;
