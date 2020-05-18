//@ts-nocheck
import React, { useContext, useState, useRef } from 'react'
import { View, Text, TouchableOpacity, Animated, ScrollView, Dimensions } from 'react-native'
import { Feather } from '@expo/vector-icons'

import ProductItem from '../../components/ProductItem'
import Notes from '../../components/Notes'
import { ThemeContext } from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { priceSelector } from '../../store/selectors'
import BottomOrderItem from '../../components/BottomOrderItem'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { HeaderText } from '../../components/styled'
import { Bubble } from '../../components/parts/Bubble'


const BasketView = (props) => {
    const theme = useContext(ThemeContext)
    const swipeItem = useRef()
    const { navigation } = props

    // const { name } = props.route.params
    const [note, setNote] = useState('')
    const [showRight, setShowRight] = useState(false)
    const cartPrice = useSelector(priceSelector)
    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart.items)
    const cartByID = useSelector(state => state.cart.itemsByID)

    navigation.setOptions({
        headerTitle: 'Your order',
        headerLeft: () => <Feather name="chevron-left" size={24} color="black" style={{ marginLeft: 20 }} onPress={() => navigation.goBack()} />,

    })

    function handleAddNote(text) {
        setNote(text)
    }

    function renderRightActions({ dragX, id }) {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => {
                    dispatch({ type: 'REMOVE_FROM CART', payload: id })
                }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: 8, left: 0, width: 40 }}>
                        <Feather name={'trash'} size={24} color="red" />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    if (cart.length > 0) {
        return (
            <View style={{ flex: 1 }}>


                <View style={{ flex: 1 }}>
                    <ScrollView style={{ maxHeight: Dimensions.get('screen').height / 1.6, marginTop: 25 }}>
                        <View style={{ flexDirection: 'column' }}>
                            {cart.map(id => {
                                return <ProductItem key={id} {...cartByID[id]} margin30 bubble />

                                {/* <Swipeable ref={swipeItem} renderRightActions={(...props) => renderRightActions({ progress: props[0], dragX: props[1], id })}> */ }
                                {/* </Swipeable> */ }
                            })}
                        </View>
                    </ScrollView>
                    <View style={{}}>
                        {/* <Notes handleAddNote={handleAddNote} /> */}
                        <Bubble>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Total </Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 24 }}>$ {cartPrice.toFixed(2)}</Text>
                            </View>
                        </Bubble>

                    </View>
                </View>


                {/* <BottomOrderItem text="Checkout" price={cartPrice.toFixed(2)} handlePress={() => navigation.navigate('Confirm', { name, note })} /> */}
                <BottomOrderItem text="Checkout" price={cartPrice.toFixed(2)} modal handlePress={() => navigation.navigate('TopLevel', { screen: 'Confirm' })} />

            </View>
        )
    }
    else {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <HeaderText size={18}>Your Basket is empty</HeaderText>
            </View>
        )
    }
}

export default BasketView
