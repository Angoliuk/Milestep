import { BrowserRouter as Router } from 'react-router-dom';
import { useRoutes } from './pages/routes';
import './App.css';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import { Loader } from './Components/Loader.js'
import { connect } from 'react-redux';
// import userInfoChange from './reduxStorage/reducers/userInfo';
// import {actionUserInfo} from './reduxStorage/actions/actions';
// import { userInfo } from './reduxStorage/actions/actionTypes';

function App(props) {
  const {name, token, login, logout, userId, ready, isAdmin} = useAuth()
  const isAuth = !!token
  const routes = useRoutes(isAuth, isAdmin)

  if (!ready) {
    return <Loader />
  }

  return (
    <AuthContext.Provider value={{
      name, token, login, logout, userId, isAuth, isAdmin
    }}>
      <div className="App">
        <Router>
          {routes}
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

function mapStateToProps(state) {
  return{
      name: state.counter1,
  }
}

function mapDispatchToProps(dispatch) {
  return{
    // setName: ()=>dispatch({type: 'ADD'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
