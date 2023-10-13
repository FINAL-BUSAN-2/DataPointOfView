import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';

const TimePicker = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(true);

  const handleDateChange = (selectedDate: Date) => {
    if (selectedDate) {
      console.log(`Selected Time: ${selectedDate}`);
      setDate(selectedDate);
    }
  };

  return (
    <View>
      {showDatePicker ? (
        <DatePicker
          date={date}
          onDateChange={handleDateChange}
          mode="time"
          fadeToColor="none"
        />
      ) : (
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={{fontSize: 16}}>Select Date</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TimePicker;
