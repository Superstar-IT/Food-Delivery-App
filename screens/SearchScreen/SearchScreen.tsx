//@ts-nocheck
import React, { useState } from 'react'
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { HeaderText } from '../../components/styled'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import ProductItem from '../../components/ProductItem'
import api from '../../api'
import debounce from 'lodash.debounce'
import { DismissKeyboard } from '../Auth/LoginScreen'

const SearchScreen = ({ navigation }) => {
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)

    navigation.setOptions({
        headerTitle: '',
        headerLeft: () => <Text style={{ fontSize: 24, fontWeight: 'bold', marginHorizontal: 20 }}>Search</Text>
    })


    async function handleSearchChange(text) {
        setLoading(true)
        const res = await api.get(`/search/?keyword=${search}`)
        setSearchResults(res.data)
        setLoading(false)
        setSearch(text)
    }



    return (
        <DismissKeyboard>
            <View style={{ flex: 1 }}>
                <SearchBar handleSearchChange={handleSearchChange} placeholder="Search meal" style={{ marginTop: 20, marginHorizontal: 20 }} />
                {!!search &&
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 20, paddingHorizontal: 20 }} >Search results</Text>
                        {loading ? <ActivityIndicator size="large" /> :
                            <ScrollView>
                                <View style={{ flexDirection: 'column' }}>
                                    {searchResults.length > 0 ? searchResults.map(item => {
                                        return <ProductItem {...item} bubble />
                                    }) : !loading && <Text style={{ marginLeft: 20 }}>No products</Text>}
                                </View>
                            </ScrollView>}
                    </View>
                }
            </View>
        </DismissKeyboard>
    )
}

export function SearchBar({ handleSearchChange, placeholder, style }) {
    return (
        <View style={style}>
            <Feather name="search" size={24} color="grey" style={{ top: 7, left: 10, zIndex: 111, position: 'absolute' }} />
            <TextInput style={{ backgroundColor: 'white', height: 40, textAlign: 'left', paddingLeft: 50, borderRadius: 5 }} placeholder={placeholder} onChangeText={handleSearchChange} />
        </View>
    )
}

export default SearchScreen
