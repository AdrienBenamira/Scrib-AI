const db = require('../models');
const moment = require('moment');

exports.grade = (query, req) => {
    if (query.grade !== undefined) {
        req.include.map(inc => {
            if (inc.model === db.Grade) {
                inc.where = {
                    ...inc.where,
                    grade: parseInt(query.grade)
                };
            }
            return inc;
        });
    }
    return req;
};

exports.isIncorrect = (query, req) => {
    if (query.isIncorrect !== undefined) {
        req.include.map(inc => {
            if (inc.model === db.Grade) {
                inc.where = {
                    ...inc.where,
                    is_incorrect: parseInt(query.isIncorrect)
                };
            }
            return inc;
        });
    }
    return req;
};

exports.date = (query, req) => {
    if(query.date !== undefined) {
        req.where = {
            ...req.where, createdAt: {
                [db.Sequelize.Op.gt]: moment(query.query.date).format('YYYY-MM-DD'),
                [db.Sequelize.Op.lt]: moment(query.query.date).add(1, 'day').format('YYYY-MM-DD')
            }
        };
    }
    return req;
};

exports.category = (query, req) => {
    if(query.category !== undefined) {

        //TODO
    }
    return req;
};

exports.keywords = (query, req) => {
    if(query.keywords !== undefined) {
        console.log(query.keywords);
        const keywords = query.keywords.split("+");
        console.log(keywords);
        //TODO
    }
    return req;
};

exports.count = (query, req) => {
    if(query.count !== undefined) {
        req.attributes = [[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']];
    }
    return req;
};

exports.summaryId = (query, req) => {
    if(query.summaryId !== undefined) {
        req.where = {...req.where, id: parseInt(query.summaryId)};
    }
    return req;
};

exports.articleId = (query, req) => {
    if(query.articleId !== undefined) {
        req.where = {...req.where, article_id: parseInt(query.articleId)};
    }
    return req;
};

exports.fullText = (query, req) => {
    if(query.fullText !== undefined) {
        req.include.map(inc => {
            if(inc.model === db.Article) {
                inc.where = {...inc.where, fullText: {
                    [db.Sequelize.Op.like]: '%' + query.fullText + '%'
                }};
            }
        });
    }
    return req;
};

exports.isGenerated = (query, req) => {
  if(query.isGenerated !== undefined) {
      req.where = {...req.where, is_generated: parseInt(query.isGenerated)};
  }
  return req;
};
