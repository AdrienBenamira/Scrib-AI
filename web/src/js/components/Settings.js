import React from 'react';
import axios from 'axios';
import {Panel} from "./glui/ui/Panel";
import Form from "./glui/form/Form";
import Input from "./glui/form/Input";
import {config} from "../config/default";
import Message from "./glui/messages/Message";

export default class Settings extends React.Component {
    constructor() {
        super();
        this.state = {
            passwordRepeatCorrect: true,
            userAdded: false
        };
    }

    render() {
        return (
            <div>
                <h1><span className="oi" data-glyph="wrench"/> Settings </h1>
                {!this.state.passwordRepeatCorrect ? (
                    <Message timer={10} error>The passwords do not match.</Message>
                ): null}
                {this.state.userAdded ? (
                    <Message timer={10} success>The user has successfully been added.</Message>
                ): null}
                <Panel dark title={
                    <div><span className="oi" data-glyph="person"/> Add a new user</div>}>
                    <Form submit={
                        <div>
                            <span className="oi" data-glyph="plus"/>
                            Add
                        </div>
                    } onSubmit={(values) => {
                        if(values.password !== values.password_repeat) this.setState({passwordRepeatCorrect: false});
                        else {
                            this.setState({passwordRepeatCorrect: true});
                            axios.post(config.api.host + '/user', {
                                username: values.username,
                                password: values.password
                            }, {auth: {
                                username: this.props.user.username,
                                password: this.props.user.password
                            }}).then(res => {
                                this.setState({userAdded: true});
                            });
                        }
                    }} vertical>
                        <Input id="username" label="Username" required/>
                        <Input id="password" type="password" label="Password" required/>
                        <Input id="password_repeat" type="password" label="Repeat Password" required/>
                    </Form>
                </Panel>
            </div>
        );
    }
}
