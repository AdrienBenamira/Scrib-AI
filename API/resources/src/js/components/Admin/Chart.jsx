import React, { Component } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

export default class Chart extends Component
{

    constructor(props) {
        super(props);
        /*this.state = {
            chartData: props.chartData
        };*/
    }

    render() {
        return (
            <div className="chart">

                <Bar
                    data={ this.props.chartData }
                    options={ {
                        title: {
                            display: true, text: 'Base de donnees', fontSize: 25

                        }, legend: {
                            display: true, position: 'right'

                        }
                    } }
                />

            </div>



        );
    }
}
