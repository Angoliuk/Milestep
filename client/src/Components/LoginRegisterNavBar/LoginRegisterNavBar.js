import {NavLink} from 'react-router-dom'
import './LoginRegisterNavBar.css';

export const LoginRegisterNavBar = () => {
    
    return(
        <nav className='navLoginRegister'>
            <NavLink className="navElemLoginRegister" to="/login">Логін</NavLink>
            <NavLink className="navElemLoginRegister" to="/register">Реєстрація</NavLink>
        </nav>
    )
}