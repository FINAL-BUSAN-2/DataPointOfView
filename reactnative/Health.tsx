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
import {HaddRoutine} from './api';
import {Alert} from 'react-native';
interface RoutineAddProps {
  navigation: NavigationProp;
}

const RoutineNameBox: React.FC<RoutineAddProps> = ({navigation}) => {
  // 뒤로 가기 버튼 클릭 시 실행할 함수
  const handleBackPress = () => {
    navigation.goBack();
  };
  // 루틴명 입력
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
  const [tagsEnabled, setTagsEnabled] = useState<string>('');

  // 루틴명 입력 핸들러
  const handleRoutineNameChange = (text: string) => {
    setRoutineName(text);
  };
  // 아이콘 추가 핸들러
  const handleAddButtonClick = () => {
    console.log('+버튼 클릭');
    // 여기에 "+" 버튼이 클릭됐을 때의 로직을 구현하세요.
  };
  // 세트 입력 핸들러
  const handleSetChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setSet(numericValue);
  };
  // 횟수 입력 핸들러
  const handleRepsChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setReps(numericValue);
  };
  // 달력 호출 및 선택 핸들러
  const handleDateSelect = (date: any) => {
    setSelectedDate(date.dateString);
    setShowCalendar(false);
  };
  // 반복 요일 선택 핸들러
  const handleDayOfWeekToggle = (day: string) => {
    if (selectedDaysOfWeek.includes(day)) {
      setSelectedDaysOfWeek(selectedDaysOfWeek.filter(d => d !== day));
    } else {
      setSelectedDaysOfWeek([...selectedDaysOfWeek, day]);
    }
  };
  // 태그 설정 핸들러
  const handletagsEnabled = (category: string) => {
    setTagsEnabled(category);
    console.log(`태그 ${category} 선택됨`);
  };

  // 추가하기 핸들러
  const handleSubmit = async () => {
    if (!routineName || !set || !reps || !selectedDate || !selectedTime) {
      // 필수 항목 중 하나라도 비어 있을 경우 경고 표시
      Alert.alert('모든 항목을 작성해 주세요.');
    } else {
      // 'addRoutine' 함수가 비동기로 작동하도록 'await' 키워드를 사용합니다.
      try {
        await HaddRoutine(
          routineName, // 루틴명
          parseInt(set), // 세트
          parseInt(reps), // 횟수
          tagsEnabled, // 태그
          selectedDaysOfWeek, // 반복요일
          selectedDate, // 날짜선택
          selectedTime, // 시간
          notificationEnabled, // 알림여부
        );

        // DB에 데이터가 성공적으로 저장되었을 때 성공 메시지를 표시합니다.
        Alert.alert('성공', '루틴이 성공적으로 추가되었습니다!');
      } catch (error) {
        // 에러가 발생하면 에러 메시지를 표시할 수 있습니다.
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
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.healthheader}>
            {/* 루틴명 입력 */}
            <View style={styles.Routinename}>
              <TextInput
                style={styles.Routineinput}
                value={routineName}
                onChangeText={handleRoutineNameChange}
                placeholder="루틴 이름을 설정해주세요"
              />
              {/* 카메라 아이콘 */}
              <TouchableOpacity
                onPress={() => console.log('Camera button pressed')}>
                <Image
                  source={require('./android/app/src/img/camera.png')}
                  style={styles.cameraicon}
                />
              </TouchableOpacity>
            </View>
            {/* 루틴 아이콘 */}
            <View style={styles.Routineicon}>
              <TouchableOpacity onPress={handleAddButtonClick}>
                <Image
                  source={require('./android/app/src/img/flo_ex.png')}
                  style={styles.Routineicon_add}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 세트 & 횟수 입력 박스 */}
          <View style={styles.setreps}>
            {/* 세트 입력 */}
            <TextInput
              style={styles.setrepsinput}
              value={set}
              onChangeText={handleSetChange}
              placeholder="       "
              keyboardType="numeric"
            />
            <Text style={styles.setrepstext}>세트 X</Text>
            {/* 횟수 입력 */}
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

          {/* 태그 선택 */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: '15%',
            }}>
            <Text>태그</Text>
            <TouchableOpacity
              onPress={() => handletagsEnabled('Upper Body')}
              style={
                tagsEnabled === 'Upper Body'
                  ? styles.selectedButton
                  : styles.button
              }>
              <Text>상체</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handletagsEnabled('Lower Body')}
              style={
                tagsEnabled === 'Lower Body'
                  ? styles.selectedButton
                  : styles.button
              }>
              <Text>하체</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handletagsEnabled('Core')}
              style={
                tagsEnabled === 'Core' ? styles.selectedButton : styles.button
              }>
              <Text>코어</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handletagsEnabled('Cardio')}
              style={
                tagsEnabled === 'Cardio' ? styles.selectedButton : styles.button
              }>
              <Text>유산소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handletagsEnabled('Stretching')}
              style={
                tagsEnabled === 'Stretching'
                  ? styles.selectedButton
                  : styles.button
              }>
              <Text>스트레칭</Text>
            </TouchableOpacity>
          </View>

          {/* 알림 설정 */}
          <Toggle
            label={'알림'}
            value={notificationEnabled}
            onChange={handleNotificationChange}
          />

          {/* 알림 설정 */}
          {/* <View style={styles.notificationcontainer}>
          <Text style={styles.notification}>알림</Text>
          알림 설정 스위치
          <View style={styles.notificationswitch}>
            <Switch
              value={notificationEnabled}
              onValueChange={value => setNotificationEnabled(value)}
              style={{transform: [{scaleX: 1.5}, {scaleY: 1.5}]}}
            />
          </View>
        </View> */}

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

          {/* 반복 설정 */}
          {/* <View style={styles.repeatcontainer}>
          <Text style={styles.repeat}>반복</Text> */}
          {/* 반복 설정 스위치 */}
          {/* <View style={styles.repeatswitch}>
            <Switch
              value={repeatEnabled}
              onValueChange={value => setRepeatEnabled(value)}
              style={{transform: [{scaleX: 1.5}, {scaleY: 1.5}]}}
            />
          </View>
        </View> */}
          {/* 요일 선택 */}
          {/* {repeatEnabled && (
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
        )} */}
        </ScrollView>
      </View>
      {/* 추가하기 */}
      <TouchableOpacity onPress={handleSubmit} style={styles.addContainer}>
        <View style={styles.addTab}>
          <Text style={styles.addtext}>추가하기</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(231,230,230)',
    width: '100%',
  },
  header: {
    height: '10%',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgb(43,58,85)', //rgb(43,58,85)
    borderBottomWidth: 0,
    borderBottomColor: '#ddd',
  },

  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
    color: 'rgb(231,230,230)',
  },
  scrollView: {},
  healthheader: {
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

  /// 세트 & 횟수 설정
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
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: '10%',
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

  //addContainer
  addContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
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
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  //addtext
  addtext: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default RoutineNameBox;
