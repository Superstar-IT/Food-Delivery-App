
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
const RegisterScreenGrade = ({ navigation, route }) => {
    const [entered, setEntered] = useState(route.params.entered)

    const [next, setNext] = useState(false)
    const emailRef = useRef();


    useEffect(() => {
        emailRef?.current?.focus();
    }, [])

    useEffect(() => {
        if (Number(entered.grade) < 13 && !!entered.grade) {
            setNext(true)
        }
        else setNext(false)
    }, [entered])

    const [focused, setFocused] = useState({ password: true })

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
                                        What grade are you in
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
                        <View style={{ flex: 1 }} />
                        <TextInput
                            ref={emailRef}
                            onBlur={() => setFocused({ password: false, })}
                            onFocus={() => setFocused({ password: true, })}
                            onChangeText={grade => Number(grade) < 13 ? setEntered({ ...entered, grade }) : {}}
                            value={entered.grade}
                            autoCapitalize={"none"} autoCorrect={false} autoCompleteType={"off"}
                            placeholder="Grade"
                            keyboardType="number-pad"
                            style={{
                                backgroundColor: 'white',
                                height: 44,
                                borderBottomColor: focused.password ? '#4F3FEB' : 'rgba(0,0,0,.06)',
                                width: '100%',
                                borderBottomWidth: 3,
                                fontSize: 18,
                                textAlign: 'left',
                                marginTop: 25
                            }} />

                        <View style={{ flex: 1 }} />
                        <TouchableOpacity onPress={() => {
                            if (next) navigation.navigate('Register3', { entered })
                            else Alert.alert('Enter your grade')
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

export default RegisterScreenGrade
