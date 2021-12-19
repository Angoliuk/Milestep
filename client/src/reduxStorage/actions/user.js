import {loginUser, logoutUser} from './actionTypes'

export function autoLogin() {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('userData'))
    if (!!userFromLocalStorage && !!userFromLocalStorage.userId) {
        return{
            type: loginUser,
            payload: userFromLocalStorage
        }
    }
    else{
        return{
            type: logoutUser
        }
    }
}

export function login(userInfo) {
    localStorage.setItem('userData', JSON.stringify(userInfo))
    console.log(userInfo)
    return{
        type: loginUser,
        payload: userInfo,
    }
}

export function logout() {
    localStorage.removeItem('userData')
    return{
        type: logoutUser,
    }
}

