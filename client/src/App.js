import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './pages/routes';
import './App.css';
import { connect } from 'react-redux';
import { autoLogin } from './reduxStorage/actions/user';
import { useEffect } from 'react';

function App(props) {

  useEffect(() => {
    props.autoLogin()
  })

  return (
      <div className="App">
        <Router>
          <Routes />
        </Router>
      </div>
  );
}

function mapStateToProps(state) {
  return{
  }
}

function mapDispatchToProps(dispatch) {
  return{
    autoLogin: () => dispatch(autoLogin())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
