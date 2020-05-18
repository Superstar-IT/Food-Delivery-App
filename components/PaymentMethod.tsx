import React, { useState, useContext } from 'react'
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Feather } from '@expo/vector-icons';
import api from '../api'
import { ThemeContext } from 'styled-components';
import { Bubble } from './parts/Bubble';
import { ProximaBold, Proxima } from './styled/Text';


function PaymentMethod({ showTrash, setShowTrash }) {
    const paymnets = useSelector(state => state.payments)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)

    if (paymnets.cards.length > 0) {
        return (
            paymnets.cards.map(card => {
                return <PaymentMethodItem loading={loading} setShowTrash={setShowTrash} showTrash={showTrash} key={card.id} {...card} Icon={() => <Image source={{ uri: card.image }} style={{ width: 40, height: 40, marginRight: 30, resizeMode: "contain" }} />} handlePress={() => {
                    setLoading({ is: true, id: card.id })
                    api.patch('/payments/defaultCard', {
                        card: card.id
                    }).then(data => {
                        const { status, message } = data.data
                        setLoading(false)
                        if (status === 'error') {
                            Alert.alert(message)
                        }
                        else if (status === 200) {
                            dispatch({ type: 'CHANGE_DEFAULT_PAYMENT', payload: card.id })
                        }
                    })
                }} />
            })
        )
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Bubble>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ProximaBold size={18}>No payment methods </ProximaBold>
                    <Proxima size={14} align="center" style={{ marginTop: 6, width: '80%' }}>Click "Add payment method" to add new card </Proxima>
                </View>
            </Bubble>
        </View>
    )

}

export function PaymentMethodItem(props) {
    const { last4, Icon, id, handlePress, showTrash, setShowTrash, loading, text, exp_month, exp_year } = props;
    const isDefault = useSelector(state => state.payments.default) === id;
    const [loading2, setLoading2] = useState(false)
    const dispatch = useDispatch();
    const theme = useContext(ThemeContext)
    return (
        <TouchableOpacity onPress={handlePress} disabled={(!loading && !isDefault) ? false : true}>
            <Bubble bottom>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon />
                    <View style={{ flexDirection: "column", flex: 1 }}>
                        <ProximaBold style={{ fontSize: 16, flex: 1 }}>
                            {"**** **** **** " + last4}{" "}
                        </ProximaBold>
                        <ProximaBold color="grey">Expires {Number(exp_month) < 10 ? `0${exp_month}` : `${exp_month}`}/{exp_year}</ProximaBold>
                    </View>
                    {isDefault && !showTrash && !loading && <Feather name="check" color={theme.color.green} size={28} />}
                    {loading.is && id === loading.id && <ActivityIndicator size="small" color="black" />}
                    {showTrash ? <TouchableOpacity disabled={loading2.is} onPress={() => {
                        setLoading2({ is: true, id: id })
                        setShowTrash(false)
                        api.delete('/payments/card/' + id)
                            .then(data => {
                                const { status } = data.data
                                if (status === 'error') {
                                    setLoading2(false)
                                    Alert.alert('Error try again')
                                }
                                else if (status === 200) {
                                    setLoading2(false)
                                    dispatch({ type: 'DELETE_CARD', payload: id })
                                }
                            })
                    }}>
                        <Feather name="trash" color='red' size={22} />
                    </TouchableOpacity> : loading2.is === true && id === loading2.id && <ActivityIndicator size="small" color="black" />}
                </View>
            </Bubble>
        </TouchableOpacity>
    )
}

export default PaymentMethod
