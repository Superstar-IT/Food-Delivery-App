import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  StatusBar
} from "react-native";
import { DismissKeyboard, LoadingButton, register } from "./LoginScreen";
import { Feather } from "@expo/vector-icons";
import api, { getSchools } from "../../api";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-community/masked-view";
export default function RegisterScreenSchool({ navigation, route }) {
  const [entered, setEntered] = useState(route.params.entered);
  const [next, setNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  async function API_SIGNUP() {
    setLoading(true);
    const { name, lastname, email, password, grade, phone, address } = entered;
    const token = await register();
    console.log("entered->", token);

    if (
      !!phone &&
      !!address &&
      !!name &&
      !!password &&
      route.params !== undefined
    ) {
      // console.log({ name, lastname, email, password, school: route.params?.school?.id, grade, token: await register() })
      api
        .post("/register", {
          name,
          lastname,
          password,
          phone,
          address,
          token: token
        })
        .then(async data => {
          if (!!data.data.user) {
            AsyncStorage.setItem("token", data.data.token.toString());
            dispatch({ type: "LOGIN_SUCCESS", payload: data.data });
            setLoading(false);
          } else {
            Alert.alert(
              data.data === "ER_DUP_ENTRY"
                ? "User with email address already exists"
                : "error"
            );
            setLoading(false);
          }
          if (data.data.status === "error") {
            alert(data.data.message);
          }
        })
        .catch(error => {
          console.log("error->", error);
          setLoading(false);
        });
    }
  }
  return (
    <DismissKeyboard>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          padding: 30,
          justifyContent: "center"
        }}
      >
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1 }} />

        <TouchableOpacity onPress={API_SIGNUP}>
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
            {!loading ? (
              <Text style={{ fontWeight: "bold", color: "white" }}>FINISH</Text>
            ) : (
              <ActivityIndicator size="small" color="white" />
            )}
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>
    </DismissKeyboard>
  );
}
