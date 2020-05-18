import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

import { AsyncStorage } from "react-native";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager'
import io from 'socket.io-client'


let school: number = 0;

// TaskManager.defineTask('LOCATION', (lol) => {
//     console.log(lol)
//     if (school > 0) {
//         globalThis.socket.emit('location', { location: { longitude: lol.data.locations[0].coords.longitude, latitude: lol.data.locations[0].coords.latitude }, auth: { school } })
//         globalThis.socket.emit('rotation', { rotation: lol.data.locations[0].coords.heading, auth: { school } })
//     }
// })


export default function useLocation() {
    const [enabled, setEnabled] = useState(false);
    const auth: any = useSelector(state => state.auth)

    async function getLoc() {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            // ERROR
        }
    }

    async function watchLocation() {
        await Location.startLocationUpdatesAsync("LOCATION", { accuracy: Location.Accuracy.Balanced, showsBackgroundLocationIndicator: true, timeInterval: 2000, }).catch(error => { })
    }

    async function initEnabled() {
        const state = await AsyncStorage.getItem('enabled').catch(error => { })
        setEnabled(JSON.parse(state))
    }

    useEffect(() => {
        const socket = io('http://52.60.103.129')
        globalThis.socket = socket
        school = auth.school
        initEnabled()
        getLoc();
    }, [])

    useEffect(() => {
        if (enabled) {
            watchLocation();
        }
        else {
            globalThis.socket.emit('location', { location: { latitude: 0, longitude: 0 }, auth })
            TaskManager.unregisterTaskAsync('LOCATION').catch(error => { })
        }
    }, [enabled])

    async function callToEnable(state: boolean) {
        setEnabled(state)
        await AsyncStorage.setItem('enabled', state.toString()).catch(error => { })
    }
    return [callToEnable, enabled]
}