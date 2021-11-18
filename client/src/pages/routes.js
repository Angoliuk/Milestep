
import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import { AuthPage } from './AuthPage'
import { CreatePage } from './CreatePage'
import { CompaniesPage } from './CompaniesPage'
import { WorkPage } from './WorkPage'
import { EditPage } from './EditPage'
import { StandartTasksPage } from './StandartTasksPage'
import { HistoryPage } from './HistoryPage'
import { StatPage } from './StatPage'
import { RegisterPage } from './RegisterPage'

export const useRoutes = isAuth => {
    if(isAuth){
        return(
            <Switch>
                <Route path="/companies" exact>
                    <CompaniesPage />
                </Route>
                <Route path="/work" exact>
                    <WorkPage />
                </Route>
                <Route path="/create" exact>
                    <CreatePage />
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
                <Redirect to="/create" />
            </Switch>
        )}

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