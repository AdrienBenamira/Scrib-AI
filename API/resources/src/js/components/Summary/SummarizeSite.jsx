import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Input from '../glui/form/Input';
// import Form from './glui/form/Form';
import * as textAction from '../../actions/textActions';
import { config } from '../../config/default';
import axios from 'axios';
import List from '../glui/form/List/List';
import ListItem from '../glui/form/List/ListItem';


export default class SummarizeSite extends Component
{

    constructor() {
        super();
        this.state = {
            origin: '',
            editing: false,
            ratio: 0.4,
            titre: '',
            redirect: false
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
            this.setState({ redirect: true });
            console.log(this.state.origin);
            this.props.socket.emit('pushQueue', {
                payload: {
                    model: this.props.text.model,
                    type: 'url',
                    url: this.state.origin,
                    ratio: this.props.text.ratio
                }
            });
        });
    }

    render() {
        return this.state.redirect ? <Redirect to="/summarize"/> : (
            <div>
                <h1><span className="oi" data-glyph="link-intact"/> Summarize from a website</h1>
                <form className="vertical">
                    <Input className="scrib-url" onChange={ (id, value, isCorrect, mess) => {
                        if (id === 'url') {
                            this.setState({origin: value});
                            console.log(this.state.origin);
                        }
                    } } id="url" placeholder="Link..." value={ this.state.origin } required/>

                    <List lable="Model" onChange={(_, model) => {
                        this.props.dispatch(textAction.changeModel(model));
                        console.log(model)
                    }}>
                        <ListItem value="google" label="Get to the point"/>
                        <ListItem value="ours_1layer" label="Ours (1 layer)"/>
                        <ListItem value="ours_4layers" label="Ours (4 layer)"/>
                    </List>
                    <button onClick={ (e) => this.onSummarizeHandler(e) }
                            disabled={ !this.state.origin || this.props.workers.number <= 0 }
                            className="confirm-summarization-site btn small round success">
                        <span className="oi" data-glyph="check"/> Summarize!
                    </button>
                </form>
            </div>
        );
    }
}
