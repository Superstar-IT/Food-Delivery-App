import React from "react";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/core";
import PaymentMethods from "./parts/PaymentsMethods";
import AddPayments from "./parts/AddPayment";
import { Modal, Header } from "../parts/Modal";

const PaymentChangeModal = (props: any) => {
  const navigation = useNavigation();

  return (
    <Modal>
      <Header header="Choose Payment" onPress={() => props.navigation.goBack()} />
      <PaymentMethods navigation={navigation} />
      <AddPayments navigation={navigation} />
    </Modal>
  );
};

export default PaymentChangeModal;
