#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const request = require('request');
const eachSeries = require('async/eachSeries');
const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Please declare your config file path. \nFor example, `combo-script ./combo.json`');
  process.exit(1);
}

const absPath = path.resolve(inputPath);
const workspace = path.join(absPath, '..');
let config

try {
  config = require(absPath);
  if (!config.resources || !Array.isArray(config.resources)) throw new Error();
} catch (err) {
  console.error(`Invalid file '${inputPath}'`);
  process.exit(1);
}

const distName = config.dist || 'dist.js';
let counter = 0;

eachSeries(config.resources, (item, cb) => {
  if (!item.url && !item.path) {
    console.warn(`Unresolved: ${JSON.stringify(item)}`);
    return cb();
  }

  console.log(`Resolving ${item.url || item.path}...`);
  counter += 1;

  if (item.url) download(item, cb);
  else copy(item, cb);

}, err => {
  if (err) throw err;
});

function download(item, cb) {
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
}

function copy(item, cp) {
  console.log(1);
}
