import React, { Component } from 'react';
import Chart from './Chart';
import { Link } from 'react-router-dom';
import * as statsActions from '../../actions/statsActions';
import * as showArticle from '../../actions/statsActions';


export default class Stats extends Component
{

    constructor() {
        super();
        this.state = {
            chartData: {},
            n4: 0,
            n5: 0,
            n3: 0,
            n2: 0,
            n1: 0,
            n0: 0,
            nt: 0,
            options: {
                grade: null,
                isIncorrect: null,
                date: null,
                id: null,
                articleId: null,
                fullText: null,
                isGenerated: null
            }
        };
    }

    componentWillMount() {
        statsActions.fetchStats({
            count: 0,
            user: this.props.user
        }).then(res => {

            console.log(res.data);
        });

        this.getChartDataFromAPI(this.state.options);
    }

    getChartDataFromAPI(values) {
        Object.getOwnPropertyNames(values).forEach(function (key) {
            if (values[key] === undefined || values[key] === '') values[key] = null;
        });

        this.setState({ options: values });
        showArticle.fetchStats({ ...values, user: this.props.user }).then(res => {
            let [n0, n1, n2, n3, n4, n5, nt] = [this.state.n0, this.state.n1, this.state.n2, this.state.n3, this.state.n4, this.state.n5, this.state.nt];
            for (let i = 0 ; i < res.data.length ; i++) {
                if (res.data[i].Grades[0].grade === 0) {
                    n0 = n0 + 1;
                    nt = nt + 1;
                }
                if (res.data[i].Grades[0].grade === 1) {
                    n1 = n1 + 1;
                    nt = nt + 1;
                }
                if (res.data[i].Grades[0].grade === 2) {
                    n2 = n2 + 1;
                    nt = nt + 1;
                }
                if (res.data[i].Grades[0].grade === 3) {
                    n3 = n3 + 1;
                    nt = nt + 1;
                }
                if (res.data[i].Grades[0].grade === 4) {
                    n4 = n4 + 1;
                    nt = nt + 1;
                }
                if (res.data[i].Grades[0].grade === 5) {
                    n5 = n5 + 1;
                    nt = nt + 1;
                }
            }
            this.setState({n0, n1, n2, n3, n4, n5, nt});
            this.setState({
                chartData: {
                    labels: ['Total', '0 étoile', '1 étoile', '2 étoiles', '3 étoiles', '4 étoiles', '5 étoiles'],
                    datasets: [{
                        label: 'Nombre',
                        data: [nt, n0, n1, n2, n3, n4, n5],
                        backgroundColor: ['rgba(255,99,132,0.6)', 'rgba(54,162,235,0.6)', 'rgba(255,206,86,0.6)', 'rgba(75,192,192,0.6)', 'rgba(0,0,0,0.6)', 'rgba(153,102,255,0.6)']
                    }]
                }
            });
        });
    }

    render() {
        return (
            <div>
                <h1><span className="oi" data-glyph="bar-chart"/> Statistics</h1>
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
