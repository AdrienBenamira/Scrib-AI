import React, {Component} from 'react';
import {Link, Route} from "react-router-dom";

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
                        <li><a href="#" className="btn success">Se connecter</a></li>
                    </ul>
                </nav>
                <main className="content">
                    <Route exact path="/" component={Summarize}/>
                </main>
            </div>
        );
    }
}
