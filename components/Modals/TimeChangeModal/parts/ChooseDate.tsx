import React, { useContext } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ThemeContext } from 'styled-components'

function ChooseDate({ onPress, title }: any) {
    const theme = useContext(ThemeContext)
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ padding: 10, paddingHorizontal: 20, backgroundColor: theme.color.blue, borderRadius: 20 }}>
                <Text style={{ color: 'white', fontSize: 16 }}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ChooseDate
