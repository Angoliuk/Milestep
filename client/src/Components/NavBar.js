import { useContext } from 'react'
import {NavLink} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './components.css';

export const NavBar = () => {
    const {name, logout} = useContext(AuthContext)
    return(
        <div className="container-nav">
            <p className="name">EventCalendar</p>
            <NavLink className="nav-elem" to="/create">Create new event</NavLink>
            <NavLink className="nav-elem" to="/work">Work for today</NavLink>
            <NavLink className="nav-elem" to="/companies">All your companies</NavLink>
            <p className="name">{name}</p>
            <button className="nav-button" onClick={logout}>logout</button>
        </div>
    )
}