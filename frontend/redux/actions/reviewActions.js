import axios from 'axios';
import {
  REVIEW_CREATE_REQUEST,
  REVIEW_CREATE_SUCCESS,
  REVIEW_CREATE_FAIL,
} from '../constants';
import { getGameDetails } from './gameActions';

const API = 'http://localhost:5000/api';

export const createReview = (gameId, rating, comment) => async (dispatch, getState) => {
  dispatch({ type: REVIEW_CREATE_REQUEST });
  try {
    const { auth } = getState();
    const config = { headers: { Authorization: `Bearer ${auth.userInfo.token}` } };
    await axios.post(`${API}/reviews`, { gameId, rating, comment }, config);
    dispatch({ type: REVIEW_CREATE_SUCCESS });
    dispatch(getGameDetails(gameId));
  } catch (err) {
    dispatch({
      type: REVIEW_CREATE_FAIL,
      payload: err.response?.data?.message || err.message,
    });
  }
};
