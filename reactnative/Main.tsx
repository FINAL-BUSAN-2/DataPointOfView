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
  Dimensions,
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
  completedItems: string[];
  setCompletedItems: React.Dispatch<React.SetStateAction<string[]>>;
};

//DB에서 루틴정보받아오기
interface RoutineData {
  ertn_time: string;
  hrtn_time: string;
  prtn_time: string;
  ertn_tag: string;
  hrtn_tag: string;
  prtn_tag: string;
  ertn_nm: string;
  prtn_nm: string;
  hrtn_nm: string;
  pill_nm: string;
  prtn_cat: string;
  hrtn_id: string;
  ertn_id: string;
  prtn_setting?: {
    prtn_time: string;
    prtn_tag: string;
    prtn_id: string;
    [key: string]: any;
  };
}

//루틴달성
interface RoutineItem {
  hrtn_nm?: string;
  ertn_nm?: string;
  pill_nm?: string;
  hrtn_id?: string;
  ertn_id?: string;
  prtn_id?: string;
  prtn_setting?: {
    prtn_id: string;
  };
}

//루틴fin
//interface Fin {
//  ertn_id: string;
//prtn_id: string;
// hrtn_id: string;
//}

// 타임라인 이모지
interface Findata {
  h_time: string;
  h_emoji: string;
  p_time: string;
  p_emoji: string;
  e_time: string;
  e_emoji: string;
}
type DatabaseData = {
  hrtn_id?: string;
  fin_hrtn_time?: string;
  ertn_id?: string;
  fin_ertn_time?: string;
  prtn_id?: string;
  fin_prtn_time?: string;
};

const Main: React.FC<MainProps> = ({
  navigation,
  userName,
  userEmail,
  setLogin,
  setUserName,
  setUserEmail,
  completedItems,
  setCompletedItems,
}) => {
  ///추가된루틴데이터가져오기
  const [data, setData] = useState<RoutineData[]>([]); // 데이터상태추가
  const [findata, setFindata] = useState<Findata[]>([]);

  useEffect(() => {
    fetch(`http://43.200.178.131:3344/emailtest/?userEmail=${userEmail}`)
      .then(response => response.json())
      .then(data => setFindata(data))
      .catch(error => console.error('Error:', error));
    fetchData(); // 컴포넌트가 마운트되면 데이터를 가져오도록 설정

    fetchRoutineCompletionData();

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

  const getTimeFromItem = (item: RoutineData): string => {
    return item.ertn_time || item.prtn_setting?.prtn_time || item.hrtn_time;
  };

  // 루틴리스트가져오기
  const fetchData = async () => {
    try {
      const fetchDataUrl = `http://43.200.178.131:3344/rtnlist/?userEmail=${userEmail}`;
      const response = await axios.get(fetchDataUrl);
      if (response.data) {
        const data: RoutineData[] = response.data;
        data.sort((a, b) => {
          const timeA = getTimeFromItem(a);
          const timeB = getTimeFromItem(b);

          // 문자열로 된 시간을 비교
          if (timeA < timeB) return -1;
          if (timeA > timeB) return 1;
          return 0;
        });

        setData(data);
      } else {
        console.error('데이터가 없습니다.');
      }
    } catch (error) {
      console.error('데이터를 가져오는 동안 오류가 발생했습니다.');
    }
  };

  //루틴달성데이터 가져오기
  const fetchRoutineCompletionData = async () => {
    try {
      // 사용자 이메일 정보를 email 변수에 저장
      const finemail = userEmail;
      console.log('이메일', userEmail);
      // axios를 사용하여 서버로 요청 보내기
      const response = await axios.get('http://43.200.178.131:3344/rtn_fin', {
        params: {finemail: finemail},
      });
      if (response.data) {
        // 서버로부터 데이터를 가져온 후, response.data를 활용하여 루틴 달성 정보를 처리
        const completionData = response.data;
        console.log('달성된루틴데이터:', completionData);
        return completionData;
      } else {
        console.error('데이터가 없습니다.');
        return null;
      }
    } catch (error) {
      console.error('루틴달성 오류');
      return null;
    }
  };

  // 플로팅 바 핸들러
  const [showImageItems, setShowImageItems] = useState(false);
  // 플로팅 바 핸들러
  const handleFloatingBarClick = () => {
    setShowImageItems(!showImageItems);
  };
  ``;
  /// 건강 페이지 이동 함수
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

  //루틴달성핸들러
  const handleRoutineCompletion = (item: RoutineItem) => {
    const currentDateTime = new Date();
    const year = currentDateTime.getFullYear();
    const month = String(currentDateTime.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
    const day = String(currentDateTime.getDate()).padStart(2, '0');
    const hours = String(currentDateTime.getHours()).padStart(2, '0');
    const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`; // yyyy-mm-dd hh:mm 형식으로 변환

    console.log('11111111111111111111111111', item); //log

    if (
      completedItems.includes(
        item.hrtn_id || item.ertn_id || item.prtn_id || '',
      )
    ) {
      Alert.alert('이미 루틴을 수행하셨습니다1111');
      99;
      return;
    }

    if (item.hrtn_nm) {
      saveToDatabase('hrtn_fin', {
        hrtn_id: item.hrtn_id || '',
        fin_hrtn_time: formattedDateTime,
      });
    } else if (item.ertn_nm) {
      saveToDatabase('ertn_fin', {
        ertn_id: item.ertn_id || '',
        fin_ertn_time: formattedDateTime,
      });
    } else if (item.pill_nm && item.prtn_setting) {
      saveToDatabase('prtn_fin', {
        prtn_id: item.prtn_setting.prtn_id || '',
        fin_prtn_time: formattedDateTime,
      });
    }
    setCompletedItems([
      ...completedItems,
      item.hrtn_id || item.ertn_id || item.prtn_id || '',
    ]);
  };
  console.log('Updated completedItems:', completedItems);

  const saveToDatabase = async (tableName: string, data: DatabaseData) => {
    try {
      console.log('2222222222222222', tableName, 'With Data:', data);
      Alert.alert;
      const response = await fetch(
        `http://43.200.178.131:3344/rtn_done/${tableName}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      console.log('333333333333333333333:', response);

      if (!response.ok) {
        throw new Error('Failed to save data to server');
      }
      const result = await response.json();
      console.log('4444444444444444444444:', result);
      return result;
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('이미 루틴을 수행하셨습니다222');
    }
  };

  return (
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
              width: 90,
              height: 30,
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
      {/* 타임라인바 */}
      <TimelineBar userEmail={userEmail} findata={findata} />

      <View style={{marginTop: 30}}></View>

      {/* 실선 */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: 'rgb(175, 171, 171)',
          alignSelf: 'center',
          width: '90%',
        }}
      />
      <View>
        {/* <Text>
          {fin_emoji},{fin_time}
        </Text> */}
      </View>
      {/* 회원명*/}
      <View style={styles.memTextContainer}>
        <Text style={styles.memtex}>
          {userName}님{' '}
          <Text
            style={{
              fontStyle: 'italic',
              fontSize: 22,
              color: 'black',
              fontWeight: 'bold',
            }}>
            Daily routine
          </Text>
        </Text>
      </View>

      {/* 루틴리스트 */}
      <FlatList
        style={{marginBottom: 70}}
        data={data}
        renderItem={({item}) => (
          <View style={styles.routineItem2}>
            <View style={styles.routineItemSection}>
              <Text style={[styles.routineInfo, {color: 'black'}]}>
                {item.ertn_time ||
                  item.prtn_setting?.prtn_time ||
                  item.hrtn_time}
              </Text>
            </View>

            <View style={styles.routineItemSectionTag}>
              <View style={styles.tagContainer}>
                <Text
                  style={[
                    styles.routineInfo,
                    {color: 'white', alignSelf: 'center'},
                  ]}>
                  {item.ertn_tag ||
                    item.prtn_setting?.prtn_tag ||
                    item.hrtn_tag}
                </Text>
              </View>
            </View>

            <View style={styles.routineItemSectionNM}>
              <Text style={[styles.routineInfo, {color: 'black'}]}>
                {item.ertn_nm || item.pill_nm || item.hrtn_nm}
              </Text>
            </View>

            <View style={styles.routineItemSection_done}>
              {completedItems.includes(
                item.hrtn_id ||
                  item.ertn_id ||
                  item.prtn_setting?.prtn_id ||
                  '',
              ) ? (
                <Text
                  style={[styles.dottedCircle, styles.completedCircle]}
                  onPress={() => handleRoutineCompletion(item)}>
                  ✔️
                </Text>
              ) : (
                <Text
                  style={styles.dottedCircle}
                  onPress={() => handleRoutineCompletion(item)}>
                  {/* Display an empty circle */}
                </Text>
              )}
            </View>
          </View>
        )}
      />

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
              source={require('./android/app/src/img/floating_wh.png')}
              style={styles.floexIcon}
            />
            <Text style={styles.flotext}>건강</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={movetest1}>
            <Image
              source={require('./android/app/src/img/floating_wh.png')}
              style={styles.floexIcon}
            />
            <Text style={styles.flotext}>영양</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={movetest2}>
            <Image
              source={require('./android/app/src/img/floating_wh.png')}
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
// 주석
interface TimelineBarProps {
  userEmail: string;
  findata: Findata[];
}
const TimelineBar: React.FC<TimelineBarProps> = ({userEmail, findata}) => {
  const [progress, setProgress] = useState(0);
  // const [chartData5, setChartData5] = useState<Findata[]>([]); // 데이터상태추가
  // 타임라인 이모지 추가하기
  // useEffect(() => {
  //   fetch(`http://43.200.178.131:3344/emailtest/?userEmail=${userEmail}`)
  //     .then(response => response.json())
  //     .then(chartData5 => setChartData5(chartData5))
  //     .catch(error => console.error('Error:', error));
  // }, []);

  const renderEmojis = () => {
    let dataToMap = Array.isArray(findata) ? findata : [findata];
    // 각 속성이 배열인지 확인하고, 배열이 아니라면 배열로 변환합니다.
    dataToMap = dataToMap.map(data => ({
      h_time: Array.isArray(data.h_time) ? data.h_time : [data.h_time],
      p_time: Array.isArray(data.p_time) ? data.p_time : [data.p_time],
      e_time: Array.isArray(data.e_time) ? data.e_time : [data.e_time],
    }));
    if (!dataToMap.length) {
      dataToMap = [
        {
          h_time: [{fin_time: '', fin_emoji: ''}],
          p_time: [{fin_time: '', fin_emoji: ''}],
          e_time: [{fin_time: ''}],
        },
      ];
    }
    const width = Dimensions.get('window').width * 0.75;

    return dataToMap.map((data, index) => {
      console.log('h_time', data.h_time, Array.isArray(data.h_time));
      console.log('p_time', data.p_time, Array.isArray(data.p_time));
      console.log('e_time', data.e_time, Array.isArray(data.e_time));
      const timesEmojis = [data.h_time, data.p_time, data.e_time];
      return timesEmojis.map((items, timeIndex) => {
        return items.map((item, itemIndex) => {
          if (!item?.fin_time) return null;
          const [date, splitTime] = item.fin_time.split(' ');
          const [hour, minute] = splitTime ? splitTime.split(':') : ['', ''];
          const position = (parseInt(hour) + parseInt(minute) / 60) / 24;
          const leftPosition = isNaN(position) ? 0 : position * width;
          const emoji = timeIndex === 2 ? '❓' : item.fin_emoji;
          return (
            <Text
              key={`${index}-${timeIndex}-${itemIndex}`}
              style={[styles.emoji, {left: leftPosition}]}>
              {emoji || ''}
            </Text>
          );
        });
      });
    });
  };

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
      {renderEmojis()}
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
  },
  // 앱 이름
  title: {
    fontSize: 23,
    fontWeight: 'bold',
  },

  //타임라인바
  timelineContainer: {
    marginTop: 30, // Adjust this to change the vertical position of the timeline bar
    width: '80%',
    alignSelf: 'center',
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgb(171,170,170)',
    overflow: 'visible',
    position: 'relative',
    zindex: 2,
  },
  // 타임라인바 텍스트
  timeText: {
    position: 'absolute',
    top: '110%',
    color: '#000000',
    fontWeight: 'bold',
  },
  // 루틴달성 이모지
  emoji: {
    position: 'absolute',
    // top: 10,
    bottom: 30,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
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
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: 'rgb(43,58,85)',
    zIndex: 1,
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
    backgroundColor: 'rgba(239,175,175,0.9)',
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
    backgroundColor: 'rgb(231,230,230)',
    borderRadius: 20, // 변경된 부분 (원의 반지름)
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 플로팅바 이벤트 텍스트
  flotext: {
    bottom: 25,
    textAlign: 'center',
    color: 'black',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  memtex: {
    fontSize: 22, // Adjust the font size as needed
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    margin: 15,
  },
  //루틴리스트
  routineItem2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignSelf: 'center',
    width: '80%',
    marginVertical: 10,
    marginHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgb(175, 171, 171)', // Set the border color
  },
  routineItemSection: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
  },
  routineItemSectionTag: {
    flex: 2,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
  },
  routineItemSectionNM: {
    width: 150,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
  },

  routineInfo: {
    textAlign: 'left',
    fontSize: 16,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    borderColor: 'rgb(175, 171, 171)', // Set the border color
    // Add any other styles you need
    justifyContent: 'center',
  },
  tagContainer: {
    // borderWidth: 1,
    borderColor: 'rgb(175, 171, 171)',
    backgroundColor: 'rgb(43,58,85)',
    padding: 3, // Adjust the padding as needed
    borderRadius: 8,
    alignSelf: 'flex-start',
    width: '60%',
  },

  routineInfoWithEmoji: {
    backgroundColor: 'white', // Background color of the circular container
    width: 30, // Adjust the size as needed
    height: 30, // Adjust the size as needed
    borderRadius: 15, // Make it a circle by setting border radius to half the width/height
    justifyContent: 'center',
    alignItems: 'center',
  },

  //루틴달성동그라미 컨테이너
  routineItemSection_done: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 50,
  },
  // 루틴달성동그라미
  dottedCircle: {
    width: 30, // 동그라미의 크기를 조절하세요.
    height: 30, // 동그라미의 크기를 조절하세요.
    borderRadius: 15, // 동그라미를 만들기 위해 width/height의 반으로 설정
    borderWidth: 2, // 점선의 두께를 조절하세요.
    borderColor: 'black', // 점선의 색상을 조절하세요.
    borderStyle: 'dotted', // 점선 스타일
    justifyContent: 'center',
    alignItems: 'center',
  },

  completedCircle: {
    // Add styles for the completed circle here
    // For example, you can set the color and font size.
    color: 'green', // Change the color as needed
    fontSize: 24, // Change the font size as needed
  },
});
export default Main;
