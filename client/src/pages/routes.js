
import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import { AuthPage } from './AuthPage'
import { CreatePage } from './CreatePage'
import { EventsPage } from './EventsPage'

export const useRoutes = isAuth => {
    if(isAuth){
        return(
            <Switch>
                <Route path="/event" exact>
                    <EventsPage />
                </Route>
                <Route path="/create" exact>
                    <CreatePage />
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