//@ts-nocheck
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { HeaderText } from '../../components/styled'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { useSelector } from 'react-redux'

const MeScreen = ({ navigation }) => {
    const auth = useSelector(state => state.auth)
    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>

            <TouchableOpacity onPress={() => navigation.navigate('TopLevel', { screen: 'Profile' })}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 30 }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontFamily: 'ProximaNova-Bold', fontSize: 24 }}>{auth.name} {auth.lastname}</Text>
                        <Text style={{ fontSize: 18, fontFamily: 'ProximaNova-Reg' }}>{!!auth.phone ? auth.phone : auth.email}</Text>
                    </View>
                    <Feather name={'chevron-right'} size={24} />
                </View>
            </TouchableOpacity>

            <View style={{ flexDirection: 'column', margin: 30 }}>
                {auth.type === 'user' && <TouchableOpacity onPress={() => navigation.navigate('TopLevel', { screen: 'Payments' })}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
                        <Feather name="credit-card" size={30} style={{ marginRight: 30 }} />
                        <Text style={{ flex: 1, fontSize: 22, fontFamily: 'ProximaNova-Reg' }}>Payments</Text>
                        <Feather name={'chevron-right'} size={24} />
                    </View>
                </TouchableOpacity>}
                <TouchableOpacity onPress={() => navigation.navigate('TopLevel', { screen: 'Settings' })}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
                        <Feather name="settings" size={30} style={{ marginRight: 30 }} />
                        <Text style={{ flex: 1, fontSize: 22, fontFamily: 'ProximaNova-Reg' }}>Settings</Text>
                        <Feather name={'chevron-right'} size={24} />
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default MeScreen
