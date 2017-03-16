import React from 'react'
import { getRegisteredUUIDs } from 'react-redux-uuid'
import UserLabel from './UserLabel'
import { connect } from 'react-redux'

const UserList = ({ userIds }) => (
  <ul>
    {userIds.map(id => (
      <UserLabel key={id} uuid={id} />
    ))}
  </ul>
)

const mapStateToProps = (state) => {
  return {
    userIds: getRegisteredUUIDs(state, 'users')
  }
}

export default connect(mapStateToProps)(UserLabel)
