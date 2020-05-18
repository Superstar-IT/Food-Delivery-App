import React from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { Feather } from '@expo/vector-icons';
import { usePrice } from '../hooks/usePrice';
import { Payments } from '../store/selectors';

function Price({ children, subtotal, promo }: any) {
    const props = usePrice(subtotal, promo)
    return children(props);
}


const TotalPrice = (props: { subtotal?: number, advanced?: boolean, promo?: number, payments: Payments }) => {
    return (
        <Price {...props}>
            {([total, tax, more, serivefee, orderfee, deliveryfee, off]: any) => {
                if (!!props?.payments?.charges?.id) {
                    total = props.payments.charges.total.amount
                    tax = props.payments.charges.fees.tax
                    more = props.payments.charges.fees.serivefee > 0
                    serivefee = props.payments.charges.fees.serivefee
                    orderfee = props.payments.charges.fees.ORDER_FEE
                    deliveryfee = props.payments.charges.fees.DELIVERY_FEE
                    off = props.payments.charges.offer_discount.value
                }
                if (!!props.advanced) {
                    return (
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Subtotal</Text>
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>$ {Number(props.subtotal).toFixed(2)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                <Text style={{ fontSize: 14 }}>Service Fee</Text>
                                <Text style={{ fontSize: 14 }}>$ {Number(serivefee).toFixed(2)}</Text>
                            </View>
                            {!more && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                <TouchableOpacity onPress={() => Alert.alert('Orders under 12$ have an additional fee')}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 14 }}>Small Order Fee</Text>
                                        <Feather name="info" size={15} style={{ marginLeft: 10 }} />
                                    </View>
                                </TouchableOpacity>
                                <Text style={{ fontSize: 14 }}>${Number(orderfee).toFixed(2)}</Text>
                            </View>
                            }

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                <Text style={{ fontSize: 14 }}>Delivery Fee</Text>
                                <Text style={{ fontSize: 14 }}>$ {Number(deliveryfee).toFixed(2)}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                <Text style={{ fontSize: 14 }}>Tax</Text>
                                <Text style={{ fontSize: 14 }}>$ {Number(tax).toFixed(2)}</Text>
                            </View>

                            {!!off && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>🎉PROMO CODE</Text>
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>-  $ {Number(off).toFixed(2)}</Text>
                            </View>}

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Total <Text style={{ fontSize: 14 }}>(Subtotal + Tax)</Text></Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 24 }}>$ {Number(total).toFixed(2)}</Text>
                            </View>
                        </View>
                    )
                }
                return (

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Total </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 24 }}>$ {props.subtotal}</Text>
                    </View>

                )

            }}
        </Price>
    )
}

export default TotalPrice
