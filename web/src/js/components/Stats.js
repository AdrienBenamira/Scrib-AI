import React, { Component } from 'react';
import axios from 'axios';
import { config } from '../config/default';
import Chart from './Chart';
import { Link } from 'react-router-dom';
import * as textAction from "../actions/textActions";

export default class Stats extends Component
{


    constructor() {
        super();
        this.state = {
            chartData: {},
            n5:5
        };
    }

    componentWillMount() {
        this.getChartData();
    }


    getChartData() {
        //this.props.dispatch((dispatch) => {
        //axios.get(config.api.host + '/grade', {
            //article: this.state.origin
        //}).then((res) => {
        //    this.state.n5=res.data;
        //}).catch(err => {
        //    if (err.response.data.message !== undefined) {
        //        dispatch(textAction.summarizationFailed(err.response.data.message));
        //    } else {
        //        dispatch(textAction.summarizationFailed('An error has occured... Please try again.'));
        //    }
        //});
        //});
        this.setState({
            chartData: {
                labels: ['ND', '1 étoile', '2 étoiles', '3 étoiles', '4 étoiles', '5 étoiles'], datasets: [{
                    label: 'Nombre',
                    data: [1, 2, 3, 4, this.state.n5, 6],
                    backgroundColor: ['rgba(255,99,132,0.6)', 'rgba(54,162,235,0.6)', 'rgba(255,206,86,0.6)', 'rgba(75,192,192,0.6)', 'rgba(0,0,0,0.6)', 'rgba(153,102,255,0.6)']

                }]

            }
        });
    }

    render() {
        return (
            <div>
                <button onClick={(e) => {
                    e.preventDefault();
                    console.log('click');
                    axios.get(config.api.host + '/user/article', {
                        auth: {
                            username: this.props.user.username, password: this.props.user.password
                        }
                    }).then((res) => {
                        console.log(res.data);
                    });
                }}>Click</button>
                <h1><span className="oi" data-glyph="graph"/> Statistics</h1>
                <div className="menu-bar">
                    <ul className="menu">
                        <li><Link to="#">Stats 1</Link></li>
                        <li><Link to="#">Stats 2</Link></li>
                    </ul>
                </div>

                <Chart chartData={ this.state.chartData }/>

            </div>


        );
    }
}
