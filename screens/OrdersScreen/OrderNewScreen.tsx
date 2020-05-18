import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { getOrders } from "../../api";
import Accordion from "react-native-collapsible/Accordion";

export default class OrderNewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: false,
      activeSections: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    getOrders()
      .then(res => {
        this.setState({ orders: res.data, loading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });
  }

  _renderHeader = section => {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleTxt}>Order #{section.display_id}</Text>
      </View>
    );
  };

  _renderContent = section => {
    return (
      <View style={styles.itemContainer}>
        {section.cart.map((item, index) => (
          <View key={index} style={[styles.rowContainer, { marginTop: 10 }]}>
            <Text style={[styles.titleTxt, { width: "50%" }]}>{item.name}</Text>

            <Text style={styles.titleTxt}>{item.amount}</Text>
            <Text style={styles.titleTxt}>CAD$ {item.price}</Text>
          </View>
        ))}

        <View style={[styles.rowContainer, { marginTop: 30 }]}>
          <Text style={styles.titleTxt}>
            Total: CAD$ {section.payments.charges.total.amount}
          </Text>
        </View>
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  render() {
    const { orders, loading, activeSections } = this.state;
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <ScrollView style={styles.container}>
          <Accordion
            sections={orders}
            activeSections={activeSections}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            onChange={this._updateSections}
          />
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  titleContainer: {
    padding: 20,
    backgroundColor: "#dfe8eb",
    marginTop: 15,
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  titleTxt: {
    fontSize: 16
  },
  itemContainer: {
    backgroundColor: "#dfe8eb",
    padding: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  }
});
