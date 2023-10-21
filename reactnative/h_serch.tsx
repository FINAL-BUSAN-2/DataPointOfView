import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';

interface CustomAutocompleteItem {
  id: string;
  title: string;
  value: string;
}

const HSearch: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [suggestionsList, setSuggestionsList] = useState<
    CustomAutocompleteItem[]
  >([]);

  const getSuggestions = (text: string) => {
    setSearchText(text);
    // 모든 검색어에 대해 예시 항목 설정
    //if (text.length > 0) {
    if (text.startsWith('가')) {
      const suggestions: CustomAutocompleteItem[] = [
        {id: '1', title: '가방', value: '가방'},
        {id: '2', title: '가구', value: '가구'},
        {id: '3', title: '가격', value: ' 가격'},
      ];
      setSuggestionsList(suggestions);
    } else {
      setSuggestionsList([]);
    }
  };

  return (
    <View style={{flex: 1}}>
      <AutocompleteDropdown
        dataSet={suggestionsList}
        onChangeText={getSuggestions}
        textInputProps={{
          placeholder: '검색',
        }}
      />
      <Text>Selected item:{searchText}</Text>
    </View>
  );
};

export default HSearch;
