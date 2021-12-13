import { standartTasks } from "../actions/actionTypes"


const initialState = {
    standartTasks: [],
}

export default function tasksInfoReducers(state=initialState, action){
    switch (action.type) {
        case standartTasks:
            return{
                ...state,
                standartTasks: action.payload
            }
    
        default:
            return state
    }
}