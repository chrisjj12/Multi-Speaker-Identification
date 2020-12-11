import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { Component } from 'react';
import {Platform, Text, View,} from 'react-native';
import AudioRecorderPlayer, {AVEncoderAudioQualityIOSType, AVEncodingOption, AudioSet, AudioEncoderAndroidType, AudioSourceAndroidType} 
from 'react-native-audio-recorder-player';
import { Card, Divider, Button, Title } from 'react-native-paper';
import { RNS3 } from 'react-native-aws3';


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
          <Tab.Screen name = "Speaker Identifier" component = {speak_ident}/>
        </Tab.Navigator>
      </NavigationContainer>
    );    
  }
}

function homepage () {
  return(
    <View style = {{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text style = {{textAlignVertical: "bottom", textAlign: "center", fontSize: 30, color: "black"}}>
        Speaker Recognition
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
      duration: '00:00:00',
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); //default is 0.1
    this.stop_recording = this.stop_recording.bind(this);
  }

  start_recording = async() => {
    /*
    const path = Platform.select({
      ios: 'first_time.wav',
      android: 'sdcard/first_time.wav', // should give extra dir name in android. Won't grant permission to the first level of dir.
    });*/
    /*
    const path = Platform.select({
      ios: 'hello.wav' //wav
    }) 
    */
    const path = 'Chris.m4a'; //change this file name to the name inputted
    const AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberofChannelsIOS: 2,
      AVFormatIDIOS: AVEncodingOption.aac,
    };
    console.log('AudioSet', AudioSet);
    const URI = await this.audioRecorderPlayer.startRecorder(path, AudioSet)
    this.audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
      });
    });
    console.log(`uri: ${URI}`);
  };

  stop_recording = async() => {
    const result  = await this.audioRecorderPlayer.stopRecorder();
    

    const file = {
      uri: result,
      name: result,
      type: `audio/aac`
    };

    const options = {
      keyPrefix: 'audio/',
      bucket: 'iostoflask',
      region: 'us-east-2',
      accessKey: 'AKIAJ6QLTOKIBPZBR65A',
      secretKey: '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',
    };

    RNS3.put(file, options)
      .progress(event => {
        console.log(`percent: ${event.percent}`);
      })
      .then(response => {
        console.log(response, "response from rns3 audio");
        if (response.status !== 201) {
          console.error(response.body);
          return;
        }
      })

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
    const path = 'Chris.m4a';
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
   //DOWNLOAD COEFF.json

  render() {
    return (
      <Card style = {{flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center', alignSelf: 'center'}}>
        <Text style = {{flex: .22, flexDirection: 'row', alignItems: 'center', alignContent: 'center', alignSelf: 'center', fontSize: 20}}>
          Please record the displayed sentence
        </Text>
        <Text style = {{flex: .2, flexDirection: 'row', alignItems: 'center', alignContent: 'center', alignSelf: 'center', fontSize: 30}}>
          The sun is shining bright today
        </Text>
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
      </Card>
    )
  }
}

class speak_ident extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPostiionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); //default is 0.1
    this.stop_recording = this.stop_recording.bind(this);
  }

  start_recording = async() => {
    /*
    const path = Platform.select({
      ios: 'first_time.wav',
      android: 'sdcard/first_time.wav', // should give extra dir name in android. Won't grant permission to the first level of dir.
    });*/
    /*
    const path = Platform.select({
      ios: 'hello.wav' //wav
    }) 
    */
    const path = 'Chris.m4a'; //change this file name to the name inputted
    const AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberofChannelsIOS: 2,
      AVFormatIDIOS: AVEncodingOption.aac,
    };
    console.log('AudioSet', AudioSet);
    const URI = await this.audioRecorderPlayer.startRecorder(path, AudioSet)
    this.audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
      });
    });
    console.log(`uri: ${URI}`);
  };

  stop_recording = async() => {
    const result  = await this.audioRecorderPlayer.stopRecorder();
    

    const file = {
      uri: result,
      name: result,
      type: `audio/aac`
    };

    const options = {
      keyPrefix: 'xxxxxxxx',
      bucket: 'xxxxxxxxxx',
      region: 'xxxxxxxxxxx',
      accessKey: 'xxxxxxxxxxxxxxxx',
      secretKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
    };

    RNS3.put(file, options)
      .progress(event => {
        console.log(`percent: ${event.percent}`);
      })
      .then(response => {
        console.log(response, "response from rns3 audio");
        if (response.status !== 201) {
          console.error(response.body);
          return;
        }
      })

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
    const path = 'Chris.m4a';
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
   //DOWNLOAD COEFF.json

  render() {
    return (
      <Card style = {{flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center', alignSelf: 'center'}}>
        <Text style = {{flex: .22, flexDirection: 'row', alignItems: 'center', alignContent: 'center', alignSelf: 'center', fontSize: 20}}>
          Please record the displayed sentence
        </Text>
        <Text style = {{flex: .2, flexDirection: 'row', alignItems: 'center', alignContent: 'center', alignSelf: 'center', fontSize: 30}}>
          The sun is shining bright today
        </Text>
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
        <Text style = {{textAlignVertical: "bottom", textAlign: "center", fontSize: 30, color: "black"}}>
          Match:
        </Text>
        < Divider/>
        <Text style = {{textAlignVertical: "bottom", textAlign: "center", fontSize: 30, color: "black"}}>
          The speaker is Chris
        </Text>
        <View style = {{marginBottom: 100}}>
        </View>
      </Card>
    )
  }
}


/*
<Button style = {{height: 80, backgroundColor: 'green'}} onPress = {() => this.create_file()}>
          <Text style = {{color: 'white', fontSize: 50}}>
            SUBMIT
          </Text>
        </Button>
        */


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