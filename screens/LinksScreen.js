import React from 'react';
import MapView, {
  ProviderPropType,
  Marker,
  AnimatedRegion,
} from 'react-native-maps';

import { ScrollView, StyleSheet, Dimensions, View, Text, Animated, Easing, PanResponder, Platform,  TouchableOpacity, Image, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const carIcon = 'https://cdn3.iconfinder.com/data/icons/transport-icons-2/512/BT_bus_renault_front-512.png';


export default class LinksScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        location: null,
        latitude: null,
        longitude: null,
    errorMessage: null,
    bus: null,
    mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
    locationResult: null,
    location: {coords: { latitude: 37.78825, longitude: -122.4324}},
};
      this.socket = new WebSocket('wss://arduino-servers.herokuapp.com:443');
    }


  
  componentWillMount() {
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const {latitude, longitude, driver_name, plate_number, sensor, deviceid, kmph, mph} = data;
      this.setState({latitudes: parseFloat(latitude), longitudes: parseFloat(longitude)});
    };
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  bus = async () => {
    
  }

  componentWillUnmount() {
    this.socket.close();
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
    render() {
       let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

  return (
    <View style={styles.container}>
                <MapView.Animated
          style={styles.map}
          provider ={MapView.PROVIDER_GOOGLE}
          showsUserLocation={true}
          region={{ latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
        >
  {this.state.longitudes && this.state.latitudes  !== null ?
    <Marker.Animated
      coordinate={this.state.longitudes !== null ? { latitude: this.state.latitudes, longitude: this.state.longitudes} : null }
     > 
      <Image
    source={{uri: carIcon}}
    style={{width:28, height: 28}}
  />
     </Marker.Animated>  : null }
        </MapView.Animated>
      </View>
  );
}
}

LinksScreen.navigationOptions = {
 // title: 'Bus',
};


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  float: {
    position: 'absolute',
    bottom: 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});
