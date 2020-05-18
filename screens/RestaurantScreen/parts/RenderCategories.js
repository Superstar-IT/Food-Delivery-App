//@ts-nocheck
import React from 'react'
import { View, Text } from 'react-native'
import RenderProcuctsCategory from './RenderProcuctsCategory'
import { useSelector } from 'react-redux';

const RenderCategories = ({ params, handleScrollPos, products }) => {

    if (!!products) {
        return Object.values(products).map((category, index) =>
            <RenderProcuctsCategory
                {...params}
                handleScrollPos={handleScrollPos}
                key={Object.keys(products)[index]}
                category={category}
                categoryName={Object.keys(products)[index]}
            />)
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>No Products</Text>
        </View>
    )
}

export default React.memo(RenderCategories)
