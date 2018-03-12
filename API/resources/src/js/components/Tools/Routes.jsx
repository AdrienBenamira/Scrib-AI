import React from 'react';
import Redirect from 'react-router-dom/es/Redirect';
import Route from 'react-router-dom/es/Route';
import Switch from 'react-router-dom/es/Switch';
import { Login } from '../Admin/Login';
import { Search } from '../Admin/Search';
import Settings from '../Admin/Settings';
import ShowArticle from '../Admin/ShowArticle';
import Stats from '../Admin/Stats';
import SelectModel from '../Admin/Train/SelectModel';
import Train from '../Admin/Train/Train';
import { Intro } from '../Intro';
import Summarize from '../Summary/Summarize';
import SummarizeSite from '../Summary/SummarizeSite';


export const Routes = (propsRoutes) => {
    return (
        <Switch>
            <Route exact path="/" component={ Intro }/>
            <Route path="/summarize_site" render={ (props) => (
                <SummarizeSite { ...props } socket={ propsRoutes.socket } dispatch={ propsRoutes.dispatch }
                               text={ propsRoutes.text } workers={ propsRoutes.workers }/>
            ) }/>
            <Route path="/summarize" render={ (props) => (
                <Summarize { ...props } socket={ propsRoutes.socket } dispatch={ propsRoutes.dispatch }
                           text={ propsRoutes.text } workers={ propsRoutes.workers }/>
            ) }/>
            <Route path="/login" render={ (props) => (
                propsRoutes.user.connected ?
                    <Redirect to="/stats"/> :
                    <Login { ...props } dispatch={ propsRoutes.dispatch } failed={ propsRoutes.user.failed }
                           connecting={ propsRoutes.user.connecting }/>
            ) }/>
            <Route path="/stats" render={ (props) => {
                console.log(propsRoutes.user);
                return propsRoutes.user.connected || propsRoutes.user.connecting ?
                    <Stats { ...props } user={ propsRoutes.user }/> :
                    <Redirect to='/'/>;
            } }/>
            <Route path="/search" render={ (props) => (
                propsRoutes.user.connected || propsRoutes.user.connecting ?
                    <Search { ...props } stats={ propsRoutes.stats } dispatch={ propsRoutes.dispatch }
                            user={ propsRoutes.user }/> :
                    <Redirect to='/'/>
            ) }/>
            <Route path="/settings" render={ (props) => (
                propsRoutes.user.connected || propsRoutes.user.connecting ?
                    <Settings dispatch={ propsRoutes.dispatch } socket={ propsRoutes.socket }
                              user={ propsRoutes.user } { ...props } /> :
                    <Redirect to='/'/>
            ) }/>
            <Route path="/train/:model" render={ ({ match }) => (
                propsRoutes.user.connected || propsRoutes.user.connecting ?
                    <Train dispatch={ propsRoutes.dispatch } user={ propsRoutes.user } models={ propsRoutes.models }
                           modelName={ match.params.model } socket={ propsRoutes.socket } /> :
                    <Redirect to='/'/>
            ) }/>
            <Route path="/train" render={ (props) => (
                propsRoutes.user.connected || propsRoutes.user.connecting ?
                    <SelectModel dispatch={ propsRoutes.dispatch } user={ propsRoutes.user }
                                 models={ propsRoutes.models } { ...props } /> :
                    <Redirect to='/'/>
            ) }/>
            <Route path="/article/:id" render={ ({ match }) => (
                <ShowArticle user={ propsRoutes.user } articleId={ match.params.id }/>
            ) }/>
        </Switch>
    );
};
