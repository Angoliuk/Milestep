// const initialState = {
//     name: 'Dmytro'
// }
import userReducers from "./reducers/userReducers"
import companiesInfoReducers from "./reducers/companiesInfoReducers"
import tasksInfoReducers from "./reducers/tasksInfoReducers"

import { combineReducers } from "redux"

export default combineReducers({
    userReducers,
    companiesInfoReducers,
    tasksInfoReducers,
    
})
// export default function mainReducer(state = initialState, action) {
//     return state
// }