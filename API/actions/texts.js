const axios = require('axios')
const config = require('../config/default');


exports.summarize = (req, res) => {
    //TODO
    console.log(req.body.article);
    console.log(config.api.host);
    axios.post(config.api.host,{article: req.body.article}).then(result => {
      console.log(result.data);
      res.send(result.data.resp_resume)
    }).catch(err => {
      console.log(err);
    })


};
