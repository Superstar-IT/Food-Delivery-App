import { createSelector } from "reselect";
import moment from "moment";

export interface Eater {
    id: number;
    name: string;
}

export interface Total {
    amount: number;
}

export interface Subtotal {
    amount: number;
}

export interface OfferDiscount {
    value: number;
    code: string;
}

export interface Fees {
    tax: number;
    serivefee: number;
    ORDER_FEE: number;
    DELIVERY_FEE: number;
}

export interface Charges {
    id: string;
    currency_code: string;
    total: Total;
    subtotal: Subtotal;
    offer_discount: OfferDiscount;
    fees: Fees;
}

export interface Payments {
    charges: Charges;
}

export interface Delivery {
    delivery_time: any;
    school: number;
    school_name: string;
    date: any;
    address: string;
    customer_email: string;
}

export interface SelectedItem {
    title: string;
    price: number;
    quantity: number;
}

export interface SelectedModifierGroup {
    title: string;
    type: string;
    selected_items: SelectedItem[];
}

export interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    restaurantID: number;
    special_price?: any;
    amount: number;
    selected_modifier_groups: SelectedModifierGroup[];
}

export interface Cart {
    id: number;
    name: string;
    subtotal: number;
    items: Item[];
}

export interface IOrder {
    _id: string;
    id: string;
    display_id: string;
    current_state: string;
    eater: Eater;
    payments: Payments;
    asap: boolean;
    delivery: Delivery;
    placed_at: Date;
    cart: Cart[];
}

export const priceSelector = createSelector(
    (state: any) => state.cart.itemsByID,
    (itemsByID: any) => {
        return Object.values(itemsByID).reduce((totalsum: any, data: any) => totalsum += (Number(data.price) * Number(data.amount)) + getOptionsPrice(data?.options, data.amount), 0)
    }
)

export function getOptionsPrice(options: any, amount?: number) {
    debugger
    return options?.reduce((sum: number, val: any) => {
        sum += val.options.reduce((sum2: number, val2: any) => {
            if (val2?.selected === true) sum2 += Number(val2.price)
            return sum2
        }, 0) * (amount || 1)
        return sum
    }, 0) || 0
}

export function getPastOptionsPrice(data: any) {
    return 0
}

export const upcomingSelector = createSelector(
    (state: any) => state.orders,
    orders => orders.filter((order: IOrder) => moment(order.delivery.delivery_time).isAfter(Date.now(), 'day'))
)

export const pastSelector = createSelector(
    (state: any) => state.orders,
    orders => orders.filter((order: IOrder) => moment(order.delivery.delivery_time).isBefore(moment(Date.now()).format('L'), 'day'))
)

export const todaySelector = createSelector(
    (state: any) => state.orders,
    orders => orders.filter((order: IOrder) => moment(order.delivery.delivery_time).isSame(Date.now(), 'day')) || []
)

export const cardSelector = createSelector(
    (state: any) => state.payments.default,
    (state: any) => state.payments.cards,
    (deafultID, cards) => cards.filter((card: any) => card.id === deafultID)[0]
)

export const itemsAmountSelector = createSelector(
    (state: any) => state.cart.itemsByID,
    items => Object.values(items).reduce((sum: number, value: any) => sum += Number(value.amount), 0)
)

export const restaurantSelector = (id: number) => createSelector(
    (state: any) => state.restaurants,
    (restaurants: Array<any>) => restaurants.filter(item => item.id === id)[0]
)