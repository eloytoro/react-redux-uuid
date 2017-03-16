import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import { UUID_KEY, NAME_KEY } from '../src/constants'
import { registerUUID } from '../src/actions'
import createReducer from '../src/createReducer'
import connectUUID from '../src/connect'
import { createStore, combineReducers } from 'redux'


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

const ConnectedComponent = connectUUID('counter', state => ({ count: state }))(Component)

const setupStore = () => {
  const store = createStore(reducer)
  const dispatch = store.dispatch
  store.dispatch = jest.fn(action => dispatch(action))

  return store
}

const setupRoot = (store, props) => mount(
  <Provider store={store}>
    <ConnectedComponent {...props} />
  </Provider>
)

describe('connect', () => {
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
      store.dispatch({ type: '@', meta: { [UUID_KEY]: uuid, [NAME_KEY]: 'counter' } })
      expect(component.props().count).toBe(2)
    })

    it('doesn\'t update the component', () => {
      store.dispatch({ type: '@', meta: { [UUID_KEY]: 'wrong', [NAME_KEY]: 'counter' } })
      expect(component.props().count).toBe(2)
    })
  }

  describe('implicitly', () => {
    const store = setupStore()
    const root = setupRoot(store)

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
    const store = setupStore()
    store.dispatch(registerUUID('counter', uuid))
    const root = setupRoot(store, { uuid })
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
