const statsSummaryQueries = require('./statsSummaryQueries');
const statsArticleQueries = require('./statsArticleQueries');
const axios = require('axios');
const config = require('../config/default');
const db = require('../models');

/**
 * Execute summarization
 * @param req
 * @param res
 */
exports.summarize = (req, res) => {
    if (req.body.article.length > config.summary.minCharacter) {
        axios.post(config.api.host, { article: req.body.article, ratio: req.body.ratio }).then(result => {
            console.log('article summarized');
            res.json({ summary: result.data.resp_resume, chrono: result.data.chrono, gain: result.data.gain });
        }).catch(err => {
            console.log('an error has occured during summarization', err);
            res.sendStatus(500);
        });
    } else {
        res.status(400).json({ message: 'The text must be at least ' + config.summary.minCharacter + ' characters.' });
    }
};

/**
 * Execute summarization for website
 * @param req
 * @param res
 */
exports.summarizeSite = (req, res) => {
    axios.post(config.api.host_site, { url: req.body.article, ratio: req.body.ratio }).then(result => {
        console.log('website summarized');
        res.json({
            summary: result.data.resp_resume,
            chrono: result.data.chrono,
            gain: result.data.gain,
            fullText: result.data.texte_original,
            titre: result.data.titre,
            authors: result.data.authors,
            publish_date: result.data.publish_date,
            keywords: result.data.keywords,
            image: result.data.images
        });
    }).catch(err => {
        console.log('an error has occured during summarization', err);
        res.sendStatus(500);
    });
};

/**
 * Add a summary to the database
 * @param req
 * @param res
 */
exports.store = (req, res) => {
    const body = req.body;
    let summaries = [{
        content: body.summary.content, is_generated: true, Grades: [{
            grade: body.summary.grade, is_incorrect: !body.summary.isAccepted
        }]
    }];
    // Push the user version if he edited
    if (parseInt(req.query.edited)) {
        summaries.push({
            content: body.summary.userVersion, is_generated: false
        });
    }
    // Add the article
    db.Article.create({
        fullText: body.article.fullText, fullText: null, Summaries: summaries
    }, {
        include: {
            association: db.Article.Summaries, // Association with the summaries
            include: [db.Summary.Grades] // And the grades
        }
    }).then(() => {
        res.status(200).json({ success: true });
    }).catch((err) => {
        console.log(err);
        switch (err.name) {
            case 'SequelizeValidationError':
                res.status(400).json({ message: 'The article or summary is not correct (article at least 500 characters).' });
                break;
            default:
                res.status(500).json({ message: 'An error has occurred, please try again.' });
                break;
        }
    });
};

exports.getSummary = (req, res) => {
    const query = req.query;

    let dbReq = {
        where: {},
        include: [
            {
                model: db.Grade,
                where: {}
            }, {
                model: db.Article,
                where: {}
            }
        ]
    };

    dbReq = statsSummaryQueries.grade(query, dbReq);
    dbReq = statsSummaryQueries.isIncorrect(query, dbReq);
    dbReq = statsSummaryQueries.date(query, dbReq);
    dbReq = statsSummaryQueries.category(query, dbReq);
    dbReq = statsSummaryQueries.keywords(query, dbReq);
    dbReq = statsSummaryQueries.count(query, dbReq);
    dbReq = statsSummaryQueries.id(query, dbReq);
    dbReq = statsSummaryQueries.articleId(query, dbReq);
    dbReq = statsSummaryQueries.fullText(query, dbReq);
    dbReq = statsSummaryQueries.isGenerated(query, dbReq);

    db.Summary.findAll(dbReq).then((result) => {
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
};

exports.getArticle = (req, res) => {
    const query = req.query;

    let dbReq = {
        where: {},
        include: [
            {
                model: db.Summary,
                where: {},
                include: [{
                    model: db.Grade,
                    where: {}
                }]
            }
        ]
    };

    dbReq = statsArticleQueries.date(query, dbReq);
    dbReq = statsArticleQueries.category(query, dbReq);
    dbReq = statsArticleQueries.keywords(query, dbReq);
    dbReq = statsArticleQueries.count(query, dbReq);
    dbReq = statsArticleQueries.summaryId(query, dbReq);
    dbReq = statsArticleQueries.id(query, dbReq);
    dbReq = statsArticleQueries.fullText(query, dbReq);
    dbReq = statsArticleQueries.isGenerated(query, dbReq);

    db.Article.findAll(dbReq).then((result) => {
        res.json(result);
    }).catch(err => {
        res.sendStatus(500);
    });
};
