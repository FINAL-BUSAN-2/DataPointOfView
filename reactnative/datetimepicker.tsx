import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';

interface TimePickerProps {
  onTimeChange: (newTime: string) => void;
}

const TimePicker = ({onTimeChange}: TimePickerProps) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(true);

  useEffect(() => {
    const currentDateTime = new Date();
    setDate(currentDateTime);
    onTimeChange(formatTime(currentDateTime));
  }, []);

  const handleDateChange = (selectedDate: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
      onTimeChange(formatTime(selectedDate));
    }
  };

  const formatTime = (time: Date) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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
