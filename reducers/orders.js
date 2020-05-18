import produce from 'immer'
import moment from 'moment'
const orders = (state = [], action) => {
    switch (action.type) {
        case 'INIT_ORDERS':
            state = []
            return action.payload
        case 'ADD_ORDER':
            return Array.isArray(action.payload) ? [...state, ...action.payload] : [...state, action.payload];
        case 'RESET_ORDER':
            return []
    }
    return state
}
export default orders