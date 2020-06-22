//Map Screen
import React from "react";
import MapView, {
  ProviderPropType,
  Marker,
  AnimatedRegion,
} from "react-native-maps"; //Google Maps Library

import {
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Animated,
  Easing,
  PanResponder,
  Platform,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location"; //Use Location
import * as Permissions from "expo-permissions"; //User Permission Library

const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const carIcon =
  "https://cdn3.iconfinder.com/data/icons/transport-icons-2/512/BT_bus_renault_front-512.png";

export default class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    //default initial value
    this.state = {
      location: null,
      latitude: null,
      longitude: null,
      errorMessage: null,
      bus: null,
      mapRegion: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      locationResult: null,
      location: { coords: { latitude: 37.78825, longitude: -122.4324 } },
    };
    //Initialize websocket connection to server
    this.socket = new WebSocket("wss://arduino-servers.herokuapp.com:443");
  }

  componentWillMount() {
    //Pass value to variable from socket
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const {
        latitude,
        longitude,
        driver_name,
        plate_number,
        sensor,
        deviceid,
        kmph,
        mph,
      } = data;
      this.setState({
        latitudes: parseFloat(latitude),
        longitudes: parseFloat(longitude),
        driver_name: driver_name,
        plate_number: plate_number,
        sensor: sensor,
        deviceid: deviceid,
        kmph: kmph,
        mph: mph,
      });
    };
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!",
      });
    } else {
      this._getLocationAsync();
    }
  }

  componentWillUnmount() {
    //Disconnect Websocket
    this.socket.close();
  }

  _getLocationAsync = async () => {
    //Access permission location
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied",
      });
    }

    _handleMapRegionChange = (location) => {
      this.setState({ location });
    };

    //Get current location from phone
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };
  render() {
    let text = "Waiting..";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    //User Interface
    return (
      <View style={styles.container}>
      {/* Map */}
        <MapView.Animated
          style={styles.map}
          provider={MapView.PROVIDER_GOOGLE}
          showsUserLocation={true}
          region={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
        {/* Arduino Bus Tracking Device Location */}
          {this.state.longitudes && this.state.latitudes !== null ? (
            <Marker.Animated
              coordinate={
                this.state.longitudes !== null
                  ? {
                      latitude: this.state.latitudes,
                      longitude: this.state.longitudes,
                    }
                  : null
              }
            >
              <Image
                source={{ uri: carIcon }}
                style={{ width: 28, height: 28 }}
              />
              <MapView.Callout tooltip style={styles.customView}>
                <TouchableHighlight underlayColor="#dddddd">
                  <View style={styles.calloutText}>
                    <Text>
                      {"Plate No:"}
                      {"\n"}
                      {this.state.plate_number}
                    </Text>
                    <Text>
                      {"Driver Name:"}
                      {"\n"}
                      {this.state.driver_name}
                    </Text>
                    <Text>
                      {"Device ID:"}
                      {"\n"}
                      {this.state.deviceid}
                    </Text>
                    <Text>Speed</Text>
                    <Text>
                      {this.state.kmph} {"KMPH"}
                    </Text>
                    <Text>
                      {this.state.mph} {"MPH"}
                    </Text>
                  </View>
                </TouchableHighlight>
              </MapView.Callout>
            </Marker.Animated>
          ) : null}
        </MapView.Animated>
      </View>
    );
  }
}

MapScreen.navigationOptions = {
  // title: 'Bus',
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  calloutText: {
    width: 130,
    backgroundColor: "white",
    opacity: 0.75,
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "gray",
  },
  float: {
    position: "absolute",
    bottom: 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: "stretch",
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
});
