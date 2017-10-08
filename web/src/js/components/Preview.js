import React from 'react';
import Form from './glui/form/Form';
import Input from './glui/form/Input';
import * as showArticle from '../actions/statsActions';
import Table from './glui/table/Table';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default class Preview extends React.Component {

    constructor() {
        super();
        this.state = {
            options: {
                grade: null,
                isIncorrect: null,
                date: null,
                id: null,
                articleId: null,
                fullText: null,
                isGenerated: null,
            },
            results: []
       };
    }

    render() {
        return (
            <div>
                <h1><span className="oi" data-glyph="magnifying-glass"/> Search</h1>
                <Form onSubmit={(values) => {
                    Object.getOwnPropertyNames( values ).forEach( function( key ){
                        if(values[key] === undefined || values[key] === '') values[key] = null;
                    });
                    this.setState({options: values});
                    showArticle.fetchStats({...values, user: this.props.user}).then(res => {
                        console.log(res.data);
                        this.setState({results: res.data});
                    });
                }} vertical submit="Search">
                    <Input id="grade" label="Grade" />
                    <Input type="checkbox" id="isIncorrect" label="IsIncorrect" />
                    <Input type="date" id="date" label="Date" />
                    <Input id="id" label="Summary ID" />
                    <Input id="articleId" label="Article ID" />
                    <Input id="fullText" label="Article extract" />
                    <Input type="checkbox" id="isGenerated" label="Is Generated?" />
                </Form>
                <Table headers={["ID", "Article ID", "Date", "Grades", "See"]} data={this.state.results.map(result => {
                    return [
                        result.id,
                        result.Article.id,
                        moment(result.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
                        result.Grades.map(grade => grade.grade).join(', '),
                        <Link className="btn" to={"/article/" + result.Article.id}>
                            <span className="oi" data-glyph="eye" />
                            See
                        </Link>
                    ]
                })} />
            </div>
        );
    }
}