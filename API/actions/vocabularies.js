const db = require('../models');

exports.add = (req, res) => {
    db.Vocabulary.findOne({where: { word: req.query.word }}).then((word) => {
        if(word === null) {
            db.Vocabulary.create({
                word: req.query.word,
                count: 1
            }).then(() => {
                res.sendStatus(200);
            }).catch(() => {res.sendStatus(500)});
        } else {
            word.count = word.count + 1;
            word.save();
            res.sendStatus(200);
        }
    }).catch(() => {
        res.sendStatus(500);
    });
};

exports.getOne = (req, res) => {
    db.Vocabulary.findOne({where: { word: req.query.word }}).then((word) => {
        if(word !== null) res.json(word);
        else res.sendStatus(404);
    }).catch(() => {
        res.sendStatus(500);
    });
};

exports.get = (req, res) => {
    const limit = req.query.limit ? req.query.limit : 10;
    const page = req.query.page ? req.query.page : 0;
    const number = req.query.number ? req.query.number : limit;
    const offset = req.query.offset ? req.query.offset : page*number;
    db.Vocabulary.findAll({
        order: [
            ['count', 'DESC']
        ],
        limit: parseInt(number),
        offset: offset
    }).then((words) => {
        if(words !== null) res.json(words);
        else res.sendStatus(404);
    }).catch((err) => {
        res.sendStatus(500);
    });
};
