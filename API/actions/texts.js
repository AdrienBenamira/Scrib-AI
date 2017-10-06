const axios = require('axios');
const config = require('../config/default');
const db = require('../models');

// const Article = require('../models/article')(db.sequelize, db.Sequelize.DataTypes);
// const Summary = require('../models/summary')(db.sequelize, db.Sequelize.DataTypes);
// const Grade = require('../models/grade')(db.sequelize, db.Sequelize.DataTypes);

/**
 * Execute summarization
 * @param req
 * @param res
 */
exports.summarize = (req, res) => {
    if (req.body.article.length > config.summary.minCharacter) {
         axios.post(config.api.host, { article: req.body.article, ratio: req.body.ratio}).then(result => {
             console.log('article summarized');
             res.json({ summary: result.data.resp_resume, chrono: result.data.chrono,gain: result.data.gain });
         }).catch(err => {
             console.log('an error has occured during summarization', err);
             res.sendStatus(500);
         });
        //res.json({chrono: 2, summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu massa interdum urna rutrum aliquam. Nam ultricies, ex nec pulvinar scelerisque, dui odio efficitur sapien, id volutpat lorem dui et felis. Vivamus dictum sagittis est, sed placerat odio congue venenatis.'})
    } else {
        res.status(400).json({ message: 'The text must be at least '+ config.summary.minCharacter +' characters.' });
    }
};




/**
 * Execute summarization for website
 * @param req
 * @param res
 */
exports.summarizeSite = (req, res) => {
    if (req.body.article.length > config.summary.minCharacter) {
        axios.post(config.api.host_site, { url: req.body.article, ratio: req.body.ratio}).then(result => {
            console.log('website summarized');
            res.json({ summary: result.data.resp_resume, chrono: result.data.chrono,gain: result.data.gain,texte_original: result.data.texte_original,titre:result.data.titre, authors:result.data.authors, publish_date:result.data.publish_date, keywords:result.data.keywords, image: result.data.images });
        }).catch(err => {
            console.log('an error has occured during summarization', err);
            res.sendStatus(500);
        });
        //res.json({chrono: 2, summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu massa interdum urna rutrum aliquam. Nam ultricies, ex nec pulvinar scelerisque, dui odio efficitur sapien, id volutpat lorem dui et felis. Vivamus dictum sagittis est, sed placerat odio congue venenatis.'})
    } else {
        res.status(400).json({ message: 'coucouThe text must be at least '+ config.summary.minCharacter +' characters.' });
    }
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

exports.get = (req, res) => {
    const query = req.query;

    let dbReq = {
        attributes: [],
        where: {},
        include: [
            {
                model: db.Grade,
                where: {}
            }, {
                model: db.Article,
                where: {},
                include: [
                    {
                        model: db.Category,
                        where: {}
                    },
                    {
                        model: db.Keyword,
                        where: {}
                    }
                ]
            }
        ]
    };

    dbReq = statsQueries.grade(query, dbReq);
    dbReq = statsQueries.isIncorrect(query, dbReq);
    dbReq = statsQueries.date(query, dbReq);
    dbReq = statsQueries.category(query, dbReq);
    dbReq = statsQueries.keywords(query, dbReq);
    dbReq = statsQueries.count(query, dbReq);
    dbReq = statsQueries.summaryId(query, dbReq);
    dbReq = statsQueries.articleId(query, dbReq);
    dbReq = statsQueries.fullText(query, dbReq);
    dbReq = statsQueries.isGenerated(query, dbReq);

    console.log(dbReq);

    db.Summary.findAll(dbReq).then((result) => {
        console.log(result);
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });

};
