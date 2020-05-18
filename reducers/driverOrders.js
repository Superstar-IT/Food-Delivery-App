import produce from 'immer'
import moment from 'moment'
const initialState = []
const driverOrders = (state = initialState, action) => {
    switch (action.type) {
        case 'INIT_DRIVER_ORDERS':
            state = []
            return action.payload
        case 'RESET_ORDER':
            return []
    }
    return state
}
export default driverOrders