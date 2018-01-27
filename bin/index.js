#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const request = require('request');
const eachSeries = require('async/eachSeries');
const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Please declare your config file path. \n\
For example, `combo-script ./combo.json`');
  process.exit(1);
}

const absPath = path.resolve(inputPath);
const workspace = path.join(absPath, '..');
let config;

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

  const fstream = fs.createWriteStream(resolve(distName), {
    flags: counter > 1 ? 'a' : 'w'
  });
  if (counter > 1) fstream.write('\n');

  if (item.url) download(item, fstream, cb);
  else copy(item, fstream, cb);

}, (err) => {
  if (err) throw err;
});

function resolve(fpath) {
  return path.isAbsolute(fpath) ? fpath : path.resolve(workspace, fpath);
}

function download(item, writeStream, cb) {
  request
    .get(item.url)
    .pipe(writeStream)
    .on('finish', cb)
    .on('error', (err) => {
      throw err;
    });
}

function copy(item, writeStream, cb) {
  fs.createReadStream(resolve(item.path))
    .pipe(writeStream)
    .on('finish', cb)
    .on('error', (err) => {
      throw err;
    });
}
