import React, {Component} from 'react';
import StarSelection from "./StarSelection";

export default class Summarize extends Component {

    constructor() {
        super();

        this.state = {
            disabled: true
        }
    }

    render() {
        return (
            <div>
                <h1>Summarize</h1>
                <div className="scrib-container">
                    <div className="scrib-article">
                        <textarea onChange={e => {
                            // Trim spaces in the beginning and end
                            e.target.value = e.target.value.replace(/^\s+|\s+$/g, '');
                            // Rescale textarea
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }} placeholder="Paste your article here..."/>
                    </div>
                    <div className="scrib-article">
                        <textarea className="disabled" disabled placeholder="Awaiting for something to sum up!"/>
                        <div className="actions">
                            <button disabled={this.state.disabled} className="bad-summarization btn small round error">
                                <span className="oi" data-glyph="x"/>
                            </button>
                            <StarSelection disabled={this.state.disabled} onClick={(number) => {
                                console.log(number);
                            }}/>
                        </div>
                        <textarea className={this.state.disabled ? 'disabled' : ''} disabled={this.state.disabled} placeholder="Write your version here"/>
                        <div className="actions">
                            <button disabled={this.state.disabled} className="confirm-summarization btn small round success">
                                <span className="oi" data-glyph="check"/> Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
