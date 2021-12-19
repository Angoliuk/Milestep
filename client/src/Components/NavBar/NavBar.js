import { connect } from 'react-redux';
import {NavLink} from 'react-router-dom'
import { logout } from '../../reduxStorage/actions/user';
import './NavBar.css';

function NavBar (props) {

    if (props.isAdmin) {
        return( 
            <nav className='navNavBar'>
                <NavLink className="navElemNavBar" to="/standartTasks">Стандартні завдання</NavLink>
                <NavLink className="navElemNavBar" to="/create">Нова компанія</NavLink>
                <NavLink className="navElemNavBar" to="/work">Завдання</NavLink>
                <NavLink className="navElemNavBar" to="/companies">Всі компанії</NavLink>
                <NavLink className="navElemNavBar" to="/history">Історія</NavLink>
                <NavLink className="navElemNavBar" to="/statistics">Статистика</NavLink>
                <NavLink className="navElemNavBar" to="/licenses">Ліцензії</NavLink>
                <p className="nameNavBar">{props.name}</p>
                <button onClick={(() => props.logout())}>logout</button>
            </nav>
        )
    }else{
        return(
            <nav className='navNavBar'>
                <NavLink className="navElemNavBar" to="/standartTasks">Стандартні завдання</NavLink>
                <NavLink className="navElemNavBar" to="/create">Нова компанія</NavLink>
                <NavLink className="navElemNavBar" to="/work">Завдання</NavLink>
                <NavLink className="navElemNavBar" to="/companies">Всі компанії</NavLink>
                <p className="nameNavBar">{props.name}</p>
                <button onClick={() => props.logout()}>logout</button>
            </nav>
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