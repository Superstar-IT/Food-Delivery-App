//@ts-nocheck
import React, { useContext, useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, RefreshControl, Alert } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { ThemeContext } from 'styled-components'
import PaymentMethod, { PaymentMethodItem } from '../../components/PaymentMethod'
import { useSelector } from 'react-redux'
import { Bubble } from '../../components/parts/Bubble'
import { ProximaBold, Proxima } from '../../components/styled/Text'



function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const PaymentsView = ({ navigation, route }) => {
    const theme = useContext(ThemeContext)
    const [showTrash, setShowTrash] = useState()
    const auth = useSelector(state => state.auth)

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, [refreshing]);

    navigation.setOptions({
        headerTitle: route.name,
        headerLeft: () => <Feather name="chevron-left" size={24} color="black" style={{ marginLeft: 20 }} onPress={() => navigation.goBack()} />,
        headerRight: () => <TouchableOpacity onPress={() => setShowTrash(!showTrash)}>
            <Feather name="edit" size={24} color="black" style={{ marginRight: 20 }} />
        </TouchableOpacity>
    })
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ flex: 1 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <ProximaBold style={{ padding: 30 }}>Balance</ProximaBold>
                <TouchableOpacity onPress={() => Alert.alert(`Flyte Balance - $ ${Number(auth.balance / 100).toFixed(2)}`, 'Convert your cash to Flyte Balance every day at the Student Center')}>
                    <Bubble bottom>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../assets/Icon.png')} style={{ width: 35, height: 35, marginRight: 30, resizeMode: "contain" }} />

                            <Proxima size={16}>  Flyte Balance </Proxima>
                            <Feather name="info" size={15} style={{ flex: 1 }} />

                            <ProximaBold size={16}>${Number(auth.balance / 100).toFixed(2)}</ProximaBold>
                        </View>
                    </Bubble>
                </TouchableOpacity>
                <ProximaBold style={{ padding: 30 }}>Payment Methods</ProximaBold>
                <PaymentMethod showTrash={showTrash} setShowTrash={setShowTrash} />
            </ScrollView>
            <TouchableOpacity onPress={() => {
                navigation.navigate('TopLevel', { screen: 'AddPayment' })
                setShowTrash(false)
            }}>
                <View style={{ padding: 20, backgroundColor: theme.color.blue, justifyContent: 'center', alignItems: 'center', borderRadius: 6, marginBottom: 50, marginHorizontal: 30, }}>
                    <Text style={{ fontSize: 18, fontFamily: 'ProximaNova-Bold', color: 'white' }}>Add payment method</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}



export default PaymentsView
