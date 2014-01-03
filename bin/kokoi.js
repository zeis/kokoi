#!/usr/bin/env node

var cli = require('../lib/cli');
var kokoi = require('../lib/kokoi');

var conf = cli.parse(process.argv);

kokoi(conf);
