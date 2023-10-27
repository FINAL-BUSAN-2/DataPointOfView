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
import PieChart from 'react-native-pie-chart';

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
    // fetchData();
    // fetchData2();
    // fetchData3();
    // fetchData4();
    // fetchData5();
    // fetchData6();
    fetch('http://43.200.178.131:3344/health_piechartdata')
      .then(response => response.json())
      .then(healthdata => setChartData(healthdata))
      .catch(error => console.error('Error:', error));
    fetch('http://43.200.178.131:3344/pill_piechartdata')
      .then(response => response.json())
      .then(pilldata => setChartData2(pilldata))
      .catch(error => console.error('Error:', error));
    console.log('chartData2:', chartData2);
  }, []);

  const series = chartData.map(dataPoint => dataPoint.count);
  const sliceColor = chartData.map(dataPoint => dataPoint.color);
  const series2 = chartData2.map(dataPoint => dataPoint.count);
  const sliceColor2 = chartData2.map(dataPoint => dataPoint.color);
  console.log('under:', chartData2);
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
        <Text style={styles.usertext}>📍{userInfo}님의 오늘의 기록</Text>
        {/* <View>
          <Text>Test Data:</Text>
          {chartData5 &&
            chartData5.map((item, index) => (
              <View key={index}>
                <Text>{item.news_idx}</Text>
              </View>
            ))}
        </View> */}
      </View>

      <View style={styles.titletop}>
        <View style={styles.line}></View>
      </View>

      {/* <Text style={styles.statictext}>💪 달성한 운동 {'\n'}</Text>
              {chartData3 &&
                chartData3.map((item, index) => (
                  <Text key={`dataPoint-${index}`}>ㆍ{item.hrtn_id}</Text>
                ))} */}

      {/* 바디 */}
      <View style={styles.topcontainer}>
        <View style={styles.tophealth}>
          <View style={styles.tophealthtitle}>
            <Text style={styles.tophealthtitletext}>운동 Top</Text>
          </View>
          <View style={styles.tophealthemoji}></View>
          <View style={styles.tophealthtag}></View>
        </View>
        <View style={styles.toppill}>
          <View style={styles.toppilltitle}>
            <Text style={styles.toppilltitletext}>영양 Top</Text>
          </View>
          <View style={styles.toppillemoji}></View>
          <View style={styles.toppilltag}></View>
        </View>
        <View style={styles.fin}>
          <View style={styles.fintitle}>
            <Text style={styles.fintitletext}>달성률</Text>
          </View>
          <View style={styles.finemoji}></View>
          <View style={styles.finper}></View>
        </View>
      </View>

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
            {/* {chartData.map((item, index) => (
              <Text key={index}>{JSON.stringify(item)}</Text>
            ))} */}
            {/* {chartData2.map((dataPoint, index) => (
              <Text key={index}>
                ㆍ{dataPoint.func}
                {dataPoint.count}
              </Text>
            ))} */}

            {/* <PieChart
              widthAndHeight={100}
              series={series}
              sliceColor={sliceColor}
            /> */}
          </View>
          <View style={styles.pillchart}>
            {/* <PieChart
              widthAndHeight={100}
              series={series2}
              sliceColor={sliceColor2}
            /> */}
            {/* {chartData2.map((dataPoint, index) => (
              <Text key={index}>
                ㆍ{dataPoint.func}
                {dataPoint.count}
              </Text>
            ))} */}
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

        <View style={styles.line}></View>

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
    flex: 0.5,
  },
  usertext: {
    fontSize: 18,
    alignSelf: 'center',
    color: 'black',
    fontWeight: 'bold',
  },

  // 통계 랭킹
  topcontainer: {
    flex: 2.5,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgb(245,235,224)',
    borderRadius: 20,
    width: '90%',
  },
  tophealth: {
    flex: 1,
    flexDirection: 'column',
  },
  tophealthtitle: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tophealthtitletext: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  tophealthemoji: {
    flex: 2,
    alignSelf: 'center',
    width: '65%',
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 150,
    borderColor: 'rgb(175,171,171)',
    backgroundColor: 'white',
  },
  tophealthtag: {
    alignSelf: 'center',
    width: '70%',
    marginTop: 10,
    marginBottom: 15,
    height: 35,
    borderRadius: 15,
    backgroundColor: 'rgb(206,119,119)',
  },
  toppill: {
    flex: 1,
    flexDirection: 'column',
  },
  toppilltitle: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toppilltitletext: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  toppillemoji: {
    flex: 2,
    alignSelf: 'center',
    width: '65%',
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 150,
    borderColor: 'rgb(175,171,171)',
    backgroundColor: 'white',
  },
  toppilltag: {
    alignSelf: 'center',
    width: '70%',
    marginTop: 10,
    marginBottom: 15,
    height: 35,
    borderRadius: 15,
    backgroundColor: 'rgb(206,119,119)',
  },
  fin: {flex: 1, flexDirection: 'column'},
  fintitle: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fintitletext: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  finemoji: {
    flex: 2,
    alignSelf: 'center',
    width: '65%',
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 150,
    borderColor: 'rgb(175,171,171)',
    backgroundColor: 'white',
  },
  finper: {
    alignSelf: 'center',
    width: '70%',
    marginTop: 10,
    marginBottom: 15,
    height: 35,
    borderRadius: 15,
    backgroundColor: 'rgb(206,119,119)',
  },
  // 선
  titletop: {
    flex: 0.3,
  },
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
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  healthchart: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    //테두리, 이후 지우기
    borderColor: 'rgb(231,230,230)',
    borderWidth: 2,
    borderRadius: 15,
  },
  pillchart: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    //테두리, 이후 지우기
    borderColor: 'rgb(231,230,230)',
    borderWidth: 2,
    borderRadius: 15,
  },
  // 통계 텍스트 영역
  statisticstextbox: {
    flex: 5,
    height: 100,
    alignSelf: 'center',
    marginTop: 20,
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
