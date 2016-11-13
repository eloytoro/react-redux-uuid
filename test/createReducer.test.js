import { UUID_KEY, NAME_KEY } from '../src/constants';
import { register, unregister } from '../src/actions'
import createReducer from '../src/createReducer'

describe('createReducer', () => {
  const counter = (state = 0) => state + 1
  const fizzbuzz = (state = 'fizz') => state === 'fizz' ? 'buzz' : 'fizz'
  const reducer = createReducer({
    counter,
    fizzbuzz
  })
  const initialState = {
    counter: {},
    fizzbuzz: {}
  }
  let prevState

  it('outputs the state', () => {
    prevState = reducer(undefined, {})
    expect(prevState).toEqual(initialState)
  })

  it('registers a new counter', () => {
    prevState = reducer(prevState, register('counter', 'COUNTER-0'))
    expect(prevState).toEqual({
      counter: {
        'COUNTER-0': 1
      },
      fizzbuzz: {}
    })
  })

  it('registers a new fizzbuzz', () => {
    prevState = reducer(prevState, register('fizzbuzz', 'FIZZBUZZ-0'))
    expect(prevState).toEqual({
      counter: {
        'COUNTER-0': 1
      },
      fizzbuzz: {
        'FIZZBUZZ-0': 'buzz'
      }
    })
  })

  it('registers a second counter', () => {
    prevState = reducer(prevState, register('counter', 'COUNTER-1'))
    expect(prevState).toEqual({
      counter: {
        'COUNTER-0': 1,
        'COUNTER-1': 1
      },
      fizzbuzz: {
        'FIZZBUZZ-0': 'buzz'
      }
    })
  })

  it('unhandled actions dont alter inner states', () => {
    const state = reducer(prevState, {})
    expect(state.counter).toBe(prevState.counter)
    expect(state.fizzbuzz).toBe(prevState.fizzbuzz)
  })

  it('alters the counter', () => {
    prevState = reducer(prevState, { meta: { [UUID_KEY]: 'COUNTER-0', [NAME_KEY]: 'counter' } })
    expect(prevState).toEqual({
      counter: {
        'COUNTER-0': 2,
        'COUNTER-1': 1
      },
      fizzbuzz: {
        'FIZZBUZZ-0': 'buzz'
      }
    })
  })

  it('alters the fizzbuzz', () => {
    prevState = reducer(prevState, { meta: { [UUID_KEY]: 'FIZZBUZZ-0', [NAME_KEY]: 'fizzbuzz' } })
    expect(prevState).toEqual({
      counter: {
        'COUNTER-0': 2,
        'COUNTER-1': 1
      },
      fizzbuzz: {
        'FIZZBUZZ-0': 'fizz'
      }
    })
  })

  it('unregisters the first counter', () => {
    prevState = reducer(prevState, unregister('counter', 'COUNTER-0'))
    expect(prevState).toEqual({
      counter: {
        'COUNTER-1': 1
      },
      fizzbuzz: {
        'FIZZBUZZ-0': 'fizz'
      }
    })
  })
})
