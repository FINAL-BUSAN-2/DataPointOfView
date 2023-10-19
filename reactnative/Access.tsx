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
                marginLeft: 16,
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

      {/* 유저 정보 */}
      <View style={styles.userinfo}>
        <Text style={styles.usertext}>{userInfo}님의 오늘의 기록</Text>
      </View>

      {/* 바디 */}
      <View style={styles.body}>
        <Image
          source={require('./android/app/src/img/staticbody.png')}
          style={styles.bodyimg}
        />
      </View>

      <View style={styles.line}></View>

      {/* 통계 */}
      <View style={styles.titlecontainer}>
        <View style={styles.titlehealth}>
          <Text style={styles.titletext}>운동 통계</Text>
        </View>
        <View style={styles.titlepill}>
          <Text style={styles.titletext}>영양 통계</Text>
        </View>
        <View style={styles.titleetc}>
          <Text style={styles.titletext}>건강 통계</Text>
        </View>
      </View>
      <View style={styles.statistics}>
        <View style={styles.chart}>
          <Image
            source={require('./android/app/src/img/cat.jpg')}
            style={styles.chartimg}
          />
          <Image
            source={require('./android/app/src/img/cat.jpg')}
            style={styles.chartimg}
          />
          <Image
            source={require('./android/app/src/img/cat.jpg')}
            style={styles.chartimg}
          />
        </View>
        <View style={styles.statisticstextbox}>
          <Text style={styles.recotext}>
            👍 : "비타민"을(를) 섭취하시는 걸 추천드려요
          </Text>
          <Text style={styles.recoproducttext}>
            ㄴ추천 제품 : "레모나","아이셔","레몬"
          </Text>
          <Text style={styles.cautiontext}>
            ❗ : "제품A"와 "제품B"같이 섭취 시
          </Text>
          <Text style={styles.cautiontext2}>부작용이 있을 수 있어요!</Text>
        </View>
      </View>

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
        <TouchableOpacity
          onPress={() => {
            console.log('가자');
            navigation.reset({
              index: 0,
              routes: [{name: 'Access'}],
            });
          }}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flex: 1.3,
    backgroundColor: '#fff',
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
  // 앱 이름
  title: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80,
    right: 20,
  },
  // user 정보
  userinfo: {
    flex: 1,
  },
  usertext: {
    fontSize: 18,
    alignSelf: 'center',
    color: 'black',
    fontWeight: 'bold',
  },

  // 바디
  body: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyimg: {
    width: '65%',
    height: '110%',
    bottom: 10,
  },

  // 선
  line: {
    width: '80%',
    height: 2,
    backgroundColor: 'rgb(231,230,230)',
    alignSelf: 'center',
    top: 5,
  },

  // 통계제목 영역
  titlecontainer: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    top: 10,
  },
  // 운동 타이틀
  titlehealth: {
    width: '25%',
    height: '120%',
    borderWidth: 4,
    borderColor: 'rgb(231,230,230)',
    borderRadius: 15,
    backgroundColor: '#fff',
    right: 5,
    zIndex: 2,
  },
  // 영양 타이틀
  titlepill: {
    width: '25%',
    height: '120%',
    borderWidth: 4,
    borderColor: 'rgb(231,230,230)',
    borderRadius: 15,
    backgroundColor: '#fff',
    zIndex: 2,
  },
  // 건강 타이틀
  titleetc: {
    width: '25%',
    height: '120%',
    borderWidth: 4,
    borderColor: 'rgb(231,230,230)',
    borderRadius: 15,
    left: 5,
    backgroundColor: '#fff',
    zIndex: 2,
  },
  // 타이틀 텍스트
  titletext: {
    fontSize: 16,
    alignSelf: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  // 통계 영역
  statistics: {
    flex: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: '20%',
    zIndex: 1,
  },
  // 차트 영역
  chart: {
    flex: 5,
    width: '80%',
    borderWidth: 5,
    borderColor: 'rgb(231,230,230)',
    borderRadius: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // 차트 이미지
  chartimg: {
    top: 20,
    width: '28%',
    height: '70%',
    borderRadius: 20,
  },

  // 통계 텍스트 영역
  statisticstextbox: {
    flex: 5,
    height: 100,
    alignSelf: 'center',
    paddingTop: 10,
  },
  recotext: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
  },
  recoproducttext: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  cautiontext: {
    top: 5,
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  cautiontext2: {
    top: 5,
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    alignSelf: 'center',
  },

  //네비게이션바
  navBarContainer: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '10%',
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 50, // for Android
    zIndex: 2,
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
