import axios from 'axios';
import {
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
  AUTH_REGISTER_FAIL,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAIL,
  AUTH_LOGOUT,
  AUTH_PROFILE_REQUEST,
  AUTH_PROFILE_SUCCESS,
  AUTH_PROFILE_FAIL,
  WISHLIST_TOGGLE_SUCCESS,
} from '../constants';

const API = 'http://localhost:5000/api';

export const register = (name, email, password) => async (dispatch) => {
  dispatch({ type: AUTH_REGISTER_REQUEST });
  try {
    const { data } = await axios.post(`${API}/auth/register`, { name, email, password });
    dispatch({ type: AUTH_REGISTER_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (err) {
    dispatch({
      type: AUTH_REGISTER_FAIL,
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const login = (email, password) => async (dispatch) => {
  dispatch({ type: AUTH_LOGIN_REQUEST });
  try {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    dispatch({ type: AUTH_LOGIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (err) {
    dispatch({
      type: AUTH_LOGIN_FAIL,
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: AUTH_LOGOUT });
};

export const getProfile = () => async (dispatch, getState) => {
  dispatch({ type: AUTH_PROFILE_REQUEST });
  try {
    const { auth } = getState();
    const config = { headers: { Authorization: `Bearer ${auth.userInfo.token}` } };
    const { data } = await axios.get(`${API}/auth/profile`, config);
    dispatch({ type: AUTH_PROFILE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: AUTH_PROFILE_FAIL,
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const toggleWishlist = (gameId) => async (dispatch, getState) => {
  try {
    const { auth } = getState();
    const config = { headers: { Authorization: `Bearer ${auth.userInfo.token}` } };
    const { data } = await axios.post(`${API}/users/wishlist`, { gameId }, config);
    dispatch({ type: WISHLIST_TOGGLE_SUCCESS, payload: data });
  } catch (err) {
    console.error('[v0] toggleWishlist error:', err.message);
  }
};
