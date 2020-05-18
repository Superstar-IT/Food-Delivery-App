import React, { useEffect, useState, useRef, useMemo, useContext } from 'react'
import { View, Text, ScrollView, Animated, TouchableOpacity, Alert } from 'react-native'
import { ThemeContext } from 'styled-components'

const TabBar = ({ headerAnimation, scrollPos, scrollRef, scrollY }) => {
    const [current, setCurrent] = useState(scrollPos[0]?.name)
    const [tabsLayout, setTabsLayout] = useState([])

    const hozRef = useRef()


    useEffect(() => {
        const tabListiner = scrollY.addListener(({ value }) => {
            var closest = scrollPos.map(item => item.y).reduce(function (prev, curr) {
                return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
            }, 0);
            if (scrollPos.filter(item => item.y === closest)[0]?.name !== current) {
                setCurrent(scrollPos.filter(item => item.y === closest)[0]?.name)
            }
        })

        return () => {
            scrollY?.removeListener(tabListiner)
        }
    })

    useMemo(() => hozRef.current?.scrollTo({ x: tabsLayout.filter(item => item.name === current)[0]?.x - 20, y: 0, animated: true }), [current])

    function handleLayout(event, name) {
        if (tabsLayout.filter(item => item?.name === name).length === 0) setTabsLayout([...tabsLayout, { name, x: event.nativeEvent.layout.x }])
    }

    return (
        <ScrollView ref={hozRef} horizontal showsHorizontalScrollIndicator={false}>
            <Animated.View style={{
                zIndex: 999,
                flexDirection: 'row', marginBottom: 5, transform: [{
                    translateY: headerAnimation
                }],
                alignItems: 'center'
            }}>
                {scrollPos?.length > 0 && scrollPos?.map((item, index) => {
                    return <Tab key={item.name} item={item} scrollRef={scrollRef} arrayindex={index} current={current} handleLayout={handleLayout} />
                })}
            </Animated.View>
        </ScrollView>
    )
}

export function Tab({ item, scrollRef, arrayindex, current, handleLayout }) {
    const theme = useContext(ThemeContext)
    return (
        <TouchableOpacity key={item.name} onPress={() => scrollRef.current.getNode().scrollTo({ x: 0, y: item.y, animated: true })} onLayout={(props) => handleLayout(props, item.name)} >
            <View style={{ paddingHorizontal: 12, paddingVertical: 6, marginRight: 20, marginLeft: arrayindex === 0 ? 20 : 0, alignItems: 'center' }}>
                <Text style={{ fontFamily: current === item.name ? 'ProximaNova-Extrabold' : 'ProximaNova-Bold', fontSize: current === item.name ? 18 : 12, color: current === item.name ? 'black' : 'grey', textAlign: 'center' }}>{item.name.toUpperCase()}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo((TabBar))
