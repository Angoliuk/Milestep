import React, { useState } from 'react'
import { LoginRegisterNavBar } from '../Components/LoginRegisterNavBar'
import { useHttp } from '../hooks/http.hook'
import './pages.css'

export const RegisterPage = () => {

    const {loading, request} = useHttp()  
    const [form, setForm] = useState({
        name: '', email:'', password:'',
    })


    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }


    const registerHandler = async () => {

        try {
            await request('/api/auth/register', 'POST', {...form})
            alert('succesfully registered')
            window.location.href = '/login'

        } catch (e) {
            alert("wrong data")
        }

    }

    return(
        <div className="container">
            <LoginRegisterNavBar />
            <div className="loginRegisterInputBlock">
                <div>
                    <h1>Реєстрація</h1>
                    <div>
                        <input id="name" name="name" onChange={changeHandler} autoComplete="off"/>
                        <label htmlFor="name">Ім'я</label>
                    </div>
                    <div>
                        <input id="Email" name="email" onChange={changeHandler} type="email"/>
                        <label htmlFor="Email">Email</label>
                    </div>
                    <div>
                        <input id="Password" name="password" onChange={changeHandler} type="password"/>
                        <label htmlFor="Password">Пароль</label>
                    </div>
                    <div>
                        <button onClick={registerHandler} disabled={loading}>Реєстрація</button>
                    </div>
                </div>
            </div>
        </div>
        )
}