import React, { useState } from 'react';
import { View, Text, Button, Modal, TouchableOpacity } from 'react-native';

const App = () => {
  const [showHourPickerModal, setShowHourPickerModal] = useState(false);
  const [showMinutePickerModal, setShowMinutePickerModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');


  const handleShowHourPicker = () => {
    setShowHourPickerModal(true);
  };

  const handleShowMinutePicker = () => {
    setShowMinutePickerModal(true);
  };

  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour.toString());
    setShowHourPickerModal(false);
  };

  const handleMinuteSelect = (minute: number) => {
    setSelectedMinute(minute.toString());
    setShowMinutePickerModal(false);
  };

  return (
    <View style={{ flex:1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop:10 }}>
        <Button title="시" onPress={handleShowHourPicker} />
        <Button title="분" onPress={handleShowMinutePicker} />
      </View>

      {/* 시간 선택 모달 */}
      <Modal visible={showHourPickerModal || showMinutePickerModal} animationType="slide">
        <View style={{ flex:1 }}>
          {showHourPickerModal && (
            <View style={{ flex:1 }}>
              {[...Array(25)].map((_, index) => (
                <TouchableOpacity key={index} onPress={() => handleHourSelect(index)}>
                  <Text>{index}시</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {showMinutePickerModal && (
            <View style={{ flex:1 }}>
              {[...Array(61)].map((_, index) => (
                <TouchableOpacity key={index} onPress={() => handleMinuteSelect(index)}>
                  <Text>{index}분</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </Modal>

      {/* 선택된 시간 표시 */}
      {selectedHour !== '' && selectedMinute !== '' && (
        <Text>선택된 시간: {selectedHour}시 {selectedMinute}분</Text>
      )}
    </View>
   );
};

export default App;
