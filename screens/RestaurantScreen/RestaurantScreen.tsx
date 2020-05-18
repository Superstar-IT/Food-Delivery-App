import React, { useRef, useState, useEffect, useMemo } from 'react'
import { View, Text, ActivityIndicator, Dimensions, Platform } from 'react-native'
import ModalViewHOC from '../../components/ModalViewHOC';
import BottomOrderItem from '../../components/BottomOrderItem'
import { useSelector, useDispatch } from 'react-redux'
import { priceSelector } from '../../store/selectors'
import api from '../../api'
import RenderCategories from './parts/RenderCategories';
import TabBar from '../../components/TabBar';
import { Feather } from '@expo/vector-icons';
import { Proxima, ProximaBold } from '../../components/styled/Text';
import Animated, { Easing } from 'react-native-reanimated';

const RestaurantScreen = (props: any) => {
    const { navigation } = props;

    const dispatch = useDispatch()
    const { id, name, type, price, image, description } = props.route.params
    const products = useSelector((state: any) => state.products?.[id]);
    const { arrival } = useSelector((state: any) => state.school);
    const [loading, setLoading] = useState(!!!products)
    const [rendering, setRendering] = useState(true)
    const cartPrice: any = useSelector(priceSelector);
    const showCart = useSelector((state: any) => state.cart.items).length > 0 ? true : false;


    useEffect(() => {
        if (loading) {
            api.get(`/products/${id}`).then((res: any) => {
                dispatch({ type: "INIT_PRODUCTS", payload: res.data })
                setLoading(false)
                setRendering(false)
            }).catch(() => {
                setLoading(false)
                setRendering(false)
            })
        }
        else {
            setLoading(false)
            setRendering(false)
        }
    }, [])

    const animatedOpacity = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(animatedOpacity, {
            toValue: 1,
            duration: 600,
            easing: Easing.ease
        }).start()
    }, [loading, rendering])

    navigation.setOptions({
        headerShown: false
    })

    const RestaurantHeader = () => (
        <>
            <ProximaBold size={16} align="center" style={{ marginTop: 20 }}>Will arrive at {arrival}</ProximaBold>
            <View style={{ padding: 30 }}>
                <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 24 }}>{name}</Text>
                <Proxima>{description}</Proxima>
            </View>
        </>
    )

    const RestaurantProducts = ({ handleScrollPos }: any) => {
        if (loading || rendering) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}  >
                    <ActivityIndicator size="large" color="black" />
                </View>
            )
        }
        return (
            <Animated.View style={{ opacity: animatedOpacity }}>
                {!rendering && <RenderCategories products={products} params={props.route.params} handleScrollPos={handleScrollPos} />}
            </Animated.View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {useMemo(() => {
                return (
                    <ModalViewHOC headerTitle={name} image={image} products={products} loading={loading} rendering={rendering}>
                        {({ handleScrollPos }: any) => (
                            <>
                                <RestaurantHeader />
                                <RestaurantProducts handleScrollPos={handleScrollPos} />
                            </>
                        )}
                    </ModalViewHOC>
                )
            }, [products, loading, rendering])}

            {showCart && <BottomOrderItem text="Checkout" price={cartPrice} handlePress={() => navigation.navigate('TopLevel', { screen: 'Confirm', params: { name: props.route.params.name } })} />}
        </View>
    )
}



export default React.memo(RestaurantScreen)
