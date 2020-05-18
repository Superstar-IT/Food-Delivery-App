//@ts-nocheck
import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import ProductItem from '../../../components/ProductItem'

function RenderProcuctsCategory({ category, categoryName, id, handleScrollPos }) {
    return (
        <View style={{ margin: 0, zIndex: 100, }} onLayout={(event) => handleScrollPos({ categoryName, y: event.nativeEvent.layout.y })}>
            <Text style={{ fontFamily: 'ProximaNova-Bold', fontSize: 24, marginLeft: 20 }}>{categoryName.toUpperCase()}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20, justifyContent: 'space-around' }}>
                {Object.values(category)?.map((product) => {
                    return <ProductItem key={product.id} {...product} restaurantID={id} bubble />
                })}
            </View>
        </View>
    )
}

{/* <ScrollView horizontal pagingEnabled snapToAlignment='center'>
    {Object.values(category)?.map((product) => {
        return <ProductItem key={product.id} {...product} restaurantID={id} square />
    })}
</ScrollView> */}

export default React.memo(RenderProcuctsCategory)
