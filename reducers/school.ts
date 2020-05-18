import produce from 'immer'
import moment from 'moment'

const initialState = {

}

const auth = (state = initialState, action: any) => {
    switch (action.type) {
        case 'INIT_SCHOOL':
            state = {
                ...action.payload,
                arrival: moment(action.payload.arrival, "HH:mm:ss").format('h:mm A')
            }
    }
    return state
}

export default auth