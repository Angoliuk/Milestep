import {setInfoAboutUser} from '../actions/actionTypes';

const initialState = {
  name: '',
  userId: '',
  isAdmin: false,
  token: null,
  ready: false,
}

export default function userInfo(state = initialState, action) {
  switch(action.type) {
    case setInfoAboutUser:
      return {
        name: action.payload.name,
        userId: action.payload.userId,
        isAdmin: !!action.payloaad.isAdmin,
      }
    default:
      return state
  }
}