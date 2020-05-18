import React, { useState, useContext } from 'react'
import { View, Text, Dimensions, TouchableOpacity, Platform } from 'react-native'
import { Feather } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemeContext } from 'styled-components';
import { CloseButton, Header, Modal } from '../parts/Modal';
import ChooseDate from './parts/ChooseDate';


const PaymentChangeModal = (props: any) => {

    const { handleDateChange, date } = props.route.params
    const [_date, setDate] = useState(date)

    return (
        <Modal>
            <Header header="Change delivery time" onPress={() => props.navigation.goBack()} />

            <DateTimePicker value={_date}
                mode={'date'}
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
                maximumDate={new Date(new Date().getTime() + 14 * (24 * 60 * 60 * 1000))}
            />
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                <ChooseDate title="Today" onPress={() => {
                    let today = new Date()
                    setDate(today)
                    handleDateChange(null, today)
                }} />

                <ChooseDate title="Tomorrow" onPress={() => {
                    let tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
                    setDate(tomorrow)
                    handleDateChange(null, tomorrow)
                }} />
            </View> */}
        </Modal>
    )
}



export default PaymentChangeModal
