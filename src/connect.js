import React from 'react';
import { bindActionCreators } from 'redux';
import { NAME_KEY, UUID_KEY } from './constants';
import { register, unregister } from './actions';
import _ from 'lodash';
import { v4 } from 'uuid';
import { connect } from 'react-redux';


const wrapActionCreators = (actionCreators, name, uuid) => {
  return _.mapValues(actionCreators, (actionCreator) => (...args) => {
    const action = actionCreator(...args);
    return {
      ...action,
      meta: {
        ...action.meta,
        [UUID_KEY]: uuid,
        [NAME_KEY]: name
      }
    };
  });
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
        throw new Error(`Looks like your uuid reducer setup is wrong. Make sure to have the resulting\
          reducer of the createUUIDReducer at the \`uuid\` key in your state's top level reducers,

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
