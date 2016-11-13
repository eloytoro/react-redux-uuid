import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { UUID_KEY, NAME_KEY } from '../src/constants';
import createReducer from '../src/createReducer'
import connectUUID from '../src/connect'
import { createStore, combineReducers } from 'redux';


describe('connect', () => {
  const counter = (state = 0) => state + 1
  const fizzbuzz = (state = 'fizz') => state === 'fizz' ? 'buzz' : 'fizz'
  const reducer = combineReducers({
    uuid: createReducer({
      counter,
      fizzbuzz
    })
  })
  const store = createStore(reducer);

  const Component = () => <div />;

  const ConnectedComponent = connectUUID('counter', state => ({ count: state }))(Component);

  const component = mount(
    <Provider store={store}>
      <ConnectedComponent />
    </Provider>
  ).find(Component);

  it('connects the component to the uuid state', () => {
    const props = component.props();
    expect(props.count).toBe(1);
    expect(props.uuid).not.toBeUndefined();
    expect(store.getState().uuid.counter[props.uuid]).toEqual(1);
  });

  it('doesn\'t update the component', () => {
    const uuid = component.props().uuid;
    expect(component.props().count).toBe(1);
    store.dispatch({ type: '@', meta: { [UUID_KEY]: 'wrong', [NAME_KEY]: 'counter' } });
    expect(component.props().count).toBe(1);
  });

  it('updates the component', () => {
    const uuid = component.props().uuid;
    expect(component.props().count).toBe(1);
    store.dispatch({ type: '@', meta: { [UUID_KEY]: uuid, [NAME_KEY]: 'counter' } });
    expect(component.props().count).toBe(2);
  });

  it('doesn\'t update the component', () => {
    const uuid = component.props().uuid;
    expect(component.props().count).toBe(2);
    store.dispatch({ type: '@', meta: { [UUID_KEY]: 'wrong', [NAME_KEY]: 'counter' } });
    expect(component.props().count).toBe(2);
  });
});