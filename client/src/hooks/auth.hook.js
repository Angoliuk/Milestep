import { useState, useCallback, useEffect} from "react"

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [name, setName] = useState(null)
    const [ready, setReady] = useState(false)
    const [userId, setuserId] = useState(null)

    const login = useCallback((name, jwtToken, id) => {
        setToken(jwtToken)
        setuserId(id)
        console.log(name)
        setName(name)
        localStorage.setItem('userData', JSON.stringify({name: name, userId: id, token: jwtToken}))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setuserId(null)
        setName(null)
        localStorage.removeItem('userData')
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('userData'))

        if (data && data.token) {
            login(data.name, data.token, data.userId)
        }
        setReady(true)
    }, [login])

    return {name, login, logout, token, userId, ready}
}