const db = require('../models');

/**
 * Add a dataset
 * @param req
 * @param res
 */
exports.add = (req, res) => {
  db.Dataset.create({
     name: req.query.name
  }).then(() =>
      res.sendStatus(200)
  ).catch(() =>
      res.sendStatus(500)
  );
};

/**
 * Get all datasets
 * @param req
 * @param res
 */
exports.get = (req, res) => {
    db.Dataset.findAll().then((datasets) => {
        res.json(datasets);
    }).catch(() => {
        res.sendStatus(500);
    });
};

/**
 * Count the number of article in the dataset
 * @param req
 *  - query { dataset }
 * @param res
 */
exports.count = (req, res) => {
    db.Dataset.findOne({where: {name: req.query.dataset}}).then((dataset) => {
        if(dataset !== null) {
            dataset.getArticles({
                attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('Article.id')), 'count']]
            }).then(articles => {
                res.json(articles);
            }).catch(() => res.sendStatus(500));
        } else {
            res.sendStatus(404);
        }
    }).catch(() => res.sendStatus(500));
};

/**
 * Add an article to a given dataset
 * @param req
 *  - body{
 *      dataset,
 *      summaries: [{
 *          content
 *      }],
 *      article: {
 *          fullText
 *      }
 *  }
 * @param res
 */
exports.addArticle = (req, res) => {
    console.log(req.body);
    db.Dataset.findOne({where: {name: req.body.dataset}}).then((dataset) => {
        if(dataset !== null) {
            let summaries = [];
            if(req.body.summaries !== undefined && req.body.summaries !== null  && req.body.summaries.length > 0) {
                req.body.summaries.forEach(summary => {
                    summaries.push({
                        content: summary.content,
                        is_generated: false,
                    });
                });
            }
            db.Article.create({
                fullText: req.body.article.fullText,
                Summaries: summaries
            }, {
                include: {
                    association: db.Article.Summaries // Association with the summaries
                }
            }).then((article) => {
                article.addDataset(dataset).then(() => {
                    res.sendStatus(200);
                }).catch(() => {
                    res.sendStatus(500);
                });
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
        } else {
            res.sendStatus(404);
        }
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
};

/**
 * Get Articles from a dataset
 * @param req
 *  - query {
 *      name,
 *      limit (10),
 *      page (0),
 *      number (limit)
 *  }
 * @param res
 */
exports.getArticles = (req, res) => {
    db.Dataset.findOne({where: {name: req.query.name}}).then(dataset => {
        if(dataset !== null) {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const page = req.query.page ? parseInt(req.query.page) : 0;
            const number = req.query.number ? parseInt(req.query.number) : limit;
            const offset = req.query.offset ? parseInt(req.query.offset) : page*number;

            dataset.getArticles({
                limit: number,
                offset: offset,
                include: [
                    {
                        model: db.Summary,
                    }
                ]
            }).then((articles) => {
                res.json(articles);
            }).catch(() => {
                res.sendStatus(500);
            })
        } else {
            res.sendStatus(404);
        }
    })
};
