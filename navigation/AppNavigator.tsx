import React from 'react';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack'
import { NavigationContainer, useNavigation, useLinking } from '@react-navigation/native';
import ProductScreen from '../screens/RestaurantScreen/ProductScreen';
import RestaurantScreen from '../screens/RestaurantScreen/RestaurantScreen';
import BasketView from '../screens/BasketScreen/BasketView';
import ConfirmView from '../screens/ConfirmScreen/ConfirmView';
import { View, Text, Animated, TouchableOpacity, Dimensions, AsyncStorage, Image, ActivityIndicator } from 'react-native';
import PaymentChangeModal from '../components/Modals/PaymentChangeModal/PaymentChangeModal';
import TimeChangeModal from '../components/Modals/TimeChangeModal/TimeChangeModal.ios';
import OrderSend from '../screens/ConfirmScreen/OrderSend';
import PaymentsView from '../screens/SettingsViews/PaymentsView';
import AddPayment from '../screens/SettingsViews/AddPayment';
import HelpView from '../screens/SettingsViews/HelpView';
import SettingsView from '../screens/SettingsViews/SettingsView';
import ProfileView from '../screens/SettingsViews/ProfileView';
import OrderHistoryView from '../screens/OrdersScreen/OrderHistoryView';
import AuthNavigator from './AuthNavigator';
import { Feather } from '@expo/vector-icons';

const Stack = createStackNavigator();
const TopLevelStack = createStackNavigator();

function TopLevelNavigator(props: any) {
  return (
    <TopLevelStack.Navigator initialRouteName="Restaurant" screenOptions={{
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24
      },
    }}>
      <TopLevelStack.Screen name="Restaurant" component={RestaurantScreen} />
      <TopLevelStack.Screen name="Product" component={ProductScreen} />
      <TopLevelStack.Screen name="Basket" component={BasketView} />
      <TopLevelStack.Screen name="Confirm" component={ConfirmView} />

      <TopLevelStack.Screen name="Profile" component={ProfileView} />
      <TopLevelStack.Screen name="Settings" component={SettingsView} />
      <TopLevelStack.Screen name="Help" component={HelpView} />
      <TopLevelStack.Screen name="Payments" component={PaymentsView} />
      <TopLevelStack.Screen name="AddPayment" component={AddPayment} />
      {/* <TopLevelStack.Screen name="Tracking" component={({ navigation }) => {
        navigation.setOptions({
          headerTitle: 'Order Tracking',
          headerLeft: () => <Feather name="chevron-left" size={24} color="black" style={{ marginLeft: 20 }} onPress={() => navigation.goBack()} />
        })
        return (
          <View>
            <Text></Text>
          </View>
        )
      }} /> */}

      <TopLevelStack.Screen name="OrderHistoryView" component={OrderHistoryView} />
    </TopLevelStack.Navigator>
  )
}

const forFade = ({ current, closing, next, inverted, layouts: { screen } }: any) => {

  const opacity = Animated.add(
    current.progress,
    next ? next.progress : 0
  ).interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5]
  });


  const translateY = Animated.multiply(
    current.progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [screen.height, 0, -300],
      extrapolate: 'clamp'
    }),
    inverted
  );
  return {
    shadowStyle: {
    },
    cardStyle: {
      transform: [
        { translateY },
      ],
    },
    containerStyle: {
    },
    overlayStyle: {
      opacity,
      backgroundColor: 'black',
    }
  }
};

const TransitionIOSSpec = {
  animation: 'spring',
  config: {
    stiffness: 500,
    damping: 70,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
    useNativeDriver: true
  },
};

function AppNavigator() {
  const ref = React.useRef();
  const { getInitialState } = useLinking(ref, {
    prefixes: ['https://flyte.live', 'flyte://reset']
  })
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<any>();

  React.useEffect(() => {
    Promise.race([
      getInitialState(),
      new Promise(resolve =>
        // Timeout in 150ms if `getInitialState` doesn't resolve
        // Workaround for https://github.com/facebook/react-native/issues/25675
        setTimeout(resolve, 150)
      ),
    ])
      .catch(e => {
        console.error(e);
      })
      .then(state => {
        if (state !== undefined) {
          setInitialState(state);
        }

        setIsReady(true);
      });
  }, [getInitialState]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer initialState={initialState} ref={ref}>
      <Stack.Navigator mode="modal" headerMode="none" initialRouteName="Main">
        <Stack.Screen name="Main" component={AuthNavigator} />
        <Stack.Screen name="TopLevel" component={TopLevelNavigator} options={{ ...TransitionPresets.DefaultTransition }} />
        <Stack.Screen name="PaymentChange" component={PaymentChangeModal} options={{
          cardStyleInterpolator: forFade,
          cardShadowEnabled: true,
          transitionSpec: {
            open: TransitionIOSSpec,
            close: TransitionIOSSpec
          },
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'vertical',
          gestureResponseDistance: { vertical: 700 },
          // animationEnabled: true,
          cardOverlayEnabled: true,
          cardStyle: { backgroundColor: 'transparent', transform: [{ translateY: Dimensions.get('window').height / 3 }] }
        } as any} />
        <Stack.Screen name="TimeChange" component={TimeChangeModal} options={{
          cardStyleInterpolator: forFade,
          cardShadowEnabled: true,
          transitionSpec: {
            open: TransitionIOSSpec,
            close: TransitionIOSSpec
          },
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'vertical',
          gestureResponseDistance: { vertical: (Dimensions.get('window').height / 2) + 50 },
          // animationEnabled: true,
          cardOverlayEnabled: true,
          cardStyle: { backgroundColor: 'transparent', transform: [{ translateY: Dimensions.get('window').height / 2 }] }
        } as any} />
        <Stack.Screen name="OrderSend" component={OrderSend} options={{
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
          headerShown: false,
          gestureEnabled: false,
          cardOverlayEnabled: true,
          cardStyle: { backgroundColor: 'transparent' }
        }} />
      </Stack.Navigator>
      <Stack.Screen name="reset" component={() => {
        return (
          <View style={{ flex: 1, backgroundColor: 'blue' }}>

          </View>
        )
      }} />

    </NavigationContainer>
  )
}

export default AppNavigator