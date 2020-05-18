//@ts-nocheck
import React, { useRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import LottieView from "lottie-react-native";
import { useDispatch, useSelector, batch } from "react-redux";
import moment from "moment";
import { useNavigation } from "@react-navigation/core";
import api from "../../api";

const OrderSend = ({ route }) => {
  const animation: any = useRef();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const card = useSelector((state: any) => state.payments.default);

  const { ProductObject, total } = route.params;
  useEffect(() => {
    animation.current.play();
    debugger;
    api
      .post("v2/payments/charge", { amount: total, order: ProductObject, card })
      .then(data => {
        const { charge, order } = data.data;
        if (data.data?.status === "error") Alert.alert(data.data.message);

        if (charge?.object === "charge") {
          const { id, status, paid, receipt_url } = charge;
          if (charge.status === "succeeded" && charge.paid === true) {
            Alert.alert("Payment successful");
            debugger;
            batch(() => {
              dispatch({
                type: "ADD_ORDER",
                payload: { ...order, paid, receipt_url }
              });
              dispatch({ type: "FLYTE_BALANCE", payload: charge.amount });
              dispatch({ type: "START_NEW_ORDER" });
            });

            if (moment(order.date2).isSame(Date.now(), "day")) {
              navigation.navigate("Today");
            } else {
              navigation.navigate("Upcoming");
            }
          } else {
            Alert.alert("FAILED: " + status);
            navigation.goBack();
          }
        } else navigation.goBack();
      })
      .catch(error => {
        debugger;
        Alert.alert("FAILED TRY AGAIN LATER");
        navigation.goBack();
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rrgba(0,0,0,0.5)"
      }}
    >
      <LottieView
        ref={animation}
        style={{
          width: 700,
          height: 700,
          backgroundColor: "transparent"
        }}
        source={require("../../assets/animations/14451-loading.json")}
      />
    </View>
  );
};

export default OrderSend;
