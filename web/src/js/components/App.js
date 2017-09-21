import React, {Component} from 'react';
import {Link, Route} from "react-router-dom";
import Summarize from "./Summarize";

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

                <form>
                    <ul className="menu">
                        <div class="form-group">
                            <label>Identification</label>
                            <input />
                        </div>
                        <div class="form-group">
                            <label>Mot de passe</label>
                            <input />
                        </div>
                    </ul>
                </form>

            </div>
        );
    }
}
