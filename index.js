var fs = require('fs')
var highland = require('highland')
var flatten = require('flat')
var languages = require('../../config/translations')
var magicWord = '777'

function translate (options) {
  var en = require(options.englishFile)

  function replaceBindingsWithMagicCharacter (text) {
    if (typeof text !== 'string') {
      return text
    }
    return text.replace(/(\{\{.+?\}\})/gi, magicWord)
  }

  function replaceMagicCharsWithBindings (result) {
    var keyValues = flatten(en)
    var values = highland.values(keyValues)

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

  // map the languages array to writable streams
  // streams are not being passed back to gulp since no other task is chaining
  languages.map(language => {
    var flattenedEnglishFile = flatten(en)
    var englishKeys = highland.keys(flattenedEnglishFile)
    var arrayOfEnglishText = highland.values(flattenedEnglishFile)
    var googleTranslate = require('google-translate')(options.apiKey)

    var translateToLanguage = (s, cb) => googleTranslate.translate(s, 'en', language, cb)

    var translate = highland
      .wrapCallback(translateToLanguage)

    var translations = arrayOfEnglishText
      .filter(isString)
      .map(replaceBindingsWithMagicCharacter)
      .batch(10)
      .map(translate)
      .flatten()
      .flatMap(replaceMagicCharsWithBindings)

    return englishKeys
      .zip(translations)
      .reduce((x, y) => highland.set(y[0], y[1], x), {})
      .map(flatten.unflatten)
      .map(s => JSON.stringify(s, null, 4))
      .pipe(fs.createWriteStream(`${options.outDir}/${language}.json`))
  })
}

module.exports = translate
