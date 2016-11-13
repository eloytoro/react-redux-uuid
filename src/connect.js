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

const connectUUID = (name, mapStateToProps, mapDispatchToProps) => (Component) => {
  const wrapMapStateToProps = (state, { uuid, ...props }) => {
    if (_.isNil(mapStateToProps)) return {};
    return mapStateToProps(
      state.uuid[name][uuid],
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
