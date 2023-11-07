import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import TimeComponent from './datetimepicker';
import {Toggle} from './components';
import {PaddRoutine} from './api';
import {Alert} from 'react-native';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';

import Search from './search';

interface RoutineAddProps {
  navigation: NavigationProp;
  userName: string;
  userEmail: string;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
  completedItems: string[];
  setCompletedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const RoutineNameBox: React.FC<RoutineAddProps> = ({
  navigation,
  userName,
  userEmail,
  completedItems,
  setCompletedItems,
}) => {
  const [selectedPillCd, setSelectedPillCd] = useState<string | null>(null);
  //검색창
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  // 검색어가 변경될 때 호출될 함수
  const handleKeywordChange = (newKeyword: string) => {
    // 이곳에서 새로운 검색어를 사용할 수 있습니다.
    console.log('새로운 검색어:', newKeyword);
  };
  const handleSearchSelect = (selectedValue: string) => {
    console.log('Selected value:', selectedValue);
    setSelectedValue(selectedValue);
  };

  /// 뒤로 가기 버튼 클릭 시 실행할 함수
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
    if (!selectedPillCd || !set || !reps) {
      // 필수 항목 중 하나라도 비어 있을 경우 경고 표시
      Alert.alert('모든 필수 항목을 작성해 주세요.');
    } else {
      try {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;
        const daysString = selectedDaysOfWeek.toString();
        const ertn_alram = notificationEnabled ? 1 : 0;

        const requestData = {
          prtn_nm: selectedPillCd,
          prtn_set: parseInt(set),
          prtn_reps: parseInt(reps),
          prtn_day: daysString || null,
          prtn_sdate: selectedDate || new Date().toDateString(),
          prtn_time: selectedTime || currentTime,
          prtn_alram: ertn_alram,
          prtn_id: '',
          prtn_cat: '',
          prtn_tag: '',
          prtn_edate: '',
          prtn_mem: userEmail,
        };

        const response = await axios.post(
          'http://43.200.178.131:3344/p_routines',
          requestData,
          // {timeout: 10000}, // 10초 타임아웃
        );
        if (response.status >= 200 && response.status < 300) {
          Alert.alert(
            '성공', // 제목
            '루틴이 성공적으로 추가되었습니다!', // 메시지
            [
              {
                text: '확인',
                onPress: () => {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Main'}],
                  });
                },
              },
            ],
          );
        }
      } catch (error) {
        Alert.alert('오류', '루틴을 추가하는 동안 문제가 발생했습니다.');
        console.error('루틴 추가 오류:', error);
      }
    }
  };

  //
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleBackPress()}>
          <Text style={styles.backButton}>
            {'<              영양 루틴 추가하기'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.scrollView}>
          {/* <ScrollView style={styles.scrollView}> */}
          {/* 루틴입력 */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              left: 10,
              // backgroundColor: 'orange',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 30,
                right: 10,
                top: 7,
                // bottom: 5,
              }}>
              🔍
            </Text>
            <View
              style={{
                alignSelf: 'center',
                width: '75%',
                // backgroundColor: 'green',
              }}>
              {/* <View> */}
              <Search
                onKeywordChange={handleKeywordChange}
                onSelect={(pillName, pillCd) => {
                  setSelectedPillCd(pillCd);
                  setSelectedValue(pillName);
                }}
              />
            </View>
          </View>
          {/* <KeyboardAvoidingView style={{flex: 0.15, top: 10}} behavior="padding"> */}
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
          <View style={styles.caltotal}>
            <TouchableOpacity
              onPress={() => setShowCalendar(true)}
              style={styles.calendarContainer}>
              {!showCalendar ? (
                <View>
                  <Text style={styles.defaultText}>
                    {selectedDate}
                    <Text style={styles.calendarText}>에 시작할 거예요</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowCalendar(true)}></TouchableOpacity>
                </View>
              ) : (
                <Modal>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Calendar
                        onDayPress={handleDateSelect}
                        markedDates={{[selectedDate]: {selected: true}}}
                      />
                      <TouchableOpacity onPress={() => setShowCalendar(false)}>
                        <View
                          style={{
                            width: '100%',
                            alignItems: 'center',
                            marginTop: 10,
                          }}>
                          <Text>취소</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}
            </TouchableOpacity>
          </View>
          {/* 시간 선택 */}
          <View style={styles.Timecontainer}>
            <TimeComponent onTimeChange={handleTimeChange} />
          </View>
          <View style={{alignItems: 'center'}}>
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
                <View>
                  <View style={styles.dayPickerContainer}>
                    <View style={styles.dayButtonRow}>
                      {['월', '화', '수', '목', '금', '토', '일'].map(day => (
                        <TouchableOpacity
                          key={`day-${day}`}
                          onPress={() => handleDayOfWeekToggle(day)}>
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
                </View>
              )}
            </Toggle>
          </View>
        </View>
        {/* </ScrollView> */}
        {/* </KeyboardAvoidingView> */}
        {/* 추가하기 */}
        <TouchableOpacity onPress={handleSubmit} style={styles.addContainer}>
          <View style={styles.addTab}>
            <Text style={styles.addtext}>추가하기</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: '10%',
    flex: 1,
    alignItems: 'center',
    alignContent: 'flex-start',
    backgroundColor: '#fff',
  },
  header: {
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    // padding: 20,
    // height: 30,
    // borderBottomWidth: 0,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
  },
  scrollView: {
    // flex: 1,
    // height: 500,
    width: '100%',
    // backgroundColor: 'purple',
    marginBottom: '18%',
  },

  /// 몇회 & 몇정 설정
  setreps: {
    // flex: 1,
    width: 300,
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'center', // 수직 가운데 정렬
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 30,
    // top: 20,
    // backgroundColor: 'red',
    // marginTop: 20,
    // bottom: 200,
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
  caltotal: {
    // top: 30,
    marginTop: 30,
  },
  calendarContainer: {
    marginTop: 5,
    width: '80%',
    // position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    // marginBottom: 50,
    // top: 140,
    // bottom: 200,
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
    // flex: 0.2,
    // top: 50,
    height: '40%',
    // backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    // margintop: 50,
    // marginBottom: 30,
    // bottom: 200,
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    height: 70,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 50, // for Android
  },
  //addTab
  addTab: {
    flexDirection: 'row',
    height: 60,
    width: '80%',
    borderRadius: 50,
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

  backButton: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    color: 'black',
    left: 10,
  },

  etcheader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

export default RoutineNameBox;
