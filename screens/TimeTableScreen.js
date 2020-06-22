//Timetable Screen
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
import ImageZoom from 'react-native-image-pan-zoom'; //Image Zoom Library
const screen = Dimensions.get('window');
export default class TimeTableScreen extends React.Component {
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
                       source={{uri:'https://scontent-dfw5-2.cdninstagram.com/v/t51.2885-15/e35/83952175_1758145144320030_7677577028747572278_n.jpg?_nc_ht=scontent-dfw5-2.cdninstagram.com&_nc_cat=106&_nc_ohc=Qey5od07dL4AX-_HEJv&oh=415733fcb58ecf62c541e3b4b7d7faf6&oe=5F10F33C'}}/>
            </ImageZoom>
</View>
    );
  }
 
}

TimeTableScreen.navigationOptions = {
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
