import React from 'react';
import Link from 'react-router-dom/Link';
import axios from 'axios';
import { config } from '../../config/default';


axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Accept'] = 'application/json';

export default class Measurements extends React.Component
{
    constructor() {
        super();
        this.state = {
            models: [],
            graphs: []
        };

        this.loadGraphs = this.loadGraphs.bind(this);
    }

    async componentWillMount() {
        const url = config.api.host + '/models/all';
        const response = await axios.get(url, {
            auth: { username: this.props.user.username, password: this.props.user.password }
        });
        this.setState({ models: response.data });
        this.loadGraphs();
    }

    loadGraphs() {
        if (this.props.match.params.model !== undefined) {
            const url = config.api.host + '/graphs?model=' + this.props.match.params.model;
            axios.get(url, {
                auth: { username: this.props.user.username, password: this.props.user.password }
            }).then(response => {
                this.setState({ graphs: response.data });
            });
        }
    }

    render() {
        if(this.props.match.params.model !== undefined && this.state.graphs.length === 0) this.loadGraphs();

        return (<div>
            <h1><span className="oi" data-glyph="graph"/> Measurements</h1>
            <div className="menu-bar">
                <ul className="menu">
                    { this.state.models.map(model =>
                        <li key={ model.id }>
                            <Link
                                to={ '/measurements/' + model.name }>{ model.name }</Link>
                        </li>
                    ) }
                </ul>
            </div>
            { this.props.match.params.model !== undefined && this.state.graphs.length > 0 ? (
                    <div className="menu-bar" style={ { marginTop: '10px' } }>
                        <ul className="menu">
                            { this.state.graphs.map(graph =>
                                <li key={ graph.id }>
                                    <Link
                                        to={ '/measurements/' + this.props.match.params.model + '/' + graph.name }>{ graph.name }</Link>
                                </li>
                            ) }
                        </ul>
                    </div>
                ) : this.props.match.params.model !== undefined ? (<p>There are no graphs yet.</p>) : (<p>Please select a model.</p>) }
        </div>);
    }
}