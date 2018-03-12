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

exports.toggleAutomatic = async (req, res) => {
    let model = await db.Model.findOne({where: {name: req.query.name}});
    model.is_automatic = !model.is_automatic;
    await model.save();
    res.sendStatus(200);
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
exports.addAction = (req, res, io) => {
    db.Model.findOne({
        where: { name: req.body.model }
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
            }).then(() => {
                if(model.is_automatic) {
                    io.sockets.to('workers').emit('execMetricRequest');
                } else {
                    res.sendStatus(200);
                }
            }).catch(() => res.sendStatus(400));
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
        where: { name: req.query.model }
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
                    res.sendStatus(400);
                });
            }).catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    }).catch((err) => {
        console.log(err);
        res.sendStatus(400);
    });
};

exports.getActions = (req, res) => {
    db.Model.findOne({
        where: { name: req.query.model }
    }).then((model) => {
        // Get all with at least two articles
        model.getModelActions({
            attributes: ['article_id', [db.sequelize.fn('count', 'article_id'), 'count']],
            where: {
                treated: false
            },
            having: db.sequelize.where(db.sequelize.fn('count', db.sequelize.col('count')), {
                $gte: 2
            }),
            group: ['article_id']
        }).then(articles => {
            if (articles.length > 0) {
                const article_id = articles[Math.floor(Math.random() * articles.length)].article_id;
                model.getModelActions({
                    where: {
                        treated: false,
                        article_id
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
            } else {
                res.json([]);
            }
        }).catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
    }).catch((err) => {
        console.log(err);
        res.sendStatus(400);
    });
};

exports.getMetrics = async (req, res) => {
    let metrics = await db.Metric.findAll({
        order: [['order', 'DESC']]
    });
    res.json(metrics);
};

exports.addMetric = async (req, res) => {
    let lastOrder = await db.Metric.findOne({
        attributes: ['order'],
        order: [['order', 'DESC']]
    });
    if (lastOrder == null) lastOrder = 0;
    else lastOrder = lastOrder.order + 1;
    await db.Metric.create({
        name: req.query.name,
        order: lastOrder
    });
    res.sendStatus(200);
};

exports.changeOrder = async (req, res) => {
    console.log('oui');
    let elem = await db.Metric.findOne({ where: { name: req.query.name } });
    let prevElem = await db.Metric.findOne({ where: { order: req.body.order } });
    prevElem.order = elem.order;
    elem.order = req.body.order;
    await elem.save();
    await prevElem.save();
    res.sendStatus(200);
};

exports.sendReadyActions = async (io) => {
    // Get all with at least two articles
    const articles = await db.ModelAction.findAll({
        attributes: ['model_id', 'article_id', [db.sequelize.fn('count', 'article_id'), 'count']],
        where: {
            treated: false
        },
        having: db.sequelize.where(db.sequelize.fn('count', db.sequelize.col('count')), {
            $gte: 2
        }),
        group: ['article_id', 'model_id']
    });
    if (articles.length > 0) {
        const article = articles[Math.floor(Math.random() * articles.length)];
        const article_id = article.article_id;
        const model_id = article.model_id;
        const actions = await db.ModelAction.findAll({
            where: {
                treated: false,
                article_id,
                model_id
            },
            limit: 2,
            include: [
                {
                    model: db.Article
                }
            ]
        });
        const metrics = await db.Metric.findAll();
        io.sockets.to('workers').emit('execMetric', metrics, actions);
    } else {
        io.sockets.to('workers').emit('execMetricCancelled');
    }
};

exports.saveAutoPreference = async (io, data) => {
    console.log(data);
    // Compute the score according to the results
    const results = data.results;
    const metrics = await db.Metric.findAll({order: [['order', 'ASC']]});
    let choices = [];
    metrics.forEach(metric => {
        const diff = results[0][metric.name].score - results[1][metric.name].score;
        if(diff > 0) choices.push(1);
        else if(diff < 0) choices.push(2);
        else choices.push(0);
    });
    const betterLeft = choices.filter(x => x === 1).length;
    const betterRight = choices.filter(x => x === 2).length;
    let score = 0;
    if(betterLeft > betterRight) score = 1;
    else if(betterRight > betterLeft) score = 2;
    else {
        const nonZeros = choices.filter(x => x !== 0);
        if(nonZeros.length) score = nonZeros[0];
        else score = 0;
    }
    // Store it the database
    const model = await db.Model.findOne({
        where: { id: data.model_id }
    });
    const actionLeft = await db.ModelAction.findOne({
        where: {
            id: data.action_left,
            treated: false
        }
    });
    const actionRight = await db.ModelAction.findOne({
        where: {
            id: data.action_right,
            treated: false
        }
    });
    if(actionRight != null && actionLeft != null) {
        actionLeft.treated = true;
        actionRight.treated = true;
        console.log("New automatic save with score: ", score);
        actionLeft.save();
        actionRight.save();
        await db.ModelPreference.create({
            model_id: model.id,
            action_left_id: actionLeft.id,
            action_right_id: actionRight.id,
            score: score
        }, {
            include: [db.Model, db.ModelAction, db.ModelAction]
        });
    }
};
