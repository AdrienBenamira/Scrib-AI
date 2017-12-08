import React from 'react';
import Form from "../glui/form/Form";
import Input from "../glui/form/Input";
import axios from 'axios';
import {config} from '../../config/default';
import {connectionFailed, connectUser, userConnected} from "../../actions/userActions";
import Message from "../glui/messages/Message";
import * as Cookies from 'js-cookie';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Accept'] = 'application/json';

export const Login = (props) => {
    return (
        <div>
            {props.failed ? (
                <Message error timer={10}>
                    Your login or password is incorrect.
                </Message>
            ) : null}
            <div className="scrib-login">
                <Form vertical action="#" method="post" submit="Login"
                      onSubmit={values => props.dispatch(dispatch => {
                          dispatch(connectUser());
                          const url = config.api.host + '/user/login';
                          axios.get(url, {auth: {
                              username: values.username, password: values.password
                          }}).then((res) => {
                              // Set the remember token cookie
                              Cookies.set('remember', {username: values.username, token: res.data.token}, {
                                  expires: 15 //days
                              });
                              dispatch(userConnected(values));
                          }).catch((err) => {
                              console.log(err);
                              dispatch(connectionFailed())
                          });
                      })}>
                    <Input id="username" autofocus label="Username" error={props.failed} required/>
                    <Input id="password" type="password" error={props.failed} label="Password" required/>
                </Form>
            </div>
        </div>
    );
};
