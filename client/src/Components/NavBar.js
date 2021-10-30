import { useContext } from 'react'
import {NavLink} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './components.css';

export const NavBar = () => {
    const {name, logout} = useContext(AuthContext)
    return(
        <div className="container-nav">
            {/* <p className="name">EventCalendar</p> */}
            <nav>
                <NavLink className="nav-elem" to="/create">Додати нову компанію</NavLink>
                <NavLink className="nav-elem" to="/work">Завдання</NavLink>
                <NavLink className="nav-elem" to="/companies">Список всіх компаній</NavLink>
                <p className="name">{name}</p>
                <button className="nav-button" onClick={logout}>logout</button>
            </nav>
        </div>
    )
}