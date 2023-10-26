import React, {useEffect, useState} from 'react';
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
import {VictoryPie} from 'victory';
import Balloon from 'react-native-balloon';

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
  const [chartData, setChartData] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [chartData3, setChartData3] = useState([]);
  const [chartData4, setChartData4] = useState([]);
  const [chartData5, setChartData5] = useState([]);
  const [chartData6, setChartData6] = useState([]);
  useEffect(() => {
    fetchData();
    fetchData2();
    fetchData3();
    fetchData4();
    fetchData5();
    fetchData6();
  }, []);

  const fetchData = async () => {
    try {
      const data = await healthPieChartData(); // getChartData() 호출하여 데이터 가져오기
      setChartData(data);
      // console.log(data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const fetchData2 = async () => {
    try {
      const data2 = await pillPieChartData(); // getChartData() 호출하여 데이터 가져오기
      setChartData2(data2);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const fetchData3 = async () => {
    try {
      const data3 = await healthlistData(); // getChartData() 호출하여 데이터 가져오기
      setChartData3(data3);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const fetchData4 = async () => {
    try {
      const data4 = await pilllistData(); // getChartData() 호출하여 데이터 가져오기
      setChartData4(data4);
      console.log(data4);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };
  const fetchData5 = async () => {
    try {
      const data5 = await testapi(); // getChartData() 호출하여 데이터 가져오기
      setChartData5(data5);
      // console.log(data5);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  // const fetchData6 = async () => {
  //   try {
  //     const data6 = await testapi2(); // getChartData() 호출하여 데이터 가져오기
  //     setChartData6(data6);
  //     console.log(data6);
  //   } catch (error) {
  //     console.error('Error fetching chart data:', error);
  //   }
  // };

  // 차트 데이터를 가져오는 비동기 함수 정의
  const healthPieChartData = async () => {
    try {
      const response = await fetch(
        'http://43.200.178.131:3344/health_piechartdata',
      );
      // const response = await fetch('http://54.180.91.68:3306');
      if (!response.ok) {
        // throw new Error('Failed to fetch chart data');
      }
      const data = await response.json();
      // console.log(data);
      return data;
    } catch (error) {
      throw new Error(`Error accessing chart data: ${error.message}`);
    }
  };

  // 차트 데이터를 가져오는 비동기 함수 정의
  const pillPieChartData = async () => {
    try {
      // console.log('debug');
      const response = await fetch(
        'http://43.200.178.131:3344/pill_piechartdata',
      );

      if (!response.ok) {
        // throw new Error('Failed to fetch chart data');
        // console.log(response);
      }
      const data2 = await response.json();
      // console.log(data2);
      // console.log(data2);
      // console.log('debug');
      return data2;
    } catch (error) {
      throw new Error(`Error accessing chart data: ${error.message}`);
    }
  };

  // 차트 데이터를 가져오는 비동기 함수 정의
  const healthlistData = async () => {
    try {
      const response = await fetch(
        'http://43.200.178.131:3344/health_listdata',
      );
      // const response = await fetch('http://54.180.91.68:3306');
      if (!response.ok) {
        // throw new Error('Failed to fetch chart data');
      }
      const data3 = await response.json();
      // console.log(data3);
      return data3;
    } catch (error) {
      throw new Error(`Error accessing chart data: ${error.message}`);
    }
  };

  // 차트 데이터를 가져오는 비동기 함수 정의
  const pilllistData = async () => {
    try {
      const response = await fetch('http://43.200.178.131:3344/pill_listdata');
      // const response = await fetch('http://54.180.91.68:3306');
      if (!response.ok) {
        // throw new Error('Failed to fetch chart data');
      }
      const data4 = await response.json();
      // console.log(data4);
      return data4;
    } catch (error) {
      throw new Error(`Error accessing chart data: ${error.message}`);
    }
  };

  // 차트 데이터를 가져오는 비동기 함수 정의
  const testapi = async () => {
    try {
      const response = await fetch('http://43.200.178.131:3344/test');
      if (!response.ok) {
        // throw new Error('Failed to fetch chart data');
      }
      const data5 = await response.json();
      // console.log(data5);
      return data5;
    } catch (error) {
      throw new Error(`Error accessing chart data: ${error.message}`);
    }
  };

  const fetchData6 = async () => {
    try {
      const response = await fetch('http://43.200.178.131:3344/test2');
      if (!response.ok) {
      }
      const data6 = await response.json();
      setChartData6(data6);
      // console.log(setChartData6);
    } catch (error) {
      throw new Error(`Error accessing chart data: ${error.message}`);
    }
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
        <View>
          <Text>Test Data:</Text>
          {chartData5 &&
            chartData5.map((item, index) => (
              <View key={index}>
                <Text>{item.news_idx}</Text>
                {/*Render other properties as needed */}
              </View>
            ))}
        </View>
      </View>

      {/* 바디 */}
      <View style={styles.body}>
        <View style={styles.balloonbox}>
          <Balloon
            containerStyle={{right: 10}}
            borderWidth={2}
            borderRadius={20}
            triangleDirection="right"
            triangleSize={12}
            width={125}
            height={200}
            triangleOffset="20%">
            <ScrollView>
              <Text style={styles.statictext}>💪 달성한 운동 {'\n'}</Text>
              {chartData3 &&
                chartData3.map((item, index) => (
                  <Text key={`dataPoint-${index}`}>ㆍ{item.hrtn_id}</Text>
                ))}
            </ScrollView>
          </Balloon>
        </View>
        <View style={styles.bodybox}>
          <Image
            source={require('./android/app/src/img/staticbody.png')}
            style={styles.bodyimg}
          />
        </View>
        <View style={styles.pilllist}>
          <Balloon
            borderWidth={2}
            borderRadius={20}
            triangleDirection="left"
            triangleSize={12}
            width={125}
            height={200}
            triangleOffset="20%">
            <ScrollView>
              <Text style={styles.statictext}>💊 섭취한 영양 {'\n'}</Text>
              {chartData4.map((dataPoint, index) => (
                <Text key={index}>ㆍ{dataPoint.name}</Text>
              ))}
            </ScrollView>
          </Balloon>
        </View>
      </View>

      <View style={styles.line}></View>

      {/* 통계 */}
      <View style={styles.titlecontainer}>
        <View style={styles.titlehealth}>
          <Text style={styles.titletext}>운동 통계</Text>
        </View>
        <View style={styles.titleetc}>
          <Text style={styles.titletext}>영양 통계</Text>
        </View>
      </View>
      <View style={styles.statistics}>
        <View style={styles.chart}>
          <View style={styles.healthchart}>
            {/* <VictoryPie
              data={chartData.map(dataPoint => ({
                x: dataPoint.tag,
                y: dataPoint.count,
              }))}
              width={80} // 가로 크기
              height={80} // 세로 크기
              radius={40} // 반지름
              innerRadius={15}
              colorScale={chartData.map(dataPoint => dataPoint.color)}
            /> */}
          </View>
          <View style={styles.pillchart}>
            {/* <VictoryPie
              data={chartData2.map(dataPoint2 => ({
                x: dataPoint2.func,
                y: dataPoint2.count,
              }))}
              width={80} // 가로 크기
              height={80} // 세로 크기
              radius={40} // 반지름
              innerRadius={15}
              colorScale={chartData2.map(dataPoint2 => dataPoint2.color)}
            /> */}
          </View>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 5,
  },
  balloonbox: {
    flex: 1,
    left: 20,
  },
  bodybox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyimg: {
    width: '70%',
    height: '100%',
  },
  pilllist: {
    flex: 1,
    right: 20,
  },
  statictext: {
    fontWeight: 'bold',
    color: 'black',
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
    right: '100%',
    zIndex: 2,
  },
  // 영양 타이틀
  titleetc: {
    width: '25%',
    height: '120%',
    borderWidth: 4,
    borderColor: 'rgb(231,230,230)',
    borderRadius: 15,
    left: '100%',
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
    justifyContent: 'space-around',
  },
  healthchart: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillchart: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
    bottom: 15,
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
