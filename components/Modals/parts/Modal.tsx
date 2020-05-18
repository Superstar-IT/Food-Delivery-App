import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native';

import { Feather } from '@expo/vector-icons';
import { isIphoneX } from '../../../utils';

export const Modal = styled.View`
  background-color: white;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  flex: 0.7;
  padding-bottom: ${isIphoneX() ? '70px' : '40px'};
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
`;

interface Props {
  header?: string,
  onPress: () => void
}

export function Header({ header, onPress }: Props) {
  return (
    <HeaderRow>
      <Text style={{ fontWeight: "bold", fontSize: 24 }}>{header}</Text>
      <CloseButton onPress={onPress} />
    </HeaderRow>
  )
}

export function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Feather name="x" size={24} />
    </TouchableOpacity>
  )
}