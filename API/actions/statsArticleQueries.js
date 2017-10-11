const db = require('../models');
const moment = require('moment');

exports.date = (query, req) => {
    if (query.date !== undefined) {
        req.where = {
            ...req.where, createdAt: {
                $gt: moment(query.query.date).format('YYYY-MM-DD'),
                $lt: moment(query.query.date).add(1, 'day').format('YYYY-MM-DD')
            }
        };
    }
    return req;
};

exports.category = (query, req) => {
    if (query.category !== undefined) {
        req.include.push({
            model: db.Category,
            where: {
                name: query.category
            }
        });
    }
    return req;
};

exports.keywords = (query, req) => {
    if (query.keywords !== undefined) {
        console.log(query.keywords);
        const keywords = query.keywords.split('+');
        console.log(keywords);
        req.include.push({
            model: db.Keyword,
            where: {}
        });
    }
    return req;
};

exports.count = (query, req) => {
    if (query.count !== undefined) {
        req.attributes = [[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']];
        req.group = 'id';
    }
    return req;
};

exports.summaryId = (query, req) => {
    if (query.summaryId !== undefined) {
        req.include.map(inc => {
            if (inc.model === db.Summary) {
                inc.where = { ...inc.where, id: parseInt(query.summaryId) };
            }
            return inc;
        });
    }
    return req;
};

exports.id = (query, req) => {
    if (query.id !== undefined) {
        req.where = { ...req.where, id: parseInt(query.id) };
    }
    return req;
};

exports.fullText = (query, req) => {
    if (query.fullText !== undefined) {
        req.where = {
            ...req.where, fullText: {
                $like: '%' + query.fullText + '%'
            }
        };
    }
    return req;
};

exports.isGenerated = (query, req) => {
    if (query.isGenerated !== undefined) {
        req.include.map(inc => {
            if (inc.model === db.Summary) {
                inc.where = { ...inc.where, is_generated: parseInt(query.isGenerated) };
            }
            return inc;
        });
    }
    return req;
};
