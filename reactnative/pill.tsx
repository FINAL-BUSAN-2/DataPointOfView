import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  RoutineAdd: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface RoutineAddProps {
  navigation: NavigationProp;
}

const RoutineAdd: React.FC<RoutineAddProps> = ({navigation}) => {
  const [routineName, setRoutineName] = useState<string>(''); // 루틴 이름 상태
  const [alarmEnabled, setAlarmEnabled] = useState<boolean>(false); // 알람 활성화 상태
  const [repeatEnabled, setRepeatEnabled] = useState<boolean>(false); // 반복 활성화 상태
  const [buttonWidth, setButtonWidth] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  //몇회몇정섭취 아래3줄
  const [intakeCount, setIntakeCount] = useState<number>(1); //기본1회로 설정해놓음
  const [supplementCount, setSupplementCount] = useState<number>(0);

  //반복
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const handleDaySelect = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  //분류
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  // 현재시간
  const currentTime = new Date().toLocaleTimeString();
  // 현재 날짜를 YYYY-MM-DD 형식으로 가져옴.
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [startDate, setStartDate] = useState<string>(formattedToday); // 시작 날짜 상태

  useEffect(() => {
    // 화면 너비를 가져와서 버튼의 너비를 계산합니다.
    const screenWidth = Dimensions.get('window').width;
    const buttonWidth = (screenWidth - 32) / 3; // 32는 가로 여백
    setButtonWidth(buttonWidth);
  }, []);

  // 뒤로 가기 버튼 클릭 시 실행할 함수
  const handleBackPress = () => {
    navigation.goBack();
  };

  // 저장 버튼 클릭 시 실행할 함수
  const handleSave = () => {
    console.log('루틴 저장');
    // 여기에 루틴을 저장하는 로직을 구현하세요.
  };

  // + 버튼 클릭 시 실행할 함수
  const handleAddButtonClick = () => {
    console.log('+버튼 클릭');
    // 여기에 "+" 버튼이 클릭됐을 때의 로직을 구현하세요.
  };

  return (
    <>
      {/* 커스텀 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleBackPress()}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* "루틴 추가" 텍스트 */}
        <Text style={[styles.title, {textAlign: 'center'}]}>루틴 추가</Text>

        {/* 루틴 이름 입력란 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="건강기능식품명을 입력해주세요!"
            value={routineName}
            onChangeText={text => setRoutineName(text)}
          />

          <TouchableOpacity
            onPress={() => console.log('Camera button pressed')}>
            <Image
              source={require('./android/app/src/img/camera.png')}
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity>

          {/* 항목 추가 버튼 */}
          <TouchableOpacity
            onPress={handleAddButtonClick}
            style={styles.addButton}>
            <Text style={[styles.addButtonText, {textAlign: 'center'}]}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={{marginTop: 20}}></View>

        <View style={styles.text}>
          {/* 몇회 몇정 언제 */}
          <Text>{`${intakeCount}회 X ${supplementCount}정`}</Text>
          <Text>{`${formattedToday}에 시작할 거에요.`}</Text>
        </View>

        <View style={{marginTop: 20}}></View>

        {/* 현재 시간 표시 */}
        <View style={styles.text}>
          <Text>시간 {currentTime}</Text>
        </View>

        <View style={{marginTop: 20}}></View>

        {/* 알람 설정 스위치 */}
        <View style={styles.inputContainer}>
          <Text>알람</Text>
          <Switch
            value={alarmEnabled}
            onValueChange={value => setAlarmEnabled(value)}
          />
        </View>

        {/* 반복 */}
        <View style={styles.inputContainer}>
          <Text>반복</Text>
          <Switch
            value={repeatEnabled}
            onValueChange={value => setRepeatEnabled(value)}
          />
        </View>
        {repeatEnabled && (
          <View style={{flexDirection: 'row', marginTop: 10}}>
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDaySelect(day)}
                style={
                  selectedDays.includes(day)
                    ? styles.selectedDayButton
                    : styles.dayButton
                }>
                <Text>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{marginTop: 20}}></View>
        <Text>추가설정</Text>
        <View style={{marginTop: 20}}></View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>태그</Text>
          <TouchableOpacity
            onPress={() => handleCategorySelect('에너지 및 다량 영양소')}
            style={
              selectedCategory === '에너지 및 다량 영양소'
                ? styles.selectedButton
                : styles.button
            }>
            <Text>에너지 및 다량 영양소</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleCategorySelect('비타민')}
            style={
              selectedCategory === '비타민'
                ? styles.selectedButton
                : styles.button
            }>
            <Text>비타민</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleCategorySelect('무기질')}
            style={
              selectedCategory === '무기질'
                ? styles.selectedButton
                : styles.button
            }>
            <Text>무기질</Text>
          </TouchableOpacity>
        </View>

        <View style={{marginTop: 20}}></View>
        {/* 컬러 */}
        <View style={{flexDirection: 'row'}}>
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

        <View style={{marginTop: 20}}></View>
      </View>

      {/* 저장 버튼 */}
      <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 36}}>
        <Button title="추가하기" onPress={handleSave} />
      </View>
    </>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 1,
    paddingHorizontal: 50, //좌우간격
  },
  header: {
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    flex: 1,
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    borderRadius: 40,
  },
  addButton: {
    backgroundColor: 'rgb(43,58,85)',
    borderRadius: 15,
    marginLeft: 5,
    padding: 10,
    width: 40,
    height: 40,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    // addButtonText:'center',
  },
  roundedInput: {
    borderRadius: 8,
  },

  // 컨테이너설정 테두리
  categoryContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 40,
  }, // 테두리

  categoryText: {
    fontSize: 16,
    // fontWeight: 'bold',
  },

  repeatOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 옵션 간격을 균등하게 배치
    marginHorizontal: -4, // 버튼 사이의 간격 조절
  },

  repeatOption: {
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    backgroundColor: 'white', // 배경색 설정
    shadowColor: 'rgba(0, 0, 0, 0.4)', // 진한 그림자 색상
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 1,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: 'rgb(43,58,85)',
  },

  //분류
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

  //반복
  dayButton: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
    margin: 2,
    borderWidth: 1,
    borderColor: '#000',
  },

  selectedDayButton: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
    margin: 2,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: 'rgb(231,230,230)',
  },

  text: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RoutineAdd;
