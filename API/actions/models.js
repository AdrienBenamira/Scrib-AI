const db = require('../models');

/**
 * Add a new model
 * @param req
 *  - query
 *      - name
 * @param res
 */
exports.add = (req, res) => {
    db.Model.create({
        name: req.query.name
    }).then(() => {
        res.sendStatus(200);
    }).catch(() => {
        res.sendStatus(400);
    });
};

/**
 * Get all
 * @param req
 * @param res
 */
exports.getAll = (req, res) => {
    db.Model.findAll()
        .then(models => {
            res.json(models);
        }).catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
};

/**
 * Add a new action
 * @param req
 *  - body
 *      - model
 *      - article_id
 *      - content
 * @param res
 */
exports.addAction = (req, res) => {
    db.Model.findOne({
        where: {name: req.body.model}
    }).then(model => {
        db.Article.findOne({
            where: {
                id: req.body.article_id
            }
        }).then((article) => {
            db.ModelAction.create({
                content: req.body.content,
                article: article,
                model: model
            }, {
                include: [db.Article, db.Model]
            }).then(() => res.sendStatus(200)).catch(() => res.sendStatus(400));
        }).catch(() => res.sendStatus(400));
    }).catch(() => res.sendStatus(400));
};

/**
 * Add a new preference
 * @param req
 *  - query
 *      - model
 *      - action_left
 *      - action_right
 *      - score (-1, 0, 1, 2)
 * @param res
 */
exports.addPreference = (req, res) => {
  db.Model.findOne({
      where: {name: req.query.model}
  }).then(model => {
      db.ModelAction.findOne({
          where: {
              id: req.query.action_left
          }
      }).then((actionLeft) => {
          db.ModelAction.findOne({
              where: {
                  id: req.query.action_right
              }
          }).then((actionRight) => {
              actionLeft.treated = true;
              actionRight.treated = true;
              actionLeft.save();
              actionRight.save();
              db.ModelPreference.create({
                  model_id: model.id,
                  action_left_id: actionLeft.id,
                  action_right_id: actionRight.id,
                  score: parseInt(req.query.score)
              }, {
                  include: [db.Model, db.ModelAction, db.ModelAction]
              }).then(() => res.sendStatus(200)).catch((err) => {
                  console.log(err);
                  res.sendStatus(400)
              });
          }).catch((err) => {
              console.log(err);
              res.sendStatus(400)
          });
      }).catch((err) => {
          console.log(err);
          res.sendStatus(400)
      });
  }).catch((err) => {
      console.log(err);
      res.sendStatus(400)
  });
};


exports.getActions = (req, res) => {
  db.Model.findOne({
      where: {name: req.query.model}
  }).then((model) => {
      // Get all with at least two articles
        model.getModelActions({
            attributes: ['article_id', [db.sequelize.fn('count', 'article_id'), 'count']],
            where: {
                treated: false,
            },
            having: db.sequelize.where(db.sequelize.fn('count', db.sequelize.col('count')), {
                $gte: 2
            }),
            group: ['article_id']
        }).then(articles => {
            if(articles.length > 0) {
                const article_id = articles[Math.floor(Math.random() * articles.length)].article_id;
                model.getModelActions({
                    where: {
                        treated: false,
                        article_id,
                    },
                    limit: 2,
                    include: [
                        {
                            model: db.Article
                        }
                    ]
                }).then(actions => {
                    res.json(actions);
                }).catch(err => {
                    console.log(err);
                    res.sendStatus(500);
                });
            }else {
                res.json([]);
            }
        }).catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
  }).catch((err) => {
      console.log(err);
      res.sendStatus(400)
  });
};
