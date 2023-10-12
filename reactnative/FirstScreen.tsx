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
import {CommonType} from './commonType';
import axios from 'axios';

type FirstScreenProps = {
  navigation: StackNavigationProp<CommonType.RootStackPageList, 'FirstScreen'>;
  userInfo: string;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setUserInfo: React.Dispatch<React.SetStateAction<string | null>>;
};

type FirstScreenState = {
  showImageItems: boolean;
};

class FirstScreen extends Component<FirstScreenProps, FirstScreenState> {
  constructor(props: FirstScreenProps) {
    super(props);
    this.state = {
      showImageItems: false,
    };
  }

  handleFloatingBarClick = () => {
    const {showImageItems} = this.state;
    this.setState({showImageItems: !showImageItems});
  };

  logOut = async () => {
    try {
      const response = await axios.get(
        'http://192.168.0.190:3344/kakao/logout',
      );

      if (response.data && response.data.message) {
        Alert.alert('로그아웃', response.data.message); // "로그아웃 되었습니다." 메시지 표시
        this.props.setLogin(false);
        this.props.setUserInfo(null);
      }
    } catch (error) {
      Alert.alert('로그아웃 오류', '로그아웃 중 문제가 발생했습니다.');
    }
  };

  render() {
    const {navigation, userInfo} = this.props;
    const {showImageItems} = this.state;

    const movetest = () => {
      navigation.navigate('test');
    };
    const movetest1 = () => {
      navigation.navigate('nutrition');
    };
    const movetest2 = () => {
      navigation.navigate('test2');
    };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftContainer}>
            <Image
              source={require('./android/app/src/img/red.png')} // 로고 이미지 파일의 경로를 지정
              style={{
                width: 30,
                height: 30,
                marginRight: 16,
              }}
            />
            <Text style={styles.title}>HP-log / {userInfo}님</Text>
          </View>
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
            <TouchableOpacity onPress={this.logOut}>
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
        {/* Timeline Bar */}
        <TimelineBar />

        <View style={{marginTop: 30}}></View>

        {/* favorites */}
        <View style={styles.favoritesbox}>
          <Text style={styles.favoritestext}>즐겨찾기</Text>
        </View>

        {/* 타원들 */}
        <View style={styles.ovalContainer}>
          <View style={[styles.oval, styles.marginRight]}></View>
          <View style={[styles.oval, styles.marginRight]}></View>
          <View style={[styles.oval, styles.marginRight]}></View>
          <View style={styles.oval}></View>
        </View>

        {/* 선 */}
        <View style={styles.line}></View>

        {/* favorites */}
        <View style={styles.orderbox}>
          <Text style={styles.ordertext}>순서변경/즐겨찾기</Text>
        </View>

        {/* Navigation Bar */}
        <View style={styles.navBarContainer}>
          <View style={styles.upTab}>
            <Image
              source={require('./android/app/src/img/thumb_up.png')}
              style={styles.upIcon}
            />
            <Text>추천</Text>
          </View>
          <View style={styles.homeTab}>
            <Image
              source={require('./android/app/src/img/home.png')}
              style={styles.homeIcon}
            />
            <Text style={styles.homeText}>홈</Text>
          </View>
          <View style={styles.accTab}>
            <Image
              source={require('./android/app/src/img/accessibility.png')}
              style={styles.accIcon}
            />
            <Text>개인</Text>
          </View>
        </View>

        {/* floatingBar */}
        <TouchableOpacity
          style={[styles.floatingBar, {zIndex: 2}]}
          onPress={() => this.handleFloatingBarClick()}>
          <Image
            source={require('./android/app/src/img/floating_wh.png')}
            style={styles.floIcon}
          />
        </TouchableOpacity>

        {showImageItems && (
          <View style={[styles.flo_ex, {zIndex: 1}]}>
            <TouchableOpacity onPress={movetest}>
              {/* <Image
                source={require('./android/app/src/img/flo_ex.png')}
                style={styles.floexIcon}
              /> */}
              <Text style={styles.flotext}>건강</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={movetest1}>
              {/* <Image
                source={require('./android/app/src/img/flo_ex.png')}
                style={styles.floexIcon}
              /> */}
              <Text style={styles.flotext}>영양</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={movetest2}>
              {/* <Image
                source={require('./android/app/src/img/flo_ex.png')}
                style={styles.floexIcon}
              /> */}
              <Text style={styles.flotext}>기타</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const TimelineBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      // Update progress
      setProgress((now.getHours() + now.getMinutes() / 60) / 24);
    };

    updateProgress(); // Update when the component is mounted

    const intervalId = setInterval(
      updateProgress,
      /* Refresh every minute */
      60 * 1000,
    );

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.timelineContainer}>
      <View style={[styles.rectangle, {width: `${progress * 100}%`}]} />
      <Text style={[styles.timeText, {left: '2%'}]}>00:00</Text>
      <Text
        style={[
          styles.timeText,
          {left: '50%', transform: [{translateX: -25}]},
        ]}>
        12:00
      </Text>
      <Text style={[styles.timeText, {right: '2%'}]}>24:00</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(231,230,230)',
    width: '100%',
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  /* Time Text Layout */
  timeText: {
    position: 'absolute',
    top: '110%',
    color: '#000000', // Change the text color to red temporarily for testing
    fontWeight: 'bold',
  },

  /* Timeline Container */
  timelineContainer: {
    marginTop: 50, // Adjust this to change the vertical position of the timeline bar
    left: '5%',
    width: '90%',
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    overflow: 'visible',
    position: 'relative',
  },

  /* favorites */
  favoritesbox: {
    flexDirection: 'row', // 요소들을 수직으로 배치
    alignItems: 'center',
  },

  favoritestext: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000',
    marginLeft: 40,
  },

  ovalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },

  oval: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },
  marginRight: {
    marginRight: 20, // 오른쪽 여백 추가
  },
  line: {
    width: '80%',
    height: 2,
    backgroundColor: '#000000',
    alignSelf: 'center', // 가로 정렬을 위해 추가
    marginTop: 20,
  },

  /* order */
  orderbox: {
    flexDirection: 'row', // 요소들을 수직으로 배치
    justifyContent: 'flex-end', // 우측 정렬
    alignItems: 'center',
    marginRight: 40,
    marginTop: 5,
  },

  ordertext: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000',
    marginLeft: 40,
  },

  /* Rectangle Layout */
  rectangle: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#888',
  },

  //navBarContainer
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
  //upTab
  upTab: {
    alignItems: 'center',
    justifyContent: 'center',
    left: 15,
  },
  //upIcon
  upIcon: {
    width: 35,
    height: 35,
  },
  //homeTab
  homeTab: {
    bottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(43,58,85,0.7)',
  },
  //homeIcon
  homeIcon: {
    width: 80,
    height: 80,
  },
  //homeText
  homeText: {
    bottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  //upTab
  accTab: {
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
  },
  //upIcon
  accIcon: {
    width: 35,
    height: 35,
  },
  //floatingBar
  floatingBar: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 60,
    height: 60, // 변경된 부분 (원의 크기)
    backgroundColor: 'rgba(43,58,85,0.85)',
    borderRadius: 30, // 변경된 부분 (원의 반지름)
    alignItems: 'center',
    justifyContent: 'center',
  },

  //floIcon
  floIcon: {
    width: 40,
    height: 40,
  },

  flo_ex: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 60,
    height: 260, // 변경된 부분 (원의 크기)
    backgroundColor: 'rgba(43,58,85,0.2)',
    borderBottomLeftRadius: 35, // 원의 하단 왼쪽 반지름
    borderBottomRightRadius: 35, // 원의 하단 오른쪽 반지름
    borderRadius: 35, // 원의 상단 반지름
    alignItems: 'center',
    justifyContent: 'center',
  },

  //floexIcon
  floexIcon: {
    bottom: 25,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(245,235,224,0.4)',
    borderRadius: 20, // 변경된 부분 (원의 반지름)
    alignItems: 'center',
    justifyContent: 'center',
  },
  //flotext
  flotext: {
    bottom: 25,
    textAlign: 'center',
  },
});
export default FirstScreen;
