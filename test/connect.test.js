import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import { UUID_KEY, NAME_KEY } from '../src/constants'
import { registerUUID } from '../src/actions'
import createReducer from '../src/createReducer'
import connectUUID from '../src/connect'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

const counter = (state = 0) => state + 1
const fizzbuzz = (state = 'fizz') => state === 'fizz' ? 'buzz' : 'fizz'
const reducer = combineReducers({
  uuid: createReducer({
    counter,
    fizzbuzz
  })
})

const Component = () => (
  <div />
)

const createConnectedComponent = (useThunk) => connectUUID('counter', state => ({ count: state }), setupActionCreators(useThunk))(Component)

const setupStore = (useThunk) => {
  const store = useThunk ? createStore(reducer, applyMiddleware(thunkMiddleware)) : createStore(reducer)
  const dispatch = store.dispatch
  store.dispatch = jest.fn(action => dispatch(action))

  return store
}

const setupActionCreators = (useThunk) => {
  const actionCreators = {}
  if (useThunk) {
      actionCreators.incr = () => (dispatch) => dispatch({type: '@'})
  } else {
      actionCreators.incr = () => {return {type: '@'}}
  }
  return actionCreators
}

const setupRoot = (store, props, useThunk) => {
  const ConnectedComponent = createConnectedComponent(useThunk)
  return mount(
        <Provider store={store}>
            <ConnectedComponent {...props} />
        </Provider>
    )
}

describe.each([false,true])('connect thunk:%o', (useThunk) => {
  const assertBehavior = (store, component, uuid) => {
    it('connects the component to the uuid state', () => {
      const props = component.props()
      expect(props.count).toBe(1)
      expect(props.uuid).not.toBeUndefined()
      expect(props.unregisterUUID).toBeUndefined()
      expect(props.registerUUID).toBeUndefined()
      expect(store.getState().uuid.counter[uuid]).toEqual(1)
    })

    it('doesn\'t update the component', () => {
      expect(component.props().count).toBe(1)
      store.dispatch({ type: '@', meta: { [UUID_KEY]: 'wrong', [NAME_KEY]: 'counter' } })
      expect(component.props().count).toBe(1)
    })

    it('updates the component', () => {
      component.props().incr()
      expect(component.props().count).toBe(2)
    })

    it('doesn\'t update the component', () => {
      store.dispatch({ type: '@', meta: { [UUID_KEY]: 'wrong', [NAME_KEY]: 'counter' } })
      expect(component.props().count).toBe(2)
    })
  }

  describe('implicitly', () => {
    const store = setupStore(useThunk)
    const root = setupRoot(store, {}, useThunk)

    const component = root.find(Component)

    const uuid = component.props().uuid

    assertBehavior(store, component, uuid)

    it('unmounts the component', () => {
      const calls = store.dispatch.mock.calls.length
      root.unmount()
      expect(store.getState().uuid.counter[uuid]).toBeUndefined()
      expect(store.dispatch.mock.calls.length).toBe(calls + 1)
    })
  })

  describe('explicitly', () => {
    const uuid = 'NON_UUID_KEY'
    const store = setupStore(useThunk)

    store.dispatch(registerUUID('counter', uuid))
    const root = setupRoot(store, { uuid }, useThunk)
    const component = root.find(Component)

    assertBehavior(store, component, uuid)

    it('unmounts the component', () => {
      const calls = store.dispatch.mock.calls.length
      root.unmount()
      expect(store.getState().uuid.counter[uuid]).not.toBeUndefined()
      expect(store.dispatch.mock.calls.length).toBe(calls)
    })
  })
})
