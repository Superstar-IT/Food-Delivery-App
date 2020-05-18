//@ts-nocheck
import React, { useCallback } from 'react'
import { View, Text, Animated, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderText } from '../../components/styled'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import ProductItem from '../../components/ProductItem'
import TotalPrice from '../../components/TotalPrice'
import { priceSelector, upcomingSelector, IOrder } from '../../store/selectors'
import { RefreshScroolView } from './OrdersScreen'
import { Bubble } from '../../components/parts/Bubble'
import { Proxima, ProximaBold } from '../../components/styled/Text'

const UpcomingView = ({ navigation }) => {

    const upcoming = useSelector(upcomingSelector)
    const dispatch = useDispatch()

    const Sorted = upcoming.slice().sort((a: IOrder, b: IOrder) => {
        return new Date(moment(a.delivery.delivery_time)) - new Date(moment(b.delivery.delivery_time))
    })

    if (upcoming.length > 0) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <RefreshScroolView url='/v2/orders' handleData={(data) => dispatch({ type: 'INIT_ORDERS', payload: data, loaded: true })} >
                    {Sorted.map((order: IOrder) => {
                        return <UpcomingItem key={order.id} {...order} navigation={navigation} />
                    })}
                </RefreshScroolView>
            </SafeAreaView>
        )
    }
    else {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <RefreshScroolView url='/v2/orders' handleData={(data) => dispatch({ type: 'INIT_ORDERS', payload: data, loaded: true })} >
                    <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                        <Bubble>
                            <ProximaBold size={24} align='center'>No upcoming orders</ProximaBold>
                            <Proxima size={16} align="center">if you order something, upcoming order details will apear here</Proxima>
                        </Bubble>
                    </View>
                </RefreshScroolView>
            </SafeAreaView>
        )
    }
}

function UpcomingItem({ navigation, ...props }) {
    const { display_id, current_state, payments, total, delivery }: IOrder = props

    return (
        <TouchableOpacity onPress={() => navigation.navigate('TopLevel', { screen: 'OrderHistoryView', params: { ...props, upcoming: true } })}>
            <Bubble bottom >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Order #{display_id}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>$ {payments.charges.total.amount}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16 }}>{current_state}</Text>
                    <Text style={{ fontSize: 16 }}>{moment(delivery.delivery_time).format('LL')}</Text>
                </View>
            </Bubble>
        </TouchableOpacity>
    )
}

export default UpcomingView
