# translate-templates
A tool that uses Google Translate API to translate template strings located in a JSON file while preserving handlebars style templates in English.

<!-- [![Build Status](https://travis-ci.org/nmehta6/morpheus.svg)](https://travis-ci.org/nmehta6/morpheus)
![Dependency Status](https://david-dm.org/nmehta6/morpheus.svg)
[![Coverage Status](https://coveralls.io/repos/nmehta6/morpheus/badge.svg?branch=master&service=github)](https://coveralls.io/github/nmehta6/morpheus?branch=master)
 -->

## Installation

```bash
npm install translate-templates --save-dev
```

## Usage overview
```javascript
let translate = require('translate-templates')
translate(options)
```

### options (all required)
`options.apiKey`: API key for Google Translate
`options.outDir`: Directory where translations should go
`options.englishFile`: Path to the English file to translate from
`options.locales`: An array of locales to translate to. Use any locale accepted by Google Translate.
