import { numOfDays, searchCompanyName, searchTaskName, list, standartTasks } from "../actions/actionTypes"


const initialState = {
    list: [],
    standartTasks: [],
    numOfDays: 5,
    searchCompanyName: '',
    searchTaskName: '',
}

export default function workPageReducers(state=initialState, action) {
    switch (action.type) {
        case list:
            return{
                ...state,
                list: action.payload,
            }

        case numOfDays:
            return{
                ...state,
                numOfDays: action.payload,
            }
    
        case searchTaskName:
            return {
                ...state,
                searchTaskName: action.payload,
            }

        case searchCompanyName:
            return{
                ...state,
                searchCompanyName: action.payload,
            }

        case standartTasks:
            return{
                ...state,
                standartTasks: action.payload,
            }

        default:
            return state
    }
}