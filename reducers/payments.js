import produce from "immer"

const initialState = {
    default: 0,
    cards: [

    ]
}

function image(brand) {
    switch (brand) {
        case 'MasterCard':
            return 'https://seeklogo.net/wp-content/uploads/2016/07/mastercard-vector-logo.png'
        case 'Visa':
            return 'https://www.visa.co.ao/dam/VCOM/regional/lac/ENG/Default/Partner%20With%20Us/Payment%20Technology/visapos/full-color-800x450.jpg'
        case 'American Express':
            return 'https://www.fintechfutures.com/files/2017/03/AmEx_logo.jpg'
        case 'Discover':
            return 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/0022/0675/brand.gif?itok=qQ0uSh0P'
        case 'Diners Club':
            return 'https://www.gamblingpedia.org/wp-content/uploads/2019/05/dinersclublogo.jpg'
        case 'JCB':
            return 'https://lh3.googleusercontent.com/proxy/nwQeynO-Ro5OM8rP0au2a0gF8k1OFc_mBA8pjW6JCVcHSdP4qcVXlTi4GPm2p-DbAw5p8eDkqsSVPhwMfJswj1XJpcaY2eYA-Bp8o9BtLTgjDXPpmYFy831pS7lomrM'
        case 'UnionPay':
            return 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/0021/5698/brand.gif?itok=gGqq7FK2'

    }
}

const payments = (state = initialState, action) => {
    switch (action.type) {

        case 'INIT_PAYMENTS': {
            const { user } = action.payload
            debugger
            return {
                ...state,
                default: action.payload?.payments.default_source || user.balance > 100 && 0,
                cards: action.payload?.payments?.sources?.data.reduce((sum, val, index) => {
                    sum[index] = { ...val, image: image(val.brand) }
                    return sum
                }, []) || []
            }
        }
        case 'ADD_PAYMENT':
            return produce(state, draftState => {
                if (draftState.cards.length === 0) {
                    draftState.default = action.payload.id
                }
                draftState.cards = [...draftState.cards, { ...action.payload, image: image(action.payload.brand) }]
            })
        case 'CHANGE_DEFAULT_PAYMENT':
            return {
                ...state,
                default: action.payload
            }
        case 'REMOVE_ALL':
            return {
                default: null,
                cards: []
            }
        case 'DELETE_CARD':
            return produce(state, draftState => {
                if (draftState.default === action.payload) {
                    draftState.default = null
                }
                draftState.cards = draftState.cards.filter(card => card.id !== action.payload)
            })
    }
    return state
}

export default payments