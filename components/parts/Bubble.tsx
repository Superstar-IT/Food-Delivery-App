import React, { useContext, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Easing } from 'react-native'
import { ThemeContext } from 'styled-components'
import Animated from 'react-native-reanimated'

interface IBubble {
    children: any,
    top?: boolean,
    bottom?: boolean,
    button?: { title: string, onPress: any },
    nopadding?: boolean
}

export function Bubble(props: IBubble) {
    const { children, top, bottom, button, nopadding } = props
    const theme: any = useContext(ThemeContext)

    if (button) {
        return (
            <View style={{ marginHorizontal: 20,  backgroundColor: 'white', borderRadius: 10, shadowColor: "black", position: 'relative', shadowOffset: { height: 9, width: 5 }, elevation: 4, shadowOpacity: 0.1, shadowRadius: 10, marginTop: top ? 25 : 0, marginBottom: bottom ? 25 : 0 }}>
                <View style={{ marginHorizontal: 20, paddingVertical: 20 }}>
                    {children}
                </View>
                <TouchableOpacity onPress={button.onPress}>
                    <View style={{ backgroundColor: theme.color.blue, padding: 15, justifyContent: 'center', alignItems: 'center', width: '100%', alignSelf: 'center', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                        <Text style={{ color: 'white', fontSize: 18 }}>{button.title}</Text>
                    </View>
                </TouchableOpacity>

            </View>
        )
    }
    return (
        <View style={{
            marginHorizontal: 20,  padding: !nopadding && 20, backgroundColor: 'white', borderRadius: 10, marginTop: top ? 25 : 0, marginBottom: bottom ? 25 : 0, shadowColor: "black", position: 'relative',
            shadowOffset: { height: 9, width: 5 },
            shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
        }}>
            {children}
        </View>
    )
}
