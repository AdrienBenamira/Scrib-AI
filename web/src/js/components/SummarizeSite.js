import React, {Component} from 'react';
import Input from './glui/form/Input';
import Form from "./glui/form/Form";
import * as textAction from "../actions/textActions";
import {config} from "../config/default";
import axios from 'axios';

export default class SummarizeSite extends Component {

    constructor() {
        super();
        this.state = {
            origin: '',
            editing: false,
            ratio:0.4,
            titre:''
        };
        this.onSummarizeHandler = this.onSummarizeHandler.bind(this);
    }

    /**
     * When we click on Summarize
     */
    onSummarizeHandler(e) {
        e.preventDefault();
        this.props.dispatch((dispatch) => {
            dispatch(textAction.summarize_site(this.state.origin));
            console.log(this.state.origin);
            axios.post(config.api.host + '/summarize_site', {
                article: this.state.origin,
                ratio: this.state.ratio
            }).then((res) => {
                dispatch(textAction.summarizationFullfiled(res.data));
            }).catch(err => {
                if (err.response.data.message !== undefined) {
                    dispatch(textAction.summarizationFailed(err.response.data.message));
                } else {
                    dispatch(textAction.summarizationFailed('An error has occured... Please try again.'));
                }
            });
        });
    }




    render() {
        return (
            <div>
                <h1><span className="oi" data-glyph="link-intact"/> Summarize from a website</h1>

                <form className="vertical">
                    <Input onChange={(id, value, isCorret, mess) => {
                    this.state.ratio=value
                }} id="ratio" label="Ratio" value={this.state.ratio} required/>
                    <Input onChange={(id, value, isCorrect, mess) => {
                        if(id === 'url') {
                            this.state.origin=value;
                            console.log(this.state.origin);
                        }
                    }} id="url" label="Website" value={this.state.origin} required/>

                    <button onClick={(e) => this.onSummarizeHandler(e)}
                            disabled={this.state.origin}
                            className="confirm-summarization-site btn small round success">
                        <span className="oi" data-glyph="check"/> Summarize!
                    </button>


                </form>

            </div>
        );
    }
}