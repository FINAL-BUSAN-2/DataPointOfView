import React, {Component, useEffect, useState} from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackPageList} from './CommonType';

type SocialProps = {
  navigation: StackNavigationProp<RootStackPageList, 'Social'>;
  userInfo: string;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setUserInfo: React.Dispatch<React.SetStateAction<string | null>>;
};

const Social: React.FC<SocialProps> = ({navigation, userInfo}) => {
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

  const challengeInfo = async () => {
    navigation.navigate('ChallengeInfo');
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* 앱 로고 및 이름 */}
          <View style={styles.leftContainer}>
            <TouchableOpacity
              onPress={() => {
                console.log('제발');
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Main'}],
                });
              }}>
              <Image
                source={require('./android/app/src/img/red.png')}
                style={{
                  width: 45,
                  height: 45,
                  marginRight: 16,
                }}
              />
            </TouchableOpacity>
            <Text style={styles.title}>HP-log / {userInfo}님</Text>
          </View>
          {/* 우측 상단 */}
          <View style={styles.rightContainer}>
            {/* 달력 아이콘 */}
            <Image
              source={require('./android/app/src/img/calendar.png')}
              style={{
                width: 30,
                height: 30,
                right: 20,
              }}
            />

            {/* 알림 아이콘 */}
            <Image
              source={require('./android/app/src/img/notification.png')}
              style={{
                width: 30,
                height: 30,
                right: 10,
              }}
            />

            {/* 환경설정 아이콘 */}
            <TouchableOpacity onPress={goHplogSet}>
              <Image
                source={require('./android/app/src/img/settings.png')}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* 챌린지 랭크 */}
        <View style={styles.challengeRank}>
          <View style={styles.challengeRankTitle}>
            <Text style={styles.challengeText}>Top rank</Text>
          </View>
          <View style={styles.rankButtonGroup}>
            <TouchableOpacity style={styles.rankButton} onPress={challengeInfo}>
              <Text style={styles.bestChallengeText}>1위</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rankButton} onPress={challengeInfo}>
              <Text style={styles.bestChallengeText}>2위</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rankButton} onPress={challengeInfo}>
              <Text style={styles.bestChallengeText}>3위</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bestChallenge}>
          <TouchableOpacity style={styles.bestChallengeButton}>
            <Text style={styles.bestChallengeText}>카테고리별 인기 챌린지</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bestChallengeButton}>
            <Text style={styles.bestChallengeText}>카테고리별 인기 챌린지</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bestChallengeButton}>
            <Text style={styles.bestChallengeText}>카테고리별 인기 챌린지</Text>
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
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 23,
    fontWeight: 'bold',
  },

  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80,
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

  challengeRank: {
    height: 300,
    backgroundColor: 'rgb(245,235,224)',
    borderWidth: 1,
    borderColor: 'black',
    margin: 20,
    borderRadius: 20,
  },

  challengeRankTitle: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
  },

  challengeText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },

  rankButtonGroup: {
    justifyContent: 'space-between',
    padding: 10,
    flex: 1,
  },

  rankButton: {
    width: '100%',
    height: '30%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
  },

  bestChallenge: {
    backgroundColor: 'rgb(245,235,224)',
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
  },

  bestChallengeButton: {
    backgroundColor: 'rgb(245,235,224)',
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
  },

  bestChallengeText: {
    textAlign: 'center',
  },
});

export default Social;
