import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Cookies from 'js-cookie';
import io from 'socket.io-client';
import axios from 'axios';
import Message from './glui/messages/Message';
import * as user from '../actions/userActions';
import { config } from '../config/default';
import SwitcherClass from './glui/switchers/SwitcherClass';
import Notifications from './Tools/Notifications';
import * as textAction from '../actions/textActions';
import * as workerActions from '../actions/workersActions';
import { Routes } from './Tools/Routes';


@withRouter
@connect(state => state)
export default class App extends Component
{
    constructor() {
        super();
        this.socket = io.connect();
    }

    componentDidMount() {
        // Wait for response
        this.socket.on('responseTask', data => {
            console.log(data);
            if (!data.error)
                this.props.dispatch(textAction.summarizationFullfiled(data.response));
            else if (data.message !== undefined)
                this.props.dispatch(textAction.summarizationFailed(data.message));
            else
                this.props.dispatch(textAction.summarizationFailed('An error has occured... Please try again.'));
        });
        // Summarize from URL
        this.socket.on('responseTaskUrl', data => {
            if (!data.error)
                this.props.dispatch(textAction.summarizationFullfiledFromURL(data.response));
            else if (data.message !== undefined)
                this.props.dispatch(textAction.summarizationFailed(data.message));
            else
                this.props.dispatch(textAction.summarizationFailed('An error has occured... Please try again.'));
        });
        // A worker is added
        this.socket.on('workerAdded', () => {
            this.props.dispatch(workerActions.addWorker());
        });
        // A worker is removed
        this.socket.on('workerRemoved', () => {
            this.props.dispatch(workerActions.removeWorker());
        });
    }

    componentWillMount() {
        // Fetch login in cookie
        if (!this.props.user.connected) {
            const rememberToken = Cookies.getJSON('remember');

            if (rememberToken !== undefined) {
                this.props.dispatch(dispatch => {
                    dispatch(user.connectUser());
                    const url = config.api.host + '/user/login';
                    const authInfo = { username: rememberToken.username, password: rememberToken.token };
                    axios.get(url, { auth: authInfo }).then((res) => {
                        // Update cookie
                        Cookies.set('remember', { username: rememberToken.username, token: res.data.token }, {
                            expires: 15 //days
                        });
                        dispatch(user.userConnected({ ...authInfo, password: res.data.token }));
                    }).catch((err) => {
                        dispatch(user.connectionFailed());
                    });
                });
            } else {
                this.props.dispatch(user.logout());
            }
        }
        // Fetch number of workers
        axios.get(config.api.host + '/workers').then(res => {
            this.props.dispatch(workerActions.setNumberWorkers(res.data));
        });
    }

    logoutHandler(e) {
        e.preventDefault();
        Cookies.remove('remember');
        this.props.dispatch(user.logout());
    }

    render() {
        return (
            <div className="container grid-container">
                <nav className="navbar">
                    <Link to="/" className="logo">
                        Scrib-AI
                    </Link>

                    <SwitcherClass trigger="ham" className="active">
                        <div className="menus">
                            <ul className="menu">
                                <li><Link to="/">Presentation of the project</Link></li>
                                <li><Link to="/summarize"><span className="oi" data-glyph="excerpt"/> Summarize your
                                    text</Link>
                                </li>
                                <li><Link to="/summarize_site"><span className="oi" data-glyph="link-intact"/> Summarize
                                    from
                                    website</Link></li>
                                { this.props.user.connected ?
                                    <li><Link to="/stats"><span className="oi" data-glyph="graph"/> Statistics</Link>
                                    </li>
                                    : null }
                                { this.props.user.connected ?
                                    <li><Link to="/search"><span className="oi" data-glyph="magnifying-glass"/>
                                        Search</Link>
                                    </li>
                                    : null }
                                { this.props.user.connected ?
                                    <li><Link to="/train"><span className="oi" data-glyph="lightbulb"/> Train</Link>
                                    </li>
                                    : null }
                            </ul>
                            <ul className="menu">
                                { this.props.user.connected ?
                                    <li><Link to="/settings"><span className="oi" data-glyph="wrench"/> Settings</Link>
                                    </li> :
                                    null }
                            </ul>
                            <ul className="menu">
                                { this.props.user.connected ?
                                    (
                                        <div>
                                            <li>Hello, { this.props.user.username }</li>
                                            <li><a onClick={ (e) => this.logoutHandler.bind(this)(e) }
                                                   className="btn error">Logout</a>
                                            </li>
                                        </div>
                                    ) :
                                    <li><Link to="/login" className="btn success">Login</Link></li> }
                            </ul>
                        </div>
                    </SwitcherClass>

                    <button id="ham" role="button" className="ham btn"><span className="oi" data-glyph="menu"/></button>
                </nav>
                <Notifications { ...this.props } />
                <main className="content">
                    { this.props.workers.number <= 0 ? (
                        <div style={ { marginBottom: 50 } }>
                            <Message warning>There is no worker started... Please, come back later.</Message>
                        </div>
                    ) : null }
                    <Routes socket={ this.socket } { ...this.props }/>
                </main>
            </div>
        );
    }
}
