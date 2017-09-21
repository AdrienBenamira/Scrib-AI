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
                </nav>
                <main className="content">
                    <h1>Summarize</h1>
                </main>
            </div>
        );
    }
}
