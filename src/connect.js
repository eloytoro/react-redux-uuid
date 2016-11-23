import React from 'react';
import { bindActionCreators } from 'redux';
import { NAME_KEY, UUID_KEY } from './constants';
import { register, unregister } from './actions';
import _ from 'lodash';
import { v4 } from 'uuid';
import { connect } from 'react-redux';


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

  if (_.isPlainObject(actionCreator)) {
    return _.mapValues(actionCreator, ac => wrapActionCreators(ac, name, uuid));
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

const selectUUIDState = (state, name, uuid) => _.get(state, ['uuid', name, uuid]);

const connectUUID = (name, mapStateToProps, mapDispatchToProps) => (Component) => {
  const wrapMapStateToProps = (state, { uuid, ...props }) => {
    if (_.isNil(mapStateToProps)) return {};

    const innerState = selectUUIDState(state, name, uuid);

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

  const wrapMapDispatchToProps = (dispatch, { uuid, ...props }) => {
    if (_.isNil(mapDispatchToProps)) return {};
    if (_.isPlainObject(mapDispatchToProps)) {
      const actions = wrapActionCreators(mapDispatchToProps, name, uuid);
      // memoize wrapped actions by passing a thunk
      return () => bindActionCreators(actions, dispatch);
    }
    return mapDispatchToProps(dispatch, props);
  };

  const ConnectedComponent = connect(wrapMapStateToProps, wrapMapDispatchToProps)(Component);

  class ConnectUUID extends React.Component {
    componentWillMount() {
      this.uuid = v4();
      this.props.register(name, this.uuid);
    }

    componentWillUnmount() {
      this.props.unregister(name, this.uuid);
    }

    render() {
      return React.createElement(ConnectedComponent, Object.assign(
        {},
        this.props,
        { uuid: this.uuid }
      ));
    }
  }

  return connect(null, { register, unregister })(ConnectUUID);
};

export default connectUUID;
