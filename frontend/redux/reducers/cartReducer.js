import {
  CART_LOAD_REQUEST,
  CART_LOAD_SUCCESS,
  CART_LOAD_FAIL,
  CART_ADD_REQUEST,
  CART_ADD_SUCCESS,
  CART_ADD_FAIL,
  CART_REMOVE_SUCCESS,
  CART_UPDATE_SUCCESS,
  CART_CLEAR,
} from '../constants';

const initialState = { loading: false, cartItems: [], error: null };

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_LOAD_REQUEST:
    case CART_ADD_REQUEST:
      return { ...state, loading: true, error: null };

    case CART_LOAD_SUCCESS:
    case CART_ADD_SUCCESS:
    case CART_REMOVE_SUCCESS:
    case CART_UPDATE_SUCCESS:
      return { loading: false, cartItems: action.payload, error: null };

    case CART_LOAD_FAIL:
    case CART_ADD_FAIL:
      return { ...state, loading: false, error: action.payload };

    case CART_CLEAR:
      return { loading: false, cartItems: [], error: null };

    default:
      return state;
  }
};

export default cartReducer;
