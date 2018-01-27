const fs = require('fs');
const request = require('request');
const eachSeries = require('async/eachSeries');
const config = require('../example/resources.json');
const distName = config.dist || 'dist.js';
let counter = 0;

eachSeries(config.resources, (item, cb) => {
  if (!item.url) return cb();

  console.log(`Resolving ${item.url}...`);
  counter += 1;

  const fstream = fs.createWriteStream(distName, { flags: counter > 1 ? 'a' : 'w' });

  if (counter > 1) {
    fstream.write('\n');
  }

  request
    .get(item.url)
    .on('error', err => {
      throw err;
    })
    .pipe(fstream)
    .on('finish', cb);
}, err => {
  if (err) throw err;
});
