import {combineReducers} from 'redux';
import user from './setUserReducer';
import channel from './setChannelReducer';
import colors from './colorReducer';

const rootReducer = combineReducers({
    user,
    channel,
    colors,
})

export default rootReducer;