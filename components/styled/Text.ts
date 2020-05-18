import styled from "styled-components/native";

interface Props {
    size?: number
    align?: 'center' | 'left' | 'right',
    color?: string

}
export const Proxima = styled.Text`
    font-size: ${(props: Props) => props.size ?? 14}px;
    text-align:${(props: Props) => props.align ?? 'left'} ;
    color:${(props: Props) => props.color ?? 'black'};
    font-family: 'ProximaNova-Reg'
`;

export const ProximaBold = styled.Text`
    font-size: ${(props: Props) => props.size ?? 14}px;
    text-align:${(props: Props) => props.align ?? 'left'} ;
    color:${(props: Props) => props.color ?? 'black'};
    font-family: 'ProximaNova-Bold'
`;

export const ProximaBlack = styled.Text`
    font-size: ${(props: Props) => props.size ?? 14}px;
    text-align:${(props: Props) => props.align ?? 'left'} ;
    color:${(props: Props) => props.color ?? 'black'};
    font-family: 'ProximaNova-Black'
`;

export const ProximaExtra = styled.Text`
   font-size: ${(props: Props) => props.size ?? 14}px;
    text-align:${(props: Props) => props.align ?? 'left'} ;
    color:${(props: Props) => props.color ?? 'black'};
    font-family: 'ProximaNova-Extrabold'
`;