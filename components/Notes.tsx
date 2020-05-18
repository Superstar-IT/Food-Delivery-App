import React from 'react'
import { View, Text, TextInput } from 'react-native'

const Notes = ({ handleAddNote }) => {
    return (
        <TextInput autoCorrect={false} autoCompleteType={"off"} maxLength={255} autoCapitalize={"none"} multiline style={{ backgroundColor: '#F4F4F4', minHeight: 24, padding: 20, textAlignVertical: "center", justifyContent: 'center', alignContent: 'center', alignItems: 'center', paddingVertical: 20, borderRadius: 5, textAlign: 'center' }} placeholder="Note to restaurant" onChangeText={handleAddNote} />
    )
}

export default Notes
