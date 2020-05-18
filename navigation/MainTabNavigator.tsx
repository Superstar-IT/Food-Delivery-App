import React, { useContext, useState, useEffect } from "react";
import {
  Platform,
  Text,
  AppState,
  View,
  TouchableOpacity,
  Animated as AnimatedNative
} from "react-native";
// import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import Animated from "react-native-reanimated";
import debounce from "lodash.debounce";

import HomeScreen from "../screens/HomeScreen/HomeScreen";
import HomeScreenNew from "../screens/HomeScreen/HomeScreen_new";
import SettingsScreen from "../screens/SettingsScreen";
import RestaurantScreen from "../screens/RestaurantScreen/RestaurantScreen";
import SearchScreen from "../screens/SearchScreen/SearchScreen";
import OrdersScreen from "../screens/OrdersScreen/OrdersScreen";
import OrdersNewScreen from "../screens/OrdersScreen/OrderNewScreen";
import RecipeScreen from "../screens/RecipeScreen/RecipeScreen";
import RecipeItemScreen from "../screens/RecipeScreen/RecipeItemScreen";
import MeScreen from "../screens/SettingsViews/MeScreen";
import ProductScreen from "../screens/RestaurantScreen/ProductScreen";
import { ThemeContext } from "styled-components";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
  MaterialTopTabBarProps
} from "@react-navigation/material-top-tabs";

import { HeaderText } from "../components/styled";
import UpcomingView from "../screens/OrdersScreen/UpcomingView";
import PastOrdersView from "../screens/OrdersScreen/PastOrderView";
import api from "../api";

const HomeStack = createStackNavigator();
const SearchStack = createStackNavigator();
const OrdersStack = createStackNavigator();
const RecipeStack = createStackNavigator();
const RecipeItemStack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator headerMode="none">
      {/* <HomeStack.Screen name="Home" component={HomeScreen} /> */}
      <HomeStack.Screen name="Home" component={HomeScreenNew} />
    </HomeStack.Navigator>
  );
}

function RecipeStackNavigator() {
  return (
    <RecipeStack.Navigator headerMode="none" initialRouteName="Recipe">
      <RecipeStack.Screen name="Recipe" component={RecipeScreen} />
      <RecipeItemStack.Screen name="RecipeItem" component={RecipeItemScreen} />
    </RecipeStack.Navigator>
  );
}

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={SearchScreen} />
    </SearchStack.Navigator>
  );
}

const OrderTabs = createMaterialTopTabNavigator();

function customTabBar({
  state,
  descriptors,
  navigation,
  position
}: {
  state: any;
  descriptors: any;
  navigation: any;
  position: Animated.Value<number>;
}) {
  debugger;
  return (
    <View style={{ paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10 }}>
      <View
        style={{
          flexDirection: "row",
          borderRadius: 5,
          backgroundColor: "white",
          shadowOffset: { height: 9, width: 5 },
          shadowOpacity: 0.1,
          elevation: 4,
          shadowRadius: 10
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key
            });
          };

          const inputRange = state.routes.map((_: number, i: number) => i);

          const opacity: Animated.Node<number> = Animated.interpolate(
            position,
            {
              inputRange,
              outputRange: inputRange.map((i: any) => (i === index ? 1 : 0)),
              extrapolate: Animated.Extrapolate.CLAMP
            }
          );

          return (
            <TouchableOpacity
              accessibilityRole="button"
              key={route.key}
              accessibilityStates={isFocused ? ["selected"] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1 }}
            >
              <Animated.View
                style={{
                  backgroundColor: isFocused ? "rgb(40,87,219)" : "white",
                  padding: 10,
                  borderRadius: 6,
                  justifyContent: "center"
                }}
              >
                <Animated.Text
                  style={{
                    fontFamily: "ProximaNova-Extrabold",
                    textAlign: "center",
                    color: isFocused ? "white" : "black"
                  }}
                >
                  {label}
                </Animated.Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function OrderTabsNavigator() {
  return (
    <OrderTabs.Navigator
      lazy={true}
      initialRouteName="Today"
      tabBarOptions={{ labelStyle: { fontFamily: "ProximaNova-Bold" } }}
      tabBar={customTabBar}
    >
      <OrderTabs.Screen name="Past" component={PastOrdersView} />
      <OrderTabs.Screen name="Today" component={OrdersScreen} />
      <OrderTabs.Screen name="Upcoming" component={UpcomingView} />
    </OrderTabs.Navigator>
  );
}

function OrdersStackNavigator() {
  return (
    <OrdersStack.Navigator headerMode="float">
      <OrdersStack.Screen
        name="Orders"
        component={OrdersNewScreen}
        options={{
          headerTitle: "",
          headerLeft: () => (
            <Text
              style={{
                fontSize: 24,
                fontFamily: "ProximaNova-Bold",
                marginHorizontal: 20
              }}
            >
              Orders
            </Text>
          )
        }}
      />
    </OrdersStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
function TabNavigator() {
  const theme: { color: { [key: string]: string } } = useContext(ThemeContext);
  const [state, setState] = useState(AppState.currentState);

  function handleAppStateChange(nextAppState: any) {
    setState(nextAppState);
  }

  useEffect(() => {
    switch (state) {
      case "active":
        api.post("/active").catch(() => {});
        break;
      case "background":
        api.post("/inactive").catch(() => {});
        break;
    }
  }, [state]);

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="HomeNavigator"
      tabBarOptions={{ labelStyle: { fontFamily: "ProximaNova-Bold" } }}
    >
      <Tab.Screen
        name="HomeNavigator"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="home"
              size={24}
              color={focused ? theme.color.blue : "grey"}
            />
          ),
          tabBarLabel: "Home"
        }}
      />
      <Tab.Screen
        name="RecipeNavigator"
        component={RecipeStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="star"
              size={24}
              color={focused ? theme.color.blue : "grey"}
            />
          ),
          tabBarLabel: "Recipe"
        }}
      />
      <Tab.Screen
        name="SearchNavigator"
        component={SearchStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="search1"
              size={24}
              color={focused ? theme.color.blue : "grey"}
            />
          ),
          tabBarLabel: "Search"
        }}
      />
      <Tab.Screen
        name="OrdersNavigator"
        component={OrdersStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="receipt"
              size={24}
              color={focused ? theme.color.blue : "grey"}
            />
          ),
          tabBarLabel: "Orders"
        }}
      />
      <Tab.Screen
        name="MeNavigator"
        component={MeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="user"
              size={24}
              color={focused ? theme.color.blue : "grey"}
            />
          ),
          tabBarLabel: "Me"
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
