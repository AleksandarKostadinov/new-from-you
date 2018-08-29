import React from 'react'

function protectedRoute (allowedRoles, inRole) {
  return function (WrappedComponent) {
    return function ({ role, ...rest }) {
      if (inRole(allowedRoles)) {
        return <WrappedComponent {...rest} />
      }
      return <h1>Not Authorized</h1>
    }
  }
}

export default protectedRoute
