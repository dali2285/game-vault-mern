import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/authReducer';
import cartReducer from './reducers/cartReducer';
import reviewReducer from './reducers/reviewReducer';
import orderLibraryReducer from './reducers/orderReducer';
import {
  gamesListReducer,
  gameDetailReducer,
  gameCreateReducer,
  gameUpdateReducer,
  gameDeleteReducer,
} from './reducers/gameReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  review: reviewReducer,
  orderLibrary: orderLibraryReducer,
  gamesList: gamesListReducer,
  gameDetail: gameDetailReducer,
  gameCreate: gameCreateReducer,
  gameUpdate: gameUpdateReducer,
  gameDelete: gameDeleteReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
