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
  userName: string;
  userEmail: string;
  // 로그인 상태를 변경시킬 수 있음(boolean값)
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  // 사용자 정보를 변경시킬 수 있음
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
};

// React 함수 컴포넌트 정의
const Access: React.FC<AccessProps> = ({userName, userEmail}) => {
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
    fetch('http://43.200.178.131:3344/health_piechartdata')
      .then(response => response.json())
      .then(healthdata => setChartData(healthdata))
      .catch(error => console.error('Error:', error));
    fetch('http://43.200.178.131:3344/pill_piechartdata')
      .then(response => response.json())
      .then(pilldata => setChartData2(pilldata))
      .catch(error => console.error('Error:', error));
    // fetch('http://43.200.178.131:3344/test2')
    //   .then(response => response.json())
    //   .then(test => setChartData3(test))
    //   .catch(error => console.error('Error:', error));
  }, []);
  // 운동 차트 데이터
  const pieChartData = chartData.pie_chart_data
    ? chartData.pie_chart_data.map(item => ({
        count: item.count,
        color: item.color,
      }))
    : [];
  // 영양 차트 데이터
  const pillChartData = chartData2.pill_chart_data
    ? chartData2.pill_chart_data.map(item => ({
        count1: item.count1,
        color1: item.color1,
      }))
    : [];

  // 데이터 변수 설정
  const hcount = pieChartData.map(item => item.count);
  const hcolor = pieChartData.map(item => item.color);
  const htopTag = chartData.top_tag;
  const htopEmoji = chartData.top_emoji;
  const pcount = pillChartData.map(item => item.count1);
  const pcolor = pillChartData.map(item => item.color1);
  const ptopFunc = chartData2.top_func1;
  const ptopEmoji = chartData2.top_emoji1;

  console.log('hcount:', pcount);
  console.log('hcolor:', pcolor);
  // console.log('test:', test);
  // console.log('hcolor:', test);
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

          <Text style={styles.title}> 웰라밸 / {userName}님</Text>
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
        <Text style={styles.usertext}>📍{userName}님의 오늘의 기록</Text>
      </View>

      <View style={styles.titletop}>
        <View style={styles.line}></View>
      </View>

      {/* 랭킹영역 */}
      <View style={styles.topcontainer}>
        {/* 운동랭킹 영역 */}
        <View style={styles.tophealth}>
          {/* 운동랭킹 타이틀 영역 */}
          <View style={styles.tophealthtitle}>
            {/* 운동랭킹 타이틀 스타일 */}
            <Text style={styles.tophealthtitletext}>운동 Top</Text>
          </View>
          {/* 운동랭킹 이모지 영역 */}
          <View style={styles.tophealthemoji}>
            {/* 운동랭킹 이모지 스타일 */}
            <Text style={styles.tophealthemojitext}>{htopEmoji}</Text>
          </View>
          {/* 운동랭킹 태그 영역 */}
          <View style={styles.tophealthtag}>
            {/* 운동랭킹 태그 스타일 */}
            <Text style={styles.tophealthtagtext}>{htopTag}</Text>
          </View>
        </View>

        {/* 영양랭킹 영역 */}
        <View style={styles.toppill}>
          {/* 영양랭킹 타이틀 영역 */}
          <View style={styles.toppilltitle}>
            {/* 영양랭킹 타이틀 스타일 */}
            <Text style={styles.toppilltitletext}>영양 Top</Text>
          </View>
          {/* 영양랭킹 이모지 영역 */}
          <View style={styles.toppillemoji}>
            {/* 영양랭킹 이모지 스타일 */}
            <Text style={styles.toppillemojitext}>{ptopEmoji}</Text>
          </View>
          {/* 영양랭킹 기능명 영역 */}
          <View style={styles.toppillfunc}>
            {/* 영양랭킹 기능명 스타일 */}
            <Text style={styles.toppillfunctext}>{ptopFunc}</Text>
          </View>
        </View>

        {/* 달성률 영역 */}
        <View style={styles.fin}>
          {/* 달성률 타이틀 영역 */}
          <View style={styles.fintitle}>
            {/* 달성률 타이틀 스타일 */}
            <Text style={styles.fintitletext}>달성률</Text>
          </View>
          {/* 달성률 이모지 영역*/}
          <View style={styles.finemoji}>
            {/* 달성률 이모지 스타일 */}
            <Text style={styles.finemojitext}></Text>
          </View>
          {/* 달성률 수치 영역 */}
          <View style={styles.finper}>
            {/* 달성률 수치 스타일 */}
            <Text style={styles.finpertext}></Text>
          </View>
        </View>
      </View>

      {/* 통계 타이틀 영역 */}
      <View style={styles.titlecontainer}>
        {/* 운동 통계 타이틀 영역 */}
        <View style={styles.titlehealth}>
          {/* 운동 통계 타이틀 스타일 */}
          <Text style={styles.titletext}>운동 통계</Text>
        </View>
        {/* 영양 통계 타이틀 영역 */}
        <View style={styles.titlepill}>
          {/* 영약 통계 타이틀 스타일 */}
          <Text style={styles.titletext}>영양 통계</Text>
        </View>
      </View>

      {/* 통계 영역 */}
      <View style={styles.statistics}>
        {/* 차트 영역 */}
        <View style={styles.chart}>
          {/* 운동 차트 */}
          <View style={styles.healthchart}>
            {chartData.pie_chart_data ? (
              <PieChart
                widthAndHeight={100}
                series={hcount}
                sliceColor={hcolor}
              />
            ) : (
              <Text>Loading...</Text>
            )}
          </View>

          {/* 영양 차트 */}
          <View style={styles.pillchart}>
            {chartData2.pill_chart_data ? (
              <PieChart
                widthAndHeight={100}
                series={pcount}
                sliceColor={pcolor}
              />
            ) : (
              <Text>Loading...</Text>
            )}
          </View>
        </View>

        <View style={styles.line}></View>

        {/* 통계 텍스트 영역 */}
        <View style={styles.statisticstextbox}>
          {/* 성분 추천 */}
          <Text style={styles.recotext}>
            👍 : "비타민"을(를) 섭취하시는 걸 추천드려요
          </Text>
          {/* 추천 제품 */}
          <Text style={styles.recoproducttext}>
            ㄴ추천 제품 : "레모나","아이셔","레몬"
          </Text>
          {/* 부작용 */}
          <Text style={styles.cautiontext}>
            ❗ : "제품A"와 "제품B"같이 섭취 시
          </Text>
          {/* 부작용 */}
          <Text style={styles.cautiontext2}>부작용이 있을 수 있어요!</Text>
        </View>
      </View>

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
    alignItems: 'center',
    justifyContent: 'center',
    width: '65%',
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 150,
    borderColor: 'rgb(175,171,171)',
    backgroundColor: 'white',
  },
  tophealthemojitext: {
    fontSize: 32,
  },
  tophealthtag: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    marginTop: 10,
    marginBottom: 15,
    height: 35,
    borderRadius: 15,
    backgroundColor: 'rgb(206,119,119)',
  },
  tophealthtagtext: {
    fontSize: 16,
    color: 'white',
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
    alignItems: 'center',
    justifyContent: 'center',
    width: '65%',
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 150,
    borderColor: 'rgb(175,171,171)',
    backgroundColor: 'white',
  },
  toppillemojitext: {
    fontSize: 32,
  },
  toppillfunc: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 15,
    height: 35,
    borderRadius: 15,
    backgroundColor: 'rgb(206,119,119)',
  },
  toppillfunctext: {
    fontSize: 16,
    color: 'white',
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
    alignItems: 'center',
    justifyContent: 'center',
    width: '65%',
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 150,
    borderColor: 'rgb(175,171,171)',
    backgroundColor: 'white',
  },
  finemojitext: {
    fontSize: 32,
  },
  finper: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    marginTop: 10,
    marginBottom: 15,
    height: 35,
    borderRadius: 15,
    backgroundColor: 'rgb(206,119,119)',
  },
  finpertext: {
    fontSize: 16,
    color: 'white',
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    top: 30,
  },
  // 운동 타이틀
  titlehealth: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    height: '60%',
    right: 15,
    borderWidth: 2,
    borderColor: 'rgb(231,230,230)',
    borderRadius: 20,
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
  // 영양 타이틀
  titlepill: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    height: '60%',
    left: 15,
    borderWidth: 2,
    borderColor: 'rgb(231,230,230)',
    borderRadius: 20,
    backgroundColor: '#fff',
    zIndex: 2,
  },

  // 통계 영역
  statistics: {
    flex: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: '20%',
    top: 20,
    zIndex: 1,
  },
  // 차트 영역
  chart: {
    flex: 5,
    width: '80%',
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
    marginTop: 25,
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
    marginTop: 3,
  },
  cautiontext: {
    top: 5,
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 10,
  },
  cautiontext2: {
    top: 5,
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 3,
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
    width: 58,
    borderRadius: 35,
    margin: 5,
    backgroundColor: 'rgb(245,235,224)',
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
});
export default Access;
