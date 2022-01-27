import React, { useState } from 'react'
import { Input } from '../../Components/input/Input'
import { PagesWrapping } from '../../hoc/PagesWrapping/PagesWrapping'
import { useHttp } from '../../hooks/http.hook'
import './RegisterPage.css'

function RegisterPage (props) {

    const {alertShowFunc} = props
    const {loading, request} = useHttp()  
    const [form, setForm] = useState({
        name: null, email: null, password: null,
    })


    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }


    const registerHandler = async () => {

        try {
            await request('/api/auth/register', 'POST', {...form})
            window.location.href = '/login'
        } catch (e) {
            alertShowFunc({show: true, type:'error', text:'Невдалося створити користувача'})
        }

    }

    return(
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
        )
}

export default PagesWrapping(RegisterPage, false)