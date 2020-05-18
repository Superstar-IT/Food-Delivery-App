//@ts-nocheck
import React, { useEffect, useState, useContext, useRef } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableWithoutFeedback,


} from 'react-native';
import { Image } from "react-native-expo-image-cache";
import api from '../../api'
import SafeAreaView from 'react-native-safe-area-view';
import { useSelector, useDispatch } from 'react-redux';
import BottomOrderItem from '../../components/BottomOrderItem';
import { priceSelector, itemsAmountSelector } from '../../store/selectors';
import { Feather } from '@expo/vector-icons';
import { ProximaBold, Proxima } from '../../components/styled/Text';
import Animated, { Easing } from 'react-native-reanimated';

const RestauramtsList = styled.View`
  align-items: center;
`;
function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}


export default function HomeScreen({ navigation }) {
  const restaurants = useSelector(state => state.restaurants)

  const showCart = useSelector(state => state.cart.items).length

  const cartPrice = useSelector(priceSelector)
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const school = useSelector(state => state.school)
  const theme = useContext(ThemeContext)
  const [loading, setLoading] = useState(true)
  async function getSchool() {
    try {
      api.get('/school').then(data => {
        debugger
        dispatch({ type: 'INIT_SCHOOL', payload: data.data })
      })
    }
    catch (error) {
      console.log(error)
    }
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getSchool()
    setTimeout(() => {
      api.get('/restaurants').then(res => {
        dispatch({ type: "INIT_RESTAURANTS", payload: res.data })
      })
    }, 500)
    wait(2000).then(() => setRefreshing(false));
  }, [refreshing]);

  React.useEffect(() => {
    api.get('/restaurants').then(res => {
      dispatch({ type: "INIT_RESTAURANTS", payload: res.data })
      setLoading(false)
    })
  }, [])
  const itemAmount = useSelector(itemsAmountSelector)

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => <TouchableWithoutFeedback onPress={() => Alert.alert(school.name, school.address)}>
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ flexDirection: 'column', marginHorizontal: 10, alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontFamily: 'ProximaNova-Bold', color: theme.color.blue }}>DELIVERING TO</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontFamily: 'ProximaNova-Bold' }}>{school.name}</Text>
              <Feather name="chevron-down" color={theme.color.blue} size={24} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    })
  }, [])


  const animatedOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!!restaurants) {
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.ease
      }).start()
    }
  }, [loading])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="black" size="large" />
      </View>
    )
  }
  else {
    return (
      <SafeAreaView style={styles.container} forceInset={{ bottom: 'never' }}>
        <Text style={{ fontFamily: 'ttnorms_bold', fontWeight: '900', fontSize: 24, marginHorizontal: 20, marginTop: 20, marginBottom: 10 }}>All restaurants</Text>
        <Animated.View style={{ opacity: animatedOpacity, flex: 1 }}>
          <FlatList
            contentContainerStyle={{ paddingBottom: 25 }}
            onRefresh={onRefresh}
            refreshing={refreshing}
            data={restaurants}
            renderItem={({ item: restaurant }) => {
              return (
                <RestauramtsList>
                  <RestaurantItem
                    {...restaurant}
                    key={restaurant.id}
                    delivery={school.delivery}
                    delivery_cap={school.delivery_cap}
                    handlePress={() => navigation.navigate('TopLevel', { screen: 'Restaurant', params: restaurant })}
                  />
                </RestauramtsList>
              )
            }}
            keyExtractor={item => item.id.toString()}
            initialNumToRende={4}
            ListEmptyComponent={() =>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontWeight: 'normal', width: '80%', fontSize: 18 }}>Once {school.delivery_cap} people register to this school, delivery service will open. </Text>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{school.count} / {school.delivery_cap} users</Text>
                <RestaurantItem id={1} name={"McDonalds"} type={"Fast Food"} delivery_cap={school.delivery_cap} delivery="disabled" image="https://cloudmatesfood.s3.eu-central-1.amazonaws.com/mcdonalds.jpg" status="in progress" />
                <RestaurantItem id={2} name={"Starbucks"} delivery_cap={school.delivery_cap} delivery="disabled" image="https://s3.ca-central-1.amazonaws.com/flyte.live/9a1053fcd7ab83640d6b9f8ad2eb888321689101_2033621810194944_7371033447604682752_n.jpg" status="in progress" />
                <RestaurantItem id={3} name={"Thai Express"} type={"Thai Food"} delivery_cap={school.delivery_cap} delivery="disabled" image="https://s3.ca-central-1.amazonaws.com/flyte.live/68abb8b599dd201ecddd7c6698e6bc3c82acc3366f2ebf288a0c258bbb80e4ab.jpg" status="in progress" />
              </View>
            }
          />
        </Animated.View>
        {/* <BottomSheet /> */}
        {/* {showCart > 0 && <BottomOrderItem text={restaurant.name} price={cartPrice} handlePress={() => navigation.navigate('TopLevel', { screen: 'Restaurant', params: restaurant })} />} */}
        {showCart > 0 && <BottomOrderItem text={itemAmount + ' Items in Cart'} price={cartPrice} handlePress={() => navigation.navigate('TopLevel', { screen: 'Basket' })} />}
      </SafeAreaView>
    );
  }
}


function RestaurantItem(props) {
  const { id, name, type, price, image, handlePress, delivery, status, delivery_cap } = props
  function NotAvailableAlert() {
    Alert.alert('Restaurant is Not Available', `When ${delivery_cap} people sign up to this school, delivery service will open.`)
  }
  function NotAvailableAlertContact() {
    Alert.alert('Restaurant is Not Available', `If you would like ${name} to be an option. Please Contact your Flyte Representative.`)
  }


  return (
    <TouchableWithoutFeedback key={id} onPress={delivery === 'disabled' ? NotAvailableAlert : status === 'in progress' ? NotAvailableAlertContact : handlePress}>
      <Animated.View style={{ marginTop: 35 }}>
        {delivery === 'disabled' && <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, flex: 1, top: 0, left: 0, position: 'absolute', zIndex: 9999, width: 280, height: 160, justifyContent: 'space-around', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'white' }}> Not Available </Text>
          <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}> When {delivery_cap} people sign up to this school, delivery service will open. </Text>
        </View>}
        {delivery === 'enabled' && status === 'in progress' && <View style={[style.image, { backgroundColor: 'rgba(0,0,0,0.6)', flex: 1, top: 0, left: 0, position: 'absolute', zIndex: 9999, justifyContent: 'space-around', alignItems: 'center', padding: 20 }]}>
          <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'white' }}> Not Available </Text>
          <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}> If you would like {name} to be an option. Please Contact your Flyte Representative. </Text>
        </View>}
        <View style={style.card} >
          <Image {...{ uri: image, cache: 'force-cache' }} style={style.image} />
          <Text style={style.name}>{name}</Text>
          {!!type && <ProximaBold color="grey" style={{ marginHorizontal: 10, marginBottom: 10 }}>{type}</ProximaBold>}
          {/* <View style={{ backgroundColor: 'white', borderRadius: 20, position: 'absolute', top: 135, right: 10, alignItems: 'center', paddingHorizontal: 25, padding: 5 }}>
            <ProximaBold size={17}>15 - 20</ProximaBold>
            <ProximaBold color="grey"> min</ProximaBold>
          </View> */}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}
const style = {
  row: {
    flexDirection: 'row'
  },
  card: {
    position: 'relative',
    flexDirection: 'column', backgroundColor: 'white',
    shadowColor: "black",
    shadowOffset: { height: 8, width: 3 },
    shadowOpacity: .1, elevation: 4, borderRadius: 8, justifyContent: 'flex-start'
  },
  name: {
    fontFamily: 'ttnorms_extrabold',
    fontSize: 18,
    margin: 10
  },
  price: {
    marginHorizontal: 10
  },
  image: {
    width: 320,
    height: 160,
    borderRadius: 8
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%'
  }
});