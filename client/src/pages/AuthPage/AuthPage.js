import { connect } from 'react-redux'
import React, {  useState  } from 'react'
import { LoginRegisterNavBar } from '../../Components/LoginRegisterNavBar/LoginRegisterNavBar'
import { useHttp } from '../../hooks/http.hook'
import './AuthPage.css'
import { login } from '../../reduxStorage/actions/user'
import { Input } from '../../Components/input/Input'

function AuthPage (props) {

    const {loading, request} = useHttp()  
    const [form, setForm] = useState({
        email:'', password:'',
    })


    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
        console.log(form)
        console.log(event.target.name)
    }


    const loginHandler = async () => {

        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            props.login({name: data.name, isAdmin: data.isAdmin, userId: data.userId })
        } catch (e) {
            alert("wrong data")
        }

    }

    return(
        <div className="container">
            <LoginRegisterNavBar />
            <div className="loginInputBlock">
                <div>
                    <h1>Вхід в акаунт</h1>
                    <Input name='email' onChange={changeHandler} type='email' htmlFor='Email' />
                    <Input name='password' onChange={changeHandler} type='password' htmlFor='Password' />
                    <div>
                        <button onClick={loginHandler}>Увійти</button>
                    </div>
                </div>
            </div>
        </div>
        )
}

function mapStateToProps(state) {
    return{

    }
}

function mapDispatchToProps(dispatch) {
    return{
        login: (userInfo) => dispatch(login(userInfo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage)