import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, Alert, AsyncStorage,  ActivityIndicator, StatusBar } from 'react-native'
import { DismissKeyboard, LoadingButton, register } from './LoginScreen'
import { Feather } from '@expo/vector-icons'
import api, { getSchools } from '../../api'
import { useDispatch } from 'react-redux'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-community/masked-view';
export default function RegisterScreenSchool({ navigation, route }) {
    const [entered, setEntered] = useState(route.params.entered)
    const [next, setNext] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!!route.params?.school?.id) {
            setNext(true)
        }
        else setNext(false)
    }, [route.params])

    async function getSchool() {
        try {
            const schoolApi = await api.get('/school')
            dispatch({ type: 'INIT_SCHOOL', payload: schoolApi.data })
        }
        catch (error) {
            console.log(error)
        }
    };

    async function API_SIGNUP() {
        setLoading(true)
        const { name, lastname, email, password, grade } = entered
        if (!!email && !!name && !!password && route.params !== undefined && !!route.params?.school?.id) {
            // console.log({ name, lastname, email, password, school: route.params?.school?.id, grade, token: await register() })
            api.post('/register', { name, lastname, email, password, school: route.params?.school?.id, grade, token: await register() })
                .then(async (data) => {
                    if (!!data.data.user) {
                        await getSchool();
                        AsyncStorage.setItem('token', data.data.token.toString())
                        dispatch({ type: 'LOGIN_SUCCESS', payload: data.data })
                        setLoading(false)
                    }
                    else {
                        Alert.alert(data.data === 'ER_DUP_ENTRY' ? 'User with email address already exists' : 'error')
                        setLoading(false)
                    }
                }).catch(error => { setLoading(false) })
        }
        else {
            if (!!school) {
                Alert.alert('Select your school')
            }
            else Alert.alert(`Don't leave empty fields`)
            setLoading(false)
        }
    }
    return (
        <DismissKeyboard>
            <View style={{ flex: 1, backgroundColor: 'white', padding: 30, justifyContent: 'center', }} >
                <StatusBar barStyle="dark-content" />
                <View style={{ flex: 1 }} />
                <MaskedView
                    style={{ flexDirection: 'row' }}
                    maskElement={
                        <View style={{
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                fontSize: 30,
                                textAlign: 'center',
                                width: '95%',
                                color: 'black',
                                fontWeight: 'bold',
                            }}>
                                Select your school
                            </Text>
                        </View>
                    }>
                    <LinearGradient
                        colors={['#4641EC', '#C543F3']}
                        start={[0, 1]}
                        end={[1, 0]}
                        style={{ height: 100, width: '100%' }}
                    />
                </MaskedView>
                <TouchableOpacity onPress={() => navigation.navigate('SelectSchool')}>
                    <View style={{ backgroundColor: 'white', height: 44, width: '100%', borderRadius: 6, fontSize: 18, textAlign: 'center', marginTop: 10, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: !!route.params?.school?.name ? "black" : 'rgba(0,0,0,0.5)' }}>{!!route.params?.school?.name ? route.params?.school?.name : "Click to select school"}</Text>
                    </View>
                </TouchableOpacity>


                {next && <TouchableOpacity onPress={API_SIGNUP}>
                    <LinearGradient
                        colors={['#3643EA', '#BC40F4']}
                        start={[0, 1]}
                        end={[1, 0]}
                        style={{ height: 50, width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 6, padding: 15, marginTop: 40 }}
                    >
                        {!loading ? <Text style={{ fontWeight: 'bold', color: 'white' }}>FINISH</Text> : <ActivityIndicator size="small" color="white" />}
                    </LinearGradient>
                </TouchableOpacity>}
                <View style={{ flex: 1 }} />
            </View>
        </DismissKeyboard>
    )
}
