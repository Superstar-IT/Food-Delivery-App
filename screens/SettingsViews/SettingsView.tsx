import React, { useContext, useState } from 'react'
import { View, Text, TouchableOpacity, AsyncStorage, Alert, Switch } from 'react-native'
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';
import { ThemeContext } from 'styled-components';
import { useDispatch, batch, useSelector } from 'react-redux';
import api from '../../api'
import { register } from '../Auth/LoginScreen';
import { Bubble } from '../../components/parts/Bubble';
import { Proxima, ProximaBold } from '../../components/styled/Text';



const SettingsView = ({ navigation }: any) => {
    const theme = useContext<any>(ThemeContext)
    const auth = useSelector((state: any) => state.auth)
    const dispatch = useDispatch()
    const [enabled, setEnabled] = useState<any>(!!auth.pushToken ? true : false)

    navigation.setOptions({
        headerTitle: 'Settings',
        headerTitleStyle: {
            fontFamily: 'ProximaNova-Bold',
            fontSize: 24
        },
        headerLeft: () => <Feather name="chevron-left" size={24} color="black" style={{ marginLeft: 20 }} onPress={() => navigation.goBack()} />
    })

    return (
        <View style={{ flex: 1, paddingVertical: 20, justifyContent: 'space-between', backgroundColor: 'white' }}>
            <Bubble bottom >
                <Proxima size={16} >Build Version: {Constants.manifest.version}</Proxima>
            </Bubble>

            <View style={{ flex: 1 }}>
                <Bubble>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <ProximaBold size={14}>Enable Push Notifications</ProximaBold>
                        <Switch value={enabled} onValueChange={async () => {
                            if (enabled) {
                                api.post('/pushToken', { token: null })
                                dispatch({ type: 'UPDATE_PUSH_TOKEN', payload: '' })
                                setEnabled(false)
                            }
                            else {
                                const token = await register()
                                api.post('/pushToken', { token }).then(data => {
                                    if (data.data.status === 'ok') {
                                        dispatch({ type: 'UPDATE_PUSH_TOKEN', payload: token })
                                    }
                                }).then(() => setEnabled(true)).catch(error => console.log(error))
                            }
                        }} />

                    </View>
                </Bubble>
            </View>
            <TouchableOpacity onPress={() => {
                api.delete('/notification').then((data) => {
                    batch(() => {
                        dispatch({ type: 'LOGIN_FAILURE' })
                        dispatch({ type: 'RESET_ORDER' })
                        dispatch({ type: 'REMOVE_ALL' })
                        dispatch({ type: 'START_NEW_ORDER' })
                    })
                    AsyncStorage.removeItem('token')
                    navigation.navigate('Main')
                }).catch(error => { })
            }
            }>
                <View style={{ padding: 20, backgroundColor: '#EB5757', justifyContent: 'center', alignItems: 'center', borderRadius: 6, marginVertical: 50, margin: 20 }}>
                    <ProximaBold size={18} color="white">Log out</ProximaBold>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default SettingsView
