import React from "react"
import { Switch, Redirect,Route } from "react-router-dom"
import { Login } from "views/Login"
import {ResetPassword} from "views/ResetPassword"
import { DashboardRoute } from "views/DashboardRoute"
import {PublicRoute} from "components/PublicRoute"
import {SignUpUser} from "components/Forms"



const MainRouter = () => {
    
    return (
        <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/reset" component={ResetPassword} />
            <Route exact path="/signup/member" component={SignUpUser} />
            <PublicRoute path="/church/:churchId" component={DashboardRoute} />
            <Route render={() => <Redirect to="/login" />} />
        </Switch>
    )
}


export default MainRouter