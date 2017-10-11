import React, {Component} from 'react';
import axios from 'axios';
import StarSelection from "./StarSelection";
import * as textAction from "../actions/textActions";
import {config} from "../config/default";
import Input from './glui/form/Input';


export default class Summarize extends Component {

    constructor() {
        super();

        this.state = {
            editing: false,
            //ratio:0.4
        };

        this.onSummarizeHandler = this.onSummarizeHandler.bind(this);
        this.onEditSummary = this.onEditSummary.bind(this);
        this.onSendHandler = this.onSendHandler.bind(this);
    }

    /**
     * When we click on Summarize
     */
    onSummarizeHandler() {
        this.props.dispatch((dispatch) => {
            dispatch(textAction.summarize(this.props.text.fullText));
            window.scrollTo(0, 0);
            axios.post(config.api.host + '/summarization', {
                article: this.props.text.fullText,
                ratio: this.props.text.ratio
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

    onEditSummary(e) {
        e.preventDefault();
        this.setState({editing: !this.state.editing}, () => {
            if (!this.props.text.summary.hasUserEdited) {
                this.props.dispatch(textAction.editSummary());
            }
        });
    }

    /**
     * When sending summary
     * @param e
     */
    onSendHandler(e) {
        e.preventDefault();
        if(!this.props.text.upload.done) {
            this.props.dispatch(textAction.startUpload());
            axios.post(config.api.host + '/summary/store' + (this.props.text.summary.hasUserEdited ? '?edited=1' : ''), {
                summary: this.props.text.summary,
                article: {
                    fullText: this.props.text.fullText
                }
            }).then(() => {
                this.props.dispatch(textAction.uploadFulfilled());
            }).catch(err => {
                this.props.dispatch(textAction.uploadFailed(err.response.data.message));
            });
        }
    }

    render() {
        return (
            <div>

                <Input onChange={(id, value, isCorret, mess) => {
                    this.props.dispatch(textAction.changeRatio(value))
                }} id="ratio" label="Ratio" required style={{display: 'block', width: 400,  margin: "0 auto"}} value={this.props.text.ratio}/>
                <h1><span className="oi" data-glyph="excerpt" /> Summarize</h1>

                <div className="scrib-container">
                    <div className="scrib-article">
                        <textarea className="article" onChange={e => {
                            // Trim spaces in the beginning and end
                            this.props.dispatch(textAction.updateArticle(e.target.value.replace(/^\s+/g, '')));
                            // Rescale textarea
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }} value={this.props.text.fullText} placeholder="Paste your article here..."/>

                        <button onClick={this.onSummarizeHandler}
                                disabled={this.props.text.summarizing}
                                className="confirm-summarization btn small round success">
                            <span className="oi" data-glyph="check"/> Summarize!
                        </button>
                    </div>
                    <div className="scrib-article">
                        {this.state.editing ? (
                                <textarea onChange={e => {
                                    this.props.dispatch(textAction.updateUserVersion(e.target.value));
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                          value={this.props.text.summary.userVersion}
                                          className="response"
                                />) :
                            (<div onClick={(e) => {
                                    if (this.props.text.summarized) {
                                        this.onEditSummary(e);
                                    }
                                    console.log('click');
                                }} className="response disabled">
                                    {this.props.text.summarizing ? <div className="loader"/> : null}
                                    <div className="response-content">
                                        {
                                            this.props.text.summarized ?
                                                ( this.props.text.summary.hasUserEdited ?
                                                    this.props.text.summary.userVersion :
                                                    this.props.text.summary.content) :
                                                (this.props.text.summarizing ?
                                                    "We're summarizing... Please wait, this can take a minute." :
                                                    'Awaiting for something to sum up!')
                                        }
                                    </div>
                                </div>
                            )}
                        <div className="actions">
                            <button onClick={() => this.props.dispatch(textAction.refuseSummary())}
                                    disabled={!this.props.text.summarized}
                                    className="bad-summarization btn small round error">
                                <span className="oi" data-glyph="x"/>
                                Poor
                            </button>
                            <StarSelection disabled={!this.props.text.summarized}
                                           dispatch={this.props.dispatch} text={this.props.text}/>
                            <button disabled={!this.props.text.summarized} onClick={(e) => this.onEditSummary(e)}
                                    className={"edit-summary btn small round" + (this.state.editing ? ' success' : '')}>
                                {this.state.editing ? <span className="oi" data-glyph="check"/> :
                                    <span className="oi" data-glyph="pencil"/>}
                                {this.state.editing ? 'Confirm' : 'Edit'}
                            </button>
                        </div>
                        <div className="actions">
                            <button onClick={(e) => this.onSendHandler(e)} disabled={!this.props.text.summarized}
                                    className="confirm-summarization btn small round success">
                                <span className="oi" data-glyph="check"/> Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
