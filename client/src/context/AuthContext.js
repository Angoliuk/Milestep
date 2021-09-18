import { createContext } from "react";

function noop(params) {
    
}

export const AuthContext = createContext(
    {
        token: null,
        userId: null,
        login: noop,
        logout: noop,
        isAuth: false
    }
)