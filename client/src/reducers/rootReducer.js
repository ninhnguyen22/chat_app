import { combineReducers } from 'redux';
import room from './room';
import crRoom from './crRoom';
import message from './message';

const rootReducer = combineReducers({
  room,
  crRoom,
  message,
});

export default rootReducer;
