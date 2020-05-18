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
const RegisterScreenPhoneNumber = ({ navigation, route }) => {
  const [entered, setEntered] = useState(route.params.entered);
  const [next, setNext] = useState(false);
  const [phone, setPhoneNum] = useState("");
  const phoneRef = useRef();

  useEffect(() => {
    phoneRef?.current?.focus();
  }, []);

  useEffect(() => {
    setNext(true);
  }, [entered]);

  const [focused, setFocused] = useState({ phone: true });

  function handlePhone(phone) {
    setEntered({ ...entered, phone });
    setPhoneNum(phone);
  }
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
                    Enter your phone number
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
              ref={phoneRef}
              onBlur={() => setFocused({ phone: false })}
              onFocus={() => setFocused({ phone: true })}
              onChangeText={phone => handlePhone(phone)}
              autoCapitalize={"none"}
              keyboardType={"phone-pad"}
              autoCorrect={false}
              autoCompleteType={"off"}
              placeholder="phone"
              style={{
                backgroundColor: "white",
                height: 44,
                borderBottomColor: focused.phone
                  ? "#4F3FEB"
                  : "rgba(0,0,0,.06)",
                width: "100%",
                borderBottomWidth: 3,
                fontSize: 18,
                textAlign: "left",
                marginTop: 25
              }}
            />

            <View style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={() => {
                if (phone) navigation.navigate("RegisterAddress", { entered });
                else Alert.alert("Enter valid phone address");
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

export default RegisterScreenPhoneNumber;
