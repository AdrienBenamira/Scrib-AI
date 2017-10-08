import React, { Component } from 'react';
import Chart from './Chart';
import { Link } from 'react-router-dom';
import * as statsActions from '../actions/statsActions';

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
        statsActions.fetchStats({
            count: 1,
            user: this.props.user
        }).then(res => {
            console.log(res.data);
        });
        this.getChartData();
    }


    getChartData() {
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
                    const opt = {
                        user: this.props.user,
                        count: 1
                    };
                    statsActions.fetchStats(opt).then(res => {
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
