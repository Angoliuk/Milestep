import {loginUser, logoutUser} from '../actions/actionTypes';

const initialState = {
  name: null,
  userId: null,
  isAdmin: false,
  isAuth: false,
}

export default function userInfo(state = initialState, action) {
  switch(action.type) {
      
    case loginUser:
      return{
        name: action.payload.name,
        isAdmin: action.payload.isAdmin,
        userId: action.payload.userId,
        isAuth: true,
      }

    case logoutUser:
      return{
        name: null,
        isAdmin: false,
        userId: null,
        isAuth: false,
      }

    default:
      return state
  }
}



// const login = useCallback((name, jwtToken, id, isAdmin) => {
//     setToken(jwtToken)
//     setuserId(id)
//     setName(name)
//     setIsAdmin(isAdmin)
//     localStorage.setItem('userData', JSON.stringify({name: name, userId: id, token: jwtToken, isAdmin: isAdmin}))
// }, [])

// const logout = useCallback(() => {
//     setToken(null)
//     setuserId(null)
//     setName(null)
//     setIsAdmin(null)
//     localStorage.removeItem('userData')
// }, [])