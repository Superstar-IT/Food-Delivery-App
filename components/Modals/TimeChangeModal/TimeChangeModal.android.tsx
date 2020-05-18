import React, { useState, useContext } from 'react'
import { View, Text, Dimensions, TouchableOpacity, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';


const PaymentChangeModal = (props: any) => {
    const { handleDateChange, date } = props.route.params
    const [_date] = useState(date)

    return (
        <DateTimePicker value={_date}
            mode={'date'}
            is24Hour={true}
            display="default"
            onChange={(props1, props2) => {
                handleDateChange(props1, props2)
                props.navigation.goBack()
            }}
            minimumDate={new Date()}
            maximumDate={new Date(new Date().getTime() + 14 * (24 * 60 * 60 * 1000))}
        />
    )
}

export default PaymentChangeModal
