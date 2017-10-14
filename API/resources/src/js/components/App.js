import React, { Component } from 'react';
import { Link, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import * as user from '../actions/userActions';
import Summarize from './Summarize';
import Stats from './Stats';
import { Intro } from './Intro';
import { Login } from './Login';
import * as Cookies from 'js-cookie';
import { config } from '../config/default';
import Settings from './Settings';
import Notifications from './Notifications';
import SummarizeSite from './SummarizeSite';
import ShowArticle from './ShowArticle';
import { Search } from './Search';
import * as textAction from '../actions/textActions';


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
            if(data.status === 200)
                this.props.dispatch(textAction.summarizationFullfiled(data));
            else if (data.message !== undefined)
                this.props.dispatch(textAction.summarizationFailed(data.message));
            else
                this.props.dispatch(textAction.summarizationFailed('An error has occured... Please try again.'));
        });
        // Summarize from URL
        this.socket.on('responseTaskUrl', data => {
            if(data.status === 200)
                this.props.dispatch(textAction.summarizationFullfiledFromURL(data));
            else if (data.message !== undefined)
                this.props.dispatch(textAction.summarizationFailed(data.message));
            else
                this.props.dispatch(textAction.summarizationFailed('An error has occured... Please try again.'));
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
                        <li><Link to="/summarize_site"><span className="oi" data-glyph="link-intact"/> Summarize from
                            website</Link></li>
                        { this.props.user.connected ?
                            <li><Link to="/stats"><span className="oi" data-glyph="graph"/> Statistics</Link></li>
                            : null }
                        { this.props.user.connected ?
                            <li><Link to="/search"><span className="oi" data-glyph="magnifying-glass"/> Search</Link>
                            </li>
                            : null }
                    </ul>
                    <ul className="menu">
                        { this.props.user.connected ?
                            <li><Link to="/settings"><span className="oi" data-glyph="wrench"/> Settings</Link></li> :
                            null }
                    </ul>
                    <ul className="menu">
                        { this.props.user.connected ?
                            (
                                <div>
                                    <li>Hello, { this.props.user.username }</li>
                                    <li><a onClick={ (e) => this.logoutHandler.bind(this)(e) } className="btn error">Logout</a>
                                    </li>
                                </div>
                            ) :
                            <li><Link to="/login" className="btn success">Login</Link></li> }
                    </ul>

                </nav>
                <Notifications { ...this.props } />
                <main className="content">
                    <Switch>
                        <Route exact path="/" component={ Intro }/>
                        <Route path="/summarize_site" render={ (props) => (
                            <SummarizeSite { ...props } socket={this.socket} dispatch={ this.props.dispatch } text={ this.props.text }/>
                        ) }/>
                        <Route path="/summarize" render={ (props) => (
                            <Summarize { ...props } socket={ this.socket } dispatch={ this.props.dispatch }
                                       text={ this.props.text }/>
                        ) }/>
                        <Route path="/login" render={ (props) => (
                            this.props.user.connected ?
                                <Redirect to="/stats"/> :
                                <Login { ...props } dispatch={ this.props.dispatch } failed={ this.props.user.failed }
                                       connecting={ this.props.user.connecting }/>
                        ) }/>
                        <Route path="/stats" render={ (props) => (
                            this.props.user.connected ?
                                <Stats { ...props } user={ this.props.user }/> :
                                <Redirect to='/'/>
                        ) }/>
                        <Route path="/search" render={ (props) => (
                            this.props.user.connected ?
                                <Search { ...props } stats={ this.props.stats } dispatch={ this.props.dispatch }
                                        user={ this.props.user }/> :
                                <Redirect to='/'/>
                        ) }/>
                        <Route path="/settings" render={ (props) => (
                            this.props.user.connected ?
                                <Settings dispatch={ this.props.dispatch } user={ this.props.user } { ...props } /> :
                                <Redirect to='/'/>
                        ) }/>
                        <Route path="/article/:id" render={ (match) => (
                            <ShowArticle user={ this.props.user } id={ match.id }/>
                        ) }/>
                    </Switch>
                </main>
            </div>
        );
    }
}