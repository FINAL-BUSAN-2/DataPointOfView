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
import {ScrollView} from 'react-native-gesture-handler';

type HplogSetProps = {
  navigation: StackNavigationProp<RootStackPageList, 'hplogset'>;
  userName: string;
  userEmail: string;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
};

const HplogSet: React.FC<HplogSetProps> = ({
  navigation,
  userName,
  userEmail,
  setLogin,
  setUserName,
  setUserEmail,
}) => {
  const [showSubButtons, setShowSubButtons] = useState(false);

  const toggleSubButtons = () => {
    setShowSubButtons(!showSubButtons);
  };

  const notyetPress = () => {
    Alert.alert('아직', '미구현');
  };

  const logOut = async () => {
    try {
      const response = await fetch('http://43.200.178.131:3344/kakao/logout');

      if (response.ok) {
        const data = await response.json();
        if (data && data.message) {
          Alert.alert('message', data.message); // "로그아웃 되었습니다." 메시지 표시
          setLogin(false);
          setUserName(null);
          setUserEmail(null);
        }
      } else {
        console.error('로그아웃 오류:', response.status);
        Alert.alert('로그아웃 오류', '로그아웃 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('네트워크 오류:', error);
      Alert.alert('네트워크 오류', '네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* 앱 로고 및 이름 */}
          <View style={styles.leftContainer}>
            {/* 로고 클릭 이벤트 */}
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
            {/* 알림 아이콘 */}
            <Image
              source={require('./android/app/src/img/notification.png')}
              style={{
                width: 30,
                height: 30,
              }}
            />
            {/* 환경설정 아이콘 */}

            <Image
              source={require('./android/app/src/img/settings.png')}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </View>
        </View>
        <View style={styles.settingTop}>
          <Text style={styles.settingTopText}>환경설정</Text>
        </View>
        <ScrollView>
          <View style={styles.scroll}>
            <TouchableOpacity
              onPress={toggleSubButtons}
              style={styles.settButton}>
              <Text style={styles.buttonText}>화면 디자인 변경</Text>
            </TouchableOpacity>
            {showSubButtons && (
              <View style={styles.themesection}>
                <TouchableOpacity style={styles.themeButton1}>
                  <Text>1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.themeButton2}>
                  <Text>2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.themeButton3}>
                  <Text>3</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.themeButton4}>
                  <Text>4</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={logOut} style={styles.settButton}>
              <Text style={styles.buttonText}>로그아웃</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={notyetPress} style={styles.settButton}>
              <Text style={styles.buttonText}>회원정보 수정</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={notyetPress} style={styles.settButton}>
              <Text style={styles.buttonText}>탈퇴</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    backgroundColor: 'white',
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

  settButton: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 10,
    marginHorizontal: '8%',
  },

  buttonText: {
    fontSize: 20,
    color: 'black',
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
  // 아티클
  articleTab: {
    flex: 3,
    width: 70,
    left: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  // 홈
  homeTab: {
    flex: 3,
    width: 70,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeTab2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 홈 이모지
  homeemoji: {
    fontSize: 25,
  },
  // 개인
  accTab: {
    flex: 3,
    width: 70,
    right: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  navarticleText: {
    fontSize: 13,
    // fontWeight: 'bold',
    color: 'black',
  },

  settingTop: {margin: '8%'},

  settingTopText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 28,
    fontWeight: '700',
  },

  themesection: {
    marginHorizontal: '8%',
  },

  themeButton1: {
    backgroundColor: 'white',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: '2%',
    height: 70,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgb(231,230,230)',
  },

  themeButton2: {
    backgroundColor: 'white',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: '2%',
    height: 70,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgb(231,230,230)',
  },

  themeButton3: {
    backgroundColor: 'white',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: '2%',
    height: 70,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgb(231,230,230)',
  },

  themeButton4: {
    backgroundColor: 'white',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: '2%',
    height: 70,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgb(231,230,230)',
  },

  scroll: {
    marginBottom: '15%',
  },
});

export default HplogSet;
