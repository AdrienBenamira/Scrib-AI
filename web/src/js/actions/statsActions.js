import axios from 'axios';
import { config } from '../config/default';


export const fetchStats = (opt, article=false) => {

    let url = config.api.host + '/user/' + (article ? 'article' : 'summary');
    let params = [];

    if(opt.grade) params.push('grade=' + opt.grade);
    if(opt.isIncorrect) params.push('isIncorrect=' + opt.isIncorrect);
    if(opt.count) params.push('count=1');
    if(opt.date) params.push('date=' + opt.date);
    if(opt.category) params.push('category=' + opt.category);
    if(opt.keywords) params.push('keywords=' + opt.keywords.join('+'));
    if(opt.id) params.push('id=' + opt.id);
    if(opt.articleId) params.push('id=' + opt.articleId);
    if(opt.fullText) params.push('fullText=' + opt.fullText);
    if(opt.isGenerated) params.push('fullText=' + opt.isGenerated);

    if(params.length > 0) url = url + '?' + params.join('&');

    return axios.get(url, {
        auth: {
            username: opt.user.username,
            password: opt.user.password
        }
    });
};