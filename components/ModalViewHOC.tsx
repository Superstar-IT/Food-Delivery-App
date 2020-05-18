import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Animated, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { Feather } from '@expo/vector-icons'
import { Dimensions, Platform } from 'react-native';
import TabBar from './TabBar';
import { Image } from "react-native-expo-image-cache";
import { isIphoneX } from '../utils';
import { ProximaBold } from './styled/Text';
import Reanimated, { Easing } from 'react-native-reanimated'
const HEADER_HEIGHT = isIphoneX() ? 100 : 80
const AnimatedImage = Animated.createAnimatedComponent(Image)

function RestaurantViewHOC({ children, headerTitle, image, products, product, loading, rendering }: any) {
    const navigation = useNavigation()

    const scrollRef = useRef();
    const scrollY = useRef(new Animated.Value(0)).current

    const [scrollPos, setScrollPos] = useState([])

    function handleScrollPos({ categoryName, y }) {
        const index = scrollPos.indexOf(scrollPos.filter((item) => item.name === categoryName)[0])
        if (index !== -1) {
            scrollPos[index].y = y
            setScrollPos(scrollPos)
        }
    }

    

    useEffect(() => {
        if (!!products) {
            const value = Object.keys(products).reduce((sum: any, val: string) => sum = [...sum, { name: val, y: !!scrollPos.filter((item: any) => item.name === val)[0]?.y ? scrollPos.filter((item: any) => item.name === val)[0]?.y : 0 }], [])
            setScrollPos(value)
        }
    }, [products])

    const scale = scrollY.interpolate({
        inputRange: [-500, 0],
        outputRange: [5, 1],
        extrapolate: "clamp"
    })


    const headerAnimation = scrollY.interpolate({
        inputRange: [isIphoneX() ? HEADER_HEIGHT + 25 : HEADER_HEIGHT + 68, isIphoneX() ? HEADER_HEIGHT + 115 : HEADER_HEIGHT + 155],
        outputRange: [25, 0],
        extrapolate: 'clamp'
    })

    const animatedOpacity = useRef(new Reanimated.Value(0)).current

    useEffect(() => {
        Reanimated.timing(animatedOpacity, {
            toValue: 1,
            duration: 600,
            easing: Easing.ease
        }).start()
    }, [])

    return (
        <Reanimated.View style={{ flex: 1, backgroundColor: 'white', opacity: animatedOpacity }}>
            <Animated.View style={{
                position: 'absolute', top: isIphoneX() ? 35 : 15, zIndex: 10, opacity: scrollY.interpolate({
                    inputRange: [isIphoneX() ? HEADER_HEIGHT - 10 : HEADER_HEIGHT + 40, isIphoneX() ? HEADER_HEIGHT + 30 : HEADER_HEIGHT + 70],
                    outputRange: [1, 0],
                    extrapolate: 'clamp'
                })
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <View style={{ width: 30, height: 30, backgroundColor: 'white', borderRadius: 5, margin: 18, justifyContent: 'center', alignItems: 'center' }}>
                        <Feather name="chevron-left" size={24} color="black" />
                    </View>
                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{
                overflow: 'hidden', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, opacity: scrollY.interpolate({
                    inputRange: [50, 160],
                    outputRange: [0, 1],
                    extrapolate: 'clamp'
                }), backgroundColor: 'white'
            }}>

                <View style={{
                    justifyContent: 'space-between', alignItems: 'flex-end', height: HEADER_HEIGHT, flexDirection: 'row'
                }}>
                    <Feather name="chevron-left" size={24} style={{ margin: 20 }} onPress={() => navigation.goBack()} />
                    <Animated.View style={{
                        transform: [{ translateY: headerAnimation }], opacity: scrollY.interpolate({
                            inputRange: [140, 200],
                            outputRange: [0, 1],
                            extrapolate: 'clamp'
                        })
                    }}>
                        <ProximaBold style={{ margin: 20, width: '100%', fontSize: !product ? 24 : 12 }} numberOfLines={1} adjustsFontSizeToFit >{headerTitle}</ProximaBold>
                    </Animated.View>
                    <View style={{ width: 24, margin: 20 }} />
                </View>

                {!!scrollPos && <Animated.View style={{
                    opacity: scrollY.interpolate({
                        inputRange: [160, 230],
                        outputRange: [0, 1],
                        extrapolate: 'clamp'
                    })
                }}>
                    <TabBar headerAnimation={headerAnimation} scrollPos={scrollPos} scrollRef={scrollRef} scrollY={scrollY} />
                </Animated.View>}


            </Animated.View>
            <Animated.ScrollView ref={scrollRef} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })} >
                {!!image ? <AnimatedImage {...{ uri: image, cache: 'force-cache' }}
                    style={{
                        zIndex: 0,
                        width: '100%',
                        height: 190,
                        top: 0,
                        position: 'relative',
                        opacity: scrollY.interpolate({
                            inputRange: [0, 100],
                            outputRange: [1, 0],
                            extrapolate: 'clamp'
                        }),
                        transform: [{
                            scaleX: scale
                        },
                        { scaleY: scale },
                        {
                            translateY: scrollY.interpolate({
                                inputRange: [-500, 500],
                                outputRange: [-100, 100],
                                extrapolate: 'clamp'
                            })
                        }]
                    }} /> : <View style={{ width: '100%', height: 190 }}></View>}
                <View style={{ flex: 1, backgroundColor: 'white', top: -20, borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
                    {children({ handleScrollPos })}
                </View>
            </Animated.ScrollView>
        </Reanimated.View>
    )
}

export default React.memo(RestaurantViewHOC)
