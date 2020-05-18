import produce from 'immer'

const initialState = {
    isAuth: null,
    first: false
}

const auth = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return produce(state, draftState => {
                draftState.isAuth = true
                draftState.token = action.payload.token
                Object.assign(draftState, action.payload.user)
            })
        case 'LOGIN_FAILURE':
            return produce(state, draftState => {
                draftState.isAuth = null
            })
        case 'UPDATE_USER':
            return action.payload
        case 'FLYTE_BALANCE':
            return {
                ...state,
                balance: Number(state.balance) - Number(action.payload)
            }
        case 'UPDATE_PUSH_TOKEN':
            return {
                ...state,
                pushToken: action.payload
            }
        case 'CHANGE_FIRST': {
            return {
                ...state,
                first: action.payload
            }
        }
    }
    return state
}

export default auth