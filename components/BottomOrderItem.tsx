import React, { useContext } from 'react'
import { View, Text, TouchableWithoutFeedback, Dimensions, Platform } from 'react-native'
import styled, { ThemeContext } from 'styled-components/native'
import { isIphoneX, toPrice } from '../utils'
import { ProximaBold } from './styled/Text'

const BottomOrderItem = (props: any) => {
    const { text, price, handlePress, modal } = props
    const theme = useContext(ThemeContext)

    return (
        <TouchableWithoutFeedback onPress={handlePress} disabled={props?.disabled}>
            <OrderButton disabled={props.disabled} theme={theme}>
                <ProximaBold color='white' size={18}>{text}</ProximaBold>
                <ProximaBold color='white' size={18}>$ {toPrice(price)}</ProximaBold>
            </OrderButton>
        </TouchableWithoutFeedback>
    )
}

const OrderButton = styled.View`
    background-color:${(props: { disabled: boolean, theme: any }) => !props?.disabled ? props.theme.color.blue : 'grey'};
    z-index: 100;
    height:${ isIphoneX() ? 80 : 60}px;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    padding-left: 50px;
    padding-right: 50px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px; 
`;

export default BottomOrderItem
