import React from 'react';
import axios from 'axios';
import { Panel } from './glui/ui/Panel';
import Form from './glui/form/Form';
import Input from './glui/form/Input';
import { config } from '../config/default';
import * as userAction from '../actions/userActions';
import Table from './glui/table/Table';


export default class Settings extends React.Component
{
    constructor() {
        super();

        this.state = {
            fetchedUsers: []
        };

        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    handleDeleteClick(e, username) {
        e.preventDefault();
        axios.delete(config.api.host + '/user?username=' + username, {
        auth: {
            username: this.props.user.username, password: this.props.user.password
        }}).then(res => {
            let users = this.state.fetchedUsers;
            users = users.filter((user) => user.username !== username);
            this.setState({fetchedUsers: users});
        }).catch(err => {
            //TODO
        });
    }

    componentWillMount() {
        axios.get(config.api.host + '/users', {
            auth: {
                username: this.props.user.username, password: this.props.user.password
            }
        }).then(res => {
            this.setState({
                fetchedUsers: res.data.map(user => {return {username: user.username}})
            });
        });
    }

    render() {
        return (
            <div>
                <h1><span className="oi" data-glyph="wrench"/> Settings </h1>
                <Panel dark title={ <div><span className="oi" data-glyph="person"/> Add a new user</div> }>
                    <Form submit={ <div>
                        <span className="oi" data-glyph="plus"/>
                        Add
                    </div> } onSubmit={ (values) => {
                        this.props.dispatch(userAction.addUser());
                        if (values.password !== values.password_repeat) this.props.dispatch(userAction.signupFailed('The passwords don\'t match.')); else {
                            axios.post(config.api.host + '/user', {
                                username: values.username, password: values.password
                            }, {
                                auth: {
                                    username: this.props.user.username, password: this.props.user.password
                                }
                            }).then(res => {
                                this.props.dispatch(userAction.userAdded());
                                let users = this.state.fetchedUsers;
                                users.push({username: values.username});
                                this.setState({fetchedUsers: users});
                            }).catch(err => {
                                this.props.dispatch(userAction.signupFailed('An error has occured.'));
                            });
                        }
                    } } vertical>
                        <Input id="username" label="Username" required/>
                        <Input id="password" type="password" label="Password" required/>
                        <Input id="password_repeat" type="password" label="Repeat Password" required/>
                    </Form>
                </Panel>

                <Table headers={ ['Username', 'Actions'] } data={ this.state.fetchedUsers.map(user => {
                    return [
                        user.username,
                        <button onClick={(e) => this.handleDeleteClick(e, user.username)} className="btn error small">
                            <span className="oi" data-glyph="x" />
                        </button>
                    ];
                }) }/>

            </div>
        );
    }
}
