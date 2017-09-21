import React, {Component} from 'react';

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
                        <li>Summarize your text</li>
                    </ul>
                    <ul/>
                    <ul className="menu">
                        <li><a href="#" className="btn success">Se connecter</a></li>
                    </ul>
                </nav>
                <main className="content">
                    <h1>Let's summarize</h1>
                </main>
            </div>
        );
    }
}
