#!/usr/bin/env node
var argv = require('yargs')
    .array('locales')
    .options('k', {
      alias: 'api-key',
      demand: true,
      describe: 'API key for Google Translate.',
      type: 'string'
    }, 'o', {
      alias: 'out-dir',
      demand: true,
      describe: 'Directory where translated files should go.',
      type: 'string'
    }, 'e', {
      alias: 'english-file',
      demand: true,
      describe: 'Path to the source English (en_US) file',
      type: 'string'
    }, 'l', {
      alias: 'locales',
      demand: true,
      describe: 'An array of locales to translate to. Example: es_MX',
      type: 'array'
    })
    .argv

var translate = require('../index.js')

translate(argv)
