import React, {Component} from 'react';
import {Link, Redirect, Route, Switch, withRouter} from "react-router-dom";
import axios from 'axios';
import {connect} from "react-redux";
import * as user from "../actions/userActions";
import Summarize from "./Summarize";
import Stats from "./Stats";
import {Intro} from "./Intro";
import {Login} from "./Login";
import * as Cookies from 'js-cookie';
import {config} from "../config/default";
import Settings from "./Settings";
import Notifications from "./Notifications";

@withRouter
@connect(state => state)
export default class App extends Component {
    constructor() {
        super();
    }

    componentWillMount() {
        // Fetch login in cookie
        if (!this.props.user.connected) {
            const rememberToken = Cookies.getJSON('remember');

            if (rememberToken !== undefined) {
                this.props.dispatch(dispatch => {
                    dispatch(user.connectUser());
                    const url = config.api.host + '/user/login';
                    const authInfo = {username: rememberToken.username, password: rememberToken.token};
                    axios.get(url, {auth: authInfo}).then((res) => {
                        // Update cookie
                        Cookies.set('remember', {username: rememberToken.username, token: res.data.token}, {
                            expires: 15 //days
                        });
                        dispatch(user.userConnected({...authInfo, password: res.data.token}));
                    }).catch((err) => {
                        dispatch(user.connectionFailed())
                    });
                })
            }
        }
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
                    <ul className="menu">
                        <li><Link to="/">Presentation of the project</Link></li>
                        <li><Link to="/summarize"><span className="oi" data-glyph="excerpt"/> Summarize your text</Link>
                        </li>
                        {this.props.user.connected ?
                            <li><Link to="/stats"><span className="oi" data-glyph="graph"/> Statistics</Link></li> :
                            null}
                    </ul>
                    <ul className="menu">
                        {this.props.user.connected ?
                            <li><Link to="/settings"><span className="oi" data-glyph="wrench"/> Settings</Link></li> :
                            null}
                    </ul>
                    <ul className="menu">
                        {this.props.user.connected ?
                            (
                                <div>
                                    <li>Hello, {this.props.user.username}</li>
                                    <li><a onClick={(e) => this.logoutHandler.bind(this)(e)} className="btn error">Logout</a>
                                    </li>
                                </div>
                            ) :
                            <li><Link to="/login" className="btn success">Login</Link></li>}
                    </ul>
                </nav>
                <Notifications dispatch={this.props.dispatch} user={this.props.user} text={this.props.text}/>
                <main className="content">
                    <Switch>
                        <Route exact path="/" component={Intro}/>
                        <Route path="/summarize" render={(props) => (
                            <Summarize {...props} dispatch={this.props.dispatch} text={this.props.text}/>
                        )}/>
                        <Route path="/login" render={(props) => (
                            this.props.user.connected ?
                                <Redirect to="/stats"/> :
                                <Login {...props} dispatch={this.props.dispatch} failed={this.props.user.failed}
                                       connecting={this.props.user.connecting}/>
                        )}/>
                        <Route path="/stats" render={(props) => (
                            this.props.user.connected ?
                                <Stats {...props} /> :
                                <Redirect to='/'/>
                        )}/>
                        <Route path="/settings" render={(props) => (
                            this.props.user.connected ?
                                <Settings dispatch={this.props.dispatch} user={this.props.user} {...props} /> :
                                <Redirect to='/'/>
                        )}/>
                    </Switch>
                </main>
            </div>
        );
    }
}
