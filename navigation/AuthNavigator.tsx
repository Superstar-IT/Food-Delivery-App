import React, { useState, useEffect, useRef } from 'react';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack'
import MainTabNavigator from './MainTabNavigator';
import { View, Text, Animated, TouchableOpacity, Dimensions, AsyncStorage, Image, ActivityIndicator, AppState, StatusBar, StyleSheet, Easing } from 'react-native';
import LoginScreen from '../screens/Auth/LoginScreen';
import LoginScreenV2 from '../screens/Auth/LoginScreenV2';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import { useSelector, useDispatch, batch } from 'react-redux';
import api from '../api'
import DriverNavigator from './DriverNavigator';
import RegisterScreenSchool from '../screens/Auth/RegisterScreenSchool';
import RegisterScreenGrade from '../screens/Auth/RegisterScreenGrade';
import RegisterScreenEmail from '../screens/Auth/RegisterScreenEmail';
import RegisterScreenPassword from '../screens/Auth/RegisterScreenPassword';
import SelectSchool from '../screens/Auth/SelectSchool';
import { LinearGradient } from 'expo-linear-gradient';
import ViewPager from '@react-native-community/viewpager';
import { useNavigation } from '@react-navigation/core';
import MaskedView from '@react-native-community/masked-view';
import { Proxima } from '../components/styled/Text';

import io from 'socket.io-client'



function SplashScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgb(17,17,17)', paddingTop: 35 }}>
            <Image source={require('../assets/images/Artboard.png')} style={{ width: Dimensions.get('window').width, resizeMode: 'contain' }} />
            <ActivityIndicator size="large" color="white" />
        </View>
    )
}

const Stack = createStackNavigator();
const AuthStack = createStackNavigator()
const Login = createStackNavigator()

function LoginNavigator() {
    return (
        <Login.Navigator initialRouteName="Login" headerMode="none" >
            {/* <Login.Screen name="Login" component={LoginScreen} /> */}
            <Login.Screen name="Login" component={LoginScreenV2} />
            <Login.Screen name="OnBorading" component={OnBorading} />
            <Login.Screen name="Register" component={RegisterScreen} />
            <Login.Screen name="RegisterEmail" component={RegisterScreenEmail} />
            <Login.Screen name="RegisterPassword" component={RegisterScreenPassword} />
            <Login.Screen name="Register2" component={RegisterScreenGrade} />
            <Login.Screen name="Register3" component={RegisterScreenSchool} />
            <Login.Screen name="SelectSchool" component={SelectSchool} />
        </Login.Navigator>
    )
}

const styles = StyleSheet.create({
    viewPager: {
        flex: 2,
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default function AuthNavigator() {
    const [isLoading, setIsLoading] = useState(true);
    const auth = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const first = useSelector(state => state.auth.first)

    // useEffect(() => {
    //     const socket = io('http://52.60.103.129')
    // }, [])

    async function getSchool() {
        try {
            const schoolApi = await api.get('/school')
            dispatch({ type: 'INIT_SCHOOL', payload: schoolApi.data })
        }
        catch (error) {

        }
    };

    const getFirst = async () => {
        const _first = await AsyncStorage.getItem('first')
        dispatch({ type: 'CHANGE_FIRST', payload: true })
        // setFirst(_first === 'false' ? false : true)
    }

    const bootstrapAsync = async () => {
        try {
            let userToken = await AsyncStorage.getItem('token')
            if (!!userToken) {
                // console.log('SUCESS')
                api.get('/user')
                    .then(async (data) => {
                        try {
                            if (!!!data.data.user) {
                                setTimeout(() => setIsLoading(false), 500)
                                dispatch({ type: 'LOGIN_FAILURE' })
                            }
                            else {
                                await getSchool()
                                batch(() => {
                                    dispatch({ type: 'LOGIN_SUCCESS', payload: { token: userToken, user: data.data.user } })
                                    !!data.data.payments && dispatch({ type: 'INIT_PAYMENTS', payload: { payments: data.data.payments, user: data.data.user } })
                                })
                                // socket.emit('identify', { id: data.data.user.id, school: data.data.user.school })
                                setIsLoading(false)
                            }
                        }
                        catch (error) {
                            console.log(error)
                        }
                    }).catch(error => {
                        setTimeout(() => setIsLoading(false), 500)
                        dispatch({ type: 'LOGIN_FAILURE' })
                        // console.log(error)
                    })
            }
            else {
                setTimeout(() => {
                    setTimeout(() => setIsLoading(false), 500)
                }, 3000)
                dispatch({ type: 'LOGIN_FAILURE' })
            }
        }
        catch (error) {
            setTimeout(() => setIsLoading(false), 500)
            dispatch({ type: 'LOGIN_FAILURE' })
        }
    }

    useEffect(() => {
        bootstrapAsync();

        getFirst();
    }, []);
    if (isLoading) {
        return <Stack.Screen options={{ cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid }} name="Splash" component={SplashScreen} />
    }
    return (
        <AuthStack.Navigator initialRouteName="Splash" headerMode="none" screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid }}>
            {auth.isAuth ? <Stack.Screen options={{ cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid, animationTypeForReplace: 'pop' }} name="Home" component={auth.type === 'user' ? MainTabNavigator : auth.type === 'driver' ? DriverNavigator : () => <View style={{ flex: 1, justifyContent: 'center' }}><Proxima>{JSON.stringify(auth)}</Proxima></View>} /> : (
                first ? <Stack.Screen name="OnBoarding" component={OnBorading} /> : <Stack.Screen options={{ cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid, animationTypeForReplace: 'push' }} name="LoginNavigator" component={LoginNavigator} />
            )}
        </AuthStack.Navigator>
    )
}

function Page({ image, text, title, width, fontSize, index }) {
    const inn = new Animated.Value(0.9)
    const top = new Animated.Value(-10)
    const scale = new Animated.Value(0.95)

    useEffect(() => {
        Animated.timing(inn, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.bounce
        }).start(() => {
            Animated.spring(top, {
                toValue: 0, tension: 5,
                duration: 100,
                useNativeDriver: true
            }).start()
            Animated.spring(scale, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }).start()
        })
        return () => {
            Animated.timing(inn, {
                toValue: -50,
                duration: 500
            })
        }
    }, [index === 0])
    return (
        <Animated.View style={{ opacity: inn, transform: [{ translateY: top }, { scale }], justifyContent: 'center', alignItems: 'center' }} key="1" >
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                <MaskedView
                    style={{ flexDirection: 'row' }}
                    maskElement={
                        <View style={{
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            flex: 1,
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                fontSize,
                                textAlign: 'center',
                                width,
                                color: 'black',
                                fontWeight: 'bold',
                            }}>
                                {title}
                            </Text>
                        </View>
                    }>
                    <LinearGradient
                        colors={['#1291AB', '#6BD98C']}
                        start={[1, 0]}
                        end={[1, 2]}
                        style={{ height: 200, width: '100%' }}
                    />
                </MaskedView>
            </View>

            <View style={{ justifyContent: 'center', flex: 1 }}>
                <Image source={image} style={{ width: Dimensions.get('screen').width, resizeMode: 'contain' }} />
            </View>

            <View style={{ flex: 1, alignItems: 'center', width: '85%', justifyContent: 'center', justifyContent: 'flex-end', marginBottom: 50 }}>
                <Text style={{ textAlign: 'center', }}>{text}</Text>
            </View>
        </Animated.View>
    )
}


function Page2({ image, text, title, width, fontSize, index }) {
    const inn = new Animated.Value(0.9)
    const top = new Animated.Value(-10)
    const scale = new Animated.Value(0.95)

    useEffect(() => {
        Animated.timing(inn, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.bounce
        }).start(() => {
            Animated.spring(top, {
                toValue: 0, tension: 5,
                duration: 100,
                useNativeDriver: true
            }).start()
            Animated.spring(scale, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }).start()
        })
        return () => {
            Animated.timing(inn, {
                toValue: -50,
                duration: 500
            })
        }
    }, [index === 0])
    return (
        <Animated.View style={{ opacity: inn, transform: [{ translateY: top }, { scale }], justifyContent: 'center', alignItems: 'center' }} key="2" >
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                <MaskedView
                    style={{ flexDirection: 'row' }}
                    maskElement={
                        <View style={{
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            flex: 1,
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                fontSize,
                                textAlign: 'center',
                                width,
                                color: 'black',
                                fontWeight: 'bold',
                            }}>
                                {title}
                            </Text>
                        </View>
                    }>
                    <LinearGradient
                        colors={['#6D009B', '#B70F30']}
                        start={[1, 0]}
                        end={[1, 2]}
                        style={{ height: 200, width: '100%' }}
                    />
                </MaskedView>
            </View>

            <View style={{ justifyContent: 'center', flex: 1 }}>
                <Image source={image} style={{ width: Dimensions.get('screen').width, resizeMode: 'contain' }} />
            </View>

            <View style={{ flex: 1, alignItems: 'center', width: '85%', justifyContent: 'center', justifyContent: 'flex-end', marginBottom: 50 }}>
                <Text style={{ textAlign: 'center', }}>{text}</Text>
            </View>
        </Animated.View>
    )
}

function Page3({ image, text, title, width, fontSize, index }) {
    const inn = new Animated.Value(0.9)
    const top = new Animated.Value(-10)
    const scale = new Animated.Value(0.95)

    useEffect(() => {
        Animated.timing(inn, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            Animated.spring(top, {
                toValue: 0, tension: 5,
                duration: 100,
                useNativeDriver: true
            }).start()
            Animated.spring(scale, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }).start()
        })
    }, [index === 2])
    return (
        <Animated.View style={{ opacity: inn, transform: [{ translateY: top }, { scale }], justifyContent: 'center', alignItems: 'center' }} key="3" >
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                <MaskedView
                    style={{ flexDirection: 'row' }}
                    maskElement={
                        <View style={{
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            flex: 1,
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                fontSize,
                                textAlign: 'center',
                                width,
                                color: 'black',
                                fontWeight: 'bold',
                            }}>
                                {title}
                            </Text>
                        </View>
                    }>
                    <LinearGradient
                        colors={['#FF6584', '#F3C169']}
                        start={[1, 0]}
                        end={[1, 2]}
                        style={{ height: 200, width: '100%' }}
                    />
                </MaskedView>
            </View>

            <View style={{ justifyContent: 'center', flex: 1 }}>
                <Image source={image} style={{ width: Dimensions.get('screen').width, resizeMode: 'contain' }} />
            </View>

            <View style={{ flex: 1, alignItems: 'center', width: '85%', justifyContent: 'center', justifyContent: 'flex-end', marginBottom: 50 }}>
                <Text style={{ textAlign: 'center', }}>{text}</Text>
            </View>
        </Animated.View>
    )
}

function OnBorading({ route }) {
    const [index, setIndex] = useState(1)
    const dispatch = useDispatch()
    const navigation = useNavigation()
    debugger
    const setFirst = route.params
    const refas = useRef()
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar barStyle="dark-content" />

            <ViewPager ref={refas} style={{ flex: 3 }} initialPage={0} onPageSelected={event => setIndex(event.nativeEvent.position)} >
                <View style={styles.page} key="1">
                    <Page index={index} image={require('../assets/images/01.png')} text="Our Delivery Fees for all our restaurant partners are only 5%" width={'60%'} fontSize={36} title="Lowest Fees In the Market" colors={""} />
                </View>
                <View style={styles.page} key="2">
                    <Page2 index={index} image={require('../assets/images/2.png')} text="Want a burger at one place, and a nice milkshake from another? No Extra Fees." width={'90%'} fontSize={30} title="Order from multiple Places at the same time" colors={""} />
                </View>
                <View style={styles.page} key="3">
                    <Page3 index={index} image={require('../assets/images/3.png')} text="Get your deliciously hot and fresh food Right at the start of lunch" width={'95%'} fontSize={36} title="Delivered right               At the start of lunch" colors={""} />
                </View>
            </ViewPager>
            <View style={{ flexDirection: 'row', justifyContent: 'center', width: '20%', justifyContent: 'space-between', alignSelf: 'center' }}>
                <LinearGradient
                    colors={index === 0 ? ['#1291AB', '#6BD98C'] : ['rgba(0,0,0,.1)', 'rgba(0,0,0,.05)']}
                    start={[1, 0]}
                    end={[1, 2]}
                    style={{ height: 10, width: 20, borderRadius: 5 }}
                />
                <LinearGradient
                    colors={index === 1 ? ['#6D009B', '#B70F30'] : ['rgba(0,0,0,.1)', 'rgba(0,0,0,.05)']}
                    start={[1, 0]}
                    end={[1, 2]}
                    style={{ height: 10, width: 20, borderRadius: 5 }}
                />
                <LinearGradient
                    colors={index === 2 ? ['#FF6584', '#F3C169'] : ['rgba(0,0,0,.1)', 'rgba(0,0,0,.05)']}
                    start={[1, 0]}
                    end={[1, 2]}
                    style={{ height: 10, width: 20, borderRadius: 5 }}
                />
            </View>
            {index < 2 && <View style={{ flex: 0.5, justifyContent: 'space-around', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => {
                    AsyncStorage.setItem('first', 'false')
                    dispatch({ type: 'CHANGE_FIRST', payload: false })
                }}>
                    <View style={{ width: 75, height: 75, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: 'grey' }}>SKIP</Text>
                    </View>
                </TouchableOpacity>
                <NextButton index={index} refas={refas} />
            </View>}

            {index === 2 && <GetStarted />}
        </View>
    )
}

function GetStarted() {
    const dispatch = useDispatch()
    const opacity = new Animated.Value(0.2)
    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 600,
            easing: Easing.bounce
        }).start()
    }, [])

    return (
        <Animated.View style={{ flex: 0.5, opacity, justifyContent: 'space-around', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
            <TouchableOpacity onPress={async () => {
                AsyncStorage.setItem('first', 'false')
                dispatch({ type: 'CHANGE_FIRST', payload: false })
            }}>
                <LinearGradient
                    colors={['#FF6584', '#F3C169']}
                    start={[1, 0]}
                    end={[1, 2]}
                    style={{ height: 50, width: '100%', justifyContent: 'center', width: 140, alignItems: 'center', borderRadius: 25, padding: 15 }}
                >
                    <Text style={{ fontWeight: 'bold', color: 'white' }}>GET STARTED</Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    )
}

function NextButton({ refas, index }) {
    const ani = new Animated.Value(0.8)
    useEffect(() => {
        Animated.timing(ani, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start()
    }, [index])
    return (
        <TouchableOpacity onPress={() => refas.current.setPage(index + 1)}>
            <Animated.View style={{ width: 95, opacity: ani, height: 50, backgroundColor: index === 0 ? 'rgba(104, 215, 141,0.3)' : index === 1 && 'rgba(183, 15, 48,.3)', borderRadius: 7, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', color: 'black' }}>NEXT</Text>
            </Animated.View>
        </TouchableOpacity>
    )
}