let loginFuncs = []
let inRoleFuncs = []
let roles = setRoles([])
let username = setUsername('')

export default {
  login: {
    subscribe: (fn, usernameIn) => {
      username = setUsername(usernameIn)
      loginFuncs.push(fn)
    },

    trigger: () => {
      loginFuncs.forEach(fn => {
        fn(username)
      })
    }
  },

  inRole: {
    subscribe: (fn, rolesIn) => {
      roles = setRoles(rolesIn)
      inRoleFuncs.push(fn)
    },

    trigger: () => {
      inRoleFuncs.forEach(fn => {
        fn(roles)
      })
    }
  },

  clear: () => {
    username = setUsername('')
    roles = setRoles([])
  }
}

function setUsername (name) {
  return name
}

function setRoles (r) {
  return Array.from(r)
}
