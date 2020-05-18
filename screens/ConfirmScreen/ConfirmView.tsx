//@ts-nocheck
import React, { useState, useContext } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Alert, ActivityIndicator, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { Feather } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'
import TotalPrice from '../../components/TotalPrice'
import { ThemeContext } from 'styled-components'
import BottomOrderItem from '../../components/BottomOrderItem'
import { useSelector, useDispatch } from 'react-redux'
import { priceSelector, cardSelector } from '../../store/selectors'
import moment from 'moment'
import ProductItem from '../../components/ProductItem'
import api from '../../api'
import { DismissKeyboard } from '../Auth/LoginScreen'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Bubble } from '../../components/parts/Bubble'
import { Proxima, ProximaBold } from '../../components/styled/Text'
import { usePrice } from '../../hooks/usePrice'


const ConfirmView = (props: any) => {
    const theme = useContext(ThemeContext)
    const { navigation } = props
    const school: any = useSelector((state: any) => state.school)

    const hours = moment(school.close, "HH:mm:ss").hours()
    const minutes = moment(school.close, "HH:mm:ss").minutes()


    const [date, setDate] = useState(new Date(Date.now()).setHours(23, minutes, 0))

    const cartPrice: number = useSelector(priceSelector)
    const auth = useSelector((state: any) => state.auth)
    const cart = useSelector((state: any) => state.cart.items)
    const cartByID = useSelector((state: any) => state.cart.itemsByID)

    function handleDateChange(event: any, _date: any) {
        setDate(new Date(Date.parse(_date)).setHours(hours, minutes, 0))
    }

    const [promo, setPromo] = useState({ value: 0, code: '' })
    const [total, tax, more, serivefee, orderfee, deliveryfee, off, subtotal] = usePrice(cartPrice, promo?.value)
    const card = useSelector(cardSelector)
    const cardID = useSelector((state: any) => state.payments.default)

    navigation.setOptions({
        headerTitle: "Checkout",
        headerLeft: () => <Feather name="chevron-left" size={24} color="black" style={{ marginLeft: 20 }} onPress={() => navigation.goBack()} />,
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24
        },
    })

    return (
        <DismissKeyboard>
            <View style={{ flex: 1, backgroundColor: '#ecf0f1' }}>
                {/* <Text>{moment(Date.now()).format('LLL')}</Text>
                <Text>{moment(date).format('LLL')}</Text>
                <Text>{moment(moment(school.close, "H:m")).format('LLL')}</Text> */}
                <ScrollView nestedScrollEnabled={true}>
                    <Bubble top bottom>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Feather name="map-pin" style={{ marginRight: 20 }} size={24} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{school.name}</Text>
                                <Text style={{ fontSize: 14 }}>{school.address}</Text>
                            </View>
                        </View>
                    </Bubble>

                    <Bubble button={{ title: 'Select delivery date', onPress: () => navigation.navigate('TimeChange', { handleDateChange, date }) }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Feather name="clock" style={{ marginRight: 20 }} size={24} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text >Order will be delivered on</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{moment(date).format('LL')} at {school.arrival}</Text>
                            </View>
                        </View>
                    </Bubble>

                    <Bubble top>
                        <Text style={{ fontFamily: 'ProximaNova-Bold', fontSize: 24, textAlign: 'center' }}>Your order</Text>
                        <View style={{ backgroundColor: theme.color.blue, width: 80, height: 4, borderRadius: 20, alignSelf: 'center', marginVertical: 5 }} />
                        <View style={{ flexDirection: 'column', marginBottom: 25 }}>
                            {cart.map((id: any) => {
                                return <ProductItem key={id} {...cartByID[id]} summery={true} route={props.route.name} />
                            })}
                        </View>
                    </Bubble>


                    <View style={{ marginHorizontal: 20, marginTop: 20, backgroundColor: 'white', borderRadius: 10, shadowColor: "black", position: 'relative', shadowOffset: { height: 9, width: 5 }, elevation: 4, shadowOpacity: 0.1, shadowRadius: 10 }}>
                        <PromoCode setPromo={setPromo} />
                    </View>


                    <Bubble top bottom>
                        <TotalPrice subtotal={cartPrice} advanced={true} promo={promo?.value} />
                    </Bubble>
                </ScrollView>



                <View style={{ justifyContent: 'center', backgroundColor: 'white', padding: 10, zIndex: -999, bottom: -10, borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingVertical: 15, top: 0 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        {!!card ? <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image source={{ uri: card.image }} style={{ width: 40, height: 40, marginRight: 30, resizeMode: "contain", marginHorizontal: 20 }} />
                            <View style={{ flexDirection: "column", flex: 1 }}>
                                <ProximaBold style={{ fontSize: 16, flex: 1, paddingTop: 5 }}>
                                    {"**** **** **** " + card.last4}{" "}
                                </ProximaBold>
                                <ProximaBold color="grey">Expires {Number(card.exp_month) < 10 ? `0${card.exp_month}` : `${card.exp_month}`}/{card.exp_year}</ProximaBold>
                            </View>
                            <TouchableOpacity onPress={() => { navigation.navigate('PaymentChange') }}>
                                <View style={{ marginHorizontal: 20 }}>
                                    <Proxima>Change</Proxima>
                                </View>
                            </TouchableOpacity>
                        </View> :
                            cardID === 0 ? <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                <Image source={require('../../assets/Icon.png')} style={{ width: 40, height: 40, marginRight: 10, resizeMode: "contain", marginHorizontal: 20 }} />
                                <ProximaBold style={{ fontSize: 16, flex: 1 }}>  Flyte Balance - <Text style={{ fontFamily: 'ProximaNova-Bold' }}>${Number(auth.balance / 100).toFixed(2)}</Text></ProximaBold>
                            </View> :
                                <View style={{ flex: 1 }}><Proxima>No default card is selected</Proxima></View>}
                        <TouchableOpacity onPress={() => { navigation.navigate('PaymentChange') }}>
                            <View style={{ marginHorizontal: 20 }}>
                                <Proxima>Change</Proxima>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>



                <BottomOrderItem text={"Place Order"} price={total} modal handlePress={() => {
                    debugger
                    if (!!card || cardID === 0) {
                        const ProductObject = {
                            delivery_time: date,
                            promo,
                            orders: Object.values(cartByID)
                        }
                        debugger
                        if (moment(Date.now()).isAfter(date, "minutes")) {
                            Alert.alert(
                                'Orders are closed for today',
                                'Choose another day',
                                [
                                    { text: 'Cancel' },
                                ]
                            )
                        }
                        else {
                            Alert.alert(
                                'Confirm delivery date',
                                moment(date).format('LL'),
                                [
                                    { text: 'Cancel' },
                                    {
                                        text: 'Confirm', onPress: () => {
                                            navigation.navigate('OrderSend', { total, ProductObject })
                                        }
                                    }
                                ]
                            )
                        }
                    }
                    else {
                        Alert.alert('Select payment method')
                    }

                }} />
            </View>
        </DismissKeyboard>
    )
}


function getOptionsList(item) {
    const str = item?.options?.reduce((sum, val, index) => {
        if (val.selected) sum += val.text + `${item.type === 'multi' ? "," : ''}`
        return sum
    }, '')

    if (str.slice(-1) === ',') {
        return str.substring(0, str.length - 1);
    }
    return str
}

function PromoCode({ setPromo }) {
    const theme = useContext(ThemeContext)
    const [promo, setPromoV] = useState('')
    const [loading, setLoading] = useState(false)
    const [valid, setValid] = useState()

    function checkPromo() {
        !!promo && !valid && setLoading(true)
        !!promo && !valid && api.get(`/promo?code=${promo}`)
            .then(res => {
                const { status, value, type } = res.data
                setTimeout(() => {
                    if (status === 'invalid') {
                        setPromo({})
                        Alert.alert(`promo code ${promo} is invalid`)
                        setValid(false)
                    }
                    else if (status === 'valid') {
                        Alert.alert(`You get ${value}% off you order`)
                        setPromo({ value: value, code: promo })
                        setValid(true)
                    }
                    setLoading(false)
                }, 500)
            })
    }
    return (
        <View style={{ flexDirection: 'column', }}>
            <View style={{ padding: 20 }}>
                <TextInput placeholder="Enter Promo Code" style={{ borderWidth: 1, borderRadius: 4, padding: 7, borderColor: 'grey', flex: 1, width: '100%' }} onChangeText={(text) => setPromoV(text)} />
            </View>


            <TouchableOpacity onPress={checkPromo}>
                <View style={{ backgroundColor: valid === undefined ? theme.color.blue : valid === true ? theme.color.green : theme.color.red, width: '100%', padding: 15, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                    {!loading ? <Text style={{ color: 'white', fontSize: 18 }}>{valid === undefined ? 'Apply' : valid === true ? 'Applied' : 'Invalid'}</Text> : <ActivityIndicator color="white" size="small" />}
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default ConfirmView
