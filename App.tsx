//@ts-nocheck
import { enableScreens } from 'react-native-screens';
enableScreens();
import Expo, { AppLoading, Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { Asset } from 'expo-asset';
import { Provider } from 'react-redux'
import * as Font from 'expo-font';
import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './navigation/AppNavigator';
import { ThemeProvider } from 'styled-components';
import store from './store/index';
import { register } from './screens/Auth/LoginScreen';
import { Card, Title, Paragraph, Button, DataTable, Divider, Drawer, FAB, TouchableRipple, Banner, Badge, Appbar } from 'react-native-paper'
import { SafeAreaView } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { ScrollView } from 'react-native-gesture-handler';
import * as TaskManager from 'expo-task-manager'

const theme = {
  color: {
    white: '#ffffff',
    // blue: 'rgb(0,145,251)',
    blue: 'rgb(40,87,219)',
    green: 'rgb(0,204,133)',
    red: 'rgb(248,2,27)',
    yellow: 'rgb(248,205,53)',
    black: '#fff'
  },
  fonts: [],
  fontSize: {
    small: '12px',
    normal: '16px',
    title: '18px',
    header: '24px'
  }
}





function listen({ origin, data }) {
  if (data.type === 'delivery') {
    const { title, body } = data
    Alert.alert(title, body)
  }
}


export function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}
const styles2 = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});



export default function App(props: any) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    register()
    Notifications.addListener(listen)
  }, [])

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <AppNavigator />
          </ThemeProvider>
        </Provider>
      </View>
    );
  }
}

async function loadResourcesAsync() {
  const imageAssets = cacheImages([
    require('./assets/images/01.png'),
    require('./assets/images/2.png'),
    require('./assets/images/3.png'),
  ]);
  await Promise.all([
    imageAssets,
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      'Gilroy-Bold': require('./assets/fonts/Gilroy-ExtraBold.otf'),
      'ProximaNova-Reg': require('./assets/fonts/ProximaNova-Reg.ttf'),
      'ProximaNova-Light': require('./assets/fonts/ProximaNova-Light.ttf'),
      'ProximaNova-Bold': require('./assets/fonts/ProximaNova-Bold.ttf'),
      'ProximaNova-Semibold': require('./assets/fonts/ProximaNova-Semibold.ttf'),
      'ttnorms_bold': require('./assets/fonts/ttnorms_bold.otf'),
      'ttnorms_extrabold': require('./assets/fonts/ttnorms_extrabold.otf'),
      'ProximaNova-Extrabold': require('./assets/fonts/ProximaNova-Extrabold.otf'),
      'ProximaNova-Black': require('./assets/fonts/ProximaNova-Black.otf'),
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
    }),
  ]);
}

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
