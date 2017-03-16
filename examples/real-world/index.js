import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { createReducer } from 'react-redux-uuid'
import UserList from './UserList'
import { loadUsersAsync } from 'api-sdk'


const user = (state, action) => {
  /*...*/
}

const reducer = combineReducers({
  uuid: createReducer({
    users
  })
})

const store = createStore(reducer)

loadUsersAsync().then(users => {
  /**
   * transforms an array of users into an object where each key is the user id
   * [{ id: 1, name: 'eloy', role: 'admin' }] -> { 1: { id: 1, name: 'eloy, role: 'admin' } }
   */
  const userMap = {};
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    userMap[user.id] = user
  }

  store.dispatch(registerUUID('users', userMap))
  /**
   * the resulting state after dispatching
   * {
   *   uuid: {
   *     users: {
   *       1: { id: 1, name: 'eloy', role: 'admin' }
   *     }
   *   }
   * }
   */
})

ReactDOM.render(
  <Provider store={store}>
    <UserList />
  </Provider>
  document.getElementById('root')
)

