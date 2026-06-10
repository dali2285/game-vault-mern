import {
  ORDER_LIBRARY_REQUEST,
  ORDER_LIBRARY_SUCCESS,
  ORDER_LIBRARY_FAIL,
} from '../constants';

const initialState = {
  loading: false,
  purchasedGames: [],
  error: null,
};

const orderLibraryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDER_LIBRARY_REQUEST:
      return { ...state, loading: true, error: null };
    case ORDER_LIBRARY_SUCCESS:
      return { ...state, loading: false, purchasedGames: action.payload, error: null };
    case ORDER_LIBRARY_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default orderLibraryReducer;
