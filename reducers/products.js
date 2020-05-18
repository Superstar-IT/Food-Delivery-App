import produce from 'immer'

const restaurant = (state = {}, action) => {
    switch (action.type) {
        case 'INIT_PRODUCTS':
            const products = action.payload.reduce((sum, value) => {
                const price = value.special_price !== null ? value.special_price : value.price;
                debugger
                sum[value.category] = !!sum[value.category] ? [...sum[value.category], { ...value, price }] : [{ ...value, price }]
                return sum
            }, {})
            return {
                ...state,
                [action.payload[0].restaurantID]: products
            }
        case 'UPDATE_OPTIONS':
    }
    return state
}

export default restaurant