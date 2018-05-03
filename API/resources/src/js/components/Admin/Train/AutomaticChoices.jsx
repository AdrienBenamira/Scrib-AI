import React from 'react';
import axios from 'axios';
import * as modelsActions from '../../../actions/modelsActions';
import { config } from '../../../config/default';
import Form from '../../glui/form/Form';
import Input from '../../glui/form/Input';
import Icon from '../../glui/ui/Icon';
import { Panel } from '../../glui/ui/Panel';


export default class AutomaticChoices extends React.Component
{
    constructor() {
        super();

        this.state = {
            addInputValue: ''
        };

        this.incrOrder = this.incrOrder.bind(this);
        this.decrOrder = this.decrOrder.bind(this);
    }

    incrOrder(name, order) {
        let metrics = [...this.props.models.metrics];
        if (order + 1 >= metrics.length - 1) {
            metrics[order].order = order + 1;
            metrics[order + 1].order = order;
            metrics.sort((a, b) => a.order - b.order);
        }
        axios.put(config.api.host + '/metric?name=' + name, {
            order: order + 1,
            auth: {
                username: this.props.user.username, password: this.props.user.password
            }
        }).then(_ =>
            this.props.dispatch(modelsActions.updateMetrics(metrics)));

    }

    decrOrder(name, order) {
        let metrics = [...this.props.models.metrics];
        if (order - 1 >= 0) {
            metrics[order].order = order - 1;
            metrics[order - 1].order = order;
            metrics.sort((a, b) => a.order - b.order);
        }
        axios.put(config.api.host + '/metric?name=' + name, {
            order: order - 1,
            auth: {
                username: this.props.user.username, password: this.props.user.password
            }
        }).then(_ =>
            this.props.dispatch(modelsActions.updateMetrics(metrics))
        );

    }

    deleteMetric(name, order) {
        let metrics = [...this.props.models.metrics];
        metrics.splice(order, 1);
        axios.delete(config.api.host + '/metric?name=' + name, {
            auth: {
                username: this.props.user.username, password: this.props.user.password
            }
        }).then(_ =>
            this.props.dispatch(modelsActions.updateMetrics(metrics))
        );
    }

    async componentWillMount() {
        const response = await axios.get(config.api.host + '/metrics', {
            auth: {
                username: this.props.user.username, password: this.props.user.password
            }
        });
        response.data.sort((a, b) => a.order - b.order);
        this.props.dispatch(modelsActions.metricsFetched(response.data));
    }


    render() {
        return (
            <div>
                <Panel style={{marginTop: "20px"}} dark title={ <div> Add a metric</div> }>
                    <Form onChange={ (id, value, _, __) => {
                        this.setState({ addInputValue: value });
                    } } onSubmit={ elements => {
                        this.setState({ addInputValue: '' });
                        axios.post(config.api.host + '/metric?name=' + elements.name, {
                            auth: {
                                username: this.props.user.username, password: this.props.user.password
                            }
                        }).then(res => this.props.dispatch(modelsActions.addMetric({ name: elements.name })));
                    } }>
                        <Input value={ this.state.addInputValue } label="Name" id="name"/>
                    </Form>
                </Panel>
                <h2>Metrics</h2>
                <p>Python files must be named `name`_metric.py. They will be executed. Print a JSON string to output a
                    result.</p>
                <table className="stripped">
                    <thead>
                    <tr>
                        <th>Execution order</th>
                        <th>Metric</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    { this.props.models.metrics.map((metric, order) => {
                        return <tr key={ metric.name }>
                            <td>{ metric.order + 1 }</td>
                            <td>{ metric.name }</td>
                            <td>
                                <button onClick={(e) => this.deleteMetric(metric.name, metric.order)} className="btn error small round">
                                    <Icon type="x"/>
                                </button>
                                { order !== 0 &&
                                <button onClick={ (e) => this.decrOrder(metric.name, metric.order) }
                                        className="btn small round">
                                    <Icon type="chevron-top"/></button> }
                                { order !== this.props.models.metrics.length - 1 &&
                                <button onClick={ (e) => this.incrOrder(metric.name, metric.order) }
                                        className="btn small round">
                                    <Icon type="chevron-bottom"/></button> }
                            </td>
                        </tr>;
                    }) }
                    </tbody>
                </table>
            </div>
        );
    }
}