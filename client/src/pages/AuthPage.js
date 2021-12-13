import { connect } from 'react-redux'
import React, {  useState  } from 'react'
import { LoginRegisterNavBar } from '../Components/LoginRegisterNavBar'
import { useHttp } from '../hooks/http.hook'
import './pages.css'
import { login } from '../reduxStorage/actions/user'

function AuthPage (props) {

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
            props.login({name: data.name, token: data.token, isAdmin: data.isAdmin, userId: data.userId })
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