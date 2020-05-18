import io from 'socket.io-client'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';



export default function useDriverLocation() {
    const [location, setLocation] = useState({ longitude: 0, latitude: 0 })
    const [rotation, setRotation] = useState(0);
    const auth = useSelector(state => state.auth)

    // useEffect(() => {
    //     const socket = io('http://52.60.103.129')

    //     socket.on('location' + auth.school, (res) => {
    //         setLocation(res)
    //     })
    //     socket.on('rotation' + auth.school, (res) => {
    //         setRotation(res)
    //     })
    // }, [])

    return [location, rotation]
}