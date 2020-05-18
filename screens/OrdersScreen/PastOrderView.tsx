//@ts-nocheck
import React, { useCallback, useEffect, useContext } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderText } from "../../components/styled";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../../components/ProductItem";
import TotalPrice from "../../components/TotalPrice";
import { priceSelector, pastSelector, IOrder } from "../../store/selectors";
import { RefreshScroolView } from "./OrdersScreen";
import { Bubble } from "../../components/parts/Bubble";
import { Proxima } from "../../components/styled/Text";
import api from "../../api";
import { ThemeContext } from "styled-components";

const PastOrdersView = ({ navigation }) => {
  const theme = useContext(ThemeContext)
  const past = useSelector(pastSelector);
  const dispatch = useDispatch();
  const Sorted = past
    .slice()
    .sort((a: IOrder, b: IOrder) => new Date(moment(b.delivery.delivery_time)) - new Date(moment(a.delivery.delivery_time)));
  useEffect(() => {
    // api
    //   .get("/v2/orders")
    //   .then(res => {
    //     dispatch({ type: "INIT_ORDERS", payload: res.data, loaded: true });
    //   })
    //   .catch(err => setLoading(false));
  }, []);
  if (past.length > 0) {
    return (
      <View style={{ flex: 1 }}>
        <RefreshScroolView
          url="/v2/orders"
          handleData={data =>
            dispatch({ type: "INIT_ORDERS", payload: data, loaded: true })
          }
        >
          <View style={{ flex: 1, marginTop: 25 }}>
            {Sorted.map((order: IOrder) => {
              return (
                <UpcomingItem
                  key={order.id}
                  {...order}
                  navigation={navigation}
                />
              );
            })}
            {/* <TouchableOpacity onPress={() => Alert.alert('Paggind get more past orders')}>
              <Text style={{ textAlign: 'center', color: 'blue' }}>Load More</Text>
            </TouchableOpacity> */}
          </View>
        </RefreshScroolView>
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RefreshScroolView
        url="/v2/orders/history"
        handleData={data =>
          dispatch({ type: "INIT_ORDERS", payload: data, loaded: true })
        }
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            width: "80%",
            alignSelf: "center"
          }}
        >
          <Text
            style={{
              fontFamily: "ProximaNova-Bold",
              fontSize: 32,
              textAlign: "center"
            }}
          >
            No Orders
          </Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              fontFamily: "ProximaNova-Reg"
            }}
          >
            if you order something, upcoming order details will apear here
          </Text>
        </View>
      </RefreshScroolView>
    </SafeAreaView>
  );
};

export function UpcomingItem({ navigation, ...props }: { navigation: any, props: IOrder }) {
  const { display_id, delivery, payments, current_state }: IOrder = props;

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TopLevel", {
          screen: "OrderHistoryView",
          params: { ...props }
        })
      }
    >
      <Bubble bottom>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontFamily: "ProximaNova-Bold", fontSize: 16 }}>
            Order #{display_id}
          </Text>
          <Text style={{ fontFamily: "ProximaNova-Bold", fontSize: 16 }}>
            $ {payments.charges.total.amount}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Proxima size={16}>{current_state}</Proxima>
          <Proxima size={16}>{moment(delivery.delivery_time).format("LL")}</Proxima>
        </View>
      </Bubble>
    </TouchableOpacity>
  );
}

export default PastOrdersView;
