'use strict'

const DESCRIBE = require('mocha').describe
const BEFORE_EACH = require('mocha').beforeEach
const IT = require('mocha').it
const EXPECT = require('chai').expect
const READING_DATA = require('@delucis/reading-data')
const RDTextStats = require('../index')

BEFORE_EACH(function () {
  READING_DATA.uninstall()
  READING_DATA.clean()
})

DESCRIBE('ReadingDataTextStats', function () {
  IT('should be an object', function () {
    EXPECT(RDTextStats).to.be.an('object')
  })

  IT('should have a config object', function () {
    EXPECT(RDTextStats).to.have.property('config')
    EXPECT(RDTextStats.config).to.be.an('object')
  })

  IT('should have a data method', function () {
    EXPECT(RDTextStats).to.have.property('data')
    EXPECT(RDTextStats.data).to.be.a('function')
  })

  IT('should throw an error if there is no text node in the passed data', async function () {
    READING_DATA.use(RDTextStats)
    try {
      await READING_DATA.run()
    } catch (e) {
      EXPECT(e).to.be.an('error')
    }
  })

  IT('should not change the text node', async function () {
    let testScope = 'myArticle'
    let testString = 'This is a short article that needs analysing.'
    let textNode = 'text'

    READING_DATA.preloadData({
      [testScope]: { [textNode]: testString }
    })

    READING_DATA.use(RDTextStats, {
      scope: testScope,
      textNode: textNode
    })

    await READING_DATA.run()

    let output = READING_DATA.data[testScope]

    EXPECT(output).to.have.property(textNode)
    EXPECT(output[textNode]).to.equal(testString)
  })

  IT('should add a node containing statistics', async function () {
    let testScope = 'myArticle'
    let testString = 'This is a short article that needs analysing.'
    let textNode = 'text'
    let outNode = 'stats'
    let metrics = ['wordcount', 'language']

    READING_DATA.preloadData({
      [testScope]: { [textNode]: testString }
    })

    READING_DATA.use(RDTextStats, {
      scope: testScope,
      outNode: outNode
    })

    await READING_DATA.run()

    let output = READING_DATA.data[testScope]

    EXPECT(output).to.have.property(outNode)
    for (let metric of metrics) {
      EXPECT(output[outNode]).to.have.property(metric)
    }
  })

  IT('should add a wordcount metric that returns the number of words in a string', async function () {
    let testScope = 'myArticle'
    let testString = 'This is a short article that needs analysing.'
    let testStringLength = testString.split(' ').length
    let textNode = 'text'
    let outNode = 'stats'

    READING_DATA.preloadData({
      [testScope]: { [textNode]: testString }
    })

    READING_DATA.use(RDTextStats, {
      scope: testScope,
      outNode: outNode
    })

    await READING_DATA.run()

    let output = READING_DATA.data[testScope]

    EXPECT(output[outNode].wordcount).to.equal(testStringLength)
  })

  IT('should not add a wordcount metric if config.wordcount is false', async function () {
    let testScope = 'myArticle'
    let testString = 'This is a short article that needs analysing.'
    let textNode = 'text'
    let outNode = 'stats'
    let disabledMetric = 'wordcount'

    READING_DATA.preloadData({
      [testScope]: { [textNode]: testString }
    })

    READING_DATA.use(RDTextStats, {
      scope: testScope,
      outNode: outNode,
      [disabledMetric]: false
    })

    await READING_DATA.run()

    let output = READING_DATA.data[testScope]

    EXPECT(output[outNode]).to.not.have.property(disabledMetric)
  })

  IT('should add a language metric that matches the language of a string', async function () {
    let testScope = 'myArticle'
    let textNode = 'text'
    let outNode = 'stats'

    let languageTests = [
      ['eng', 'This is a short text in the English language.'],
      ['fra', 'Voici une histoire courte en français.'],
      ['deu', 'Los gehts mit einer kurzer Geschichte auf Deutsch.'],
      ['arb', 'هذا قصة قصيرة عربية']
    ]

    for (let test of languageTests) {
      let language = test[0]
      let testString = test[1]

      READING_DATA
        .uninstall()
        .clean()
        .preloadData({
          [testScope]: { [textNode]: testString }
        })
        .use(RDTextStats, {
          scope: testScope,
          outNode: outNode
        })

      await READING_DATA.run()

      let output = READING_DATA.data[testScope]

      EXPECT(output[outNode].language).to.equal(language)
    }
  })

  IT('should not add a language metric if config.language is false', async function () {
    let testScope = 'myArticle'
    let testString = 'This is a short article that needs analysing.'
    let textNode = 'text'
    let outNode = 'stats'
    let disabledMetric = 'language'

    READING_DATA.preloadData({
      [testScope]: { [textNode]: testString }
    })

    READING_DATA.use(RDTextStats, {
      scope: testScope,
      outNode: outNode,
      [disabledMetric]: false
    })

    await READING_DATA.run()

    let output = READING_DATA.data[testScope]

    EXPECT(output[outNode]).to.not.have.property(disabledMetric)
  })

  IT('should strip HTML tags before analysing text if config.stripHTML is true', async function () {
    let testScope = 'myArticle'
    let testString = '<p>This is a <em>short</em> article that <strong>needs tags removing</strong> before analysis.</p>'
    let testStringLength = 11
    let testStringLanguage = 'eng'
    let textNode = 'text'
    let outNode = 'stats'
    let metrics = ['wordcount', 'language']

    READING_DATA.preloadData({
      [testScope]: { [textNode]: testString }
    })

    READING_DATA.use(RDTextStats, {
      scope: testScope,
      textNode: textNode,
      outNode: outNode,
      stripHTML: true
    })

    await READING_DATA.run()

    let output = READING_DATA.data[testScope]

    EXPECT(output).to.have.property(textNode)
    EXPECT(output[textNode]).to.equal(testString)
    EXPECT(output).to.have.property(outNode)
    for (let metric of metrics) {
      EXPECT(output[outNode]).to.have.property(metric)
    }
    EXPECT(output[outNode].wordcount).to.equal(testStringLength)
    EXPECT(output[outNode].language).to.equal(testStringLanguage)
  })
})
