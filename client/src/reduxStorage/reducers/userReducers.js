import {loginUser, logoutUser, setInfoAboutUser} from '../actions/actionTypes';

const initialState = {
  name: null,
  userId: null,
  isAdmin: false,
  token: null,
  isAuth: false,
}

export default function userInfo(state = initialState, action) {
  switch(action.type) {
    case setInfoAboutUser:
      return {
        name: action.payload.name,
        userId: action.payload.userId,
        isAdmin: !!action.payload.isAdmin,
      }
      
    case loginUser:
      return{
        name: action.payload.name,
        token: action.payload.token,
        isAdmin: action.payload.isAdmin,
        // ready: action.payload.ready,
        userId: action.payload.userId,
        isAuth: true,
      }

    case logoutUser:
      return{
        name: null,
        token: null,
        isAdmin: false,
        // ready: false,
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