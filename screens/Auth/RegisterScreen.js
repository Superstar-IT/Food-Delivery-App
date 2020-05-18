import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Picker, TextInput, Alert, KeyboardAvoidingView, AsyncStorage, Keyboard, Image, StatusBar } from 'react-native'
import { HeaderText } from '../../components/styled'
import { Feather } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import Constants from 'expo-constants';
import api, { getSchools } from '../../api'
import { useDispatch } from 'react-redux'
import { DismissKeyboard } from './LoginScreenV2'
import { validateEmail } from './helpers'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-community/masked-view';
const RegisterScreen = ({ navigation }) => {
    const [entered, setEntered] = useState({ name: '', lastname: '', email: '', password: '', grade: '' })

    const [next, setNext] = useState(false)
    const emailRef = useRef();


    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        const { name, lastname } = entered
        if (!!name && !!lastname) {
            setNext(true)
        }
        else setNext(false)
    }, [entered])

    const [focused, setFocused] = useState({ name: true, lastname: false })

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar barStyle="dark-content" />
            <DismissKeyboard>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
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
                                        width: '80%',
                                        color: 'black',
                                        fontWeight: 'bold',
                                    }}>
                                        Enter your name
                            </Text>
                                </View>
                            }>
                            <LinearGradient
                                colors={['#4641EC', '#C543F3']}
                                start={[0, 1]}
                                end={[1, 0]}
                                style={{ height: 200, width: '100%' }}
                            />
                        </MaskedView>
                    </View>
                    <View style={{ flex: 0.5, padding: 35, justifyContent: 'flex-start', marginTop: -200 }}>
                        <TextInput
                            onBlur={() => setFocused({ name: false, lastname: false })}
                            onFocus={() => setFocused({ name: true, lastname: false })}
                            ref={emailRef}
                            onChangeText={name => setEntered({ ...entered, name })}
                            autoCapitalize={"none"} autoCorrect={false} autoCompleteType={"off"}
                            placeholder="First Name"
                            style={{
                                backgroundColor: 'white',
                                height: 44,
                                borderBottomColor: focused.name ? '#4F3FEB' : 'rgba(0,0,0,.06)',
                                width: '100%',
                                borderBottomWidth: 3,
                                fontSize: 18,
                                textAlign: 'left',
                                marginTop: 25
                            }} />
                        <TextInput
                            onBlur={() => setFocused({ name: false, lastname: false })}
                            onFocus={() => setFocused({ name: false, lastname: true })}
                            onChangeText={lastname => setEntered({ ...entered, lastname })}
                            autoCapitalize={"none"}
                            autoCorrect={false}
                            placeholder="Last Name"
                            style={{
                                backgroundColor: 'white',
                                height: 44,
                                borderBottomColor: focused.lastname ? '#4F3FEB' : 'rgba(0,0,0,.06)',
                                width: '100%',
                                borderBottomWidth: 3,
                                fontSize: 18,
                                textAlign: 'left',
                                marginTop: 25
                            }} />

                        <View style={{ flex: 1 }} />
                        <TouchableOpacity onPress={() => {
                            if (next) navigation.navigate('RegisterEmail', { entered })
                            else Alert.alert('All fields are required')
                        }}>
                            <LinearGradient
                                colors={['#3643EA', '#BC40F4']}
                                start={[0, 1]}
                                end={[1, 0]}
                                style={{ height: 50, width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 6, padding: 15, marginTop: 40 }}
                            >
                                <Text style={{ fontWeight: 'bold', color: 'white' }}>NEXT</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </DismissKeyboard>
        </View>
    )
}

export default RegisterScreen
