import {loginUser, logoutUser, setInfoAboutUser} from './actionTypes'

export function setUser() {
    return {
      type: setInfoAboutUser,
    }
  }

export function login(userInfo) {
    return{
        type: loginUser,
        payload: userInfo,
    }
}

export function logout() {
    return{
        type: logoutUser,
    }
}

