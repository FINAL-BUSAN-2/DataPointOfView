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
import {Calendar} from 'react-native-calendars';
import TimeComponent from './datetimepicker';
import {Toggle} from './components';
import {PaddRoutine} from './api';
import {Alert} from 'react-native';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';

import Search from './search_health';

interface RoutineAddProps {
  navigation: NavigationProp;
}

const RoutineNameBox: React.FC<RoutineAddProps> = ({navigation}) => {
  // 뒤로 가기 버튼 클릭 시 실행할 함수
  const handleBackPress = () => {
    navigation.goBack();
  };
  //루틴명 입력
  const [routineName, setRoutineName] = useState('');
  // 세트 입력
  const [set, setSet] = useState('');
  // 횟수 입력
  const [reps, setReps] = useState('');
  // 달력 날짜 선택
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  // 달력 호출
  const [showCalendar, setShowCalendar] = useState(false);

  //시간선택
  const [selectedTime, setSelectedTime] = useState('');
  const handleTimeChange = (newTime: string) => {
    setSelectedTime(newTime);
  };

  // 알림 기능
  const [notificationEnabled, setNotificationEnabled] =
    useState<boolean>(false);
  const handleNotificationChange = (newValue: any) => {
    setNotificationEnabled(newValue);
    if (newValue) {
      console.log('알림 on');
    } else {
      console.log('알림 off');
    }
  };

  // 반복 기능
  const [repeatEnabled, setRepeatEnabled] = useState<boolean>(false);
  // 반복 요일 선택
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<string[]>([]);

  //태그 설정
  // 초기 상태로 빈 문자열 ('')을 가진 tagsEnabled 상태 생성
  //const [tagsEnabled, setTagsEnabled] = useState<string>('');

  //////////핸들러
  // 루틴명 입력 핸들러
  const handleRoutineNameChange = (text: string) => {
    setRoutineName(text);
    console.log(`입력된 루틴명: ${text}`); // 입력된 루틴명을 콘솔에 출력
  };
  // 아이콘 추가 핸들러
  const handleAddButtonClick = () => {
    console.log('+버튼 클릭');
    // 여기에 "+" 버튼이 클릭됐을 때의 로직을 구현하세요.
  };
  // 몇회 입력 핸들러
  const handleSetChange = (text: string) => {
    //숫자가 아닌 문자가 입력될 경우 입력x (숫자가아닌문자는빈문자열로바꿈)
    const numericValue = text.replace(/[^0-9]/g, '');
    setSet(numericValue);
    console.log(`입력된 몇회: ${numericValue}`);
  };
  // 몇정 입력 핸들러
  const handleRepsChange = (text: string) => {
    //숫자가 아닌 문자가 입력될 경우 입력x (숫자가아닌문자는빈문자열로바꿈)
    const numericValue = text.replace(/[^0-9]/g, '');
    setReps(numericValue);
    console.log(`입력된 몇정: ${numericValue}`);
  };
  // 달력 호출 및 선택 핸들러
  // const handleDateSelect = (date: any) => {
  const handleDateSelect = (date: any) => {
    setSelectedDate(date.dateString);
    setShowCalendar(false);
    console.log(`선택된 날짜: ${date.dateString}`);
  };

  // 반복 요일 선택 핸들러
  const handleDayOfWeekToggle = (day: string) => {
    if (selectedDaysOfWeek.includes(day)) {
      // 이미 선택된 요일을 다시 클릭한 경우, 해당 요일을 배열에서 제거
      setSelectedDaysOfWeek(selectedDaysOfWeek.filter(d => d !== day));
      console.log(`요일 ${day} 해제됨`);
    } else {
      // 아직 선택되지 않은 요일을 클릭한 경우, 해당 요일을 배열에 추가
      setSelectedDaysOfWeek([...selectedDaysOfWeek, day]);
      console.log(`요일 ${day} 선택됨`);
    }
  };

  // 태그 선택 핸들러
  // const handletagsEnabled = (tag: string) => {
  //   console.log(`태그 ${tag} 선택됨`);
  //   setTagsEnabled(tag);
  // };

  // 추가하기 핸들러
  const handleSubmit = async () => {
    if (!routineName || !set || !reps) {
      // 필수 항목 중 하나라도 비어 있을 경우 경고 표시
      Alert.alert('모든 필수 항목을 작성해 주세요.');
    } else {
      try {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const selectedTime = `${hours}:${minutes}`;
        const daysString = selectedDaysOfWeek.toString();
        const ertn_alram = notificationEnabled ? 1 : 0;

        const requestData = {
          prtn_nm: routineName,
          prtn_set: parseInt(set),
          prtn_reps: parseInt(reps),
          prtn_day: daysString,
          prtn_sdate: selectedDate || new Date().toDateString(),
          prtn_time: selectedTime || new Date().toTimeString(),
          prtn_alram: ertn_alram,
          prtn_id: '',
          prtn_cat: '',
          prtn_tag: '',
          prtn_edate: '',
          prtn_mem: '',
        };
        console.log('44444444444444444444444===', requestData);

        const response = await axios.post(
          'http://43.200.178.131:3344/p_routines',
          requestData,
          {timeout: 10000}, // 10초 타임아웃
        );
        console.log('55555555555555555555555555===', response);
        if (response.status >= 200 && response.status < 300) {
          Alert.alert('성공', '루틴이 성공적으로 추가되었습니다!');
        } else {
          Alert.alert('오류', '루틴을 추가하는 동안 문제가 발생했습니다.');
        }
      } catch (error) {
        Alert.alert('오류', '루틴을 추가하는 동안 문제가 발생했습니다.');
        console.error('루틴 추가 오류:', error);
      }
    }
  };

  //
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleBackPress()}>
          <Text style={styles.backButton}>{'< 영양 루틴 추가하기'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* 루틴입력 */}
          <View style={{zIndex: 1}}>
            <Search />
          </View>
          {/* 
          <View style={styles.Routinename}>
            <TextInput
              style={styles.Routineinput}
              value={routineName}
              onChangeText={handleRoutineNameChange}
              placeholder="루틴명을 입력해 주세요!"
              onFocus={() => navigation.navigate('Search')}
            />
          </View> */}

          {/* 루틴 아이콘 */}
          {/* <View style={styles.Routineicon}>
              <TouchableOpacity onPress={handleAddButtonClick}>
                <Image
                  source={require('./android/app/src/img/flo_ex.png')}
                  style={styles.Routineicon_add}
                />
              </TouchableOpacity>
            </View>
            </View>

          {/*몇회&몇정 입력 박스 */}
          <View style={styles.setreps}>
            {/* 몇회 입력 */}
            <TextInput
              style={styles.setrepsinput}
              value={set}
              onChangeText={handleSetChange}
              placeholder="       "
              keyboardType="numeric"
            />
            <Text style={styles.setrepstext}>회 X</Text>
            {/* 몇정 입력 */}
            <TextInput
              style={styles.setrepsinput}
              value={reps}
              onChangeText={handleRepsChange}
              placeholder="       "
              keyboardType="numeric"
            />
            <Text style={styles.setrepstext}>정</Text>
          </View>

          {/* 날짜 선택 (달력 호출) */}
          <TouchableOpacity
            onPress={() => setShowCalendar(true)}
            style={styles.calendarContainer}>
            {!showCalendar ? (
              <>
                <Text style={styles.defaultText}>
                  {selectedDate}
                  <Text style={styles.calendarText}>에 시작할 거예요</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => setShowCalendar(true)}></TouchableOpacity>
              </>
            ) : (
              <>
                <Calendar
                  onDayPress={handleDateSelect}
                  markedDates={{[selectedDate]: {selected: true}}}
                />
                <TouchableOpacity onPress={() => setShowCalendar(false)}>
                  <Text>취소</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
          {/* 시간 선택 */}
          <View style={styles.Timecontainer}>
            <TimeComponent onTimeChange={handleTimeChange} />
          </View>

          <Toggle
            label={'알림'}
            value={notificationEnabled}
            onChange={setNotificationEnabled}
          />

          {/* 반복 설정 */}
          <Toggle
            label={'반복'}
            value={repeatEnabled}
            onChange={setRepeatEnabled}>
            {repeatEnabled && (
              <>
                <View style={styles.dayPickerContainer}>
                  <View style={styles.dayButtonRow}>
                    {['월', '화', '수', '목', '금', '토', '일'].map(day => (
                      <TouchableOpacity
                        key={`day-${day}`}
                        onPress={() => handleDayOfWeekToggle(day)}
                        style={[
                          styles.dayButton,
                          selectedDaysOfWeek.includes(day) &&
                            styles.selectedDayButton,
                        ]}>
                        <Text
                          key={`text-${day}`}
                          style={[
                            styles.dayButtonText,
                            selectedDaysOfWeek.includes(day) &&
                              styles.selectedDayButtonText,
                          ]}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}
          </Toggle>
        </ScrollView>

        {/* 추가하기 */}
        <TouchableOpacity onPress={handleSubmit} style={styles.addContainer}>
          <View style={styles.addTab}>
            <Text style={styles.addtext}>추가하기</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'rgb(231,230,230)',
  },
  scrollView: {},
  pillheader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  Routinename: {
    marginTop: 20,
    width: 300,
    height: 50,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: '#000000',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center', // 수직 가운데 정렬
    alignItems: 'center',
    marginBottom: 10,
  },
  Routineinput: {
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
  },
  cameraicon: {
    width: 34,
    height: 34,
    marginLeft: 30,
  },
  Routineicon: {
    marginTop: 20, // Adjust this to change the vertical position of the timeline bar
    left: 0,
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom:20,
  },
  Routineicon_add: {
    width: 34,
    height: 34,
  },

  /// 몇회 & 몇정 설정
  setreps: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'center', // 수직 가운데 정렬
    alignItems: 'center',
    marginBottom: 10,
  },
  setrepsinput: {
    padding: 8,
    fontSize: 16,
    borderBottomWidth: 2, // 아랫줄 테두리 추가
    borderBottomColor: 'black', // 아랫줄 색상 설정
  },
  setrepstext: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000000',
  },

  /// 캘린더
  calendarContainer: {
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  defaultText: {
    fontSize: 18,
    color: '#999999',
  },
  calendarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  selectedDate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  // 시간 설정
  Timecontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  /// 알람 설정
  notificationcontainer: {
    marginTop: 0,
    width: 360,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between', // 수직 가운데 정렬
    alignItems: 'center',
    marginBottom: 10,
  },
  notification: {
    marginLeft: 50,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000000',
  },
  notificationswitch: {
    marginRight: 50,
  },

  /// 반복
  repeatcontainer: {
    marginTop: 0,
    width: 360,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between', // 수직 가운데 정렬
    alignItems: 'center',
    marginBottom: 10,
  },
  repeat: {
    marginLeft: 50,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000000',
  },
  repeatswitch: {
    marginRight: 50,
  },
  dayButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dayPickerContainer: {
    marginTop: 0,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  dayButton: {},

  selectedDayButton: {},

  dayButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(43,58,85)',
  },

  selectedDayButtonText: {
    color: 'rgb(206,119,119)',
  },

  /// 추가 설정
  addtioncontainer: {
    marginTop: 0,
    width: 360,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between', // 수직 가운데 정렬
    alignItems: 'center',
    marginBottom: 10,
  },
  addtion: {
    marginLeft: 50,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000000',
  },
  addtionswitch: {
    marginRight: 50,
  },
  button: {
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
  },

  selectedButton: {
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: 'rgb(231,230,230)',
    borderRadius: 5,
  },

  checklist: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 200,
  },

  //addContainer
  addContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    height: 70,
    alignItems: 'center',
    elevation: 50, // for Android
  },
  //addTab
  addTab: {
    flexDirection: 'row',
    height: 80,
    width: '100%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'rgb(43,58,85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  //addtext
  addtext: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    padding: 20,
    //backgroundColor: 'rgb(43,58,85)', //rgb(43,58,85)
    borderBottomWidth: 0,
    borderBottomColor: '#ddd',
  },

  backButton: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    color: 'black',
  },

  etcheader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});

export default RoutineNameBox;
