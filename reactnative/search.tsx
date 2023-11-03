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

interface SearchProps {
  onKeywordChange: (newKeyword: string) => void;
  onSelect: (pillName: string, pillCd: string) => void;
}

interface autoDatas {
  pill_cd: string;
  pill_nm: string;
  pill_mnf: string;
  func_emoji: string;
}
function Search(props: SearchProps) {
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
    return fetch(`http://43.200.178.131:3344/pillsearch?q=${keyword}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched data:', data); // 로그 출력
        return data;
      });
  };

  const updateData = async () => {
    if (!itemSelected) {
      const res = await fetchData();
      let filteredItems = res.filter((list: autoDatas) =>
        list.pill_nm.includes(keyword),
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

  const onSelect = (selectedValue: string, selectedCd: string) => {
    setKeyword(selectedValue);
    setKeyItems([]);
    props.onSelect(selectedValue, selectedCd);
    setItemSelected(true);
  };

  const clearSearchInput = () => {
    setKeyword(''); // Clear the search input
    setItemSelected(false); // Reset itemSelected to false
  };

  return (
    // 검색창
    <View style={{flex: 1, zIndex: 3}}>
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
            style={{flex: 1}}
            nestedScrollEnabled={true}
            keyExtractor={item => item.pill_nm}
            renderItem={({item}) => (
              <TouchableOpacity
                key={item.pill_nm}
                style={styles.item}
                onPress={() => {
                  onSelect(item.pill_nm, item.pill_cd);
                  setKeyword(item.pill_nm);
                  setKeyItems([]);
                  props.onSelect(item.pill_nm, item.pill_cd);
                }}>
                <Text>
                  {item.func_emoji} {item.pill_nm}
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
    flex: 1,
    marginTop: 20, //위로부터 띄우기
    // marginHorizontal: 20, //양옆띄우기
    width: '100%',
    height: 50, // 높이 값을 조금 더 크게 설정
    position: 'relative',
    flexDirection: 'row', // 방향 설정
    alignItems: 'center', // 세로 정렬
    top: 0,
    // alignSelf: 'flex-end',
    justifyContent: 'space-between', // 가로 정렬
    borderRadius: 30,
    // backgroundColor: 'blue',
    // borderWidth: 1,
    //borderColor: 'black',
    zIndex: 3,
  },
  //검색창
  search: {
    flex: 1, // 검색창이 가능한 한 많은 공간을 차지하도록
    paddingLeft: 40,
    paddingRight: 15,
    backgroundColor: '#fff', //검색창 색상
    width: '100%',
    // left: 50,
    height: 50, // 전체 부모 컨테이너의 높이를 차지하게 설정
    color: '#333', //입력되는글자색상
    fontSize: 14, // fontSize 값을 조금 줄임
    // paddingVertical: 10, // paddingVertical 값을 조절
    borderRadius: 30, // 라운드 모서리 추가
    borderWidth: 2,
    borderColor: 'rgb(127,127,127)',
    // marginBottom: 10, // 간격 추가
    // marginRight: 10, // 취소 버튼과의 간격
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    top: 20, // 아이콘의 수직 위치 조절
  },
  //연관검색창
  autoSearchContainer: {
    // flex: 1,
    height: 180,
    // position: 'absolute',
    alignSelf: 'center',
    // top: 36,
    bottom: 30,
    maxHeight: 300, // 높이를 제한
    width: '99%',
    backgroundColor: 'rgb(231,230,230)',
    padding: 15,
    // right: 5,
    // left: 30,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderWidth: 1,
    borderColor: 'rgb(175,171,171)',
    marginHorizontal: 20,
    zIndex: 2,
    marginTop: '9%',
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 2,
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

export default Search;
