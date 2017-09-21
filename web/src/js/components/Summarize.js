import React, {Component} from 'react';

export default class Summarize extends Component {

    render() {
        return (
            <div>
                <h1>Summarize</h1>
                <div className="scrib-container">
                    <div className="scrib-article">
                        <textarea placeholder="Paste your article here..."/>
                    </div>
                    <div className="scrib-article-result">
                        <textarea />
                        <div className="actions">
                            <button className="btn error">
                                <span className="oi" data-glyph="x" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
