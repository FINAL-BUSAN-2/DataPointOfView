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

const MyScreen = () => {
  // 달력 날짜 선택
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const handleDateSelect = (date: any) => {
    setSelectedDate(date.dateString);
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.body}>
          <Calendar
            style={styles.calendar}
            theme={{
              selectedDayBackgroundColor: 'black',
              selectedDayTextColor: 'white',
              arrowColor: 'green',
              dotColor: 'yelows',
              todayTextColor: 'red',
              calendarBackground: 'rgb(231,230,230)',
            }}
            onDayPress={day => {
              setSelectedDate(day.dateString);
              console.log(day);
            }}
            monthFormat={'M월'}
            markedDates={{[selectedDate]: {selected: true}}}
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.success}>
            <Text style={styles.successtext}>월별 달성률:</Text>
            <View style={styles.successrec}></View>
          </View>
          <View style={styles.statistics}>
            <Text style={styles.statisticstext}>-으아아아아악</Text>
            <Text style={styles.statisticstext}>-으아아아아악</Text>
            <Text style={styles.statisticstext}>-으아아아아악</Text>
            <Text style={styles.statisticstext}>-으아아아아악</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 600,
    backgroundColor: 'rgb(231,230,230)',
  },
  body: {
    // flex: 5.5,
    backgroundColor: 'rgb(231,230,230)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  calendar: {
    width: 400,
  },
  footer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  success: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successtext: {
    alignSelf: 'flex-start',
    left: '15%',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successrec: {
    width: '80%',
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    margin: 8,
    backgroundColor: 'rgb(231,230,230)',
  },
  statistics: {
    paddingTop: 10,
  },
  statisticstext: {
    left: '15%',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MyScreen;
