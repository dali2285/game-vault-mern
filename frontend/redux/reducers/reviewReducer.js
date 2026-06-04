import {
  REVIEW_CREATE_REQUEST,
  REVIEW_CREATE_SUCCESS,
  REVIEW_CREATE_FAIL,
} from '../constants';

const initialState = { loading: false, success: false, error: null };

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case REVIEW_CREATE_REQUEST:
      return { loading: true, success: false, error: null };
    case REVIEW_CREATE_SUCCESS:
      return { loading: false, success: true, error: null };
    case REVIEW_CREATE_FAIL:
      return { loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};

export default reviewReducer;
