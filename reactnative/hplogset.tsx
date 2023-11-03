import React, {Component, useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackPageList} from './CommonType';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import axios from 'axios';

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
  const [showUpdateMem, setShowUpdateMem] = useState(false);
  const [showSubButtons, setShowSubButtons] = useState(false);
  const [userInfo, setUserInfo] = useState({
    mem_email: '',
    mem_name: '',
    mem_gen: '',
    mem_age: '',
    mem_sday: '',
  });

  const toggleSubButtons = () => {
    setShowSubButtons(!showSubButtons);
  };

  const [gender, setGender] = useState<string | null>(null);

  const changeGender = () => {
    // 현재 상태를 기반으로 다음 상태를 결정
    let nextGender;
    if (gender === 'male') {
      nextGender = 'female';
    } else if (gender === 'female') {
      nextGender = '비공개';
    } else {
      nextGender = 'male';
    }
    setGender(nextGender);
  };

  const [ageRange, setAgeRange] = useState<string | null>(null);

  const changeAgeRange = () => {
    // 현재 상태를 기반으로 다음 상태를 결정
    let nextAgeRange;
    if (ageRange === '0~9') {
      nextAgeRange = '10~19';
    } else if (ageRange === '10~19') {
      nextAgeRange = '20~29';
    } else if (ageRange === '20~29') {
      nextAgeRange = '30~39';
    } else if (ageRange === '30~39') {
      nextAgeRange = '40~49';
    } else if (ageRange === '40~49') {
      nextAgeRange = '50~59';
    } else if (ageRange === '50~59') {
      nextAgeRange = '60~69';
    } else if (ageRange === '60~69') {
      nextAgeRange = '70~79';
    } else if (ageRange === '70~79') {
      nextAgeRange = '80~89';
    } else if (ageRange === '80~89') {
      nextAgeRange = '90~99';
    } else {
      nextAgeRange = '0~9';
    }
    setAgeRange(nextAgeRange);
  };

  const displayGender = (() => {
    switch (gender) {
      case 'male':
        return '남성';
      case 'female':
        return '여성';
      case '비공개':
        return '비공개';
      default:
        return gender;
    }
  })();

  const updateMem = async () => {
    const response = await axios.get(
      `http://43.200.178.131:3344/getMemInfo/?userEmail=${userEmail}`,
    );
    console.log('응답 데이터:', response.data);

    const newUserInfo = {
      mem_email: response.data.mem_email,
      mem_name: response.data.mem_name,
      mem_gen: response.data.mem_gen,
      mem_age: response.data.mem_age,
      mem_sday: response.data.mem_sday,
    };

    setUserInfo(newUserInfo); // userInfo 업데이트
    setGender(newUserInfo.mem_gen);
    if (newUserInfo.mem_gen === null) {
      setGender('비공개');
    } else {
      setGender(newUserInfo.mem_gen);
    }
    setAgeRange(newUserInfo.mem_age);
    setShowUpdateMem(true);
  };

  const goHplogSet = async () => {
    navigation.navigate('hplogset');
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

  const saveMemInput = async (gender, ageRange) => {
    try {
      const response = await axios.get(
        `http://43.200.178.131:3344/saveMemInput?userEmail=${userEmail}&mem_gen=${gender}&mem_age=${ageRange}`,
      );
      Alert.alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
    setShowUpdateMem(false);
  };

  const handleWithdrawal = () => {
    Alert.alert(
      '탈퇴 확인',
      '정말로 회원 탈퇴하시겠습니까?\n\n탈퇴 시 개인정보는 6개월간 보관됩니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '탈퇴',
          onPress: async () => {
            try {
              const response = await axios.get(
                `http://43.200.178.131:3344/withdrawal?userEmail=${userEmail}`,
              );
              if (response.status === 200) {
                Alert.alert('탈퇴 완료', '탈퇴되었습니다.');
                setLogin(false);
                setUserName(null);
                setUserEmail(null);
              } else {
                Alert.alert('탈퇴 실패', '탈퇴 중에 오류가 발생했습니다.');
              }
            } catch (error) {
              console.error('탈퇴 요청 중 오류 발생: ', error);
              Alert.alert('오류', '탈퇴 중에 오류가 발생했습니다.');
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* 앱 로고 및 이름 */}
          <View style={styles.leftContainer}>
            {/* 알림 아이콘 */}
            <TouchableOpacity>
              <Image
                source={require('./android/app/src/img/notification.png')}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </TouchableOpacity>

            {/* <Text style={styles.title}>웰라밸 / {userName}님</Text> */}
          </View>
          <TouchableOpacity
            onPress={() => {
              console.log('제발');
              navigation.reset({
                index: 0,
                routes: [{name: 'Main'}],
              });
            }}>
            <Image
              source={require('./android/app/src/img/logo.png')}
              style={{
                width: 150,
                height: 50,
                // marginRight: 16,
              }}
            />
          </TouchableOpacity>
          {/* 우측 상단 */}
          <View style={styles.rightContainer}>
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
                  <Text style={{color: 'black'}}>기본</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.themeButton2}>
                  <Text style={{color: 'white'}}>다크모드</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={logOut} style={styles.settButton}>
              <Text style={styles.buttonText}>로그아웃</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={updateMem} style={styles.settButton}>
              <Text style={styles.buttonText}>회원정보 수정</Text>
            </TouchableOpacity>
            {showUpdateMem && (
              <Modal>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>회원 정보 수정</Text>
                    <View style={styles.modalLine}>
                      <Text style={styles.modalKey}>이메일 : </Text>
                      <Text style={styles.modalValue}>
                        {userInfo.mem_email}
                      </Text>
                    </View>
                    <View style={styles.modalLine}>
                      <Text style={styles.modalKey}>닉네임 : </Text>
                      <Text style={styles.modalValue}>{userInfo.mem_name}</Text>
                    </View>
                    <View style={styles.modalLine}>
                      <Text style={styles.modalKey}>성별 : </Text>
                      <TouchableOpacity
                        onPress={changeGender}
                        style={{width: '70%', alignItems: 'center'}}>
                        <Text style={(styles.modalValue, {color: 'gray'})}>
                          {displayGender}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.modalLine}>
                      <Text style={styles.modalKey}>연령대 : </Text>
                      <TouchableOpacity
                        onPress={changeAgeRange}
                        style={{width: '70%', alignItems: 'center'}}>
                        <Text style={(styles.modalValue, {color: 'gray'})}>
                          {ageRange}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.modalLine}>
                      <Text style={styles.modalKey}>가입일 : </Text>
                      <Text style={styles.modalValue}>{userInfo.mem_sday}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => saveMemInput(gender, ageRange)}>
                      <View
                        style={{
                          width: '100%',
                          alignItems: 'center',
                          marginTop: 20,
                        }}>
                        <Text>저장</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}
            <TouchableOpacity
              onPress={() => handleWithdrawal(userEmail)}
              style={styles.settButton}>
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
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // 앱 이름
  title: {
    fontSize: 23,
    fontWeight: 'bold',
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
  },
  // 아티클 이모지
  articleemoji: {
    fontSize: 25,
    color: 'black',
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
    color: 'black',
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
    color: 'black',
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
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: '2%',
    height: 70,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgb(231,230,230)',
  },

  themeButton2: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
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

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },

  modalTitle: {
    color: 'black',
    fontSize: 30,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '700',
  },

  modalLine: {marginVertical: 10, flexDirection: 'row'},

  modalKey: {color: 'black', fontSize: 15, width: '30%'},

  modalValue: {color: 'black', fontSize: 15, width: '70%', textAlign: 'center'},
});

export default HplogSet;
