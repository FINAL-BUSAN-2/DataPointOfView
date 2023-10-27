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

// import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';

interface autoDatas {
  city: string;
  growth_from_2000_to_2013: string;
  latitude: number;
  longitude: number;
  population: string;
  rank: string;
  state: string;
}
function Search() {
  const navigation = useNavigation();
  const [keyword, setKeyword] = useState<string>('');
  const [keyItems, setKeyItems] = useState<autoDatas[]>([]);

  const onChangeData = (e: any) => {
    setKeyword(e.nativeEvent.text);
  };

  const fetchData = () => {
    return fetch(
      `https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json`,
    )
      .then(res => res.json())
      .then(data => data.slice(0, 100));
  };

  const updateData = async () => {
    const res = await fetchData();
    let filteredItems = res
      .filter((list: autoDatas) => list.city.includes(keyword))
      .slice(0, 10);
    setKeyItems(filteredItems);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (keyword) updateData();
    }, 200);
    return () => {
      clearTimeout(debounce);
    };
  }, [keyword]);

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
        {/* 취소 버튼 */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            //setKeyword(''); 검색내역지우기
            //setKeyItems([]);
            navigation.goBack(); //뒤로가기
          }}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginTop: 10}}></View>
      {/* 실선 */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: 'rgb(175, 171, 171)',
          width: '100%', // 화면 전체 너비에 맞춤
        }}
      />

      {keyItems.length > 0 && keyword && (
        <View style={styles.autoSearchContainer}>
          <FlatList
            data={keyItems}
            keyExtractor={item => item.city}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setKeyword(item.city);
                  setKeyItems([]);
                }}>
                <Text>{item.city}</Text>
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
    marginTop: 20, //위로부터 띄우기
    marginHorizontal: 20, //양옆띄우기
    width: 380,
    height: 60, // 높이 값을 조금 더 크게 설정
    position: 'relative',
    flexDirection: 'row', // 방향 설정
    alignItems: 'center', // 세로 정렬
    justifyContent: 'space-between', // 가로 정렬

    //borderWidth: 1,
    //borderColor: 'black',
  },
  //검색창
  search: {
    flex: 1, // 검색창이 가능한 한 많은 공간을 차지하도록
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'rgb(231,230,230)', //검색창 색상
    width: 330,
    height: 60, // 전체 부모 컨테이너의 높이를 차지하게 설정
    color: '#333', //입력되는글자색상
    fontSize: 14, // fontSize 값을 조금 줄임
    paddingVertical: 10, // paddingVertical 값을 조절
    borderRadius: 10, // 라운드 모서리 추가
    marginBottom: 10, // 간격 추가
    marginRight: 10, // 취소 버튼과의 간격
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    top: 20, // 아이콘의 수직 위치 조절
  },
  //연관검색창
  autoSearchContainer: {
    position: 'absolute',
    top: 80,
    maxHeight: 200, // 높이를 제한
    width: 320,
    backgroundColor: '#fff',
    padding: 15,
    //borderWidth: 2,
    marginHorizontal: 20,
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
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

export default Search;