import React, {Component, useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Linking,
  ScrollView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackPageList} from './CommonType';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';

import axios from 'axios';

// 화면 관리
type MainProps = {
  navigation: StackNavigationProp<RootStackPageList, 'Main'>;
  userName: string;
  userEmail: string;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
};

//DB에서 루틴정보받아오기
interface RoutineData {
  id: number; //임시로number해놓음
  ertn_time: string;
  hrtn_time: string;
  prtn_time: string;
  ertn_tag: string;
  hrtn_tag: string;
  prtn_tag: string;
  ertn_nm: string;
  prtn_nm: string;
  hrtn_nm: string;
}

const Main: React.FC<MainProps> = ({
  navigation,
  userName,
  userEmail,
  setLogin,
  setUserName,
  setUserEmail,
}) => {
  ///추가된루틴데이터가져오기
  const [data, setData] = useState<RoutineData[]>([]); // 데이터상태추가

  useEffect(() => {
    fetchData(); // 컴포넌트가 마운트되면 데이터를 가져오도록 설정

    //카메라
    const platformPermissions = PERMISSIONS.ANDROID.CAMERA;
    const requestCameraPermission = async () => {
      try {
        const result = await request(platformPermissions);
      } catch (err) {
        Alert.alert('Camera permission err');
        console.warn(err);
      }
    };
    requestCameraPermission();
  }, []);

  const fetchData = async () => {
    try {
      const fetchDataUrl = `http://43.200.178.131:3344/rtnlist/?userEmail=${userEmail}`;
      const response = await axios.get(fetchDataUrl);
      if (response.data) {
        const data = response.data;
        // 정렬 없이 데이터를 설정함
        setData(data);
        console.log(response);
        console.log(data);
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
    navigation.navigate('Pill');
  };
  // 기타 페이지 이동 함수
  const movetest2 = () => {
    navigation.navigate('Etc');
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
      {/* 타임라인바 */}
      <TimelineBar />

      <View style={{marginTop: 30}}></View>

      {/* 실선 */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: 'rgb(175, 171, 171)',
          width: '100%',
        }}
      />

      {/* 회원명*/}
      <View style={styles.memTextContainer}>
        <Text style={styles.memtex}>{userName}님 Daily routine</Text>
      </View>

      {/* 루틴리스트 */}
      <FlatList
        data={data}
        renderItem={({item}) => (
          <View style={styles.routineItem2}>
            <View style={styles.routineItemSection}>
              <Text style={[styles.routineInfo, {color: 'black'}]}>
                {item.ertn_time || item.prtn_time || item.hrtn_time}
              </Text>
            </View>

            <View style={styles.routineItemSection}>
              <View style={styles.tagContainer}>
                <Text style={[styles.routineInfo, {color: 'white'}]}>
                  {item.ertn_tag || item.prtn_tag || item.hrtn_tag}
                </Text>
              </View>
            </View>

            <View style={styles.routineItemSection}>
              <Text style={[styles.routineInfo, {color: 'black'}]}>
                {item.ertn_nm || item.prtn_nm || item.hrtn_nm}
              </Text>
            </View>

            <View style={styles.routineItemSection}>
              <Text style={styles.routineInfo}>😀</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.emptySpace}></View>

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
    width: 80,
  },
  // 앱 이름
  title: {
    fontSize: 23,
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
    zindex: 1,
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
    zIndex: 2,
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
    width: 58,
    borderRadius: 35,
    margin: 5,
    backgroundColor: 'rgb(245,235,224)',
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
  // 플로팅바
  floatingBar: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 60,
    height: 60, // 변경된 부분 (원의 크기)
    backgroundColor: 'rgb(206,119,119)',
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
    backgroundColor: 'rgb(239,175,175)',
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

  // Define styles for routine items
  routineItem: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  routineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routineTag: {
    fontSize: 14,
    color: '#888',
  },
  routineTime: {
    fontSize: 14,
    color: '#888',
  },
  //회원명
  memTextContainer: {
    // flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  memtex: {
    fontSize: 17, // Adjust the font size as needed
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  //루틴리스트
  routineItem2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'red', // 'rgb(175, 171, 171)'
    marginVertical: 5,
    //paddingVertical: 30,
    height: 60,
  },
  routineItemSection: {
    flex: 1,
    justifyContent: 'center',
  },
  routineInfo: {
    height: 30,
    textAlign: 'center',
    fontSize: 16,
    // borderTopWidth: 1,
    //borderBottomWidth: 1,
    //borderColor: 'blue', // Set the border color
    // Add any other styles you need
    justifyContent: 'center',
  },
  tagContainer: {
    // borderWidth: 1,
    borderColor: 'rgb(175, 171, 171)',
    backgroundColor: 'rgb(43,58,85)',
    padding: 0, // Adjust the padding as needed
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 50,
  },

  routineInfoWithEmoji: {
    backgroundColor: 'white', // Background color of the circular container
    width: 30, // Adjust the size as needed
    height: 30, // Adjust the size as needed
    borderRadius: 15, // Make it a circle by setting border radius to half the width/height
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptySpace: {
    height: '10%',
    backgroundColor: 'blue.',
  },
});
export default Main;
