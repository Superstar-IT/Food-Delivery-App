import styled from 'styled-components'

export const HeaderText = styled.Text`
    font-weight: bold;
    font-size: ${props => props.size === undefined ? 24 : props.size}px;
    margin: 30px;
`;