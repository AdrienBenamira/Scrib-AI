import React, {Component} from 'react';
import {Link, Route, Switch} from "react-router-dom";
import Summarize from "./Summarize";
import Login from "./Login";
import {connect} from "react-redux";
import * as user from "../actions/userAction";

@connect(state => {
    return {
        //TODO
    };
})
export default class App extends Component {
    constructor() {
        super();
    }

    componentWillMount() {
        // Test connection
        this.props.dispatch(user.connectUser("bob"));
    }

    render() {
        return (
            <div className="container grid-container">
                <nav className="navbar">
                    <a href="#" className="logo">
                        Scrib-AI
                    </a>
                    <ul className="menu">
                        <li><Link to="/">Summarize your text</Link></li>
                    </ul>
                    <ul/>
                    <ul className="menu">
                        <li><Link to="/login" className="btn success">Se connecter</Link></li>
                    </ul>
                </nav>
                <main className="content">
                    <Switch>
                        <Route exact path="/" component={Summarize}/>
                        <Route path="/login" component={Login}/>
                    </Switch>
                </main>
            </div>
        );
    }
}
