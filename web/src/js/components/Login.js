import React, {Component} from 'react';
import Form from "./glui/form/Form";
import Input from "./glui/form/Input";
import {connectUser, userConnected} from "../actions/userAction";
import Identification from "../../../../API/Identification";



export const Login = (props) => {
    return (
        <div>
            <div className="scrib-login">
                <Form vertical action="#" method="post" submit="Login"
                onSubmit={values => props.dispatch(dispatch => {
                    dispatch(connectUser(values));
                    //TODO: API CALL
                    var name=this.ids.username.value;
                    var password=this.ids.password.value;

                    Identification.postIdentification(name,password);

                    dispatch(userConnected());
                })}>
                    <Input id="username" label="Email Adress" required/>
                    <Input id="password" type="password" label="Password" required/>
                </Form>
            </div>
        </div>
    );
};
