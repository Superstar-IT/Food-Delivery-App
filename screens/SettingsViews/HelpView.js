//@ts-nocheck
import React from 'react'
import { View, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'

// @ts-ignore
const HelpView = ({ navigation }) => {

    navigation.setOptions({
        headerTitle: 'Help',
        headerLeft: () => <Feather name="chevron-left" size={24} color="black" style={{ marginLeft: 20 }} onPress={() => navigation.goBack()} />
    })

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>coming soon</Text>
        </View>
    )
}

export default HelpView
