import React from 'react';
import * as statsActions from '../../actions/statsActions';
import Message from '../glui/messages/Message';
import { Redirect } from 'react-router-dom';
import { Panel } from '../glui/ui/Panel';


export default class ShowArticle extends React.Component
{

    constructor() {
        super();

        this.state = {
            article: null,
            errorMessage: null,
            isAuthorized: true
        };
    }

    componentWillMount() {
        statsActions.fetchStats({
            articleId: this.props.articleId,
            user: this.props.user
        }, true).then(res => {
            if (res.data.length === 0)
                this.setState({ errorMessage: 'This article doesn\'t exist' });
            else
                this.setState({ article: res.data[0] });
        }).catch(err => {
            this.setState({ isAuthorized: false });
        });
    }

    render() {
        if (!this.state.isAuthorized) return <Redirect to="/"/>;
        const article = this.state.article !== null ? (
            <div>
                <h1>Summaries</h1>
                <div className="cards">
                    { this.state.article.Summaries.map(summary => (
                        <div key={summary.id} className="card large">
                            <div className="card-content" style={{
                                textAlign: 'justify',
                                lineHeight: '1.8em',
                                fontSize: '17px'
                            }}>{ summary.content }</div>
                            <ul className="card-list">
                                {summary.Grades.map(grade => (
                                    <li key={grade.id}>grade: {grade.grade}, is incorrect? {grade.isIncorrect ? 'Yes' : 'No'}</li>
                                ))}
                            </ul>
                        </div>
                    )) }
                </div>
                <Panel title={ this.state.article.title !== null ? this.state.article.title : 'No title' }>
                    <p className="article">{ this.state.article.fullText }</p>
                    <div className="author">{ this.state.article.author }</div>
                </Panel>
            </div>
        ) : null;
        return this.state.errorMessage !== null ? (
            <Message error>{ this.state.errorMessage }</Message>
        ) : article;
    }
}
