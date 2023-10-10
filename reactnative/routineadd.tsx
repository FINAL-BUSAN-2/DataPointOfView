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

const RoutineAdd = () => {
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
  // 알림 기능
  const [notificationEnabled, setNotificationEnabled] =
    useState<boolean>(false);
  // 반복 기능
  const [repeatEnabled, setRepeatEnabled] = useState<boolean>(false);
  // 반복 요일 선택
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<string[]>([]);
  // 추가 설정
  const [addtionEnabled, setAddtionEnabled] = useState<string>('');
  // 추가 설정
  const [isAdditionEnabled, setIsAdditionEnabled] = useState<boolean>(false);
  // 추가하기
  const [newTask, setNewTask] = useState('');

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

  //시간
  // 현재시간
  const currentTime = new Date().toLocaleTimeString();
  // 현재 날짜를 YYYY-MM-DD 형식으로 가져옴.
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [startDate,setStartDate] = useState<string>(formattedToday); // 시작 날짜 상태


  // 반복 요일 선택 핸들러
  const handleDayOfWeekToggle = (day: string) => {
    if (selectedDaysOfWeek.includes(day)) {
      setSelectedDaysOfWeek(selectedDaysOfWeek.filter(d => d !== day));
    } else {
      setSelectedDaysOfWeek([...selectedDaysOfWeek, day]);
    }
  };
  // 추가 설정 핸들러
  const handleaddtionEnabled = (category: string) => {
    setAddtionEnabled(category);
  };
  //

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          {/* 루틴명 입력 */}
          <View style={styles.Routinename}>
            <TextInput
              style={styles.Routineinput}
              value={routineName}
              onChangeText={handleRoutineNameChange}
              placeholder="건강기능식품명을 입력해 주세요!"
            />
            {/* 카메라 아이콘 */}
            <TouchableOpacity
              onPress={() => console.log('Camera button pressed')}>
              <Image
                source={require('./android/app/src/assets/camera.png')}
                style={styles.cameraicon}
              />
            </TouchableOpacity>
          </View>
          {/* 루틴 아이콘 */}
          <View style={styles.Routineicon}>
            <TouchableOpacity onPress={handleAddButtonClick}>
              <Image
                source={require('./android/app/src/assets/flo_ex.png')}
                style={styles.Routineicon_add}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 세트 & 횟수 입력 박스 */}
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

        
        {/* 현재 시간 표시 */}
      <View style={styles.text}>
      <Text>시간 {currentTime}</Text>
      </View>
      

        {/* 알림 설정 */}
        <View style={styles.notificationcontainer}>
          <Text style={styles.notification}>알림</Text>
          {/* 알림 설정 스위치 */}
          <View style={styles.notificationswitch}>
            <Switch
              value={notificationEnabled}
              onValueChange={value => setNotificationEnabled(value)}
              style={{transform: [{scaleX: 1.5}, {scaleY: 1.5}]}}
            />
          </View>
        </View>

        {/* 반복 설정 */}
        <View style={styles.repeatcontainer}>
          <Text style={styles.repeat}>반복</Text>
          {/* 반복 설정 스위치 */}
          <View style={styles.repeatswitch}>
            <Switch
              value={repeatEnabled}
              onValueChange={value => setRepeatEnabled(value)}
              style={{transform: [{scaleX: 1.5}, {scaleY: 1.5}]}}
            />
          </View>
        </View>
        {/* 요일 선택 */}
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

        {/* 추가 설정 */}
        <View style={styles.addtioncontainer}>
          <Text style={styles.addtion}>추가 설정</Text>
          {/* 추가 설정 스위치 */}
          <View style={styles.addtionswitch}>
            <Switch
              value={isAdditionEnabled}
              onValueChange={value => setIsAdditionEnabled(value)}
              style={{transform: [{scaleX: 1.5}, {scaleY: 1.5}]}}
            />
          </View>
        </View>
        {/* 태그 및 컬러 선택 */}
        {isAdditionEnabled && (
          <>
            {/* 태그 선택 */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>태그</Text>
              <TouchableOpacity
                onPress={() => handleaddtionEnabled('에너지 및 다량 영양소')}
                style={
                  addtionEnabled === '에너지 및 다량 영양소'
                    ? styles.selectedButton
                    : styles.button
                }>
                <Text>에너지 및 다량 영양소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleaddtionEnabled('비타민')}
                style={
                  addtionEnabled === '비타민'
                    ? styles.selectedButton
                    : styles.button
                }>
                <Text>비타민</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleaddtionEnabled('무기질')}
                style={
                  addtionEnabled === '무기질'
                    ? styles.selectedButton
                    : styles.button
                }>
                <Text>무기질</Text>
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 20}}></View>

            {/* 컬러 선택 */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>컬러</Text>
              <TouchableOpacity onPress={() => console.log('Red selected')}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: '#FF0000',
                    marginLeft: 10,
                    borderRadius: 15,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log('Yellow selected')}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: '#FFB700',
                    marginLeft: 10,
                    borderRadius: 15,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log('Lime selected')}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: '#42FF00',
                    marginLeft: 10,
                    borderRadius: 15,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log('Purple selected')}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: '#CC00FF',
                    marginLeft: 10,
                    borderRadius: 15,
                  }}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* 추가하기 */}
      <View style={styles.addContainer}>
        <View style={styles.addTab}>
          <Text style={styles.addtext}>추가하기</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(231,230,230)',
  },
  scrollView: {},
  header: {
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

  /// 몇회&몇정 설정
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
  ///시간
  text: {
    alignItems: 'center',
    justifyContent: 'center',
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

  cat: {
    marginTop: 200,
    width: 350,
    height: 500,
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
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  //addtext
  addtext: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default RoutineAdd;