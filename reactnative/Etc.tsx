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
//import {EaddRoutine} from './api';
import axios from 'axios';
import {Alert} from 'react-native';

interface RoutineAddProps {
  navigation: NavigationProp;
  userName: string;
  userEmail: string;
}

const RoutineNameBox: React.FC<RoutineAddProps> = ({
  navigation,
  userName,
  userEmail,
}) => {
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

  const handleNotificationChange = (newValue: 0 | 1) => {
    setNotificationEnabled(newValue === 1);
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
  // const [tagsEnabled, setTagsEnabled] = useState<string>('');

  // 루틴명 입력 핸들러
  // 루틴명 입력 핸들러
  const handleRoutineNameChange = (text: string) => {
    setRoutineName(text);
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

  // // 태그 설정 핸들러
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
          ertn_nm: routineName,
          ertn_set: parseInt(set),
          ertn_reps: parseInt(reps),
          ertn_day: daysString || null,
          ertn_sdate: selectedDate || new Date().toDateString(),
          ertn_time: selectedTime || new Date().toTimeString(),
          ertn_alram: ertn_alram,
          ertn_id: '',
          ertn_cat: '',
          ertn_tag: '',
          ertn_edate: '',
          ertn_mem: userEmail,
        };
        console.log({userEmail}, requestData);

        const response = await axios.post(
          'http://43.200.178.131:3344/routines',
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
          <Text style={styles.backButton}>{'< 기타 루틴 추가하기'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.etcheader}>
            {/* 루틴명 입력 */}

            <View style={styles.Routinename}>
              <TextInput
                style={styles.Routineinput}
                value={routineName}
                onChangeText={handleRoutineNameChange}
                placeholder="루틴명을 입력해 주세요!"
              />
            </View>
          </View>

          {/*일%회 입력 박스 */}
          <View style={styles.setreps}>
            {/* 일 입력 */}
            <TextInput
              style={styles.setrepsinput}
              value={set}
              onChangeText={handleSetChange}
              placeholder="       "
              keyboardType="numeric"
            />
            <Text style={styles.setrepstext}>일 X</Text>
            {/* 몇회 입력 */}
            <TextInput
              style={styles.setrepsinput}
              value={reps}
              onChangeText={handleRepsChange}
              placeholder="       "
              keyboardType="numeric"
            />
            <Text style={styles.setrepstext}>회</Text>
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

          {/* 태그 선택 태그없애기로함 */}

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
    backgroundColor: '#fff',
    width: '100%',
  },
  scrollView: {},
  etcheader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  Routinename: {
    marginTop: 20,
    width: 300,
    height: 50,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: 'rgb(175,171,171)',
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

  /// 세트 & 횟수 설정
  setreps: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'center', // 수직 가운데 정렬
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
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
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
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

  //addContainer
  addContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    backgroundColor: '#fff',
    borderBottomWidth: 0,
    borderBottomColor: '#ddd',
  },

  backButton: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    color: 'black',
  },
});

export default RoutineNameBox;
