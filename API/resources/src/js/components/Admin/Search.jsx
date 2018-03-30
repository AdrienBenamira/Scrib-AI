import React from 'react';
import Form from '../glui/form/Form';
import Input from '../glui/form/Input';
import * as statsActions from '../../actions/statsActions';
import Table from '../glui/table/Table';
import { Link } from 'react-router-dom';
import moment from 'moment';


export const Search = (props) => (
    <div>
        <h1><span className="oi" data-glyph="magnifying-glass"/> Search</h1>
        <Form onSubmit={ (values) => {
            if(props.match.params.page) values['page'] = props.match.params.page;
            Object.getOwnPropertyNames(values).forEach(function (key) {
                if (values[key] === undefined || values[key] === '') values[key] = null;
            });
            props.dispatch((dispatch) => {
                dispatch(statsActions.updateOptions(values));
                dispatch(statsActions.fetchResults());
                statsActions.fetchStats({ ...values, user: props.user }).then(res => {
                    dispatch(statsActions.fetchResultsFulfilled(res.data));
                }).catch(err => {
                    dispatch(statsActions.fetchingFailed('An error has occured.'));
                });
            });
        } } vertical submit="Search">
            <Input id="grade" label="Grade"/>
            <Input type="checkbox" id="isIncorrect" label="IsIncorrect"/>
            <Input type="date" id="date" label="Date"/>
            <Input id="id" label="Summary ID"/>
            <Input id="articleId" label="Article ID"/>
            <Input id="fullText" label="Article extract"/>
            <Input type="checkbox" id="isGenerated" label="Is Generated?"/>
        </Form>
        <Table headers={ ['ID', 'Article ID', 'Date', 'Grades', 'See'] } data={ props.stats.results.map(result => {
            let value = [
                result.id,
                result.Article.id,
                moment(result.createdAt).format('MMMM Do YYYY, h:mm:ss a')];
            if(result.Grades !== undefined) value.push(result.Grades.map(grade => grade.grade).join(', '));
            else value.push('-');
            value.push(
                <Link className="btn" to={ '/article/' + result.Article.id }>
                    <span className="oi" data-glyph="eye"/>
                    See
                </Link>);
            return value;
        }) }/>
    </div>
);
