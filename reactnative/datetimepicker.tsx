import React, {useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import DatePicker from 'react-native-date-picker';

const TimePicker = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(true);

  const handleDateChange = (selectedDate: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View>
      {showDatePicker ? (
        <DatePicker date={date} onDateChange={handleDateChange} />
      ) : (
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={{fontSize: 16}}>Select Date</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TimePicker;
