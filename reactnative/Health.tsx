import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import TimeComponent from './datetimepicker';
import {Toggle} from './components';
import {HaddRoutine} from './api';
import {
  Camera,
  useCameraDevice,
  // useCameraDevices,
} from 'react-native-vision-camera';

import RNFS from 'react-native-fs';
import axios from 'axios';
import HealthSearch from './search_health';

interface RoutineAddProps {
  navigation: NavigationProp;
  userName: string;
  userEmail: string;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
}

const RoutineNameBox: React.FC<RoutineAddProps> = ({
  navigation,
  userName,
  userEmail,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const toggleModal = () => {
    RNFS.unlink(`${internalStoragePath}/${newFileName}`)
      .then(() => {
        console.log('파일 삭제 성공');
        RNFS.readdir(internalStoragePath).then(files => {
          console.log('폴더 내 파일 목록:', files);
          // 이 목록에 이동된 파일이 있는지 확인할 수 있음
        });
      })
      .catch(err => {
        console.log('파일 삭제 실패: ', err);
      });
    setModalVisible(!isModalVisible);
    setCameraImgPath('');
  };
  // const devices = useCameraDevices();
  const device = useCameraDevice('back');
  const camera = React.useRef(null);
  // 카메라 오픈 여부 상태 추가
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraImgPath, setCameraImgPath] = useState('');
  // 카메라 아이콘 클릭 핸들러
  const handleCameraButtonClick = () => {
    setIsCameraOpen(true);
  };

  //검색창
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  // 검색어가 변경될 때 호출될 함수
  const handleKeywordChange = (newKeyword: string) => {
    // 이곳에서 새로운 검색어를 사용할 수 있습니다.
    console.log('새로운 검색어:', newKeyword);
  };
  const handleSearchSelect = (selectedValue: string) => {
    console.log(selectedValue);
    setSelectedValue(selectedValue);
  };

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
  // const [tagsEnabled, setTagsEnabled] = useState<string>('');
  // 초기 상태에서는 빈 문자열 배열로 설정
  const [tagsEnabled, setTagsEnabled] = useState<string[]>([]);
  console.log(`태그 : ${tagsEnabled}`);

  // 루틴명 입력 핸들러
  const handleRoutineNameChange = (text: string) => {
    console.log(`입력된 루틴명: ${text}`);
    setRoutineName(text);
  };
  // 아이콘 추가 핸들러
  const handleAddButtonClick = () => {
    console.log('+버튼 클릭');
    // 여기에 "+" 버튼이 클릭됐을 때의 로직을 구현하세요.
  };

  const goHplogSet = async () => {
    navigation.navigate('hplogset');
  };

  // 세트 입력 핸들러
  const handleSetChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setSet(numericValue);
    console.log(`입력된 몇세트: ${numericValue}`);
  };
  // 횟수 입력 핸들러
  const handleRepsChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setReps(numericValue);
    console.log(`입력된 몇회: ${numericValue}`);
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
      setSelectedDaysOfWeek(selectedDaysOfWeek.filter(d => d !== day));
    } else {
      setSelectedDaysOfWeek([...selectedDaysOfWeek, day]);
    }
  };
  // 태그 설정 핸들러
  // const handletagsEnabled = (category: string) => {
  //   setTagsEnabled(category);
  //   console.log(`태그 ${category} 선택됨`);
  // };
  // 태그 버튼을 누를 때 선택 상태를 토글하는 함수
  const handletagsEnabled = (tag: string) => {
    if (tagsEnabled.includes(tag)) {
      // 이미 선택된 태그라면 선택 해제
      setTagsEnabled(tagsEnabled.filter(selectedTag => selectedTag !== tag));
    } else {
      // 선택되지 않은 태그라면 선택 추가
      setTagsEnabled([...tagsEnabled, tag]);
    }
  };

  // 추가하기 핸들러
  const handleSubmit = async () => {
    if (!selectedValue || !set || !reps) {
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
          hrtn_nm: selectedValue.split('-')[0],
          hrtn_set: parseInt(set),
          hrtn_reps: parseInt(reps),
          hrtn_day: daysString || '',
          hrtn_sdate: selectedDate || new Date().toDateString(),
          hrtn_time: selectedTime || currentTime,
          hrtn_alram: ertn_alram,
          hrtn_id: '',
          hrtn_cat: '',
          hrtn_tag: selectedValue.split('-')[1],
          hrtn_edate: '',
          hrtn_mem: userEmail,
        };

        const response = await axios.post(
          'http://43.200.178.131:3344/h_routines',
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
                onPress: () => navigation.navigate('Main'),
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

  // 내부 저장소의 경로 얻기
  const internalStoragePath = RNFS.DocumentDirectoryPath;
  // 사진찍기
  const onCameraButton = async () => {
    const timestamp = Date.now();
    const newFileName = `photo_${timestamp}.jpg`;
    if (!camera.current) return;
    const photo = await camera.current.takePhoto({
      flash: 'off',
      qualityPrioritization: 'speed',
    });

    await RNFS.moveFile(
      `/${photo.path}`,
      `file://${internalStoragePath}/${newFileName}`,
    )
      .then(() =>
        console.log(
          'Image Moved',
          `${photo.path}`,
          '-- to --',
          `file://${internalStoragePath}/${newFileName}`,
        ),
      )
      .then(() =>
        setCameraImgPath(`file://${internalStoragePath}/${newFileName}`),
      );
    RNFS.readdir(internalStoragePath).then(files => {
      console.log('폴더 내 파일 목록:', files);
      // 이 목록에 이동된 파일이 있는지 확인할 수 있음
    });
    setModalVisible(!isModalVisible);
    setNewFileName(newFileName);
  };

  // const https = require('https');

  const imageSearch = async () => {
    const formData = new FormData();
    formData.append('file', {
      uri: `file://${internalStoragePath}/${newFileName}`,
      type: 'image/jpeg',
      name: newFileName,
    });

    // const searchUrl = 'http://43.200.178.131:3344/imageSearch';
    const searchUrl = 'http://13.209.7.124:5000/upload';

    //   const HttpAgent = new https.Agent({rejectUnauthorized: false});

    axios
      .post(searchUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        //       httpsAgent: HttpAgent,
      })
      .then(response => {
        Alert.alert('이 기구가 맞나요?', response.data['predicted_class'], [
          {
            text: '네',
            onPress: () => {
              setIsCameraOpen(false);
              RNFS.unlink(`${internalStoragePath}/${newFileName}`);
              setModalVisible(!isModalVisible);
              setCameraImgPath('');
            },
          },
          {
            text: '아니요',
            onPress: () => {
              RNFS.unlink(`${internalStoragePath}/${newFileName}`);
              setModalVisible(!isModalVisible);
              setCameraImgPath('');
            },
          },
        ]);
      })
      .catch(error => {
        if (error.response) {
          console.error('서버 응답 오류:', error.response.data);
        } else if (error.request) {
          console.error('네트워크 오류', error.message);
        } else {
          console.error('오류', error.message);
        }
      });
  };

  return (
    <>
      {isCameraOpen && device !== null ? (
        // <View>
        //   <Image
        //     source={{uri: cameraImgPath}}
        //     style={{width: 300, height: 300}}
        //   />
        //   <Text>{cameraImgPath}</Text>
        // </View>
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            device={device}
            photo={true}
            isActive={true}
            ref={camera}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={toggleModal}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={{
                  uri: `file://${internalStoragePath}/${newFileName}`,
                }}
                style={{
                  width: 300,
                  height: 300,
                  transform: [{rotate: '-90deg'}],
                }}
              />
              <View
                style={{
                  width: 300,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity onPress={imageSearch}>
                  <View
                    style={{
                      width: 120,
                      height: 50,
                      backgroundColor: 'rgb(43,58,85)',
                      margin: 15,
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{textAlign: 'center', color: 'white'}}>
                      검색
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleModal}>
                  <View
                    style={{
                      width: 120,
                      height: 50,
                      backgroundColor: 'rgb(206,119,119)',
                      margin: 15,
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{textAlign: 'center', color: 'white'}}>
                      닫기
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <View style={styles.headercontainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => handleBackPress()}>
              <Text style={styles.backButton}>
                {'<              건강 루틴 추가하기'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <View style={styles.cameraSection}>
              <TouchableOpacity onPress={() => handleCameraButtonClick()}>
                <View style={styles.camerabutton}>
                  <Text style={styles.cameraText}>📷</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.cameraInfo}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: 17,
                  }}>
                  운동기구 카메라 인식
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 15,
                  }}>
                  - 이 기구 이름 뭐에요?
                </Text>
              </View>
            </View>
            <View style={styles.searchSection}>
              <View style={{zIndex: 1, width: '100%'}}>
                <HealthSearch
                  onKeywordChange={handleKeywordChange}
                  onSelect={handleSearchSelect}
                />
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

            {/* 시간 선택 */}
            <View style={styles.Timecontainer}>
              <TimeComponent onTimeChange={handleTimeChange} />
            </View>

            {/* 알림 설정 */}
            <Toggle
              label={'알림'}
              value={notificationEnabled}
              onChange={handleNotificationChange}
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
          </View>
        </View>
      )}
      {isCameraOpen && device !== null ? (
        <TouchableOpacity onPress={onCameraButton} style={styles.addContainer}>
          <View style={styles.addTab}>
            <Text style={styles.addtext}>사진검색</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleSubmit} style={styles.addContainer}>
          <View style={styles.addTab}>
            <Text style={styles.addtext}>추가하기</Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '80%',
    alignItems: 'center',
    width: '100%',
  },

  headercontainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flex: 0.5,
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

  backButton: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    color: 'black',
    left: 10,
  },

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
    marginTop: 50,
    width: 300,
    flexDirection: 'row',
    justifyContent: 'center', // 수직 가운데 정렬
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 5,
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
    marginTop: 15,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
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
    marginTop: 10,
  },

  /// 알람 설정
  notificationcontainer: {
    marginTop: 10,
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
    paddingRight: 10,
    paddingLeft: 10,
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    backgroundColor: 'rgb(127,127,127)',
  },

  selectedButton: {
    paddingRight: 10,
    paddingLeft: 10,
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: 'rgb(43,58,85)',
    borderRadius: 5,
  },

  //addContainer
  addContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
    backgroundColor: '#fff',
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
  cameraContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  camerabutton: {
    backgroundColor: '#CE7676',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
  },

  cameraText: {
    fontSize: 32,
    color: 'black',
    textAlign: 'center',
  },

  cameraSection: {
    width: '72%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: '5%',
  },

  cameraInfo: {
    fontSize: 14,
    paddingVertical: 10,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
  },

  searchSection: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4%',
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
