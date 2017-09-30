import React, {Component} from 'react';
import axios from 'axios';
import StarSelection from "./StarSelection";
import * as textAction from "../actions/textActions";
import {config} from "../config/default";

export default class Summarize extends Component {

    constructor() {
        super();

        this.state = {
            fullText: '',
        };

        this.onSummarizeHandler = this.onSummarizeHandler.bind(this);
    }

    /**
     * When we click on Summarize
     */
    onSummarizeHandler() {
        this.props.dispatch((dispatch) => {
            dispatch(textAction.summarize(this.state.fullText));
            axios.post(config.api.host + '/summarization', {
                article: this.state.fullText
            }).then((res) => {
                console.log(res.data);
                dispatch(textAction.summarizationFullfiled(res.data));
            }).catch(err => {
                //TODO: Different error according to the error
                dispatch(textAction.summarizationFailed('An error has occured... Please try again.'))
            });
        });
    }

    render() {
        return (
            <div>
                <h1><span className="oi" data-glyph="excerpt"/> Summarize</h1>
                <div className="scrib-container">
                    <div className="scrib-article">
                        <textarea className="article" onChange={e => {
                            // Trim spaces in the beginning and end
                            this.setState({fullText: e.target.value.replace(/^\s+/g, '')});
                            // Rescale textarea
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }} value={this.state.fullText} placeholder="Paste your article here..."/>

                        <button onClick={this.onSummarizeHandler} className="confirm-summarization btn small round success">
                            <span className="oi" data-glyph="check"/> Summarize!
                        </button>
                    </div>
                    <div className="scrib-article">
                        <div className="response disabled">
                            {this.props.text.summary.content !== null ? this.props.text.summary.content : 'Awaiting for something to sum up!' }
                        </div>
                        <div className="actions">
                            <button disabled={this.props.text.summary.content === null} className="bad-summarization btn small round error">
                                <span className="oi" data-glyph="x"/>
                            </button>
                            <StarSelection disabled={this.props.text.summary.content === null} onClick={(number) => {
                                console.log(number);
                            }}/>
                        </div>
                        <textarea className={this.props.text.summary.content === null ? 'disabled' : ''} disabled={this.props.text.summary.content === null} placeholder="Write your version here"/>
                        <div className="actions">
                            <button disabled={this.props.text.summary.content === null} className="confirm-summarization btn small round success">
                                <span className="oi" data-glyph="check"/> Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
