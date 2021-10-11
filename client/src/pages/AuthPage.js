import React, {  useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'

export const AuthPage = () => {

    const auth = useContext(AuthContext)
    const {loading, request} = useHttp()  
    const [form, setForm] = useState({
        name:'', email:'', password:'',
    })


    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            alert('succesfully registered')
        } catch (e) {
            alert("wrong data")
        }
    }
    const loginHandler = async () => {
        console.log(1)
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            console.log('login button', data.name)
            auth.login(data.name, data.token, data.userId)
        } catch (e) {
            alert("wrong data")
        }
    }
    return(
        <div className="main-block">
            <h1>AuthPage</h1>
            <div>
                <div>
                    <input id="name" name="name" onChange={changeHandler}/>
                    <label htmlFor="name">name</label>
                </div>
                <div>
                    <input id="Email" name="email" onChange={changeHandler}/>
                    <label htmlFor="Email">Email</label>
                </div>
                <div>
                    <input id="Password" name="password" onChange={changeHandler}/>
                    <label htmlFor="Password">Password</label>
                </div>
                <div>
                    <button onClick={loginHandler} disabled={loading}>Login</button>
                    <button onClick={registerHandler} disabled={loading}>Register</button>
                </div>
            </div>
        </div>
        )
}