var fs = require('fs')
var path = require('path')
var _ = require('highland')
var flatten = require('flat')
var magicWord = '777'

function translate (options) {
  var en = require(path.join(__dirname, options.englishFile))
  var locales = options.locales

  function replaceBindingsWithMagicCharacter (text) {
    if (typeof text !== 'string') {
      return text
    }
    return text.replace(/(\{\{.+?\}\})/gi, magicWord)
  }

  function replaceMagicCharsWithBindings (result) {
    var keyValues = flatten(en)
    var values = _.values(keyValues)

    var originalText = values
      .find(v => replaceBindingsWithMagicCharacter(v) === result.originalText)
      .map(v => {
        var replacements = v.match(/\{\{.*?\}\}/g)
        return result.translatedText.replace(new RegExp(magicWord, 'g'), () => replacements.shift() || '')
      })

    return originalText
  }

  function isString (str) {
    return typeof str === 'string'
  }

  // map the locales array to writable streams
  // streams are not being passed back to gulp since no other task is chaining
  locales.map(language => {
    var flattenedEnglishFile = flatten(en)
    var englishKeys = _.keys(flattenedEnglishFile)
    var arrayOfEnglishText = _.values(flattenedEnglishFile)
    var googleTranslate = require('google-translate')(options.apiKey)

    var translateToLanguage = (s, cb) => googleTranslate.translate(s, 'en', language, cb)

    var translate = _
      .wrapCallback(translateToLanguage)

    var translations = arrayOfEnglishText
      .filter(isString)
      .map(replaceBindingsWithMagicCharacter)
      .batch(10)
      .flatMap(translate)
      .flatMap(replaceMagicCharsWithBindings)

    return englishKeys
      .zip(translations)
      .reduce((x, y) => _.set(y[0], y[1], x), {})
      .map(flatten.unflatten)
      .map(s => JSON.stringify(s, null, 4))
      .pipe(fs.createWriteStream(`${options.outDir}/${language}.json`))
  })
}

module.exports = (options) => {
  translate(options)
}
