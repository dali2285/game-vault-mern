import axios from 'axios';
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
} from '../constants';

const API = 'http://localhost:5000/api';

const authHeader = (getState) => {
  const { auth } = getState();
  return { headers: { Authorization: `Bearer ${auth.userInfo.token}` } };
};

export const createOrder = (orderData) => async (dispatch, getState) => {
  dispatch({ type: ORDER_CREATE_REQUEST });
  try {
    const { data } = await axios.post(`${API}/orders`, orderData, authHeader(getState));
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: ORDER_CREATE_FAIL, payload: err.response?.data?.message || err.message });
  }
};

export const listMyOrders = () => async (dispatch, getState) => {
  dispatch({ type: ORDER_LIST_REQUEST });
  try {
    const { data } = await axios.get(`${API}/orders/user`, authHeader(getState));
    dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
    console.log('[v0] listMyOrders success:', data);
  } catch (err) {
    dispatch({ type: ORDER_LIST_FAIL, payload: err.response?.data?.message || err.message });
  }
};

export const listAllOrders = () => async (dispatch, getState) => {
  dispatch({ type: ORDER_LIST_REQUEST });
  try {
    const { data } = await axios.get(`${API}/orders/admin`, authHeader(getState));
    dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: ORDER_LIST_FAIL, payload: err.response?.data?.message || err.message });
  }
};
