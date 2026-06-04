import axios from 'axios';
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

const API = 'http://localhost:5000/api';

const authHeader = (getState) => {
  const { auth } = getState();
  return { headers: { Authorization: `Bearer ${auth.userInfo.token}` } };
};

export const loadCart = () => async (dispatch, getState) => {
  dispatch({ type: CART_LOAD_REQUEST });
  try {
    const { data } = await axios.get(`${API}/cart`, authHeader(getState));
    dispatch({ type: CART_LOAD_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: CART_LOAD_FAIL, payload: err.response?.data?.message || err.message });
  }
};

export const addToCart = (gameId, quantity = 1) => async (dispatch, getState) => {
  dispatch({ type: CART_ADD_REQUEST });
  try {
    const { data } = await axios.post(`${API}/cart/add`, { gameId, quantity }, authHeader(getState));
    dispatch({ type: CART_ADD_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: CART_ADD_FAIL, payload: err.response?.data?.message || err.message });
  }
};

export const removeFromCart = (gameId) => async (dispatch, getState) => {
  try {
    const { data } = await axios.post(`${API}/cart/remove`, { gameId }, authHeader(getState));
    dispatch({ type: CART_REMOVE_SUCCESS, payload: data });
  } catch (err) {
    console.error('[v0] removeFromCart error:', err.message);
  }
};

export const updateCartItem = (gameId, quantity) => async (dispatch, getState) => {
  try {
    const { data } = await axios.put(`${API}/cart/update`, { gameId, quantity }, authHeader(getState));
    dispatch({ type: CART_UPDATE_SUCCESS, payload: data });
  } catch (err) {
    console.error('[v0] updateCartItem error:', err.message);
  }
};

export const clearCart = () => async (dispatch, getState) => {
  try {
    await axios.delete(`${API}/cart/clear`, authHeader(getState));
    dispatch({ type: CART_CLEAR });
  } catch (err) {
    console.error('[v0] clearCart error:', err.message);
  }
};
