import axios from 'axios';
import {
  GAMES_LIST_REQUEST,
  GAMES_LIST_SUCCESS,
  GAMES_LIST_FAIL,
  GAME_DETAIL_REQUEST,
  GAME_DETAIL_SUCCESS,
  GAME_DETAIL_FAIL,
  GAME_CREATE_REQUEST,
  GAME_CREATE_SUCCESS,
  GAME_CREATE_FAIL,
  GAME_UPDATE_REQUEST,
  GAME_UPDATE_SUCCESS,
  GAME_UPDATE_FAIL,
  GAME_DELETE_REQUEST,
  GAME_DELETE_SUCCESS,
  GAME_DELETE_FAIL,
} from '../constants';

const API = 'http://localhost:5000/api';

export const listGames = (search = '', category = 'All', sort = '', page = 1) => async (dispatch) => {
  dispatch({ type: GAMES_LIST_REQUEST });
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);
    if (sort) params.append('sort', sort);
    params.append('page', page);
    params.append('limit', 12);

    const { data } = await axios.get(`${API}/games?${params.toString()}`);
    dispatch({ type: GAMES_LIST_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: GAMES_LIST_FAIL,
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const getGameDetails = (id) => async (dispatch) => {
  dispatch({ type: GAME_DETAIL_REQUEST });
  try {
    const { data } = await axios.get(`${API}/games/${id}`);
    dispatch({ type: GAME_DETAIL_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: GAME_DETAIL_FAIL,
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const createGame = (gameData) => async (dispatch, getState) => {
  dispatch({ type: GAME_CREATE_REQUEST });
  try {
    const { auth } = getState();
    const config = { headers: { Authorization: `Bearer ${auth.userInfo.token}` } };
    const { data } = await axios.post(`${API}/games`, gameData, config);
    dispatch({ type: GAME_CREATE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: GAME_CREATE_FAIL,
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const updateGame = (id, gameData) => async (dispatch, getState) => {
  dispatch({ type: GAME_UPDATE_REQUEST });
  try {
    const { auth } = getState();
    const config = { headers: { Authorization: `Bearer ${auth.userInfo.token}` } };
    const { data } = await axios.put(`${API}/games/${id}`, gameData, config);
    dispatch({ type: GAME_UPDATE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: GAME_UPDATE_FAIL,
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const deleteGame = (id) => async (dispatch, getState) => {
  dispatch({ type: GAME_DELETE_REQUEST });
  try {
    const { auth } = getState();
    const config = { headers: { Authorization: `Bearer ${auth.userInfo.token}` } };
    await axios.delete(`${API}/games/${id}`, config);
    dispatch({ type: GAME_DELETE_SUCCESS, payload: id });
  } catch (err) {
    dispatch({
      type: GAME_DELETE_FAIL,
      payload: err.response?.data?.message || err.message,
    });
  }
};
