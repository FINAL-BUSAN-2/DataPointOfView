import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import DatePicker from 'react-native-date-picker'

const TimePicker = () => {

  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Button title="시간 선택" onPress={() => setOpen(true)} />

      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
    </View>
  );
};

export default TimePicker;
