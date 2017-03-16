import { v4 } from 'uuid';
import mapValues from 'lodash.mapvalues';
import { bindActionCreators } from 'redux';
import { NAME_KEY, UUID_KEY } from './constants';
import isPlainObject from 'lodash.isplainobject';
import isNil from 'lodash.isnil';
import get from 'lodash.get';


export const createUUID = () => v4();
export const getUUIDState = (state, name, ...args) => get(state, ['uuid', name, ...args]);
export const getRegisteredUUIDs = (state, name) => Object.keys(getUUIDState(state, name));

export const wrapActionCreators = (actionCreator, name, uuid) => {
  if (name === undefined) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Wrapped action creators must have a name parameter');
    } else {
      throw new Error(`Looks like youre passing undefined as a name to the wrapActionCreators\
        function call

        Example:
          import { wrapActionCreators } from 'react-redux-uuid';

          const generalActions = { add, subtract };
          // this would apply the add and subtract actions to all reducers within the counter name
          const mapDispatchToProps = wrapActionCreators(generalActions, 'counter');
      `);
    }
  }

  if (isPlainObject(actionCreator)) {
    return mapValues(actionCreator, ac => wrapActionCreators(ac, name, uuid));
  }

  return (...args) => {
    const action = actionCreator(...args);
    return {
      ...action,
      meta: Object.assign(
        {},
        action.meta,
        name && { [NAME_KEY]: name },
        uuid && { [UUID_KEY]: uuid },
      )
    };
  };
};

export const wrapMapStateToProps = (mapStateToProps, name) => (state, props) => {
  if (isNil(mapStateToProps)) return {};

  const innerState = getUUIDState(state, name, props.uuid);

  if (innerState === undefined) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Can\'t find the state by UUID');
    } else {
      throw new Error(`Looks like your uuid reducer setup is wrong. Make sure to have the\
        resulting reducer of the createUUIDReducer at the \`uuid\` key in your state's top level\
        reducers,

        Example:
          import { createUUIDReducer } from 'react-redux-uuid';

          const mainAppReducer = combineReducers({
            uuid: createUUIDReducer({
              counter: counterReducer,
              fizzbuzz: fizzbuzzReducer
            })
          })

          const store = createStore(mainAppReducer, ...);
      `);
    }
  }

  return mapStateToProps(
    innerState,
    props
  );
};

export const wrapMapDispatchToProps = (mapDispatchToProps, name) => (dispatch, { uuid, ...props }) => {
  if (isNil(mapDispatchToProps)) return {};
  if (isPlainObject(mapDispatchToProps)) {
    const actions = wrapActionCreators(mapDispatchToProps, name, uuid);
    // memoize wrapped actions by passing a thunk
    return () => bindActionCreators(actions, dispatch);
  }
  return mapDispatchToProps(dispatch, props);
};
