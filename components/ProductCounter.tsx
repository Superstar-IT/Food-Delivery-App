//@ts-nocheck
import React from 'react'
import { View, Text } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import styled from 'styled-components'
import { ProximaBold } from './styled/Text';

const Button = styled.TouchableOpacity`
    box-shadow: 0px 4px 4px rgba(0 , 0, 0, 0.25);
    width: 50px;
    height: 50px;
    border-radius: 15px;
    justify-content: center;
    background-color: ${props => props.disabled ? '#E5E5E5' : 'white'};
    align-items: center;
`;

const ProductCounter = ({ count, handleClick }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Button disabled={count > 0 ? false : true} onPress={() => handleClick('minus')}>
                <Entypo name="minus" size={38} color={count > 1 ? 'black' : '#959595'} />
            </Button>
            <ProximaBold size={38} style={{ margin: 20 }}>{count}</ProximaBold>
            <Button onPress={() => handleClick('add')}>
                <Entypo name="plus" size={38} style={{ paddingLeft: 1, paddingTop: 5 }} />
            </Button>
        </View>
    )
}

export default ProductCounter
