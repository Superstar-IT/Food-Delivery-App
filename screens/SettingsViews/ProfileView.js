//@ts-nocheck
import React, { useState, useEffect, useContext } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeContext } from 'styled-components';
import api from '../../api'
import { ProximaBold } from '../../components/styled/Text';
const ProfileView = ({ navigation }) => {
    const theme = useContext(ThemeContext)
    const auth = useSelector(state => state.auth)
    const dispatch = useDispatch()

    navigation.setOptions({
        headerTitle: 'Profile',
        headerLeft: () => <Feather name="chevron-left" size={24} color="black" style={{ marginLeft: 20 }} onPress={() => navigation.goBack()} />
    })

    const [edited, changeEdited] = useState(auth)


    return (
        <KeyboardAvoidingView keyboardVerticalOffset={50} behavior='padding' style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
            <ScrollView>
                <SettingItem title="First Name" placeholder={edited.name} handleChange={name => changeEdited({ ...edited, name })} />
                <SettingItem title="Last Name" placeholder={edited.lastname} handleChange={lastname => changeEdited({ ...edited, lastname })} />
                {/* <SettingItem title="Email" placeholder={edited.email} handleChange={email => changeEdited({ ...edited, email })} /> */}
                <SettingItem title="Phone number" placeholder={edited.phone} handleChange={phone => changeEdited({ ...edited, phone })} />
                {auth.type === 'user' && <SettingItem title="Grade" placeholder={edited.grade.toString()} handleChange={grade => changeEdited({ ...edited, grade })} />}
                {auth.type === 'user' && <SettingItem title="School ID" placeholder={edited.schoolID.toString()} handleChange={schoolID => changeEdited({ ...edited, schoolID })} />}
            </ScrollView>

            <TouchableOpacity onPress={() => {
                dispatch({ type: 'UPDATE_USER', payload: edited })
                api.post('/user', edited)
                navigation.goBack()
            }}>
                <View style={{ opacity: edited === auth ? 0.5 : 1, padding: 20, backgroundColor: theme.color.blue, justifyContent: 'center', alignItems: 'center', borderRadius: 6, marginVertical: 50 }}>
                    <ProximaBold size={18} color="white">Save</ProximaBold>
                </View>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

function SettingItem({ title, placeholder, handleChange }) {
    return (
        <View style={{ marginVertical: 5 }}>
            <View style={{ backgroundColor: 'white', top: 10, zIndex: 10, width: 120, left: 20, alignItems: 'center' }}>
                <ProximaBold color='rgba(0,0,0,0.5)'>{title}</ProximaBold>
            </View>
            <TextInput style={{ borderWidth: 2, zIndex: 0, borderColor: 'rgba(0,0,0,0.1)', height: 60, borderRadius: 10, justifyContent: 'center', padding: 20, fontSize: 16, fontFamily: 'ProximaNova-Reg', }} value={placeholder} onChangeText={(text) => handleChange(text)} />
        </View>
    )
}

export default ProfileView
