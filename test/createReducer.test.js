import { UUID_KEY, NAME_KEY } from '../src/constants';
import { registerUUID, unregisterUUID } from '../src/actions'
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
    prevState = reducer(prevState, registerUUID('counter', 'COUNTER-0'))
    expect(prevState).toEqual({
      counter: {
        'COUNTER-0': 1
      },
      fizzbuzz: {}
    })
  })

  it('registers a new fizzbuzz', () => {
    prevState = reducer(prevState, registerUUID('fizzbuzz', 'FIZZBUZZ-0'))
    expect(prevState).toEqual({
      counter: {
        'COUNTER-0': 1
      },
      fizzbuzz: {
        'FIZZBUZZ-0': 'buzz'
      }
    })
  })

  it('registers three more counters', () => {
    prevState = reducer(prevState, registerUUID('counter', {
      'COUNTER-1': 0,
      'COUNTER-2': 3,
      'COUNTER-3': 3
    }))
    expect(prevState).toEqual({
      counter: {
        'COUNTER-0': 1,
        'COUNTER-1': 1,
        'COUNTER-2': 4,
        'COUNTER-3': 4
      },
      fizzbuzz: {
        'FIZZBUZZ-0': 'buzz'
      }
    })
  })

  it('unregisters two counters', () => {
    prevState = reducer(prevState, unregisterUUID('counter', ['COUNTER-2', 'COUNTER-3']))
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

  it('unhandled actions go to inner states', () => {
    prevState = reducer(prevState, { type: '@' })
    expect(prevState).toEqual({
      counter: {
        'COUNTER-0': 2,
        'COUNTER-1': 2
      },
      fizzbuzz: {
        'FIZZBUZZ-0': 'fizz'
      }
    });
  })

  it('actions with no UUID alter all states within a given name', () => {
    prevState = reducer(prevState, { type: '@', meta: { [NAME_KEY]: 'counter' } })
    expect(prevState).toEqual({
      counter: {
        'COUNTER-0': 3,
        'COUNTER-1': 3
      },
      fizzbuzz: {
        'FIZZBUZZ-0': 'fizz'
      }
    });
  })

  it('alters the counter', () => {
    prevState = reducer(prevState, { meta: { [UUID_KEY]: 'COUNTER-0', [NAME_KEY]: 'counter' } })
    expect(prevState).toEqual({
      counter: {
        'COUNTER-0': 4,
        'COUNTER-1': 3
      },
      fizzbuzz: {
        'FIZZBUZZ-0': 'fizz'
      }
    })
  })

  it('alters the fizzbuzz', () => {
    prevState = reducer(prevState, { meta: { [UUID_KEY]: 'FIZZBUZZ-0', [NAME_KEY]: 'fizzbuzz' } })
    expect(prevState).toEqual({
      counter: {
        'COUNTER-0': 4,
        'COUNTER-1': 3
      },
      fizzbuzz: {
        'FIZZBUZZ-0': 'buzz'
      }
    })
  })

  it('unregisters the first counter', () => {
    prevState = reducer(prevState, unregisterUUID('counter', 'COUNTER-0'))
    expect(prevState).toEqual({
      counter: {
        'COUNTER-1': 3
      },
      fizzbuzz: {
        'FIZZBUZZ-0': 'buzz'
      }
    })
  })
})
