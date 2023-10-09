import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const TimePicker = () => {
  const [selectedTime, setSelectedTime] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    hideDatePicker();
  };

  return (
    <View>
      <Button title="시간 선택" onPress={showDatePicker} />
      <Text>선택된 시간: {selectedTime}</Text>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default TimePicker;
