import {
  NAME_KEY,
  UUID_KEY,
  REGISTER,
  UNREGISTER
} from './constants';
import omit from 'lodash.omit';
import mapValues from 'lodash.mapvalues';
import has from 'lodash.has';
import { combineReducers } from 'redux';


const createUUIDReducer = (reducers) => {
  const splitReducer = mapValues(reducers, (reducer) => (state = {}, action) => {
    if (!has(action, ['meta', UUID_KEY]))
      return mapValues(state, (innerState) => reducer(innerState, action));
    const key = action.meta[UUID_KEY];

    switch (action.type) {
      case REGISTER: return Object.assign(
        {},
        state,
        mapValues(
          typeof key === 'string' ? { [key]: undefined } : key,
          (initialState) => reducer(initialState, action)
        )
      );
      case UNREGISTER: return omit(state, key);
    }

    return has(state, key)
      ? { ...state, [key]: reducer(state[key], action) }
      : state;
  });

  return (state = {}, action) => {
    if (!has(action, ['meta', NAME_KEY]))
      return mapValues(splitReducer, (reducer, key) => reducer(state[key], action));

    const name = action.meta[NAME_KEY];

    return Object.assign({}, state, {
      [name]: splitReducer[name](state[name], action)
    });
  };
}

export default createUUIDReducer;
