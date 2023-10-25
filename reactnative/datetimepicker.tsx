import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
interface TimePickerProps {
  onTimeChange: (newTime: string) => void;
}
const TimePicker = ({onTimeChange}: TimePickerProps) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(true);
  const handleDateChange = (selectedDate: Date) => {
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const selectedTime = `${hours}:${minutes}`;
      console.log(`Selected Time: ${selectedTime}`);
      setDate(selectedDate);
      onTimeChange(selectedTime); // 선택한 시간을 부모 컴포넌트로 전달
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
          <Text style={{fontSize: 16}}>Select Time</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default TimePicker;
