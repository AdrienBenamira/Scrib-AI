import React, {Component} from 'react';
import Form from "./glui/form/Form";
import Input from "./glui/form/Input";
import {connectUser, userConnected} from "../actions/userAction";

export const Login = (props) => {
    return (
        <div>
            <div className="scrib-login">
                <Form vertical action="#" method="post" submit="Login"
                onSubmit={values => props.dispatch(dispatch => {
                    dispatch(connectUser(values));
                    //TODO: API CALL
                    dispatch(userConnected());
                })}>
                    <Input id="username" label="Email Adress" required/>
                    <Input id="password" label="Password" required/>
                </Form>
            </div>
        </div>
    );
};
