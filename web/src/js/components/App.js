import React, {Component} from 'react';
import {Link, Route, Switch, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import * as user from "../actions/userAction";
import Summarize from "./Summarize";
import Stats from "./Stats";
import {Intro} from "./Intro";
import {Login} from "./Login";

@withRouter
@connect(state => {
    return {
        //TODO
    };
})
export default class App extends Component {
    constructor() {
        super();
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
                    </ul>
                    <ul className="menu">
                        <li><Link to="/summarize">Summarize your text</Link></li>
                    </ul>
                    <ul/>
                    <ul className="menu">
                        <li><Link to="/login" className="btn success">Login</Link></li>
                    </ul>
                </nav>
                <main className="content">
                    <Switch>
                        <Route exact path="/" component={Intro}/>
                        <Route path="/summarize" component={Summarize}/>
                        <Route path="/login" render={(props) => {
                            return <Login {...props} dispatch={this.props.dispatch} />;
                        }}/>
                        <Route path="/stats" component={Stats}/>
                    </Switch>
                </main>
            </div>
        );
    }
}
