import React, {Component, useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  SafeAreaView,
  Linking,
  ScrollView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackPageList} from './CommonType';
import axios from 'axios';

////

// 화면 관리
type MainProps = {
  navigation: StackNavigationProp<RootStackPageList, 'Main'>;
  userInfo: string; //로그인된 사용자ID
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setUserInfo: React.Dispatch<React.SetStateAction<string | null>>;
};

//DB에서 루틴정보받아오기
interface RoutineData {
  id: number; //임시로number해놓음
  rtn_name: string;
  rtn_time: string;
  rtn_tag: string;
}

const Main: React.FC<MainProps> = ({
  navigation,
  userInfo,
  setLogin,
  setUserInfo,
}) => {
  ///추가된루틴데이터가져오기
  //const [routineData, setRoutineData] = useState<RoutineData[]>([]);
  //const [data, setData] = useState([]);
  const [data, setData] = useState<RoutineData[]>([]); // 데이터상태추가
  useEffect(() => {
    fetchData(); // 컴포넌트가 마운트되면 데이터를 가져오도록 설정
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/rtnlist'); // 엔드포인트를 수정해야 합니다.

      if (response.data) {
        // 데이터 가져오고
        const data = response.data;
        //rtn_time을 기준으로 오름차순 정렬
        data.sort((a, b) => a.rtn_time.localeCompare(b.rtn_time));
        //정렬된 데이터를설정함
        setData(data);
      } else {
        console.error('데이터가 없습니다.');
      }
    } catch (error) {
      console.error('데이터를 가져오는 동안 오류가 발생했습니다.');
    }
  };

  const [showImageItems, setShowImageItems] = useState(false);
  // 플로팅 바 핸들러
  const handleFloatingBarClick = () => {
    setShowImageItems(!showImageItems);
  };
  ``;
  // 건강 페이지 이동 함수
  const movetest = () => {
    navigation.navigate('Health');
  };
  // 영양 페이지 이동 함수
  const movetest1 = () => {
    navigation.navigate('pill');
  };
  // 기타 페이지 이동 함수
  const movetest2 = () => {
    navigation.navigate('Etc');
  };

  const logOut = async () => {
    try {
      const response = await axios.get(
        'http://172.16.10.195:3344/kakao/logout',
      );

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
    <View style={styles.container}>
      <View style={styles.header}>
        {/* 앱 로고 및 이름 */}
        <View style={styles.leftContainer}>
          <Image
            source={require('./android/app/src/img/red.png')}
            style={{
              width: 30,
              height: 30,
              marginRight: 16,
            }}
          />
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
          <TouchableOpacity onPress={logOut}>
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
      {/* 타임라인바 */}
      <TimelineBar />

      <View style={{marginTop: 30}}></View>

      {/* 즐겨찾기 */}
      <View style={styles.favoritesbox}>
        <Text style={styles.favoritestext}>즐겨찾기</Text>
      </View>

      {/* 즐겨찾기 이모지 자리 */}
      <View style={styles.ovalContainer}>
        <View style={[styles.oval, styles.marginRight]}></View>
        <View style={[styles.oval, styles.marginRight]}></View>
        <View style={[styles.oval, styles.marginRight]}></View>
        <View style={styles.oval}></View>
      </View>
      <View style={styles.line}></View>

      {/* 편집 */}
      <View style={styles.orderbox}>
        <Text style={styles.ordertext}>순서변경/즐겨찾기</Text>
      </View>

      {/* 루틴DB에서 값 받아오기 필요한 컬럼 => 시간,루틴명,태그 */}

      {/* <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.routineItem}>
            <Text style={styles.routineName}>
              Routine Name: {item.rtn_name}
            </Text>
            <Text style={styles.routineTag}>Tag: {item.rtn_tag}</Text>
            <Text style={styles.routineTime}>Time: {item.rtn_time}</Text>
          </View>
        )}
      /> */}

      <View>
        {data.map(item => (
          <View key={item.id} style={styles.roundedBox}>
            <Text style={styles.rtntext}>{item.rtn_time}</Text>

            <View style={styles.routinelist}>
              <Text>
                {' '}
                {item.rtn_tag} {item.rtn_name}
              </Text>
            </View>
          </View>
        ))}
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
        <View style={styles.homeTab}>
          <Image
            source={require('./android/app/src/img/home.png')}
            style={styles.homeIcon}
          />
          <Text style={styles.homeText}>홈</Text>
        </View>
        {/* 개인 */}
        <View style={styles.accTab}>
          <Image
            source={require('./android/app/src/img/accessibility.png')}
            style={styles.accIcon}
          />
          <Text>개인</Text>
        </View>
      </View>

      {/* 플로팅바 */}
      <TouchableOpacity
        style={[styles.floatingBar, {zIndex: 2}]}
        onPress={() => handleFloatingBarClick()}>
        <Image
          source={require('./android/app/src/img/floating_wh.png')}
          style={styles.floIcon}
        />
      </TouchableOpacity>
      {/* 플로팅바 이벤트 */}
      {showImageItems && (
        <View style={[styles.flo_ex, {zIndex: 1}]}>
          <TouchableOpacity onPress={movetest}>
            <Image
              source={require('./android/app/src/img/flo_ex.png')}
              style={styles.floexIcon}
            />
            <Text style={styles.flotext}>건강</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={movetest1}>
            <Image
              source={require('./android/app/src/img/flo_ex.png')}
              style={styles.floexIcon}
            />
            <Text style={styles.flotext}>영양</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={movetest2}>
            <Image
              source={require('./android/app/src/img/flo_ex.png')}
              style={styles.floexIcon}
            />
            <Text style={styles.flotext}>기타</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
// 타임라인바
const TimelineBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      setProgress((now.getHours() + now.getMinutes() / 60) / 24);
    };
    updateProgress();
    const intervalId = setInterval(updateProgress, 60 * 1000);

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
    fontSize: 20,
    fontWeight: 'bold',
  },

  //타임라인바
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
  // 타임라인바 텍스트
  timeText: {
    position: 'absolute',
    top: '110%',
    color: '#000000',
    fontWeight: 'bold',
  },

  // 즐겨찾기
  favoritesbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // 즐겨찾기 텍스트
  favoritestext: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000',
    marginLeft: 40,
  },
  // 즐겨찾기 이모지 자리
  ovalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  // 즐겨찾기 이모지
  oval: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },
  marginRight: {
    marginRight: 20,
  },
  line: {
    width: '80%',
    height: 2,
    backgroundColor: '#000000',
    alignSelf: 'center',
    marginTop: 20,
  },

  // 편집
  orderbox: {
    flexDirection: 'row', // 요소들을 수직으로 배치
    justifyContent: 'flex-end', // 우측 정렬
    alignItems: 'center',
    marginRight: 40,
    marginTop: 5,
  },
  // 편집텍스트
  ordertext: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000',
    marginLeft: 40,
  },

  // 타임라인 바깥
  rectangle: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#888',
  },

  //네비게이션바
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
  // 홈
  homeTab: {
    bottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(43,58,85,0.7)',
  },
  // 홈 아이콘
  homeIcon: {
    width: 80,
    height: 80,
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
  // 플로팅바
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

  // 플로팅바 아이콘
  floIcon: {
    width: 40,
    height: 40,
  },
  // 플로팅바 이벤트
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
  // 플로팅바 이벤트 아이콘
  floexIcon: {
    bottom: 25,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(245,235,224,0.4)',
    borderRadius: 20, // 변경된 부분 (원의 반지름)
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 플로팅바 이벤트 텍스트
  flotext: {
    bottom: 25,
    textAlign: 'center',
  },
  //루틴 리스트 스타일
  roundedBox: {
    //backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  routinelist: {
    backgroundColor: 'rgb(231,230,230)',
    borderRadius: 10,
    //padding: 10,
    marginBottom: 10,
    borderWidth: 1, // 테두리 두께
    borderColor: 'black', // 테두리 색상
  },

  rtntext: {
    marginLeft: 10, // 원하는 간격 크기로 조정
  },

  // // Define styles for routine items
  // routineItem: {
  //   backgroundColor: '#fff',
  //   margin: 10,
  //   padding: 10,
  //   borderRadius: 10,
  // },
  // routineName: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   color: '#000000',
  // },
  // routineTag: {
  //   fontSize: 14,
  //   color: '#888',
  // },
  // routineTime: {
  //   fontSize: 14,
  //   color: '#888',
  // },
});
export default Main;
