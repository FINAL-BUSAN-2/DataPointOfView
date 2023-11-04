import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

interface Search_healthProps {
  onKeywordChange: (newKeyword: string) => void;
  onSelect: (selectedValue: string) => void;
}

interface autoDatas {
  health_nm: string;
  health_tag: string;
  health_emoji: string;
}
function HealthSearch(props: Search_healthProps) {
  const navigation = useNavigation();
  const [keyword, setKeyword] = useState<string>('');
  const [keyItems, setKeyItems] = useState<autoDatas[]>([]);
  const [itemSelected, setItemSelected] = useState(false);

  const onChangeData = (e: any) => {
    const newKeyword = e.nativeEvent.text;
    setKeyword(newKeyword);
    props.onKeywordChange(newKeyword); // 새로운 검색어를 부모 컴포넌트로 전달
  };
  const fetchData = () => {
    return fetch('http://43.200.178.131:3344/healthsearch')
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => data); // 필요에 따라 데이터 처리 로직 추가
  };

  const updateData = async () => {
    if (!itemSelected) {
      const res = await fetchData();
      let filteredItems = res.filter((list: autoDatas) =>
        list.health_nm.includes(keyword),
      );
      // .slice(0, 10); 최대 10개항목만
      setKeyItems(filteredItems);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (keyword) updateData();
    }, 200);
    return () => {
      clearTimeout(debounce);
      setItemSelected(false);
    };
  }, [keyword]);

  const onSelect = (selectedValue: string) => {
    setKeyword(selectedValue);
    setKeyItems([]);
    props.onSelect(selectedValue);
    setItemSelected(true);
  };

  const clearSearchInput = () => {
    setKeyword(''); // Clear the search input
    setItemSelected(false); // Reset itemSelected to false
  };

  return (
    // 검색창
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <TextInput
          value={keyword}
          onChange={onChangeData}
          style={styles.search}
          placeholder="검색어 입력"
        />
        {/* 취소 버튼
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            //setKeyword(''); 검색내역지우기
            //setKeyItems([]);
            navigation.goBack(); //뒤로가기
          }}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity> */}
      </View>

      <View style={{marginTop: 10}}></View>
      {/* 실선
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: 'rgb(175, 171, 171)',
          width: '100%', // 화면 전체 너비에 맞춤
        }}
      /> */}

      {keyword && !itemSelected && keyItems.length > 0 && keyword && (
        <View style={styles.autoSearchContainer}>
          <FlatList
            data={keyItems}
            keyExtractor={item => `${item.health_nm}-${item.health_tag}`}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onSelect(`${item.health_nm}-${item.health_tag}`); // Call your onSelect function
                  setKeyword(item.health_nm);
                  setKeyItems([]);
                }}>
                <Text>
                  {item.health_emoji}
                  {item.health_nm}({item.health_tag})
                </Text>
                {/* <Image
                  source={require('./assets/imgs/north_west.svg')}
                  style={styles.arrowIcon}
                /> */}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  //검색창박스
  container: {
    marginTop: 10, //위로부터 띄우기
    width: '85%',
    height: 50, // 높이 값을 조금 더 크게 설정
    position: 'relative',
    flexDirection: 'row', // 방향 설정
    alignItems: 'center', // 세로 정렬
    alignSelf: 'center',
    justifyContent: 'space-between', // 가로 정렬
    backgroundColor: '#fff',
    borderRadius: 30,
    //borderWidth: 1,
    //borderColor: 'black',
    zIndex: 2,
  },
  //검색창
  search: {
    // flex: 1, // 검색창이 가능한 한 많은 공간을 차지하도록
    paddingLeft: 30,
    paddingRight: 15,
    backgroundColor: '#fff', //검색창 색상
    width: '100%',
    height: 50, // 전체 부모 컨테이너의 높이를 차지하게 설정
    color: '#333', //입력되는글자색상
    fontSize: 14, // fontSize 값을 조금 줄임
    paddingVertical: 10, // paddingVertical 값을 조절
    borderRadius: 40, // 라운드 모서리 추가
    borderWidth: 1,
    borderColor: 'rgb(127,127,127)',
    // marginBottom: 10, // 간격 추가
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    top: 20, // 아이콘의 수직 위치 조절
  },
  //연관검색창
  autoSearchContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: 60,
    maxHeight: '100%', // 높이를 제한
    width: '85%',
    backgroundColor: 'rgb(231,230,230)',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgb(175,171,171)',
    marginHorizontal: 20,
    zIndex: 1,
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    left: 10,
    justifyContent: 'space-between',
  },
  arrowIcon: {
    width: 18,
    height: 18,
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: 'black', // 일반적으로 취소 버튼의 색상
    //fontSize:
  },
});

export default HealthSearch;
