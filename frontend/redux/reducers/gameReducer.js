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

const gamesListInitial = { loading: false, games: [], total: 0, page: 1, pages: 1, error: null };
const gameDetailInitial = { loading: false, game: null, error: null };

export const gamesListReducer = (state = gamesListInitial, action) => {
  switch (action.type) {
    case GAMES_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case GAMES_LIST_SUCCESS:
      return {
        loading: false,
        games: action.payload.games,
        total: action.payload.total,
        page: action.payload.page,
        pages: action.payload.pages,
        error: null,
      };
    case GAMES_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    case GAME_DELETE_SUCCESS:
      return { ...state, games: state.games.filter((g) => g._id !== action.payload) };
    default:
      return state;
  }
};

export const gameDetailReducer = (state = gameDetailInitial, action) => {
  switch (action.type) {
    case GAME_DETAIL_REQUEST:
      return { ...state, loading: true, error: null };
    case GAME_DETAIL_SUCCESS:
      return { loading: false, game: action.payload, error: null };
    case GAME_DETAIL_FAIL:
      return { loading: false, game: null, error: action.payload };
    default:
      return state;
  }
};

export const gameCreateReducer = (state = { loading: false, game: null, error: null, success: false }, action) => {
  switch (action.type) {
    case GAME_CREATE_REQUEST:
      return { loading: true, game: null, error: null, success: false };
    case GAME_CREATE_SUCCESS:
      return { loading: false, game: action.payload, error: null, success: true };
    case GAME_CREATE_FAIL:
      return { loading: false, game: null, error: action.payload, success: false };
    default:
      return state;
  }
};

export const gameUpdateReducer = (state = { loading: false, game: null, error: null, success: false }, action) => {
  switch (action.type) {
    case GAME_UPDATE_REQUEST:
      return { loading: true, game: null, error: null, success: false };
    case GAME_UPDATE_SUCCESS:
      return { loading: false, game: action.payload, error: null, success: true };
    case GAME_UPDATE_FAIL:
      return { loading: false, game: null, error: action.payload, success: false };
    default:
      return state;
  }
};

export const gameDeleteReducer = (state = { loading: false, error: null, success: false }, action) => {
  switch (action.type) {
    case GAME_DELETE_REQUEST:
      return { loading: true, error: null, success: false };
    case GAME_DELETE_SUCCESS:
      return { loading: false, error: null, success: true };
    case GAME_DELETE_FAIL:
      return { loading: false, error: action.payload, success: false };
    default:
      return state;
  }
};
