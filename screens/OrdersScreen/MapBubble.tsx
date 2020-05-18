import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react'
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import { Bubble } from '../../components/parts/Bubble'
import MapView, { Marker, AnimatedRegion } from 'react-native-maps'
// import useDriverLocation from '../../hooks/useDriverLocation'
import { ProximaBold } from '../../components/styled/Text'
import Animated, { Easing } from 'react-native-reanimated'
import geolib from 'geolib'


const MapBubble = () => {
    // const [_location, rotation] = useDriverLocation();
    const _location = { longitude: 0, latitude: 0 }
    let location = useRef(new AnimatedRegion).current;
    const [follow, setFollow] = useState(true)
    let _mapView: any;

    useEffect(() => {

        if (location === undefined && _location.latitude !== 0) {
            location = new AnimatedRegion({ ..._location });
        }

        if (location !== undefined) {
            location.timing({
                ..._location, duration: 2000
            }).start()
        }

        if (follow) {
            _mapView?.animateCamera({
                center: _location,
                zoom: 20,
                altitude: 1000
            }, 2000)
        }
    }, [_location])

    if (_location.latitude !== 0 && !!location) {
        return (
            <Bubble top nopadding >
                <MapView ref={(mapView) => { _mapView = mapView; }} style={styles.mapStyle}>
                    <Marker.Animated coordinate={location}>
                        <Image source={require('../../assets/car.png')} style={{ transform: [{ scale: 0.3 }, { rotateZ: `${rotation}deg` }] }} />
                    </Marker.Animated>
                </MapView>
                <TouchableOpacity onPress={() => setFollow(!follow)}>
                    <ProximaBold style={{ textAlign: 'center', padding: 5 }}>{follow ? 'unfollow' : 'follow'}</ProximaBold>
                </TouchableOpacity>
            </Bubble>
        )
    }
    else {
        location = undefined
    }
    return null
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapStyle: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
});


export default MapBubble
