import React, { Component } from 'react';
import Chart from './Chart';
import { Link } from 'react-router-dom';
import * as statsActions from '../actions/statsActions';
import * as showArticle from '../actions/statsActions';

export default class Stats extends Component
{


    constructor() {
        super();
        this.state = {
            chartData: {},
            n4:0,
            n5:0,
            n3:0,
            n2:0,
            n1:0,
            n0:0,
            nt:0,
            options: {
                grade: null,
                isIncorrect: null,
                date: null,
                id: null,
                articleId: null,
                fullText: null,
                isGenerated: null,
            }
        };
    }

    componentWillMount() {
        statsActions.fetchStats({
            count: 1,
            user: this.props.user
        }).then(res => {
            console.log(res.data);
        });


        this.getChartDataFromAPI(this.state.options);
    }



    getChartDataFromAPI(values) {
            Object.getOwnPropertyNames( values ).forEach( function( key ){
                if(values[key] === undefined || values[key] === '') values[key] = null;
            });

            this.setState({options: values});
            showArticle.fetchStats({...values, user: this.props.user}).then(res => {
                console.log(res.data);
                for(var i=0;i<res.data.length;i++){
                    if(res.data[i].Grades[0].grade==0){
                        this.state.n0=this.state.n0+1;
                        this.state.nt=this.state.nt+1;
                    }
                    if(res.data[i].Grades[0].grade==1){
                        this.state.n1=this.state.n1+1;
                        this.state.nt=this.state.nt+1;
                    }
                    if(res.data[i].Grades[0].grade==2){
                        this.state.n2=this.state.n2+1;
                        this.state.nt=this.state.nt+1;
                    }
                    if(res.data[i].Grades[0].grade==3){
                        this.state.n3=this.state.n3+1;
                        this.state.nt=this.state.nt+1;
                    }
                    if(res.data[i].Grades[0].grade==4){
                        this.state.n4=this.state.n4+1;
                        this.state.nt=this.state.nt+1;
                    }
                    if(res.data[i].Grades[0].grade==5){
                        this.state.n5=this.state.n5+1;
                        this.state.nt=this.state.nt+1;
                    }
                }
                console.log('OK');
                console.log(this.state.nt);
                console.log(this.state.chartData);
                console.log('OK');
                this.setState({
                    chartData: {
                        labels: ['ND', '1 étoile', '2 étoiles', '3 étoiles', '4 étoiles', '5 étoiles'], datasets: [{
                            label: 'Nombre',
                            data: [this.state.nt,this.state.n0,this.state.n1, this.state.n2, this.state.n3, this.state.n4, this.state.n5],
                            backgroundColor: ['rgba(255,99,132,0.6)', 'rgba(54,162,235,0.6)', 'rgba(255,206,86,0.6)', 'rgba(75,192,192,0.6)', 'rgba(0,0,0,0.6)', 'rgba(153,102,255,0.6)']
                        }]
                    }
                });
                console.log(this.state.chartData);

            })

    }



    render() {
        return (
            <div>
                <h1><span className="oi" data-glyph="graph"/> Statistics</h1>
                <div className="menu-bar">
                    <ul className="menu">
                        <li><Link to="#">Stats 1</Link></li>
                        <li><Link to="#">Stats 2</Link></li>
                    </ul>
                </div>
                <Chart chartData={this.state.chartData }/>
            </div>


        );
    }
}
