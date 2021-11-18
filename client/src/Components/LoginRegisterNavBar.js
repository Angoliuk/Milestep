import {NavLink} from 'react-router-dom'
import './components.css';

export const LoginRegisterNavBar = () => {
    
    return(
        <div className="container-nav">
            <nav>
                <NavLink className="nav-elem" to="/login">Логін</NavLink>
                <NavLink className="nav-elem" to="/register">Реєстрація</NavLink>
            </nav>
        </div>
    )
}