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
            fetchedUsers: [],
            fetchedWorkers: []
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

    handleDeleteWorkerClick(e, name) {
        e.preventDefault();
        axios.delete(config.api.host + '/user/worker?name=' + name, {
            auth: {
                username: this.props.user.username, password: this.props.user.password
            }}).then(res => {
            let workers = this.state.fetchedWorkers;
            workers = workers.filter((worker) => worker.name !== name);
            this.setState({fetchedWorkers: workers});
        }).catch(err => {
        });
    }

    fetchWorkers() {
        axios.get(config.api.host + '/user/workers', {
            auth: {
                username: this.props.user.username, password: this.props.user.password
            }
        }).then(res => {
            this.setState({
                fetchedWorkers: res.data.map(worker => {return {name: worker.name, status: worker.status}})
            });
        });
    }

    fetchUsers() {
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

    componentWillMount() {
        this.props.socket.on('workerAdded', () => {
            this.fetchWorkers();
        });
        this.props.socket.on('workerRemoved', () => {
            this.fetchWorkers();
        });
        this.fetchUsers();
        this.fetchWorkers();
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
                <h2>Users</h2>
                <Table headers={ ['Username', 'Delete'] } data={ this.state.fetchedUsers.map(user => {
                    return [
                        user.username,
                        <button onClick={(e) => this.handleDeleteClick(e, user.username)} className="btn error small">
                            <span className="oi" data-glyph="x" />
                        </button>
                    ];
                }) }/>

                <Panel dark title={ <div><span className="oi" data-glyph="person"/> Add a new worker</div> }>
                    <Form submit={ <div>
                        <span className="oi" data-glyph="plus"/>
                        Add
                    </div> } onSubmit={ (values) => {
                        this.props.dispatch(userAction.addUser());
                        if (values.password !== values.password_repeat) this.props.dispatch(userAction.signupFailed('The passwords don\'t match.')); else {
                            axios.post(config.api.host + '/user/worker', {
                                name: values.name, password: values.password
                            }, {
                                auth: {
                                    username: this.props.user.username, password: this.props.user.password
                                }
                            }).then(res => {
                                let workers = this.state.fetchedWorkers;
                                workers.push({name: values.name});
                                this.setState({fetchedWorkers: workers});
                            });
                        }
                    } } vertical>
                        <Input id="name" label="Name" required/>
                        <Input id="password" type="password" label="Password" required/>
                        <Input id="password_repeat" type="password" label="Repeat Password" required/>
                    </Form>
                </Panel>
                <h2>Workers</h2>
                <Table headers={ ['Name', 'Delete', 'Status'] } data={ this.state.fetchedWorkers.map(worker => {
                    return [
                        worker.name,
                        <button onClick={(e) => this.handleDeleteWorkerClick(e, worker.name)} className="btn error small">
                            <span className="oi" data-glyph="x" />
                        </button>,
                        worker.status ?
                            (<span className="scrib-badge success"><span className="oi" data-glyph="check"/> ON</span>)
                            : (<span className="scrib-badge error"><span className="oi" data-glyph="x"/> OFF</span> )
                    ];
                }) }/>
            </div>
        );
    }
}
