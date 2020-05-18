import React, { useState, useEffect, useContext } from 'react'
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, AsyncStorage, Alert, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Image, Animated, Easing, Platform } from 'react-native'
import { HeaderText } from '../../components/styled'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeContext } from 'styled-components'
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { useNavigation } from '@react-navigation/core';
import api from '../../api'

export const DismissKeyboard = ({ children }) => {
    const [visible, setVisible] = useState(false)
    const theme = useContext(ThemeContext)
    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
        return () => {
            setVisible(false)
            Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
            Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
        };
    }, [])

    const _keyboardDidShow = () => setVisible(true)
    const _keyboardDidHide = () => { }
    return (
        <TouchableWithoutFeedback onPress={() => {
            setVisible(false)
            Keyboard.dismiss()
        }} disabled={visible ? false : true}>
            <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }} >
                {React.cloneElement(children, { visible, setVisible })}
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export async function register() {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    if (status !== 'granted') {
        // Alert.alert('You need to enable permissions in settings')
        return 0
    }
    const token = await Notifications.getExpoPushTokenAsync();
    return token
}

function LoginScreen() {
    const theme = useContext(ThemeContext)
    const [loading, setLoading] = useState(false)
    if (Platform.OS === 'android') {
        return (
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                <DismissKeyboard>
                    <Login loading={loading} setLoading={setLoading} />
                </DismissKeyboard>
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: theme.color.blue }}>
            <DismissKeyboard>
                <Login loading={loading} setLoading={setLoading} />
            </DismissKeyboard>
        </View>

    )
}

interface IProps {
    handleClick: () => void,
    loading: boolean,
    title?: string,
    color?: string,
    style?: any,
    props?: any
}

export function LoadingButton(Red: IProps) {
    const { handleClick, loading, title, color, style, ...props } = Red
    if (loading) {
        return (
            <View style={{ backgroundColor: 'black', padding: 15, borderRadius: 6, fontSize: 18, marginTop: 10, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <ActivityIndicator size="small" color="white" />
            </View>
        )
    }
    else {
        return (
            <TouchableOpacity onPress={handleClick} disabled={loading} {...props}>
                <View style={{ backgroundColor: color, padding: 15, borderRadius: 6, fontSize: 18, marginTop: 10, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

}


function Login({ loading, visible, setLoading, setVisible }) {
    const isAuth = useSelector(state => state.auth.isAuth)
    const scale = new Animated.Value(1)
    const translateY = new Animated.Value(0)
    const navigation = useNavigation()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()

    async function getSchool() {
        try {
            const schoolApi = await api.get('/school')
            dispatch({ type: 'INIT_SCHOOL', payload: schoolApi.data })
        }
        catch (error) {
            console.log(error)
        }
    };

    async function API_LOGIN() {
        // !!!API CHECK IF LOGIN INFO IS VALID AND SET isAuth to true
        if (!!email && !!password) {
            setLoading(true)
            fetch('http://52.60.103.129/api/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, token: await register() })
            }
            )
                .then(data => data.json())
                .then(async (data) => {
                    if (data.status !== 'error') {
                        getSchool();
                        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.user, token: data.token } })
                        !!data.payments && dispatch({ type: 'INIT_PAYMENTS', payload: { payments: data.payments, user: data.user } })
                        AsyncStorage.setItem('token', data.token.toString())
                        setLoading(false)
                    }
                    else {
                        setLoading(false)
                        dispatch({ type: 'LOGIN_FAILURE' })
                        Alert.alert(!!data.message ? data.message : 'Something is wrong')
                    }
                }).catch(error => {
                    dispatch({ type: 'LOGIN_FAILURE' })
                    setLoading(false)
                    Alert.alert('Wrong email or password, Try again')
                })
        }
        else {
            dispatch({ type: 'LOGIN_FAILURE' })
            Alert.alert('Enter corrent email and password')
        }
    }

    useEffect(() => {
        if (visible === false) {
            Animated.parallel([
                Animated.timing(scale, {
                    toValue: 1.5,
                    duration: 300,
                    easing: Easing.linear,
                    useNativeDriver: true
                }).start(() => { }),
                Animated.timing(translateY, {
                    toValue: -100,
                    duration: 300,
                    easing: Easing.linear,
                    useNativeDriver: true
                })
            ])
        }
        else {
            Animated.timing(scale, {
                toValue: 0.7,
                duration: 300,
                useNativeDriver: true
            }).start()
        }
    }, [visible])

    return (
        <View style={{ flex: 1, backgroundColor: '#007BE9' }}>
            <Animated.View style={{ flex: 1, justifyContent: 'center', transform: [{ translateY: translateY }], alignItems: 'center' }}>
                <Animated.Image source={require('../../assets/Group.png')} style={{ width: 100, transform: [{ scale }, { translateY }], marginBottom: 50, resizeMode: 'contain' }} />
            </Animated.View>
            <View style={{ flex: 0.5, padding: 35, justifyContent: 'flex-start', marginTop: -200 }}>
                <Text style={{ fontSize: 28, color: 'white', fontWeight: 'bold', textAlign: 'left' }}>Login</Text>
                <TextInput onChangeText={text => setEmail(text)} autoCapitalize={"none"} autoCorrect={false} autoCompleteType={"off"} placeholder="Email" style={{ borderColor: isAuth == false ? 'red' : isAuth === true ? 'green' : 'transparent', borderWidth: isAuth == false ? 2 : isAuth === true ? 2 : 0, backgroundColor: 'white', height: 44, width: '100%', borderRadius: 6, fontSize: 18, textAlign: 'center', marginTop: 25 }} onSubmitEditing={() => setVisible(false)} onFocus={() => setVisible(true)} />
                <TextInput onChangeText={text => setPassword(text)} autoCapitalize={"none"} autoCorrect={false} secureTextEntry={true} placeholder="Password" style={{ borderColor: isAuth == false ? 'red' : isAuth === true ? 'green' : 'transparent', borderWidth: isAuth == false ? 2 : isAuth === true ? 2 : 0, backgroundColor: 'white', height: 44, width: '100%', borderRadius: 6, fontSize: 18, textAlign: 'center', marginTop: 10 }} onSubmitEditing={() => setVisible(false)} onFocus={() => setVisible(true)} />
                <LoadingButton handleClick={API_LOGIN} loading={loading} title="Enter" color="black" />
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <View style={{ backgroundColor: 'black', padding: 15, borderRadius: 6, fontSize: 18, marginTop: 10, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Sign Up</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LoginScreen
