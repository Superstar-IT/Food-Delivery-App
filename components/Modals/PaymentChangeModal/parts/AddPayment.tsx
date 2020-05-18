import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ThemeContext } from "styled-components";
import { NavigationState, NavigationProp } from "@react-navigation/core";

const AddPayments = ({ navigation }: any) => {
  const theme = useContext<any>(ThemeContext);
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("TopLevel", { screen: "AddPayment" })}
    >
      <View
        style={{
          backgroundColor: theme.color.blue,
          padding: 20,
          borderRadius: 6,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 20
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
          Add Payment Method
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddPayments;
