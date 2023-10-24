import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';

interface CustomAutocompleteItem {
  id: string;
  title: string;
  value: string;
}

const PSearch: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [suggestionsList, setSuggestionsList] = useState<
    CustomAutocompleteItem[]
  >([]);

  const fetchSuggestions = (text: string) => {
    setSearchText(text);
    // 모든 검색어에 대해 서버에서 데이터 가져오기
    if (text.length > 0) {
      fetch('http://10.0.2.2:8000/get_pill_info' + text)
        .then(response => response.json())
        .then(data => {
          setSuggestionsList(data); // 서버에서 가져온 데이터로 업데이트
        })
        .catch(error => {
          console.error('Error fetching suggestions:', error);
        });
    } else {
      setSuggestionsList([]);
    }
  };

  return (
    <View style={{flex: 1}}>
      <AutocompleteDropdown
        dataSet={suggestionsList}
        onChangeText={fetchSuggestions}
        textInputProps={{
          placeholder: '검색',
        }}
      />
      <Text>Selected item: {searchText}</Text>
    </View>
  );
};

export default PSearch;
