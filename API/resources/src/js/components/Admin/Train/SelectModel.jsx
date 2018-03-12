import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as modelsActions from '../../../actions/modelsActions';
import { config } from '../../../config/default';
import Form from '../../glui/form/Form';
import Input from '../../glui/form/Input';
import { Panel } from '../../glui/ui/Panel';


export default class SelectModel extends React.Component
{
    componentWillMount() {
        this.props.dispatch(modelsActions.fetchModels());
        this.updateModels();
    }

    updateModels() {
        axios.get(config.api.host + '/models/all', {
            auth: {
                username: this.props.user.username, password: this.props.user.password
            }
        }).then(
            response => {
                this.props.dispatch(modelsActions.modelsFetched(response.data));
            })
            .catch(err => this.props.dispatch(modelsActions.fetchingFailed(err)));
    }

    render() {
        return (
            <div>
                <h1>Choose a model</h1>
                <ul>{ this.props.models.models.map(model =>
                    <li key={model.id}>
                        <Link onClick={() => this.props.dispatch(modelsActions.changeCurrentModel(model.id))} to={ '/train/' + model.name }>{model.name}</Link>
                    </li>) }</ul>
                <Panel title={ <div><span className="oi" data-glyph="justify-left"/> Add a new model</div> }>
                    <Form submit={ <div>
                        <span className="oi" data-glyph="plus"/>
                        Add
                    </div> } onSubmit={ (values) => {
                        axios.post(config.api.host + '/model?name=' + values.name, {
                            auth: {
                                username: this.props.user.username, password: this.props.user.password
                            }
                        }).then(response => {
                            this.props.dispatch(modelsActions.fetchModels());
                            this.updateModels();
                        });
                    } } vertical>
                        <Input id="name" label="Name" required/>
                    </Form>
                </Panel>
            </div>
        );
    }
}