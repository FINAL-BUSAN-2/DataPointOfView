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

const MyScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dailytext}>님의 오늘의 기록</Text>
      </View>
      <View style={styles.body}>
        <Image
          source={require('./android/app/src/img/staticbody.png')}
          style={styles.bodyimg}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.health}>
          <Text style={styles.healthtext}>건강 통계</Text>
          <View style={styles.healthstatistics}>
            <View style={styles.outercir}>
              <View style={styles.innercir}></View>
              <Text style={styles.innertext}>80분</Text>
              <Text style={styles.innertext}>1000 kcal</Text>
            </View>
          </View>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pilltext}>영양 통계</Text>
          <View style={styles.pillstatistics}>
            <View style={styles.pillbar}></View>
            <View style={styles.pillbar}></View>
            <View style={styles.pillbar}></View>
          </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailytext: {
    fontSize: 16,
    alignSelf: 'center',
    color: 'black',
    fontWeight: 'bold',
  },

  body: {
    flex: 5.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyimg: {
    width: '85%',
    height: '100%',
  },
  // 통계
  footer: {
    flex: 2.5,
    flexDirection: 'row',
    paddingBottom: '20%',
  },
  // 건강 통계
  health: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 건강 통계 텍스트
  healthtext: {
    flex: 1,
    fontWeight: 'bold',
  },
  // 건강 통계 시각화
  healthstatistics: {
    flex: 3,
  },
  // 건강 통계 시각화 임시1
  outercir: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgb(254,252,243)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 건강 통계 시각화 임시2
  innercir: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    backgroundColor: 'rgb(231,230,230)',
  },
  // 건강 통계 시각화 임시 텍스트
  innertext: {
    fontWeight: 'bold',
  },
  // 영양 통계
  pill: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 영양 통계 텍스트
  pilltext: {
    flex: 1,
    fontWeight: 'bold',
  },
  // 영양 통계 시각화
  pillstatistics: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 영양 통계 막대
  pillbar: {
    width: 100,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 2,
    margin: 5,
    backgroundColor: 'rgb(175,171,171)',
  },
});

export default MyScreen;
