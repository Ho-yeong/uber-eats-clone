import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Restaurant } from "../pages/client/restaurants";
import {Header} from '../components/header'
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";


const ClientRoutes =
     [
        <Route path="/" exact key="Restaurant">
            <Restaurant />
        </Route>,
        <Route path="/confirm" exact key="ConfirmEmail">
            <ConfirmEmail />
        </Route>,
        <Route path="/edit-profile" exact key="EditProfile">
            <EditProfile />
        </Route>
    ]

export const LoggedInRouter = () => {

    const { data, loading, error } = useMe();
    
    if(!data || loading || error){
        return (
            <div className="h-screen flex justify-center items-center">
                <span className="font-medium text-xl tracking-wide">Loading...</span>
            </div>
        )
    }
    return (
        <Router>
            <Header />
            <Switch>
                {data.me.role === "Client" && ClientRoutes}
                {/* <Redirect to="/" /> */}
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </Router>
    )
}