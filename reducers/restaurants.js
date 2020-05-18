
const cart = (state = [], action) => {
    switch (action.type) {
        case 'INIT_RESTAURANTS':
            return action.payload
    }
    return state
}

export default cart