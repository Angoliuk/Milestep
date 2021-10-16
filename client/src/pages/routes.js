
import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import { AuthPage } from './AuthPage'
import { CreatePage } from './CreatePage'
import { CompaniesPage } from './CompaniesPage'
import { WorkPage } from './Work'
import { EditPage } from './EditPage'

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
                <Redirect to="/create" />
            </Switch>
        )}

        return(
            <Switch>
                <Route path="/" exact>
                    <AuthPage />
                </Route>
                <Redirect to="/" />
            </Switch>
        )
}