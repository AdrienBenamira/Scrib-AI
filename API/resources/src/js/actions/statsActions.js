import axios from 'axios';
import { config } from '../config/default';


export const fetchStats = (opt, article=false) => {

    let url = config.api.host + '/user/' + (article ? 'article' : 'summary');
    let params = [];

    if(opt.grade && opt.grade !== null) params.push('grade=' + opt.grade);
    if(opt.isIncorrect && opt.isIncorrect !== null) params.push('isIncorrect=' + opt.isIncorrect);
    if(opt.count && opt.count !== null) params.push('count=1');
    if(opt.date && opt.date !== null) params.push('date=' + opt.date);
    if(opt.category && opt.category !== null) params.push('category=' + opt.category);
    if(opt.keywords && opt.keywords !== null) params.push('keywords=' + opt.keywords.join('+'));
    if(opt.id && opt.id !== null) params.push('id=' + opt.id);
    if(opt.articleId && opt.articleId !== null) params.push('id=' + opt.articleId);
    if(opt.summaryId && opt.summaryId !== null) params.push('id=' + opt.summaryId);
    if(opt.fullText && opt.fullText !== null) params.push('fullText=' + opt.fullText);
    if(opt.isGenerated && opt.isGenerated !== null) params.push('fullText=' + opt.isGenerated);

    if(params.length > 0) url = url + '?' + params.join('&');

    return axios.get(url, {
        auth: {
            username: opt.user.username,
            password: opt.user.password
        }
    });
};

export const updateOptions = (opt) => {
    return {
        type: 'OPTIONS_UPDATED',
        payload: opt
    };
};

export const fetchResults = () => {
    return {
        type: 'FETCHING_RESULTS'
    };
};

export const fetchResultsFulfilled = (results) => {
    return {
        type: 'RESULTS_FETCHED',
        payload: results
    };
};

export const fetchingFailed = (error) => {
    return {
        type: 'FETCHING_FAILED',
        payload: error
    };
};