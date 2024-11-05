/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Geolocation from '@react-native-community/geolocation';
import React, {useEffect, useRef, useState} from 'react';

import {
  Dimensions,
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
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { AppEventsLogger,Settings } from 'react-native-fbsdk-next';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_LAT = 28.6304394;
const INITIAL_LNG = 77.3771503;
const INITIAL_POSITION = {
  latitude: INITIAL_LAT,
  longitude: INITIAL_LNG,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const App = () => {
  const [searchText, setSearchText] = useState('');
  const [results , setResults] = useState([]);
  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const map = useRef<MapView | null >(null);

  useEffect(() => {
    logCustomEvent();
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const logCustomEvent = () => {
    AppEventsLogger.logEvent('Deepak_event');
  };

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
       
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        //Will give you the location on location change

        setLocationStatus('You are Here');
        console.log(position);

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
  };

  const searchPlaces = async () => {
    if (!searchText.trim().length) return;

    const googleApisUrl =
      'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const input = searchText.trim();
    const location = `${INITIAL_LAT},${INITIAL_LNG}&radius=2000`;
    const url = `${googleApisUrl}?query=${input}&location=${location}&key=AIzaSyD57FjdNKODFtX95VuIjFYGl5aq92IVFyo`;
    try {
      const resp = await fetch(url);
      const json = await resp.json();
      // console.log(json);
      if (json && json.results) {
        const coords: import('react-native-maps').LatLng[] = []
        for (const item of json.results) {
          // console.log(item.geometry);
          coords.push({
            latitude: item.geometry.location.lat,
            longitude: item.geometry.location.lng,
          });
        }
        setResults(json.results)
        if(coords.length) {
          map.current?.fitToCoordinates(coords,{
            edgePadding:{
              top: 50,
              right: 50,
              bottom: 50,
              left: 50
            },
            animated: true
          });
          Keyboard.dismiss();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <MapView
      ref={map}
        style={styles.mapContainer}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_POSITION}
      >
        {searchText === '' &&<Marker coordinate={INITIAL_POSITION} />}
        {results.length ? results.map((item, i) => {
          const coord: import('react-native-maps').LatLng = {
            latitude: item.geometry.location.lat,
            longitude: item.geometry.location.lng,
          }
          return <Marker key={`search-item-${i}`} coordinate={coord} title={item.name} description=''/>
        }): null}
      </MapView>
      <View style={styles.searchBox}>
        <Text style={styles.searchBoxLabel}>{'Search place'}</Text>
        <TextInput
          style={styles.searchBoxField}
          onChangeText={text => setSearchText(text)}
          autoCapitalize="sentences"
        />
        <TouchableOpacity
          // onPress={() => searchPlaces()}
          onPress={() => logCustomEvent()}
          style={styles.buttonContainer}>
          <Text style={styles.buttonLabel}>{'Search'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  mapContainer: {
    height: '100%',
    width: '100%',
  },
  searchBox: {
    position: 'absolute',
    width: '90%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#aaa',
    backgroundColor: 'white',
    padding: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  searchBoxField: {
    borderColor: '#777',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 18,
    marginBottom: 8,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#26f',
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 18,
    color: 'white',
  },
});

export default App;
