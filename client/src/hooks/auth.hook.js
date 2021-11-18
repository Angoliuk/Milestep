import { useState, useCallback, useEffect} from "react"

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [name, setName] = useState(null)
    const [ready, setReady] = useState(false)
    const [userId, setuserId] = useState(null)
    const [isAdmin, setIsAdmin] = useState(null)

    const login = useCallback((name, jwtToken, id, isAdmin) => {
        setToken(jwtToken)
        setuserId(id)
        setName(name)
        setIsAdmin(isAdmin)
        localStorage.setItem('userData', JSON.stringify({name: name, userId: id, token: jwtToken, isAdmin: isAdmin}))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setuserId(null)
        setName(null)
        setIsAdmin(null)
        localStorage.removeItem('userData')
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('userData'))

        if (data && data.token) {
            login(data.name, data.token, data.userId)
        }
        setReady(true)
    }, [login])

    return {name, login, logout, token, userId, ready, isAdmin}
}