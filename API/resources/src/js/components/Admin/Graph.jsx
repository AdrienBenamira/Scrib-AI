import React from 'react';
import Link from 'react-router-dom/Link';
import axios from 'axios';
import { config } from '../../config/default';
import Dropdown from '../glui/dropdown/Dropdown';
import { Line } from 'react-chartjs-2';


axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Accept'] = 'application/json';

export default class Graph extends React.Component
{
    constructor() {
        super();
        this.state = {
            models: [],
            graphs: [],
            graph: {},
            versions: [],
            selectedVersion: null
        };
        this.onVersionClick = this.onVersionClick.bind(this);

    }

    async componentWillMount() {
        // Listening for new data
        this.props.socket.on('newGraphStep', (data) => {
            this.setState({
                versions: [...this.state.versions, data],
                selectedVersion: this.state.versions.length
            });
        });

        this.props.socket.on('newMeasurement', (data) => {
            let newVersion = [...this.state.versions];
            let isNewVersion = true;
            let selectedVersion = this.state.selectedVersion;
            newVersion.forEach(version => {
                if (version.id === data.graph_step_id) isNewVersion = false;
            });
            if (isNewVersion) {
                newVersion = [...newVersion, data.graph_step];
                selectedVersion = newVersion.length;
            }
            newVersion.map(version => {
                if (version.id === data.graph_step_id) version.Measurements.push(data);
            });
            this.setState({ versions: newVersion, selectedVersion });
            this.computeCurrentData();
        });

        // Fetching initial data
        let url = config.api.host + '/models/all';
        let response = await axios.get(url, {
            auth: { username: this.props.user.username, password: this.props.user.password }
        });
        this.setState({ models: response.data });
        url = config.api.host + '/graphs?model=' + this.props.match.params.model;
        response = await axios.get(url, {
            auth: { username: this.props.user.username, password: this.props.user.password }
        });
        this.setState({ graphs: response.data });
        url = config.api.host + '/graph/measurements?graph=' + this.props.match.params.graph;
        response = await axios.get(url, {
            auth: { username: this.props.user.username, password: this.props.user.password }
        });
        // Last version selected by default
        this.setState({
            versions: response.data.sort((a, b) => a.id - b.id),
            selectedVersion: response.data.length - 1
        });
        this.computeCurrentData();
    }

    onVersionClick(e, key) {
        e.preventDefault();
        this.computeCurrentData(key);
        this.setState({ selectedVersion: key });
    }

    computeCurrentData(key = null) {
        if(key === null) key = this.state.selectedVersion;
        const measures = this.state.versions[key].Measurements;
        let k = 0;
        const labels = measures.map(measure => {
            k++;
            return measure.legend !== null ? measure : k;
        });
        const data = measures.map(measure => measure.value);
        this.setState({
            graph: {
                labels, datasets: [{
                    data,
                    label: this.state.versions[this.state.selectedVersion].name
                }]
            }
        });
    }

    render() {
        return (
            <div>
                <h1><span className="oi" data-glyph="graph"/> Measurements : { this.props.match.params.graph }</h1>
                <div className="menu-bar">
                    <ul className="menu">
                        { this.state.models.map(model =>
                            <li key={ model.id }><Link to={ '/measurements/' + model.name }>{ model.name }</Link></li>
                        ) }
                    </ul>
                </div>
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
                <Dropdown label="Version" className="btn">
                    { this.state.versions.map((version, key) => (
                        <li key={ version.id }><a href="#"
                                                  onClick={ (e) => this.onVersionClick(e, key) }>{ version.name }</a>
                        </li>
                    )) }
                </Dropdown>
                { this.state.graph !== {} ?
                    <Line data={ this.state.graph }/> : <p>The Graph is empty.</p> }
            </div>
        );
    }
}