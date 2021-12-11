// const initialState = {
//     name: 'Dmytro'
// }
import userInfo from "./reducers/userInfo"
import workPageReducers from "./reducers/workPageReducers"

import { combineReducers } from "redux"

export default combineReducers({
    userInfo,
    workPageReducers,
    
})
// export default function mainReducer(state = initialState, action) {
//     return state
// }