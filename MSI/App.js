import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { Component } from 'react';
import {StyleSheet, Text, View, Button,} from 'react-native';
import AudioRecorderPlayer, {AVEncoderAudioQualityIOSType, AVEncodingOption, AudioEncoderAndroidType, AudioSet, AudioSourceAndroidType,} 
from 'react-native-audio-recorder-player';
//import Voice from 'react-native-voice';


const Tab = createBottomTabNavigator();

export default class App extends Component {
  render () {
    return(
    <NavigationContainer>
      <Tab.Navigator initialRouteName = "Home">
        <Tab.Screen name = "Home" component = {homepage}/>
        <Tab.Screen name = "First Time User" component = {first_time_user}/>
      </Tab.Navigator>
    </NavigationContainer>
    );    
  }
}

function homepage () {
  return(
    <View style = {{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text style = {{textAlignVertical: "bottom", textAlign: "center", fontSize: 30, color: "black"}}>
        Multi-Speaker Indentification
      </Text>
    </View>
  );
}

class first_time_user extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPostiionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00'
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); //default is 0.1
  }

  start_recording = async() => {
    const path = 'first_time.wav'
    const AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberofChannelsIOS: 2,
      AVFormatIDIOS: AVEncodingOption.aac,
    };
    console.log('AudioSet', AudioSet);
    const uri = await this.audioRecorderPlayer.startRecorder(path, AudioSet)
    this.audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
      });
    });
    console.log(`uri: ${uri}`);
  };

  stop_recording = async() => {
    const result  = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
    console.log(result);
  };

  play_recording = async() => {
    console.log('play_recording');
    const path = 'first_time.wav'
    const msg = await this.audioRecorderPlayer.startPlayer(path);
    this.audioRecorderPlayer.setVolume(1.0);
    console.log(msg);
    this.audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        this.audioRecorderPlayer.stopPlayer();
      }
      this.setState({
        currentPostiionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: this. audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
    });
  };
}

/*
  constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      started: '',
      results: [],
    };

    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart(e) {
    this.setState({
      started: '√',
    });
  };

  onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  };

  onSpeechResults(e) {
    this.setState({
      results: e.value,
    });
  }

  async _startRecognition(e) {
    this.setState({
      recognized: '',
      started: '',
      results: [],
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  render () {
    return (
      <View>
        <Text style={styles.transcript}>
            Transcript
        </Text>
        {this.state.results.map((result, index) => <Text style={styles.transcript}> {result}</Text>
        )}
        <Button style={styles.transcript}
        onPress={this._startRecognition.bind(this)}
        title="Start"></Button>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  transcript: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
    top: '400%',
  },
});
*/