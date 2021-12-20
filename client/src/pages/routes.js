
import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import AuthPage from './AuthPage/AuthPage'
import CreatePage from './CreatePage/CreatePage'
import CompaniesPage from './CompaniesPage/CompaniesPage'
import WorkPage from './WorkPage/WorkPage'
import EditPage from './EditPage/EditPage'
import StandartTasksPage from './StandartTasksPage/StandartTasksPage'
import HistoryPage from './HistoryPage/HistoryPage'
import StatPage from './StatPage/StatPage'
import { RegisterPage } from './RegisterPage/RegisterPage'
import { connect } from 'react-redux'
import LicensesPage from './LicensesPage/LicensesPage'

function Routes (props) {
    
    if(props.isAuth && props.isAdmin){
        return(
            <Switch>
                <Route path="/companies" exact>
                    <CompaniesPage />
                </Route>
                <Route path="/work" exact>
                    <WorkPage />
                </Route>
                <Route path="/edit/:id" exact>
                    <EditPage />
                </Route>
                <Route path="/standartTasks" exact>
                    <StandartTasksPage />
                </Route>
                <Route path="/history" exact>
                    <HistoryPage />
                </Route>
                <Route path="/statistics" exact>
                    <StatPage />
                </Route>
                <Route path="/licenses" exact>
                    <LicensesPage />
                </Route>
                <Route path="/create" exact>
                    <CreatePage />
                </Route>
                <Redirect to="/create" />
            </Switch>
        )}
    else if(props.isAuth){
        return(
            <Switch>
                <Route path="/companies" exact>
                    <CompaniesPage />
                </Route>
                <Route path="/work" exact>
                    <WorkPage />
                </Route>
                <Route path="/edit/:id" exact>
                    <EditPage />
                </Route>
                <Route path="/standartTasks" exact>
                    <StandartTasksPage />
                </Route>
                <Route path="/licenses" exact>
                    <LicensesPage />
                </Route>
                <Route path="/create" exact>
                    <CreatePage />
                </Route>
                <Redirect to="/create" />
            </Switch>
        )
    }
    

    return(
        <Switch>
            <Route path="/login" exact>
                <AuthPage />
            </Route>
            <Route path="/register" exact>
                <RegisterPage />
            </Route>
            <Redirect to="/login" />
        </Switch>
    )
}

function mapStateToProps(state) {
    return{
        isAdmin: state.userReducers.isAdmin,
        isAuth: state.userReducers.isAuth,
    }
}

export default connect(mapStateToProps)(Routes)