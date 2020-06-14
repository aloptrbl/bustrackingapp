import React from 'react';
import { ExpoConfigView } from '@expo/samples';
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
import ImageZoom from 'react-native-image-pan-zoom';
const screen = Dimensions.get('window');
export default class SettingsScreen extends React.Component {

  render()
  {
    const images = [{url: 'http://uic.utem.edu.my/wp-content/uploads/2019/04/D3lgkwVUwAIGmVS.jpg'}];

    return (
<View>
<ImageZoom cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={200}
                       imageHeight={200}>
                <Image style={{width:200, height:200}}
                       source={{uri:'http://uic.utem.edu.my/wp-content/uploads/2019/04/D3lgkwVUwAIGmVS.jpg'}}/>
            </ImageZoom>
</View>
    );
  }
 
}

SettingsScreen.navigationOptions = {
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
timetable: {
width: screen.width,
resizeMode: 'contain',
height: screen.height
}
});
