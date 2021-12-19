import { companyLicenses, history, list, usersList} from "../actions/actionTypes"


const initialState = {
    list: [],
    history: [],
    licenses: [],
    users: [],
}

export default function companiesInfoReducers(state=initialState, action) {
    switch (action.type) {
        case list:
            return{
                ...state,
                list: action.payload,
            }

        case usersList:
            return{
                ...state,
                users: action.payload,
            }

        case history:
            return{
                ...state,
                history: action.payload,
            }
        case companyLicenses:
            return{
                ...state,
                licenses: action.payload
            }

        default:
            return state
    }
}