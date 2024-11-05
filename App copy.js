import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const App = props => {
  <SafeAreaView style={style.mainContainer}>
    <MapView style={style.mapContainer} provider={PROVIDER_GOOGLE} />
  </SafeAreaView>;
};

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'red',
  },
  mapContainer: {
    height: '100%',
    width: '100%',
  },
});

export default App;
