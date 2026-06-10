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

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  profile: null,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_REGISTER_REQUEST:
    case AUTH_LOGIN_REQUEST:
    case AUTH_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH_REGISTER_SUCCESS:
    case AUTH_LOGIN_SUCCESS:
      return { ...state, loading: false, userInfo: action.payload, error: null };

    case AUTH_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: action.payload,
        userInfo: state.userInfo
          ? {
              ...state.userInfo,
              avatarUrl: action.payload.avatarUrl,
              name: action.payload.name || state.userInfo.name,
              email: action.payload.email || state.userInfo.email,
            }
          : state.userInfo,
      };

    case AUTH_REGISTER_FAIL:
    case AUTH_LOGIN_FAIL:
    case AUTH_PROFILE_FAIL:
      return { ...state, loading: false, error: action.payload };

    case AUTH_LOGOUT:
      return { ...state, userInfo: null, profile: null };

    case WISHLIST_TOGGLE_SUCCESS:
      return {
        ...state,
        profile: state.profile ? { ...state.profile, wishlist: action.payload } : null,
      };

    default:
      return state;
  }
};

export default authReducer;
