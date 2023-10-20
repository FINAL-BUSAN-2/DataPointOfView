import React, {useRef, useState} from 'react';
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown';

interface Props {
  placeholder?: string;
  dataset: TAutocompleteDropdownItem[];
  renderItem?: (
    item: TAutocompleteDropdownItem,
    searchText: string,
  ) => JSX.Element;
}

const AutoCompleteSearch = ({placeholder, dataset, renderItem}: Props) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const dropdownController = useRef(null);

  return (
    <AutocompleteDropdown
      clearOnFocus={false}
      closeOnBlur={true}
      closeOnSubmit={false}
      // initialValue={{id: '2'}} // or just '2'
      suggestionsListMaxHeight={200}
      onSelectItem={() => setSelectedItem}
      controller={controller => {
        dropdownController.current = controller;
      }}
      textInputProps={{
        placeholder: placeholder,
      }}
      containerStyle={{flexGrow: 1, flexShrink: 1, width: 250}}
      dataSet={dataset}
      emptyResultText={'결과가 없습니다.'}
      renderItem={renderItem}
    />
  );
};

export default AutoCompleteSearch;
