import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../../components/ProductItem";
import {
  priceSelector,
  todaySelector,
  itemsAmountSelector,
  IOrder,
  Cart
} from "../../store/selectors";
import api from "../../api";
import produce from "immer";
import { ThemeContext } from "styled-components";
import { Bubble } from "../../components/parts/Bubble";
import TotalPrice from "../../components/TotalPrice";
import { ProximaBold } from "../../components/styled/Text";
import MapView, { Marker } from 'react-native-maps';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import MapBubble from "./MapBubble";


const OrdersScreen = ({ navigation, route }: any) => {
  const theme: any = useContext(ThemeContext);
  const today = useSelector(todaySelector);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const orders = useSelector((state: any) => state.orders);
  const school = useSelector((state: any) => state.school);


  useEffect(() => {
    loading &&
      api
        .get("/v2/orders")
        .then(res => {
          debugger
          dispatch({ type: "INIT_ORDERS", payload: res.data, loaded: true });
          setLoading(false);
        })
        .catch(err => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="black" size="large" />
      </View>
    );
  } else {
    if (today.length > 0) {
      return (
        <View style={{ flex: 1, }}>
          <RefreshScroolView
            url="/v2/orders"
            handleData={(data: any) =>
              dispatch({ type: "INIT_ORDERS", payload: data, loaded: true })
            }
            setLoading={setLoading}
          >
            <Bubble>
              <ProximaBold size={14}>Will be delivered on</ProximaBold>
              <Text style={{ fontFamily: "ProximaNova-Reg", fontSize: 18 }}>
                {moment(today[0].date2).format("ll")} at {school.arrival}
              </Text>
            </Bubble>

            <Bubble top>
              <ProximaBold size={18} align="center">
                Order code
              </ProximaBold>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "ProximaNova-Reg",
                  textAlign: "center"
                }}
              >
                Show this when receiving your food
              </Text>
              <Text
                style={{
                  fontFamily: "ProximaNova-Bold",
                  fontSize: 32,
                  color: "#007BE9",
                  marginTop: 20,
                  textAlign: "center"
                }}
              >
                #{today[0].display_id}
              </Text>
            </Bubble>

            <MapBubble />

            {today.map((order: IOrder, index: number) => {
              return (
                <Bubble top key={order.display_id}>
                  <ProximaBold size={24} align="center">
                    Your order #{index + 1}
                  </ProximaBold>
                  {/* <Text>{moment(order.date2).format('LLL')}</Text> */}
                  <View
                    style={{
                      backgroundColor: theme.color.blue,
                      width: 80,
                      height: 4,
                      borderRadius: 20,
                      alignSelf: "center",
                      marginVertical: 5
                    }}
                  />
                  <View>
                    {order.cart.map((item: Cart) => {
                      return <ProductItem key={item.id + Date.now()} {...item} summery={true} disabled={true} paid={true} />
                    })}
                  </View>
                  <View style={{ marginTop: 20 }}>
                    <TotalPrice subtotal={order.payments.charges.subtotal.amount} payments={order.payments} advanced/>
                  </View>
                </Bubble>
              );
            })}
          </RefreshScroolView>
          <View style={{ marginHorizontal: 20 }}>
            <Text
              style={{ textAlign: "center", marginBottom: -20, marginTop: 10 }}
            >
              A receipt has been emailed to your email
            </Text>
          </View>
        </View>
      );
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RefreshScroolView
        url="/v2/orders"
        handleData={(data: any) =>
          dispatch({ type: "INIT_ORDERS", payload: data, loaded: true })
        }
        setLoading={setLoading}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}
        >
          <Bubble>
            <Text
              style={{
                fontFamily: "ProximaNova-Bold",
                fontSize: 24,
                textAlign: "center"
              }}
            >
              No orders today
            </Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                fontFamily: "ProximaNova-Reg"
              }}
            >
              if you order something, order details will apear here
            </Text>
          </Bubble>
        </View>
      </RefreshScroolView>
    </SafeAreaView>
  );
};



export default OrdersScreen;

export function RefreshScroolView({
  children,
  url,
  handleData,
  setLoading = () => { }
}: any) {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    api
      .get(url)
      .then(res => {
        handleData(!!res.data ? res.data : []);
        setLoading(false);
      })
      .catch(err => console.log(err));
    wait(800).then(() => setRefreshing(false));
  }, [refreshing]);

  function wait(timeout: number) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {children}
    </ScrollView>
  );
}