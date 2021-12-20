import React, { useState } from 'react'
import { Input } from '../../Components/input/Input'
import { LoginRegisterNavBar } from '../../Components/LoginRegisterNavBar/LoginRegisterNavBar'
import { useHttp } from '../../hooks/http.hook'
import './RegisterPage.css'

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
            <div className="registerInputBlock">
                <div>
                    <h1>Реєстрація</h1>
                    <form autoComplete='off'>

                        <Input 
                            name='name' 
                            onChange={changeHandler} 
                            value={form.name} 
                            htmlFor="Ім'я"
                        />

                        <Input 
                            name='email' 
                            onChange={changeHandler} 
                            value={form.email} 
                            htmlFor='Email'
                            type="email"
                        />

                        <Input 
                            name='password' 
                            onChange={changeHandler} 
                            value={form.password} 
                            htmlFor='Пароль'
                            type="password"
                        />

                    </form>
                    
                    <div>
                        <button onClick={registerHandler} disabled={loading}>Реєстрація</button>
                    </div>
                </div>
            </div>
        </div>
        )
}