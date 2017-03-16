import React from 'react'
import { connectUUID } from 'react-redux-uuid'

const UserLabel = ({ email, role }) => (
  <li>
    <strong>{role}</strong>
    {' - '}
    <span>{email}</span>
  </li>
)

const mapStateToProps = ({ email, role }) => {
  return {
    email,
    role
  }
}

export default connectUUID(mapStateToProps)(UserLabel)
