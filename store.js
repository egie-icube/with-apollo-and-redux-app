import { createStore } from 'redux'

const initialState = {
  lastUpdate: 0,
  light: false,
  count: 0,
  cart: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: action.cart,
      }
    case 'UPDATE_TO_CART':
      return {
        ...state,
        cart: action.cart,
      }
    case 'TICK':
      return {
        ...state,
        lastUpdate: action.lastUpdate,
        light: !!action.light,
      }
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1,
      }
    case 'RESET':
      return {
        ...state,
        count: initialState.count,
      }
    default:
      return state
  }
}

export const initializeStore = (preloadedState = initialState) => {
  return createStore(reducer, preloadedState)
}
