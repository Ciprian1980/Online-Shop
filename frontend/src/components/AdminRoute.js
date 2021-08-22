import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect } from 'react-router-dom';

export default function AdminRoute({component: Component, ...rest}) {
    //getting the user info
    const userSignin = useSelector((state) => state.userSignin);
    const {userInfo} = userSignin;
    return (
        <Route
            {...rest}
            render={(props) => 
            userInfo  && userInfo.isAdmin ? (
                    <Component {...props}></Component>
                ) : (
                    <Redirect to="/signin"></Redirect>
                )
            } 
        ></Route>
    )
}
