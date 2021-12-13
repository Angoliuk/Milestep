import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './pages/routes';
import './App.css';
import { connect } from 'react-redux';
// import userInfoChange from './reduxStorage/reducers/userInfo';
// import {actionUserInfo} from './reduxStorage/actions/actions';
// import { userInfo } from './reduxStorage/actions/actionTypes';

function App(props) {

  return (
    // <AuthContext.Provider value={{
    //   name, token, login, logout, userId, isAuth, isAdmin
    // }}>
      <div className="App">
        <Router>
          <Routes />
        </Router>
      </div>
  //   </AuthContext.Provider>
  );
}

function mapStateToProps(state) {
  return{
      // name: state.counter1,
  }
}

function mapDispatchToProps(dispatch) {
  return{
    // setName: ()=>dispatch({type: 'ADD'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
