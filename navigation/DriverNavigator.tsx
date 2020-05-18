import React, { useContext, useEffect, useState, useRef } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, Alert, SectionList, Linking, ScrollView, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch } from 'react-redux'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import MeScreen from '../screens/SettingsViews/MeScreen'
import { Feather, AntDesign } from '@expo/vector-icons'
import { ThemeContext } from 'styled-components'
import api, { getResurants, getDriverOrders } from '../api'
import { LoadingButton } from '../screens/Auth/LoginScreen'
import Axios from 'axios'
import moment, { calendarFormat } from 'moment'

import { Proxima, ProximaBold } from '../components/styled/Text'
// import useLocation from '../hooks/useLocation'
const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function DriverTabNavigator() {

    // const [callToEnable, enabled] = useLocation();
    const theme = useContext(ThemeContext)
    return (
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen name="Home" component={HomeNavigator} options={{ tabBarIcon: ({ focused }) => <AntDesign name="home" size={24} color={focused ? theme.color.blue : 'grey'} />, tabBarLabel: 'Home' }} />
            <Tab.Screen name="Settings" component={MeScreen} options={{ tabBarIcon: ({ focused }) => <Feather name="user" size={24} color={focused ? theme.color.blue : 'grey'} />, tabBarLabel: 'Me' }} />
        </Tab.Navigator>
    )
}

const HomeNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Mainn">
            <Stack.Screen name="Mainn" component={MainScreen} />
        </Stack.Navigator>
    )
}


function MainScreen({ navigation }: any) {
    const refas = useRef<any>()
    const theme = useContext(ThemeContext)
    const orders = useSelector((state: any) => state.driverOrders)
    const restaurants = useSelector((state: any) => state.restaurants)
    const school = useSelector((state: any) => state.school)
    const [sending, setSending] = useState(false)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const dispatch = useDispatch()


    navigation.setOptions({
        headerShown: true,
        headerTitle: () => <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Image source={{ uri: school.logo }} style={{ width: 30, height: 30 }} />
            {school.id > 0 ? <View style={{ flexDirection: 'column', marginHorizontal: 10 }}>
                <ProximaBold size={16}>{school.name}</ProximaBold>
                <Proxima>{school.address}</Proxima>
            </View> : <View style={{ flexDirection: 'column', marginHorizontal: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>you are not assigned to school</Text>
                </View>}
        </View>
    })

    const getRestaurants = api.get('/restaurants')
    // const getTodayOrders = api.get('/test/orders')
    const getTodayOrders = api.get('/driver/today')

    // const [callToEnable, enabled] = useLocation();
    const enabled = false;
    const callToEnable = () => { }

    useEffect(() => {
        Axios.all([getRestaurants, getTodayOrders]).then(Axios.spread((...response) => {
            dispatch({ type: 'INIT_RESTAURANTS', payload: response[0].data })
            dispatch({ type: 'INIT_DRIVER_ORDERS', payload: response[1].data })
            setLoading(false)
        })).catch(errors => {
            setLoading(false)
        })
    }, [])

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }


    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />
            <Text>{enabled ? 'true' : 'false'}</Text>
            <View style={{ marginVertical: 20, alignItems: 'center', width: '100%' }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    {orders.map((item: any, index: any) => {
                        return (
                            <TouchableOpacity key={item.title} onPress={() => refas.current.scrollToLocation({ animated: true, sectionIndex: index, itemIndex: 1 })}>
                                <View style={{ padding: 12, marginRight: 20, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 5, marginLeft: index === 0 ? 20 : 0 }}>
                                    <Proxima>{!!restaurants.filter((restaurant: any) => restaurant.id === item.title)[0]?.name ? restaurants.filter((restaurant: any) => restaurant.id === item.title)[0]?.name : 'deleted'}</Proxima>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>
            {loading ? <Proxima>loading...</Proxima> :
                <View style={{ flex: 1 }}>
                    <SectionList
                        style={{ flex: 1 }}
                        ref={refas}
                        onRefresh={() => {
                            setRefreshing(true)
                            Axios.all([getRestaurants, getTodayOrders]).then(Axios.spread((...response) => {
                                dispatch({ type: 'INIT_RESTAURANTS', payload: response[0].data })
                                dispatch({ type: 'INIT_DRIVER_ORDERS', payload: response[1].data })
                                setTimeout(() => {
                                    setRefreshing(false)
                                }, 500)
                            })).catch((error) => {
                                setTimeout(() => {
                                    setRefreshing(false)
                                }, 1000)
                            })
                        }}
                        stickySectionHeadersEnabled={true}
                        refreshing={refreshing}
                        sections={orders}
                        renderSectionHeader={({ section: { title } }) => <Section title={title} restaurants={restaurants} count={orders.filter((item: any) => item.title === title)[0].data.length} />}

                        renderItem={({ item }) => <UpcomingItem key={item.id} navigation={navigation} {...item} status={'Ready for pickup'} />}
                        keyExtractor={(item, index) => item + index}
                        ListEmptyComponent={() => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: 'bold', fontSize: 24 }}>No orders</Text></View>}
                        extraData={[orders, loading, refreshing]}
                    />
                    <View style={{ marginHorizontal: 20 }}>
                        <LoadingButton title="Send arrival notification" color={theme.color.blue} loading={sending} handleClick={() => {
                            setSending(true)
                            api.post('/notifications', { users: orders.map((item: any) => item.data.map(item2 => item2.eater.id)).flat().filter(onlyUnique), message: { type: 'delivery' } }).then(res => {
                                setSending(false)
                                Alert.alert('Notifications sent')
                            })
                        }} />
                    </View>
                    <View style={{ marginHorizontal: 20 }}>
                        {!enabled ? <TouchableOpacity onPress={() => callToEnable(true)} >
                            <View style={{ backgroundColor: theme.color.blue, padding: 15, borderRadius: 6, fontSize: 18, marginTop: 10, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                <ProximaBold style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Share Location</ProximaBold>
                            </View>
                        </TouchableOpacity> : <TouchableOpacity onPress={() => callToEnable(false)} >
                                <View style={{ backgroundColor: 'black', padding: 15, borderRadius: 6, fontSize: 18, marginTop: 10, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <ProximaBold style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Sharing your location</ProximaBold>
                                </View>
                            </TouchableOpacity>}
                    </View>
                </View>}
        </View>
    )
}

function Section({ title, restaurants, count }: any) {
    return (
        // <TouchableOpacity onPress={() => Linking.openURL(`http://maps.google.com/?daddr=${restaurants.filter(item => item.id === title)[0]?.address}`)}>
        <TouchableOpacity>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', backgroundColor: 'black', padding: 10, paddingHorizontal: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'white' }}>{
                    !!restaurants.filter((item: any) => item.id === title)[0]?.name ? restaurants.filter((item: any) => item.id === title)[0]?.name : 'Restaurant name'
                }</Text>

                <Text style={{ color: 'white' }}>ORDERS - <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{count}</Text></Text>
            </View>
        </TouchableOpacity>
    )
}


function UpcomingItem({ navigation, ...props }: any) {
    const { display_id, delivery, payments, cart } = props

    return (
        <TouchableOpacity onPress={() => navigation.navigate('TopLevel', { screen: 'OrderHistoryView', params: { ...props, driver: true } })}>
            <View style={{ flexDirection: 'column', marginTop: 20, margin: 20 }} >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Order #{display_id}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>$ {cart.subtotal}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {/* <Text style={{ fontSize: 16 }}>delivered</Text> */}
                    <Text style={{ fontSize: 16 }}>{moment(delivery.delivery_date).format('LL')}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default DriverTabNavigator
