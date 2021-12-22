import { connect } from 'react-redux'
import React, {  useState  } from 'react'
import { useHttp } from '../../hooks/http.hook'
import './AuthPage.css'
import { login } from '../../reduxStorage/actions/user'
import { Input } from '../../Components/input/Input'
import { PagesWrapping } from '../../hoc/PagesWrapping/PagesWrapping'

function AuthPage (props) {

    const {request} = useHttp()  
    const {alertShowFunc} = props
    const [form, setForm] = useState({
        email: undefined, password: undefined,
    })


    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }


    const loginHandler = async () => {

        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            props.login({name: data.name, isAdmin: data.isAdmin, userId: data.userId })
        } catch (e) {
            alertShowFunc({show: true, type:'error', text:'Невдалося увійти до акаунту'})
        }

    }

    return(
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

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapping(AuthPage, false))