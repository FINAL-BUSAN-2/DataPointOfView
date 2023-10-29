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

type SocialProps = {
  navigation: StackNavigationProp<RootStackPageList, 'Social'>;
  userName: string;
  userEmail: string;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
};

const Social: React.FC<SocialProps> = ({navigation, userName, userEmail}) => {
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

  const newsInfo = async search => {
    try {
      let response = await fetch(
        // 서버
        // `http://43.200.178.131:3344/naver/news/?search=${search}`,
        `http://43.200.178.131:3344/naver/news/?search=${search}`,
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      let data = await response.json();
      console.log(data);
      navigation.navigate('NewsInfo', {newsData: data});
    } catch (error) {
      console.error('Error fetching the news:', error);
      // 추가적인 에러 처리를 여기에 할 수 있습니다.
    }
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
            <Text style={styles.title}>웰라밸 / {userName}님</Text>
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
        <View style={styles.bestChallenge}>
          <Text style={styles.challengeText}>뉴스</Text>
          <View style={styles.bestChallenge1}>
            <TouchableOpacity
              style={styles.bestChallengeButton}
              onPress={() => newsInfo('건강기능식품')}>
              <Text style={styles.bestChallengeText}>건강기능식품</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bestChallengeButton}
              onPress={() => newsInfo('루틴')}>
              <Text style={styles.bestChallengeText}>루틴</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bestChallengeButton}
              onPress={() => newsInfo('헬스케어')}>
              <Text style={styles.bestChallengeText}>헬스케어</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bestChallenge2}>
            <TouchableOpacity
              style={styles.bestChallengeButton}
              onPress={() => newsInfo('건강')}>
              <Text style={styles.bestChallengeText}>건강</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bestChallengeButton}
              onPress={() => newsInfo('운동법')}>
              <Text style={styles.bestChallengeText}>운동법</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bestChallengeButton}
              onPress={() => newsInfo('박성호')}>
              <Text style={styles.bestChallengeText}>박성호</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 네비게이션바 */}
        <View style={styles.navBarContainer}>
          {/* 아티클 */}
          <TouchableOpacity
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Social'}],
              });
            }}>
            <View style={styles.articleTab}>
              <View style={styles.articleTab2}>
                <Text style={styles.articleemoji}>📰</Text>
                <Text style={styles.navarticleText}>아티클</Text>
              </View>
            </View>
          </TouchableOpacity>
          {/* 홈 */}
          <TouchableOpacity
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Main'}],
              });
            }}>
            <View style={styles.homeTab}>
              <View style={styles.homeTab2}>
                <Text style={styles.homeemoji}>🏠</Text>
                <Text style={styles.navText}>홈</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* 개인 */}
          <TouchableOpacity
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Access'}],
              });
            }}>
            <View style={styles.accTab}>
              <View style={styles.accTab2}>
                <Text style={styles.accemoji}>🙋</Text>
                <Text style={styles.navText}>개 인</Text>
              </View>
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

  //네비게이션바
  navBarContainer: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopColor: 'rgb(231,230,230)',
    borderTopWidth: 1,
    height: '8%',
    backgroundColor: '#fff',
    zIndex: 2,
  },
  // 아티클 영역
  articleTab: {
    flex: 3,
    width: 70,
    left: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 아티클 영역2
  articleTab2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 58,
    borderRadius: 35,
    margin: 5,
    backgroundColor: 'rgb(245,235,224)',
  },
  // 아티클 이모지
  articleemoji: {
    fontSize: 25,
  },
  // 아티클 텍스트
  navarticleText: {
    fontSize: 13,
    // fontWeight: 'bold',
    color: 'black',
  },
  // 홈 영역
  homeTab: {
    flex: 3,
    width: 70,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 홈 영역2
  homeTab2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 홈 이모지
  homeemoji: {
    fontSize: 25,
  },
  // 개인 영역
  accTab: {
    flex: 3,
    width: 70,
    right: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 개인 영역2
  accTab2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 개인 이모지
  accemoji: {
    fontSize: 25,
  },
  // 네비게이션 텍스트
  navText: {
    fontSize: 13,
    // fontWeight: 'bold',
    color: 'black',
  },

  challengeRank: {
    height: 300,
    margin: 20,
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
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
  },
  bestChallenge1: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bestChallenge2: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
