import {
  NAME_KEY,
  UUID_KEY,
  REGISTER,
  UNREGISTER
} from './constants';
import _ from 'lodash';
import { combineReducers } from 'redux';


const createUUIDReducer = (reducers) => {
  const splitReducer = _.mapValues(reducers, (reducer) => (state = {}, action) => {
    if (!_.has(action, ['meta', UUID_KEY]))
      return _.mapValues(state, (innerState) => reducer(innerState, action));
    const key = action.meta[UUID_KEY];

    switch (action.type) {
      case REGISTER: return Object.assign({}, state, {
        [key]: reducer(undefined, action)
      });
      case UNREGISTER: return _.omit(state, key);
    }

    return _.has(state, key)
      ? { ...state, [key]: reducer(state[key], action) }
      : state;
  });

  return (state = {}, action) => {
    if (!_.has(action, ['meta', NAME_KEY]))
      return _.mapValues(splitReducer, (reducer, key) => reducer(state[key], action));

    const name = action.meta[NAME_KEY];

    return Object.assign({}, state, {
      [name]: splitReducer[name](state[name], action)
    });
  };
}

export default createUUIDReducer;
