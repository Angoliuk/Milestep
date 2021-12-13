import { connect } from 'react-redux';
import {NavLink} from 'react-router-dom'
import { logout } from '../reduxStorage/actions/user';
import './components.css';

function NavBar (props) {

    if (props.isAdmin) {
        return( 
            <div className="container-nav">
                <nav>
                    <NavLink className="nav-elem" to="/standartTasks">Стандартні завдання</NavLink>
                    <NavLink className="nav-elem" to="/create">Нова компанія</NavLink>
                    <NavLink className="nav-elem" to="/work">Завдання</NavLink>
                    <NavLink className="nav-elem" to="/companies">Всі компанії</NavLink>
                    <NavLink className="nav-elem" to="/history">Історія</NavLink>
                    <NavLink className="nav-elem" to="/statistics">Статистика</NavLink>
                    <p className="name">{props.name}</p>
                    <button className="nav-button" onClick={(logout => props.logout())}>logout</button>
                </nav>
            </div>
        )
    }else{
        return(
            <div className="container-nav">
                <nav>
                    <NavLink className="nav-elem" to="/standartTasks">Стандартні завдання</NavLink>
                    <NavLink className="nav-elem" to="/create">Нова компанія</NavLink>
                    <NavLink className="nav-elem" to="/work">Завдання</NavLink>
                    <NavLink className="nav-elem" to="/companies">Всі компанії</NavLink>
                    <p className="name">{props.name}</p>
                    <button className="nav-button" onClick={() => props.logout()}>logout</button>
                </nav>
            </div>
        )
    }
    
}

function mapStateToProps(state) {
    return{
        name: state.userReducers.name,
        isAdmin: state.userReducers.isAdmin,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        logout: () => dispatch(logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)