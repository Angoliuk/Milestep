import { useContext } from 'react'
import {NavLink} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './components.css';

export const NavBar = () => {
    const {logout} = useContext(AuthContext)
    return(
        <div className="container-nav">
            <p className="name">EventCalendar</p>
            <NavLink className="nav-elem" to="/create">Create new event</NavLink>
            <NavLink className="nav-elem" to="/event">All your events</NavLink>
            <button className="nav-button" onClick={logout}>logout</button>
        </div>
    )
}