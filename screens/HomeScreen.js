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
  Alert,
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
      const data = JSON.parse(e.data);
      const {latitude, longitude, driver_name, plate_number, sensor, deviceid, kmph, mph} = data;
      this.setState({latitudes: parseFloat(latitude), longitudes: parseFloat(longitude), driver_name: driver_name, plate_number: plate_number});
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
            source={{uri: 'data:image/png;base64,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'}}
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
{this.state.plate_number}
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
