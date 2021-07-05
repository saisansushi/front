import { combineReducers } from 'redux';
import navigation from './navigation';
import appState from './appState';
import config from './config';
import order from './order';
import init from './init';

export default combineReducers({
    navigation,
    appState,
    config,
    order,
    init


});

