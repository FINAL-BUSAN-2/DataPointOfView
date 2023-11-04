import React, {Component, useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackPageList} from './CommonType';

type NewsData = {
  news_cat: string;
  news_title: string;
  news_link: string;
  news_img: string;
};

type NewsInfoProps = {
  navigation: StackNavigationProp<RootStackPageList, 'NewsInfo'>;
  route: {
    params: {
      newsData: NewsData[];
    };
  };
  userName: string;
  userEmail: string;
  completedItems: string[];
  setCompletedItems: React.Dispatch<React.SetStateAction<string[]>>;
};

const NewsInfo: React.FC<NewsInfoProps> = ({
  navigation,
  route,
  userName,
  userEmail,
  completedItems,
  setCompletedItems,
}) => {
  const {newsData, search, icon} = route.params;
  const handleBackPress = () => {
    navigation.goBack();
  };
  // 개인 페이지 이동 함수
  const movetest3 = () => {
    navigation.navigate('Access');
  };
  // 소셜 페이지 이동 함수
  const movetest4 = () => {
    navigation.navigate('Social');
  };

  const goHplogSet = async () => {
    navigation.navigate('hplogset');
  };

  const openNews = url => {
    Linking.openURL(url);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* 앱 로고 및 이름 */}
          <View style={styles.leftContainer}>
            {/* 알림 아이콘 */}
            <TouchableOpacity>
              <Image
                source={require('./android/app/src/img/notification.png')}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </TouchableOpacity>

            {/* <Text style={styles.title}>웰라밸 / {userName}님</Text> */}
          </View>
          <TouchableOpacity
            onPress={() => {
              console.log('제발');
              navigation.reset({
                index: 0,
                routes: [{name: 'Main'}],
              });
            }}>
            <Image
              source={require('./android/app/src/img/logo.png')}
              style={{
                width: 90,
                height: 30,
                // marginRight: 16,
              }}
            />
          </TouchableOpacity>
          {/* 우측 상단 */}
          <View style={styles.rightContainer}>
            {/* 환경설정 아이콘 */}
            <TouchableOpacity onPress={goHplogSet}>
              <Image
                source={require('./android/app/src/img/settings.png')}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.newsTitleContainer}>
          <TouchableOpacity onPress={handleBackPress}>
            <Text style={styles.articleTitleText}>📰 Daily article</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.newslabel}>
          <Text style={styles.newsContentText}>{search}</Text>
          <View style={styles.newsIcon}>
            <Text style={styles.newsContentIcon}>{icon}</Text>
          </View>
        </View>
        {newsData &&
          newsData.map((news, index) => (
            <TouchableOpacity
              style={styles.newstab}
              key={index}
              onPress={() => openNews(news.news_link)}>
              <Text style={styles.newsTitleText} key={index}>
                {news.news_title}
              </Text>
            </TouchableOpacity>
          ))}
        {/* 네비게이션바 */}
        <View style={styles.navBarContainer}>
          {/* 아티클 */}
          <TouchableOpacity
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Social'}],
              });
            }}>
            <View style={styles.articleTab}>
              <View style={styles.articleTab2}>
                <Text style={styles.articleemoji}>📰</Text>
                <Text style={styles.navarticleText}>아티클</Text>
              </View>
            </View>
          </TouchableOpacity>
          {/* 홈 */}
          <TouchableOpacity
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Main'}],
              });
            }}>
            <View style={styles.homeTab}>
              <View style={styles.homeTab2}>
                <Text style={styles.homeemoji}>🏠</Text>
                <Text style={styles.navText}>홈</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* 개인 */}
          <TouchableOpacity
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Access'}],
              });
            }}>
            <View style={styles.accTab}>
              <View style={styles.accTab2}>
                <Text style={styles.accemoji}>🙋</Text>
                <Text style={styles.navText}>개 인</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 23,
    fontWeight: 'bold',
  },

  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: 80,
  },

  //네비게이션바
  navBarContainer: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopColor: 'rgb(231,230,230)',
    borderTopWidth: 1,
    height: '8%',
    backgroundColor: '#fff',
    zIndex: 2,
  },
  // 아티클 영역
  articleTab: {
    flex: 3,
    width: 70,
    left: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 아티클 영역2
  articleTab2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 58,
    borderRadius: 35,
    margin: 5,
    backgroundColor: 'rgb(245,235,224)',
  },
  // 아티클 이모지
  articleemoji: {
    fontSize: 25,
    color: 'black',
  },
  // 아티클 텍스트
  navarticleText: {
    fontSize: 13,
    // fontWeight: 'bold',
    color: 'black',
  },
  // 홈 영역
  homeTab: {
    flex: 3,
    width: 70,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 홈 영역2
  homeTab2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 홈 이모지
  homeemoji: {
    fontSize: 25,
    color: 'black',
  },
  // 개인 영역
  accTab: {
    flex: 3,
    width: 70,
    right: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 개인 영역2
  accTab2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 개인 이모지
  accemoji: {
    fontSize: 25,
    color: 'black',
  },
  // 네비게이션 텍스트
  navText: {
    fontSize: 13,
    // fontWeight: 'bold',
    color: 'black',
  },

  newstab: {
    height: '8%',
    borderLeftColor: '#AFABAB',
    borderLeftWidth: 1,
    marginVertical: 15,
    marginHorizontal: 30,
    justifyContent: 'center',
  },

  articleTitleText: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: '700',
    margin: 5,
  },

  newsTitleText: {fontSize: 16, marginHorizontal: '5%'},

  newsTitleContainer: {
    height: '7%',
    justifyContent: 'center',
  },

  newslabel: {
    marginVertical: 15,
    marginHorizontal: 30,
    height: 70,
    backgroundColor: '#FEFCF3',
    borderTopColor: '#AFABAB',
    borderTopWidth: 1,
    borderBottomColor: '#AFABAB',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  newsContentText: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    width: '70%',
  },

  newsIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#AFABAB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  newsContentIcon: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 30,
    fontWeight: '400',
  },
});

export default NewsInfo;
