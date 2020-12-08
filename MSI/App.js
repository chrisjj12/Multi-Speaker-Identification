import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { Component } from 'react';
import {Text, View,} from 'react-native';
import AudioRecorderPlayer, {AVEncoderAudioQualityIOSType, AVEncodingOption, AudioSet, AudioEncoderAndroidType, AudioSourceAndroidType} 
from 'react-native-audio-recorder-player';
import { Card, Divider, Button, Title } from 'react-native-paper';
//import com.rnfs.RNFSPackage; 

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
    /*
    const path = Platform.select({
      ios: 'first_time.wav',
      android: 'sdcard/first_time.wav', // should give extra dir name in android. Won't grant permission to the first level of dir.
    });*/
    const path = 'hello.m4a';
    //const uri = await audioRecorderPlayer.startRecord(path);
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

  playback_recording = async(e) => {
    console.log('playback_recording');
    /*
    const path = Platform.select({
      ios: 'first_time.wav',
      android: 'sdcard/first_time.wav', // should give extra dir name in android. Won't grant permission to the first level of dir.
    });
    */
    const path = 'hello.m4a';
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

  stop_playback_recording = async(e) => {
    console.log('playback_recording');
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  };

  create_file = async(e) => {
    const path = 'hello.m4a'
    const URL = '/Users/chrisjung/Documents/School/GradSchool/EC601/Multi-Speaker-Identification/MSI'
    const headers = {
      'Accept-Language': 'en-US'
    }
    const file = await this.audioRecorderPlayer.FileDownload.download(URL, path, headers)
    .then((response) => {
      console.log
    } 
    console.log(file);
    
    const DEST = RNFS.DocumentDirectoryPath
    const fileName = 'hello.m4a'
    

    FileDownload.addListener(URL, (info) => {
      console.log(`complete ${(info.totalBytesWritten / info.totalBytesExpectedToWrite * 100)}%`);
    });

    FileDownload.download(URL, DEST, fileName, headers)
    .then((response) => {
      console.log(`downloaded! file saved to: ${response}`)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  render() {
    return (
      <Card style = {{flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center', alignSelf: 'center'}}>
        <Title style = {{Title: 'centered'}}>
          {this.state.recordTime}
        </Title>
        <Button mode = "contained" onPress = {() => this.start_recording()}>
          RECORD
        </Button>
        <Button mode = "outlined"  onPress = {() => this.stop_recording()}>
          STOP
        </Button>
        < Divider/>
        <Title>
          {this.state.playTime} / {this.state.duration}
        </Title>
        <Button mode = "contained"  onPress = {() => this.playback_recording()}>
          PLAY
        </Button>
        <Button mode = "outlined"  onPress = {() => this.stop_playback_recording()}>
          STOP
        </Button>
        <View style = {{marginBottom: 100}}>
        </View>
        <Button style = {{height: 80, backgroundColor: 'green'}} onPress = {() => this.create_file()}>
          <Text style = {{color: 'white', fontSize: 50}}>
            SUBMIT
          </Text>
        </Button>
      </Card>
    )
  }
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