import React from 'react';
import { registerUUID, unregisterUUID } from './actions';
import omit from 'lodash.omit';
import { createUUID, wrapMapStateToProps, wrapMapDispatchToProps } from './commons';
import { connect } from 'react-redux';


const connectUUID = (name, mapStateToProps, mapDispatchToProps) => (Component) => {
  const ConnectedComponent = connect(
    wrapMapStateToProps(mapStateToProps, name),
    wrapMapDispatchToProps(mapDispatchToProps, name)
  )(Component);

  class ConnectUUID extends React.Component {
    componentWillMount() {
      this.uuid = this.props.uuid || createUUID();

      if (!this.props.uuid) {
        this.props.registerUUID(name, this.uuid);
      }

      this.unregister = () => {
        this.props.unregisterUUID(name, this.uuid);
      }
    }

    componentWillUnmount() {
      if (!this.props.uuid) {
        this.unregister();
      }
    }

    render() {
      return (
        <ConnectedComponent
          {...omit(this.props, 'registerUUID', 'unregisterUUID')}
          uuid={this.uuid}
        />
      );
    }
  }

  return connect(null, { registerUUID, unregisterUUID })(ConnectUUID);
};

export default connectUUID;
