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
        //res.json({chrono: 2, summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu massa
        // interdum urna rutrum aliquam. Nam ultricies, ex nec pulvinar scelerisque, dui odio efficitur sapien, id
        // volutpat lorem dui et felis. Vivamus dictum sagittis est, sed placerat odio congue venenatis.'})
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
    // res.json({chrono: 2, summary: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu massa
    // interdum urna rutrum aliquam. Nam ultricies, ex nec pulvinar scelerisque, dui odio efficitur sapien, id
    // volutpat lorem dui et felis. Vivamus dictum sagittis est, sed placerat odio congue venenatis.`,
    //         gain: 1,
    //         fullText: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean finibus pretium leo sit amet suscipit. Morbi vel ligula nec ipsum aliquam porttitor quis quis velit. Aenean mattis tellus metus, fringilla mattis lectus imperdiet vel. Maecenas finibus lorem sapien, non tempor orci bibendum vel. Integer aliquet consequat nisi, vitae tincidunt nulla varius vitae. Pellentesque in eleifend mi, porta hendrerit libero. Quisque lacinia, mauris nec iaculis mollis, odio tellus pharetra nibh, nec ultricies nisi quam eget eros. Fusce quis efficitur urna. Mauris molestie ullamcorper velit quis mattis. Praesent dignissim ligula neque, in blandit sapien ultrices in. Maecenas bibendum velit orci, in aliquam quam placerat at. Ut eget rhoncus sem. Praesent iaculis lorem quis lobortis tempus. Aliquam venenatis vehicula nisl eget auctor. Integer ac fringilla felis, ac consequat nulla. Nulla sed vulputate velit.\n" +
    //         "\n" +
    //         "Vivamus dictum commodo turpis. Fusce vehicula purus eu ante pellentesque ullamcorper. Maecenas sollicitudin ante dui, at interdum lorem dictum id. Aliquam et enim at ligula tincidunt euismod ac et ipsum. In at viverra turpis, consectetur euismod felis. Sed a mollis velit. Vivamus sed auctor tortor. Donec leo augue, volutpat id tellus ac, placerat tempus nunc. Maecenas lobortis euismod leo eget tincidunt.\n" +
    //         "\n" +
    //         "Praesent malesuada quam eu facilisis malesuada. Vestibulum condimentum malesuada tempus. Sed scelerisque aliquam ligula, ac efficitur orci gravida nec. Aenean eleifend dui vitae vehicula malesuada. Nunc vel congue quam. Suspendisse vel congue sem, vitae suscipit massa. Nullam lacinia mattis erat non semper. Nam ultricies mi sit amet commodo iaculis. Phasellus dictum faucibus lectus ut ornare. Ut at lectus bibendum velit vestibulum lobortis. Curabitur quam lorem, tempor sed vestibulum sit amet, faucibus et orci. Integer tempor velit vitae eleifend finibus. Suspendisse et lectus mollis, ullamcorper augue ac, dignissim nisl. Ut at consectetur nunc, a malesuada ligula. ",
    //         titre: "title",
    //         authors: "author",
    //         publish_date: "sdsdf",
    //         keywords: "",
    //         image: ""});
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
