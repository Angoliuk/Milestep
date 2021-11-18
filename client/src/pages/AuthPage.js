import React, {  useState, useContext } from 'react'
import { LoginRegisterNavBar } from '../Components/LoginRegisterNavBar'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import './pages.css'

export const AuthPage = () => {

    const auth = useContext(AuthContext)
    const {loading, request} = useHttp()  
    const [form, setForm] = useState({
        email:'', password:'',
    })


    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }


    const loginHandler = async () => {

        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            console.log(data)
            auth.login(data.name, data.token, data.userId, data.isAdmin)
        } catch (e) {
            alert("wrong data")
        }

    }


    return(
        <div className="container">
            <LoginRegisterNavBar />
            <div className="loginRegisterInputBlock">
                <div>
                    <h1>Вхід в акаунт</h1>
                    <div>
                        <input id="Email" name="email" onChange={changeHandler} type="email"/>
                        <label htmlFor="Email">Email</label>
                    </div>
                    <div>
                        <input id="Password" name="password" onChange={changeHandler} type="password"/>
                        <label htmlFor="Password">Пароль</label>
                    </div>
                    <div>
                        <button onClick={loginHandler} disabled={loading}>Увійти</button>
                    </div>
                </div>
            </div>
        </div>
        )
}