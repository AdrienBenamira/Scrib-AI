import React, { Component } from 'react';
import axios from 'axios';
import * as modelsActions from '../../../actions/modelsActions';
import { config } from '../../../config/default';


export default class Train extends Component
{

    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(modelsActions.fetchActions());
        this.fetchTwoActions();
    }

    fetchTwoActions() {
        axios.get(config.api.host + '/model/actions?model=' + this.props.modelName, {
            auth: {
                username: this.props.user.username, password: this.props.user.password
            }
        }).then(response => {
            this.props.dispatch(modelsActions.actionsFetched(response.data));
        }).catch(err => {
            this.props.dispatch(modelsActions.fetchActionsFailed(err));
        });
    }

    onClick(e, preference) {
        console.log(preference);
        this.props.dispatch(modelsActions.fetchActions());
        const url = config.api.host + '/model/preference?model=' + this.props.modelName + '&action_left=' +
                this.props.models.actions.actions[0].id + '&action_right=' +
                this.props.models.actions.actions[1].id + '&score=' + preference;
        axios.post(url, {
            auth: {
                username: this.props.user.username, password: this.props.user.password
            }
        }).then(response => {
            console.log(response);
            this.fetchTwoActions();
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (<div>
            <h1>Training</h1>
            <p>
                You will be shown two different summaries for a same article. Please click on the best summary.
            </p>
            { this.props.models.actions.actions.length > 0 ?
                <div>
                    <div className="cards">
                        <button onClick={(e) => this.onClick(e, 1)} className="card large">
                            <div className="card-heading">Choice 1</div>
                            <div className="card-content" style={{
                                textAlign: 'justify',
                                lineHeight: '1.8em',
                                fontSize: '17px'
                            }}>
                                { this.props.models.actions.actions[0].content }
                            </div>
                        </button>
                        <button onClick={(e) => this.onClick(e, 2)} className="card large">
                            <div className="card-heading">Choice 2</div>
                            <div className="card-content" style={{
                                textAlign: 'justify',
                                lineHeight: '1.8em',
                                fontSize: '17px'
                            }}>
                                { this.props.models.actions.actions[1].content }
                            </div>
                        </button>
                    </div>
                    <div style={{
                        width: 200,
                        display: "block",
                        margin: "0 auto"
                    }}>
                        <button onClick={(e) => this.onClick(e, -1)} className="btn dark">Neither</button>
                        <button onClick={(e) => this.onClick(e, 0)} className="btn default">Both</button>
                    </div>
                    <h2>Associated article</h2>
                    <p className="article">{this.props.models.actions.actions[0].Article.fullText}</p>
                </div>
                : <p style={{
                    marginTop: 60,
                    textAlign: "center"
                }}>There is no more examples... Wait until some appear.</p> }
        </div>);
    }
}
