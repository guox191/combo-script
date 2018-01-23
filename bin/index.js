const fs = require('fs');
const axios = require('axios');
const eachSeries = require('async/eachSeries');
const config = require('../example/resources.json');
const distName = config.dist || 'dist.js'

eachSeries(config.resources, (item, cb) => {
  if (!item.url) return cb();

  axios({
    method: 'get',
    url: item.url,
  })
    .then(res => {
      fs.writeFileSync(distName, res.data + '\n', { flag: 'a' });
      cb();
    })
    .catch(err => {
      cb(err);
    });
}, err => {
  if (err) {
    console.log(err)
  }
})
