import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Picker,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  AsyncStorage,
  Keyboard,
  Image,
  StatusBar
} from "react-native";
import { HeaderText } from "../../components/styled";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import api, { getSchools } from "../../api";
import { useDispatch } from "react-redux";
import { DismissKeyboard } from "./LoginScreenV2";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-community/masked-view";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const RegisterAddress = ({ navigation, route }) => {
  const [entered, setEntered] = useState(route.params.entered);
  const [next, setNext] = useState(false);
  const [f_location, setLocation] = useState("");
  const [show_locations, showLocations] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const addressRef = useRef();

  useEffect(() => {
    addressRef?.current?.focus();
  }, []);

  useEffect(() => {
    setNext(true);
  }, [entered]);

  async function onChangeLocation(text) {
    showLocations(true);
    setLocation(text);
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyCMOlzsK0_sscqyeqq2KBS9bKosOvKW130&input=${text}&location=0,0&radius=2000`;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      setPredictions(json.predictions);
    } catch (err) {
      console.error(err);
    }
  }

  function handleLocation(prediction) {
    let address = prediction;
    setEntered({ ...entered, address });
    setLocation(prediction);
    showLocations(false);
  }

  const [focused, setFocused] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar barStyle="dark-content" />
      <DismissKeyboard>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              flex: 0.5,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <MaskedView
              style={{ flexDirection: "row" }}
              maskElement={
                <View
                  style={{
                    backgroundColor: "transparent",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      textAlign: "center",
                      width: "80%",
                      color: "black",
                      fontWeight: "bold"
                    }}
                  >
                    Enter your address
                  </Text>
                </View>
              }
            >
              <LinearGradient
                colors={["#4641EC", "#C543F3"]}
                start={[0, 1]}
                end={[1, 0]}
                style={{ height: 200, width: "100%" }}
              />
            </MaskedView>
          </View>
          <View
            style={{
              flex: 0.5,
              padding: 35,
              justifyContent: "flex-start",
              marginTop: -200
            }}
          >
            <View style={{ flex: 1 }} />
            <TextInput
              ref={addressRef}
              autoCapitalize={"none"}
              autoCorrect={false}
              autoCompleteType={"off"}
              style={{
                backgroundColor: "white",
                height: 44,
                borderBottomColor: focused ? "#4F3FEB" : "rgba(0,0,0,.06)",
                width: "100%",
                borderBottomWidth: 3,
                fontSize: 18,
                textAlign: "left",
                marginTop: 25
              }}
              onBlur={() => setFocused(false)}
              onFocus={() => setFocused(true)}
              placeholder="address"
              value={f_location}
              onChangeText={text => onChangeLocation(text)}
            />
            {show_locations && (
              <View>
                {predictions.map(prediction => (
                  <TouchableOpacity
                    key={prediction.description}
                    style={{
                      padding: 5,
                      borderBottomColor: "#4F3FEB",
                      borderBottomWidth: 1
                    }}
                    onPress={() => handleLocation(prediction.description)}
                  >
                    <Text key={prediction.id} style={{ fontSize: 16 }}>
                      {prediction.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={() => {
                if (f_location)
                  navigation.navigate("RegisterPassword", { entered });
                else Alert.alert("Enter valid address");
              }}
            >
              <LinearGradient
                colors={["#3643EA", "#BC40F4"]}
                start={[0, 1]}
                end={[1, 0]}
                style={{
                  height: 50,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 6,
                  padding: 15,
                  marginTop: 40
                }}
              >
                <Text style={{ fontWeight: "bold", color: "white" }}>NEXT</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </DismissKeyboard>
    </View>
  );
};

export default RegisterAddress;
