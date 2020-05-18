import produce from "immer";

const initialState = {
  items: [],
  itemsByID: {}
};

const cart = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      debugger;
      return produce(state, draftState => {
        draftState.itemsByID[action.payload.id] = action.payload;
        draftState.items.push(action.payload.id);
      });
    case "ADD_TO_CART_NEW":
      return produce(state, draftState => {
        draftState.itemsByID[action.payload.id] = action.payload;
        draftState.items.push(action.payload.id);
      });
    case "REMOVE_FROM_CART":
      return produce(state, draftState => {
        delete draftState.itemsByID?.[action.payload];
        draftState.items = draftState.items.filter(
          item => item !== action.payload
        );
      });
    case "UPDATE_CART":
      return produce(state, draftState => {
        draftState.itemsByID[action.payload.id].amount = action.payload.amount;
        draftState.itemsByID[action.payload.id].extra = action.payload.extra;
        draftState.itemsByID[action.payload.id].options =
          action.payload.options;
      });
    case "START_NEW_ORDER":
      return {
        items: [],
        itemsByID: {}
      };
  }
  return state;
};

export default cart;
