const db = require('../models');
const moment = require('moment');

exports.grade = (query, req) => {
    console.log(query.grade);
    if (query.grade !== undefined) {
        let hasInclude = false;
        req.include.forEach(inc => {
            if(inc.model === db.Grade) {
                hasInclude = true;
            }
        });
        if(hasInclude) {
            req.include.map(inc => {
                if (inc.model === db.Grade) {
                    inc.where = {
                        ...inc.where,
                        grade: parseInt(query.grade)
                    };
                }
                return inc;
            });
        } else req.include.push({
            model: db.Grade,
            where: {
                grade: parseInt(query.grade)
            }
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
                $gt: moment(query.date).format('YYYY-MM-DD'),
                $lt: moment(query.date).add(1, 'day').format('YYYY-MM-DD')
            }
        };
    }
    return req;
};

exports.count = (query, req) => {
    if(query.count !== undefined) {
        req.attributes = [[db.sequelize.fn('COUNT', db.sequelize.col('Summary.id')), 'count']];
        req.group = 'Grades.grade';
    }
    return req;
};

exports.category = (query, req) => {
    if (query.category !== undefined) {
        req.include.map(inc => {
            if(inc.model === db.Article) {
                const toPush = {
                  model: db.Category,
                  where: {name: query.category}
                };

                if(inc.include !== undefined) inc.include.push(toPush);
                else inc.include = [toPush];
            }
            return inc;
        });
    }
    return req;
};

exports.keywords = (query, req) => {
    if (query.keywords !== undefined) {
        const keywords = query.keywords.split('+');
        req.include.map(inc => {
            if(inc.model === db.Article) {
                const toPush = {
                    model: db.Keyword,
                    where: {
                        name: {
                            $in: keywords
                        }
                    }
                };

                if(inc.include !== undefined) inc.include.push(toPush);
                else inc.include = [toPush];
            }
            return inc;
        });
    }
    return req;
};

exports.id = (query, req) => {
    if(query.id !== undefined) {
        req.where = {...req.where, id: parseInt(query.id)};
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
                    $like: '%' + query.fullText + '%'
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
