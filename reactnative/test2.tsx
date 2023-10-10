import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showImageItems: false,
    };
  }

  handleFloatingBarClick = () => {
    const { showImageItems } = this.state;
    this.setState({ showImageItems: !showImageItems });
  };

  render() {
    const { showImageItems } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          
          <Text style={styles.appName}>App Name</Text>
          <Text style={styles.appLogo}>App Logo</Text>
        </View>
        <View style={styles.timeline}>
          <Text>타임라인 바</Text>
        </View>
        <View style={styles.favorites}>
          <Text>즐겨찾기 목록</Text>
        </View>
        <View style={styles.checklist}>
          <Text>체크리스트 목록</Text>
        </View>

        {/* Navigation Bar */}
        <View style={styles.navBarContainer}>
          <View style={styles.navTab}>
            <Image source={require('./android/app/src/img/home.png')} style={styles.navIcon} />
            <Text>홈</Text>
          </View>
          <View style={styles.navTab}>
            <Image source={require('./android/app/src/img/thumb_up.png')} style={styles.navIcon} />
            <Text>추천</Text>
          </View>
          <View style={styles.navTab}>
            <Image source={require('./android/app/src/img/settings.png')} style={styles.navIcon} />
            <Text>소셜</Text>
          </View>
          <View style={styles.navTab}>
            <Image source={require('./android/app/src/img/accessibility.png')} style={styles.navIcon} />
            <Text>개인</Text>
          </View>
        </View>

        {/* floatingBar */}
        <TouchableOpacity
          style={[styles.floatingBar, { zIndex: 2 }]}
          onPress={this.handleFloatingBarClick}
        >
          <Image source={require('./android/app/src/img/floating_wh.png')} style={styles.floIcon} />
        </TouchableOpacity>

        {showImageItems && (
          <View style={[styles.flo_ex, { zIndex: 1 }]}>
            <Image source={require('./android/app/src/img/flo_ex.png')} style={styles.floexIcon} />
            <Text style={styles.flotext}>건강</Text>
            <Image source={require('./android/app/src/img/flo_ex.png')} style={styles.floexIcon} />
            <Text style={styles.flotext}>영양</Text>
            <Image source={require('./android/app/src/img/flo_ex.png')} style={styles.floexIcon} />
            <Text style={styles.flotext}>기타</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor :'rgb(231,230,230)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  appLogo: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  timeline: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favorites: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklist:{
    flex :1 ,
    alignItems :'center' ,
    justifyContent :'center'
  }, 
  

  
  //navBarContainer
  navBarContainer: {
    flexDirection:'row', 
    justifyContent:'space-around',
    position:'absolute', 
    bottom:0,
    left:0,
    right:0,
    height:70,
    backgroundColor:'#f5f5f5',
    alignItems:'center',
    elevation: 50, // for Android
  },
  //navTab
  navTab:{
    alignItems:'center',
    justifyContent:'center'
  },
  //navIcon
  navIcon:{
    width:35,
    height:35
  },

  //floatingBar
  floatingBar :{
  position: 'absolute',
  right: 20,
  bottom: 90,
  width: 60,
  height: 60, // 변경된 부분 (원의 크기)
  backgroundColor: 'rgba(43,58,85,0.85)',
  borderRadius: 30, // 변경된 부분 (원의 반지름)
  alignItems: 'center',
  justifyContent: 'center',
    },
  
    //floIcon
  floIcon:{
    width:40,
    height:40,
  },

  flo_ex:{
  position: 'absolute',
  right: 20,
  bottom: 90,
  width: 60,
  height: 260, // 변경된 부분 (원의 크기)
  backgroundColor: 'rgba(43,58,85,0.2)',
  borderBottomLeftRadius: 35, // 원의 하단 왼쪽 반지름
  borderBottomRightRadius: 35, // 원의 하단 오른쪽 반지름
  borderRadius: 35, // 원의 상단 반지름
  alignItems: 'center',
  justifyContent: 'center',
  },

  //floexIcon
  floexIcon:{
    bottom:25,
    width:40,
    height:40,
    backgroundColor: 'rgba(245,235,224,0.4)',
    borderRadius: 20, // 변경된 부분 (원의 반지름)
    alignItems: 'center',
    justifyContent: 'center',
  },
  //flotext
  flotext:{
    bottom:25,
  },
});

export default App;
