import { useContext } from 'react'
import {NavLink} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './components.css';

export const NavBar = () => {
    
    const {name, logout} = useContext(AuthContext)
    
    return(
        <div className="container-nav">
            <nav>
                <NavLink className="nav-elem" to="/standartTasks">Стандартні завдання</NavLink>
                <NavLink className="nav-elem" to="/create">Нова компанія</NavLink>
                <NavLink className="nav-elem" to="/work">Завдання</NavLink>
                <NavLink className="nav-elem" to="/companies">Всі компанії</NavLink>
                <NavLink className="nav-elem" to="/history">Історія</NavLink>
                <NavLink className="nav-elem" to="/statistics">Статистика</NavLink>
                <p className="name">{name}</p>
                <button className="nav-button" onClick={logout}>logout</button>
            </nav>
        </div>
    )
}