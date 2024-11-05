/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {startTransition, useEffect, useRef, useState} from 'react';

import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import Sound from 'react-native-sound';
import RBSheet from 'react-native-raw-bottom-sheet';

const App = () => {
  const sheetRef = useRef(null);

  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  Voice.onSpeechStart = () => setIsRecording(true);
  Voice.onSpeechEnd = () => setIsRecording(false);
  Voice.onSpeechError = err => setError(err.error);
  Voice.onSpeechResults = results => setResult(results.value[0]);

  const playSound = () => {
    var sound = new Sound('sound.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log(
        'duration in seconds: ' +
          sound.getDuration() +
          'number of channels: ' +
          sound.getNumberOfChannels(),
      );

      // Play the sound with an onEnd callback
      sound.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  };

  const startRecording = async () => {
    try {
      await Voice.start('en-US');
      playSound();
      sheetRef.current.open();
      // result === ''
      //   ? setTimeout(() => {
      //       setResult(`Sorry that wasn't clear`);
      //     }, 5000)
      //   :
      setTimeout(() => {
        stopRecording();
        playSound();
      }, 6000);
    } catch (err) {
      setError(err);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      sheetRef.current.close();
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text
        style={{
          textAlign: 'center',
          alignSelf: 'center',
          marginTop: 30,
          fontSize: 23,
          color: 'black',
          fontWeight: '600',
          fontStyle: 'italic',
          textDecorationLine: 'underline',
        }}>
        {'Voice Search'}
      </Text>

      <View style={styles.fieldContainer}>
        <Image
          source={require('./Project/Assets/Images/loupe.png')}
          resizeMode="contain"
          style={{
            alignSelf: 'center',
            height: 27,
            width: 27,
          }}
        />
        <View
          style={{
            width: '80%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Text
            numberOfLines={5}
            style={{
              alignSelf: 'flex-start',
              fontSize: 15,
              color: 'black',
              fontWeight: 'bold',
              // textAlign: 'center',
              // fontStyle: 'italic',
            }}>
            {result}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setResult('');
            startRecording();
          }}
          style={{
            alignSelf: 'center',
          }}>
          <Image
            source={require('./Project/Assets/Images/microphone.png')}
            resizeMode="contain"
            style={{
              alignSelf: 'center',
              height: 27,
              width: 27,
            }}
          />
        </TouchableOpacity>
      </View>

      {/* <Text
        style={{
          alignSelf: 'center',
        }}>
        {result}
      </Text>

      <Text
        style={{
          alignSelf: 'center',
        }}>
        {error}
      </Text>

      <TouchableOpacity
        style={{
          marginTop: 30,
          alignSelf: 'center',
        }}
        onPress={() => {
          isRecording ? stopRecording() : startRecording();
        }}>
        <Text
          style={{
            color: 'red',
          }}>
          {isRecording ? 'stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity> */}

      <RBSheet
        ref={sheetRef}
        animationType={'slide'}
        closeOnPressMask={true}
        closeOnDragDown={false}
        customStyles={{
          container: {
            height: 210,
            borderTopLeftRadius: 51,
            borderTopRightRadius: 51,
            borderTopWidth: 1,
            backgroundColor: 'black',
          },
          wrapper: {
            // backgroundColor: colors.transparentBlack,
            paddingBottom: 20,
          },
        }}>
        <TouchableOpacity
          onPress={() => sheetRef.current.close()}
          style={{
            alignSelf: 'flex-start',
            marginHorizontal: '5%',
            marginTop: 13,
          }}>
          <Image
            source={require('./Project/Assets/Images/closeBtn.png')}
            resizeMode="contain"
            style={{
              alignSelf: 'center',
              height: 20,
              width: 20,
              tintColor: 'white',
            }}
          />
        </TouchableOpacity>

        <View
          style={{
            width: '80%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            numberOfLines={5}
            style={{
              alignSelf: 'center',
              fontSize: 15,
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              // fontStyle: 'italic',
            }}>
            {result}
          </Text>
        </View>

        <Text
          style={{
            alignSelf: 'center',
            fontSize: 15,
            color: 'white',
            fontStyle: 'italic',
            marginTop: 30,
          }}>
          {'Listening'}
        </Text>

        <Image
          source={{
            uri: 'https://media4.giphy.com/media/mXbQ2IU02cGRhBO2ye/giphy.gif',
          }}
          style={{
            height: 60,
            width: 140,
            alignSelf: 'center',
          }}
        />
      </RBSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  fieldContainer: {
    width: '90%',
    alignSelf: 'center',
    borderWidth: 0.6,
    marginTop: 40,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    borderRadius: 20,
    paddingVertical: 10,
  },
});

export default App;
