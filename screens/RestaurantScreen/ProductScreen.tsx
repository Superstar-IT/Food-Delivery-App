//@ts-nocheck
import React, { useState, useContext, useEffect, useRef, useMemo } from 'react'
import { View, Text, Alert, TextInput, TouchableOpacity, Animated } from 'react-native'
import ModalViewHOC from '../../components/ModalViewHOC'
import ProductCounter from '../../components/ProductCounter'
import { useNavigation } from '@react-navigation/core'
import { ThemeContext } from 'styled-components'
import { useDispatch, useSelector, batch } from 'react-redux'
import BottomOrderItem from '../../components/BottomOrderItem'
import { restaurantSelector, getOptionsPrice } from '../../store/selectors'
import { Feather } from '@expo/vector-icons'
import produce from 'immer'
import { Bubble } from '../../components/parts/Bubble'
import { Proxima } from '../../components/styled/Text'

const ProductScreen = (props) => {
    const { navigation } = props

    navigation.setOptions({
        headerShown: false
    })

    const theme = useContext(ThemeContext)
    const dispatch = useDispatch()
    const { restaurantID, name, image, description, price, category, amount, id, route, options } = props.route.params
    const [selected, setSelected] = useState(options)

    const [count, setCount] = useState(amount || 1)

    const optionsPrice = getOptionsPrice(selected, count)
    const [_price, setPrice] = useState((Number(price) * count))

    const cartCount = useSelector(state => state.cart.items.length)
    const extra = useSelector(state => state.cart.itemsByID?.[id]?.extra)
    const [_extra, setExtra] = useState(extra)

    const [allGood, setAllGood] = useState()

    useEffect(() => {
        if (!!options) {
            setAllGood(!selected.map(item => item.options.some(item => item?.selected === true)).includes(false))
        }
        else setAllGood(true)
    }, [selected])

    function handleClick(action) {
        if (action === 'add') {
            setCount(Number(count) + 1)
            setPrice(+(Number(_price) + Number(price)).toFixed(2))
        }
        else if (action === 'minus') {
            if (count > 1) {
                setCount(Number(count) - 1)
                setPrice((Number(_price) - Number(price)).toFixed(2))
            }
        }
    }



    return (
        <View style={{ flex: 1 }}>
            <ModalViewHOC product headerTitle={name} image={image || 'https://previews.123rf.com/images/topform8/topform81307/topform8130700214/20674548-fast-food-seamless-background.jpg'} >
                {() => (
                    <>
                        <View style={{ padding: 30 }}>
                            <Text style={{ fontFamily: 'ProximaNova-Bold', fontSize: 24 }}>{name}</Text>
                            <Proxima>{description}</Proxima>
                        </View>

                        {!!options && <Options options={options} selected={selected} setSelected={setSelected} />}

                        <View style={{ flex: 1 }}>
                            <ProductCounter count={count} handleClick={handleClick} />
                            <TextInput onChangeText={text => setExtra(text)} value={_extra} autoCapitalize={"none"} enablesReturnKeyAutomatically autoCorrect={false} autoCompleteType={"off"} multiline placeholder="Specify this item including any condiments, or item specifications" style={{ minHeight: 50, paddingLeft: 20, borderRadius: 6, backgroundColor: '#F4F4F4', width: '80%', alignSelf: 'center', marginTop: 20 }} />
                            {!!amount && <TouchableOpacity onPress={() => {
                                dispatch({ type: 'REMOVE_FROM_CART', payload: id })
                                if (cartCount === 1 && route === 'Confirm') {
                                    navigation.navigate('HomeNavigator')
                                }
                                else {
                                    navigation.goBack()
                                }
                            }}>
                                <Text style={{ color: theme.color.red, fontWeight: 'bold', fontSize: 18, textAlign: 'center', margin: 20 }}>Delete Item</Text>
                            </TouchableOpacity>}
                        </View>
                    </>
                )}
            </ModalViewHOC>




            {!!!amount && <BottomOrderItem disabled={!allGood} text="Add to cart" price={Number(_price) + Number(optionsPrice)} handlePress={() => { // IF PRODUCT IS NOT IN CART
                setAllGood(false)
                dispatch({ type: 'ADD_TO_CART', payload: { ...props.route.params, amount: count, extra: _extra, options: selected } })
                navigation.goBack()
            }} />}

            {!!amount && <BottomOrderItem disabled={!allGood} text="Update cart" price={Number(_price) + Number(optionsPrice)} handlePress={() => { // IF PRODUCT IN CART THEN UPDATE AMOUNT
                dispatch({ type: 'UPDATE_CART', payload: { ...props.route.params, amount: count, extra: _extra, options: selected } })
                navigation.goBack()
            }} />}

        </View>
    )
}

function Options(props) {
    const { selected } = props
    return selected.map((option) => {
        return (
            <Bubble bottom key={option.title}>
                <View style={{ flexDirection: 'column', flex: 1, width: '100%' }}>
                    <Text style={{ textAlign: 'left', fontFamily: 'ProximaNova-Bold', fontSize: 24, fontWeight: '600' }}>{option.title}</Text>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly' }}>
                        <OptionsList  {...props} option={option} />
                    </View>
                </View>
            </Bubble>
        )
    })
}

function OptionsList({ selected, setSelected, option }) {
    debugger
    const getIndex = function (title, text) {
        const titleIndex = selected.findIndex(item => item.title === title) // FIND WHICH INDEX TO UPDATE E.Q: "SELECT DRINK" is index 1
        const optionIndex = selected[titleIndex].options.findIndex(item => item.text === text) // FIND WHICH INDEX TO update inside object "SELECT DRINK" E.Q: IF text === 'Coca-Coca', find index of it.
        return [titleIndex, optionIndex]
    }

    if (!!!option.options.length) return null

    return option.options.map(item => {
        const [index1, index2] = getIndex(option.title, item.text)
        function handleChangeSignle() {
            setSelected(produce(selected, draftState => {
                draftState[index1].options.map(item => { // RESET ALL SELECTED OPTIONS
                    delete item.selected
                })
                draftState[index1].options[index2].selected = true // E.Q: option.title === 'SELECT DRINK' && option.text === 'Coca-Cola'. So index1 is index of 'SELECT DRINK' inside SELECTED array, and index2 is INDEX OF 'coco-cola' item inside 'SELECT DRINK' object options array.

            }))
        }
        function handleChangeMulti() {
            setSelected(produce(selected, draftState => {
                if (draftState[index1].options[index2]?.selected === true) {
                    delete draftState[index1].options[index2].selected
                }
                else {
                    draftState[index1].options[index2].selected = true
                }

            }))
        }
        if (option.type === 'single') {
            return (
                <TouchableOpacity key={item.text} onPress={handleChangeSignle}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <View style={{ borderRadius: 50, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', width: 20, height: 20, backgroundColor: selected[index1].options[index2]?.selected === true ? 'rgb(0,176,97)' : 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                            <Feather name="check" color="white" size={14} />
                        </View>
                        <Text style={{ fontSize: 16, margin: 15, fontWeight: 'normal', flex: 1 }}>{item.text}</Text>
                        {!!item.price && <Text style={{ color: 'grey', fontSize: 15 }}>+ $ {item.price.toFixed(2)}</Text>}
                    </View>
                    {/* <View style={{ flex: 1, borderRadius: 15, backgroundColor: selected ? theme.color.blue : '#EFEFEF', width: 100, height: 35, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                </View> */}
                </TouchableOpacity>
            )
        }
        else if (option.type === 'multi') {
            return (
                <TouchableOpacity key={item.text} onPress={handleChangeMulti}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', width: 20, height: 20, backgroundColor: selected[index1].options[index2]?.selected === true ? 'rgb(0,176,97)' : 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                            <Feather name="check" color="white" size={14} />
                        </View>
                        <Text style={{ fontSize: 24, margin: 15, fontWeight: 'normal', flex: 1 }}>{item.text}</Text>
                        {!!item.price && <Text style={{ color: 'grey', fontSize: 15 }}>+ $ {item.price.toFixed(2)}</Text>}
                    </View>
                    {/* <View style={{ flex: 1, borderRadius: 15, backgroundColor: selected ? theme.color.blue : '#EFEFEF', width: 100, height: 35, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                </View> */}
                </TouchableOpacity>
            )
        }

    })
}

export default React.memo(ProductScreen)
