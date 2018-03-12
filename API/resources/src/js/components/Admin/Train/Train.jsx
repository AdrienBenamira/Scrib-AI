import React, { Component } from 'react';
import axios from 'axios';
import * as modelsActions from '../../../actions/modelsActions';
import { config } from '../../../config/default';
import AutomaticChoices from './AutomaticChoices';
import RightLeftChoices from './RightLeftChoices';


export default class Train extends Component
{
    constructor() {
        super();
        this.toggleAuto = this.toggleAuto.bind(this);
    }

    updateModels() {
        axios.get(config.api.host + '/models/all', {
            auth: {
                username: this.props.user.username, password: this.props.user.password
            }
        }).then(
            response => {
                this.props.dispatch(dispatch => {
                    dispatch(modelsActions.modelsFetched(response.data));
                    const curModel = this.props.models.models.filter(model => model.name === this.props.modelName);
                    if(curModel.length > 0)
                        dispatch(modelsActions.changeCurrentModel(curModel[0].id));
                });
            })
            .catch(err => this.props.dispatch(modelsActions.fetchingFailed(err)));
    }

    componentWillMount() {
        if (!this.props.models.models[this.props.models.currentModelId]) {
            this.props.dispatch(modelsActions.fetchModels());
            this.updateModels();
        }
        this.props.dispatch(modelsActions.fetchActions());
        this.fetchTwoActions();
        console.log(this.props.models);
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

    async toggleAuto() {
        const name = this.props.models.models[this.props.models.currentModelId].name;
        await axios.put(config.api.host + '/model/toggle-auto?name=' + name, {
            auth: {
                username: this.props.user.username, password: this.props.user.password
            }
        });
        this.updateModels();
    }

    render() {
        return (<div>
            <button className="btn" onClick={ () => this.toggleAuto() }>Toggle auto/manual</button>
            <h1>Training</h1>
            { this.props.models.models[this.props.models.currentModelId] ? this.props.models.models[this.props.models.currentModelId].is_automatic ?
                <AutomaticChoices { ...this.props } /> :
                <RightLeftChoices { ...this.props } /> : null }
        </div>);
    }
}
