import React, { useContext, useState } from "react";
import { ThemeContext } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  TouchableOpacity,
  View,
  Text,
  Image as ImageNative,
  GestureResponderEvent,
  ScrollView,
  Alert
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import { Bubble } from "../../../parts/Bubble";
import { Proxima, ProximaBold } from "../../../styled/Text";
const FlyteIcon = require("../../../../assets/Icon.png");

interface IProps {
  last4: string;
  Icon: React.FC;
  id: any;
  handlePress: () => void;
  exp_year: string;
  exp_month: string;
}

export default function PaymentMethods({ navigation }: any) {
  const auth = useSelector((state: any) => state.auth);
  const cards = useSelector((state: any) => state.payments.cards);
  const dispatch = useDispatch();
  return (
    <View style={{ flexDirection: "column", marginTop: 25, flex: 1 }}>
      <ScrollView>
        <TouchableOpacity
          onPress={() => {
            dispatch({ type: "CHANGE_DEFAULT_PAYMENT", payload: 0 });
            navigation.goBack();
          }}
        >
          <Bubble bottom>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ImageNative
                source={FlyteIcon}
                style={{
                  width: 35,
                  height: 35,
                  marginRight: 30,
                  resizeMode: "contain"
                }}
              />
              <ProximaBold style={{ fontSize: 16, flex: 1 }}> Flyte Balance </ProximaBold>
              <Proxima>$ {Number(auth.balance / 100).toFixed(2)}</Proxima>
            </View>
          </Bubble>
        </TouchableOpacity>
        {Object.values(cards).map((card: any) => {
          return (
            <PaymentMethod
              key={card.id}
              {...card}
              Icon={() => {
                return (
                  <Image
                    {...{ uri: card.image }}
                    style={{
                      width: 50,
                      height: 50,
                      marginRight: 30,
                      resizeMode: "contain"
                    }}
                  />
                );
              }}
              handlePress={() => {
                dispatch({ type: "CHANGE_DEFAULT_PAYMENT", payload: card.id });
                navigation.goBack();
              }}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

function PaymentMethod({ last4, Icon, id, handlePress, exp_year, exp_month }: IProps) {
  const isDefault = useSelector((state: any) => state.payments.default) === id;
  const theme = useContext<any>(ThemeContext);
  return (
    <TouchableOpacity onPress={handlePress}>
      <Bubble bottom>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon />
          <View style={{ flexDirection: "column", flex: 1 }}>
            <ProximaBold style={{ fontSize: 16, flex: 1 }}>
              {"**** **** **** " + last4}{" "}
            </ProximaBold>
            <ProximaBold color="grey">Expires {Number(exp_month) < 10 ? `0${exp_month}` : `${exp_month}`}/{exp_year}</ProximaBold>
          </View>
          {isDefault && (
            <Feather name="check" color={theme.color.green} size={28} />
          )}
        </View>
      </Bubble>
    </TouchableOpacity>
  );
}
