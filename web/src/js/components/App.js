import React, {Component} from 'react';
import {Link, Route} from "react-router-dom";
import Summarize from "./Summarize";
import Login from "./Login";
import Stats from "./Stats";

export default class App extends Component {
    constructor() {
        super();
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
                    <Route exact path="/" component={Summarize}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/stats" component={Stats}/>
                </main>



            </div>
        );
    }
}
