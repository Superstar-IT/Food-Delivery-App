import { createStore, combineReducers, compose, applyMiddleware } from 'redux'

import cart from '../reducers/cart'
import products from '../reducers/products'
import restaurants from '../reducers/restaurants'
import payments from '../reducers/payments'
import auth from '../reducers/auth'
import orders from '../reducers/orders'
import driverOrders from '../reducers/driverOrders'
import school from '../reducers/school'


const composeEnhancers =
    typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        }) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(),
    // other store enhancers if any
);

const reducer = combineReducers({
    cart,
    products,
    restaurants,
    payments,
    auth,
    driverOrders,
    orders,
    school
});
const store = createStore(reducer, enhancer)

export default store