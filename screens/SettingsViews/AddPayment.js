//@ts-nocheck
import React, { useContext, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native'
import { ThemeContext } from 'styled-components'
import { Feather } from '@expo/vector-icons'
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { useDispatch, useSelector } from 'react-redux';
const stripe = require('stripe-client')('pk_live_vFWtptkqsGof2Co6ZYgVIS4A007vzM4IRM')
// const stripe = require('stripe-client')('pk_test_DKJCxAGo9UZegSvGA4fk3aw2000JopyNtv')

import api from '../../api'
import { LoadingButton } from '../Auth/LoginScreen';

const AddPayment = ({ navigation, route }) => {
    const theme = useContext(ThemeContext)
    const auth = useSelector(state => state.auth)
    const payments = useSelector(state => state.payments)
    const [card, setCard] = useState()
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const s = StyleSheet.create({
        container: {
            backgroundColor: "#F5F5F5",
            marginTop: 60,
        },
        label: {
            color: "black",
            fontSize: 12,
        },
        input: {
            fontSize: 16,
            color: "black",
        },
    });

    const _onChange = formData => {
        /* eslint no-console: 0 */
        setCard(formData)
    };

    async function addCard() {
        setLoading(true)
        let cardObject = {
            card: {
                number: Number(card.values.number.replace(/\s/g, '')),
                exp_month: card.values.expiry.split('/')[0],
                exp_year: card.values.expiry.split('/')[1],
                cvc: Number(card.values.cvc),
                name: `${auth.name} ${auth.lastname}`
            }
        }
        let cardToken = await stripe.createToken(cardObject)

        debugger
        if (payments.cards.filter(card => card.id === cardObject.card.number).length === 0) {
            api.post('/payments/card', { card: cardToken, email: auth.email })
                .then(data => {
                    const { status, message, card } = data.data
                    if (status === 'error') {
                        Alert.alert(message)
                        setLoading(false)
                    }
                    else if (status === 200) {
                        debugger
                        dispatch({ type: 'ADD_PAYMENT', payload: card })
                        setLoading(false)
                        navigation.goBack()
                    }
                }).catch(error => {
                    // console.log(error)
                    setLoading(false)
                    Alert.alert("Error: can't add your card")
                })
        }
        else {
            Alert.alert('card is already added')
            setLoading(false)
        }

    }

    navigation.setOptions({
        headerTitle: 'Add Card',
        headerLeft: () => <Feather name="chevron-left" size={24} color="black" style={{ marginLeft: 20 }} onPress={() => navigation.goBack()} />
    })
    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 30 }}>
            <LiteCreditCardInput
                requiresCVC
                labelStyle={s.label}
                inputStyle={s.input}
                validColor={"black"}
                invalidColor={"red"}
                placeholderColor={"darkgray"}
                onChange={_onChange} />

            {card?.status?.number === 'invalid' && <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>Invalid Card Number</Text>}
            {card?.status?.expiry === 'invalid' && <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>Invalid Expiry</Text>}
            {card?.status?.cvc === 'invalid' && <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>Invalid CVC</Text>}
            {card?.valid &&
                <LoadingButton loading={loading} handleClick={addCard} title="Add Card" color={theme.color.blue} />}
        </View>
    )
}

export default AddPayment
