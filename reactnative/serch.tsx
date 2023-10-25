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

interface autoDatas {
  city: string;
  growth_from_2000_to_2013: string;
  latitude: number;
  longitude: number;
  population: string;
  rank: string;
  state: string;
}

function Serch() {
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
    <View style={styles.container}>
      <TextInput
        value={keyword}
        onChange={onChangeData}
        style={styles.search}
      />
      {/* <Image
        source={require('./assets/imgs/search.svg')}
        style={styles.searchIcon}
      /> */}

      {keyItems.length > 0 && keyword && (
        <View style={styles.autoSearchContainer}>
          <FlatList
            data={keyItems}
            keyExtractor={item => item.city}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => setKeyword(item.city)}>
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
  container: {
    //width: 400,
    height: 60, // 높이 값을 조금 더 크게 설정
    position: 'relative',
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  search: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'yellow',
    //width: '100%',
    height: '100%', // 전체 부모 컨테이너의 높이를 차지하게 설정
    color: '#333',
    fontSize: 14, // fontSize 값을 조금 줄임
    paddingVertical: 10, // paddingVertical 값을 조절
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    top: 20, // 아이콘의 수직 위치 조절
  },
  autoSearchContainer: {
    position: 'absolute',
    top: 50,
    height: '50%',
    width: 400,
    backgroundColor: '#fff',
    padding: 15,
    borderWidth: 2,
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
});

export default Serch;
