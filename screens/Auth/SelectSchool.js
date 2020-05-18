import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native'
import { getSchools } from '../../api'
import { SearchBar } from '../SearchScreen/SearchScreen'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-community/masked-view';
import { Proxima } from '../../components/styled/Text'
function SelectSchool({ navigation }) {
    const [schoolList, setSchoolList] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    async function fetchData() {
        const { data: schools } = await getSchools(0)
        try {
            setSchoolList(schools)
            setLoading(false)
        }
        catch{
            setLoading(false)
        }
    }


    useEffect(() => {
        fetchData()
    }, [])

    function handleSearch(text) {
        setSearch(text)
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 30, justifyContent: 'flex-start', paddingTop: 50 }} >
            <StatusBar barStyle="dark-content" />
            <MaskedView
                style={{ flexDirection: 'row' }}
                maskElement={
                    <View style={{
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            fontSize: 30,
                            textAlign: 'center',
                            width: '95%',
                            color: 'black',
                            fontWeight: 'bold',
                        }}>
                            Select your school
                            </Text>
                    </View>
                }>
                <LinearGradient
                    colors={['#4641EC', '#C543F3']}
                    start={[0, 1]}
                    end={[1, 0]}
                    style={{ height: 80, width: '100%' }}
                />
            </MaskedView>
            <Proxima>{search}</Proxima>
            <SearchBar handleSearchChange={handleSearch} placeholder="Search school" style={{ marginTop: -30 }} />

            {loading ? <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color="black" size="large" />
            </View> :
                <View style={{ flex: 1, marginTop: 20 }}>
                    <ScrollView>
                        {schoolList.map((school) => {
                            return (
                                <TouchableOpacity onPress={() => navigation.navigate("Register3", { school })}>
                                    <View style={{ height: 35, width: '100%', justifyContent: 'center', marginTop: 10 }}>
                                        <Text style={{ color: 'black', fontSize: 24, fontWeight: '500' }}>{school.name}</Text>
                                    </View>
                                    <View style={{ borderBottomColor: 'rgba(0,0,0,0.3)', borderBottomWidth: 1, paddingTop: 10 }} />
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
            }
        </View >
    )
}

export default SelectSchool
