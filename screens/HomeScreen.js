import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
const haversine = require('haversine');
const screen = Dimensions.get('window');
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    };
    this.socket = new WebSocket('wss://arduino-servers.herokuapp.com:443');
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
    this.socket.onmessage = (e) => {
      this.data = e.data;
      const long = this.data.split(',')[1];
      const lat = this.data.split(',')[0];
      this.setState({latitudes: parseFloat(lat), longitudes: parseFloat(long)});
    };
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
    this.socket.close();
    this.location;
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    _handleMapRegionChange = location => {
      this.setState({ location });
    };

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  tick() {
    this.setState({
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    });
  }

render() {
  let text = 'Waiting..';
  if (this.state.errorMessage) {
    text = this.state.errorMessage;
  } else if (this.state.location) {
    text = JSON.stringify(this.state.location);
  }

  const locationA = this.state.location && this.state.location.coords !== null || undefined || NaN ? {latitude: this.state.location.coords.latitude , longitude: this.state.location.coords.longitude} : {latitude: 0, longitude: 0};
  const locationB = {latitude: this.state.latitudes, longitude: this.state.longitudes};
  const result = haversine(locationA, locationB);
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeContainer}>
          <Image
            source={{uri: 'https://www.utem.edu.my/image/newlogo/logoUTeMPNG.png'}}
            style={styles.welcomeImage}
          />
        </View>

        <View style={styles.getStartedContainer}>

          <Text style={styles.getStartedText}>Welcome</Text>

          <View>
            <Text>Bus Location Monitoring App</Text>
          </View>
          <Text style={{fontSize: 30,fontWeight:'bold'}}>{this.state.time}</Text>
          <Text style={{fontSize: 12}}>{this.state.date}</Text>
        </View>
<View style={styles.card}>
<Image
            source={{uri: 'https://image.flaticon.com/icons/png/512/15/15923.png'}}
            style={{width: 50, height:50}}
          />
<View style={styles.distance}>
<Text style={styles.distancetext}>
CDM 2016
</Text>
  <Text>About {result !== NaN ? result.toFixed(2) : 0.00} kilometres</Text>
</View>
</View>
      
      </ScrollView>
    </View>
  );
}
}

HomeScreen.navigationOptions = {
  header: null,
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
flexDirection: 'row',
alignSelf: 'center',
 margin: 55,
 padding: 25,
 borderRadius: 25,
 width: screen.width - 25,
 height: 100,
 borderColor: 'black',
 borderWidth: 1
  },
  distance: {
  paddingLeft: 25,
  },
  distancetext: {
  fontWeight: 'bold',
  fontSize: 20
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: screen.width,
    height: 100,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
