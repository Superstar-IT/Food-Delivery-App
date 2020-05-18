//@ts-nocheck
import React from 'react'
import { View, ScrollView, Text, Linking, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import ProductItem from '../../components/ProductItem'
import TotalPrice from '../../components/TotalPrice'
import SafeAreaView from 'react-native-safe-area-view'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { Bubble } from '../../components/parts/Bubble'
import { IOrder, Item } from '../../store/selectors'


const OrderHistoryView = ({ navigation, route }) => {
    const { display_id, date, upcoming, cart, payments, driver }: IOrder = route.params
    const arrival = useSelector(state => state.school.arrival)

    navigation.setOptions({
        headerTitle: `Order #${display_id}`,
        headerLeft: () => <Feather name="chevron-left" size={24} color="black" style={{ marginLeft: 20 }} onPress={() => navigation.goBack()} />
    })

    if (driver === true) return (
        <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'never', bottom: 'always' }}>
            {upcoming === true && <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 20 }}>This order wil be delivered at {arrival}</Text>}
            {upcoming === true && <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>on {moment(date).format('LLL')} </Text>}
            <ScrollView style={{ marginTop: 25 }}>
                {cart.items.map((item: Item) => {
                    return <ProductItem key={item.id} {...item} disabled={true} paid={!!payments.charges.id} margin30 bubble />
                })}
            </ScrollView>
            {/* {upcoming === true && <TouchableOpacity>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'red' }}>Cancel Order </Text>
            </TouchableOpacity>} */}
            <Bubble bottom>
                <TotalPrice subtotal={cart.subtotal} />
            </Bubble>
            {/* <Text style={{ textAlign: 'center', marginTop: 10 }}>{charge}</Text> */}
        </SafeAreaView>
    )

    return (
        <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'never', bottom: 'always' }}>
            {upcoming === true && <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 20 }}>This order wil be delivered at {arrival}</Text>}
            {upcoming === true && <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>on {moment(date).format('LLL')} </Text>}
            <ScrollView style={{ marginTop: 25 }}>
                {cart.map((item: Item) => {
                    return <ProductItem key={item.id} {...item} disabled={true} paid={!!payments.charges.id} margin30 bubble />
                })}
            </ScrollView>
            {/* {upcoming === true && <TouchableOpacity>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'red' }}>Cancel Order </Text>
            </TouchableOpacity>} */}
            <Bubble bottom>
                <TotalPrice subtotal={payments.charges.subtotal.amount} payments={payments} advanced />
            </Bubble>
            {/* <Text style={{ textAlign: 'center', marginTop: 10 }}>{charge}</Text> */}
        </SafeAreaView>
    )
}

export default OrderHistoryView
