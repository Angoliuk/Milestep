// const initialState = {
//     name: 'Dmytro'
// }
import userInfo from "./reducers/userInfo"
import companiesInfoReducers from "./reducers/companiesInfoReducers"
import tasksInfoReducers from "./reducers/tasksInfoReducers"

import { combineReducers } from "redux"

export default combineReducers({
    userInfo,
    companiesInfoReducers,
    tasksInfoReducers,
    
})
// export default function mainReducer(state = initialState, action) {
//     return state
// }