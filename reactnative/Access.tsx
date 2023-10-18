import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackPageList} from './CommonType';
import Daily from './daily';

// 화면 관리
type AccessProps = {
  // Access의 Stack Navigation에 속해있음을 의미
  // 다른 화면으로 전환 혹은 스택 내의 화면 관리
  navigation: StackNavigationProp<RootStackPageList, 'Access'>;
  // 로그인된 사용자의 정보를 문자열 형태로 저장
  userInfo: string;
  // 로그인 상태를 변경시킬 수 있음(boolean값)
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  // 사용자 정보를 변경시킬 수 있음
  setUserInfo: React.Dispatch<React.SetStateAction<string | null>>;
};

// React 함수 컴포넌트 정의
const Access: React.FC<AccessProps> = ({userInfo}) => {
  // useNavigation을 사용해 navigation prop을 가져옴
  const navigation =
    useNavigation<StackNavigationProp<RootStackPageList, 'Access'>>();
  // 환경설정 페이지 이동 함수
  const goHplogSet = async () => {
    navigation.navigate('hplogset');
  };
  return (
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
          <Text style={styles.title}>HP-log / {userInfo}님</Text>
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

      <Daily />

      {/* 네비게이션바 */}
      <View style={styles.navBarContainer}>
        {/* 추천 */}
        <View style={styles.upTab}>
          <Image
            source={require('./android/app/src/img/thumb_up.png')}
            style={styles.upIcon}
          />
          <Text>추천</Text>
        </View>
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
        <View style={styles.accTab}>
          <Image
            source={require('./android/app/src/img/accessibility.png')}
            style={styles.accIcon}
          />
          <Text>개인</Text>
        </View>
      </View>
    </View>
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
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80,
  },
  // 앱 이름
  title: {
    fontSize: 23,
    fontWeight: 'bold',
  },

  // 탭 스크린
  tabcontainer: {},
  // daily 스크린
  tabdaily: {},
  // daily 스크린
  tabmonthly: {},

  //네비게이션바
  navBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '10%',
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
  // 홈
  homeTab: {
    bottom: 25,
    width: 90,
    height: 90,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(43,58,85,0.7)',
  },
  // 홈 아이콘
  homeIcon: {
    width: 60,
    height: 60,
  },
  // 홈 텍스트
  homeText: {
    bottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // 개인
  accTab: {
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
  },
  // 개인 아이콘
  accIcon: {
    width: 35,
    height: 35,
  },
});
export default Access;
