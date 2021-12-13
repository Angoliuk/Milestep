import { history, list} from "../actions/actionTypes"


const initialState = {
    list: [],
    history: [],
}

export default function companiesInfoReducers(state=initialState, action) {
    switch (action.type) {
        case list:
            return{
                ...state,
                list: action.payload,
            }

        case history:
            return{
                ...state,
                history: action.payload,
            }

        default:
            return state
    }
}