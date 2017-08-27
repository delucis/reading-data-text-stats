/**
 * @module reading-data-text-stats
 */

const STRIP = require('strip')
const COUNT = require('@iarna/word-count')
const FRANC = require('franc-min')

const ReadingDataTextStats = (function () {
  return {
    /**
     * Configuration object providing a default configuration to be
     * used by ReadingData#use()
     * @type {Object}
     * @prop {String} scope='textStats' - The scope this plugin’s data should be saved under on the ReadingData instance.
     * @prop {String} hooks='process'   - The hook on which this plugin should be called.
     * @prop {String} textNode='text'   - The property in the scope that contains the string to be analysed.
     * @prop {String} outNode='stats'   - The property to be added to the scope text statistics.
     * @prop {Boolean} stripHTML=false  - Whether or not the plugin should try to strip HTML tags from the input string.
     * @prop {Boolean} wordcount=true   - Whether or not the plugin should return how many words are in the input string.
     * @prop {Boolean} language=true    - Whether or not the plugin should return the language of the input string.
     */
    config: {
      scope: 'textStats',
      hooks: 'process',
      textNode: 'text',
      outNode: 'stats',
      stripHTML: false,
      wordcount: true,
      language: true
    },

    /**
     * Analyse a text node and add a node containing text statistics.
     * @param  {Object} pluginContext Context variables specific to this plugin.
     * @param  {Object} pluginContext.config This plugin’s configuration.
     * @param  {Object} pluginContext.data   Any data already stored by ReadingData under this plugin’s scope.
     * @param  {Object} context Contextual this passed from the ReadingData calling environment. Equivalent to the entire ReadingData instance.
     * @param  {Object} context.config Global configuration settings.
     * @param  {Object} context.data Data stored on the ReadingData instance.
     * @return {Object} Data to be stored by ReadingData under this plugin’s scope.
     */
    data: async function ({config, data}) {
      if (!data.hasOwnProperty(config.textNode)) {
        throw new Error('ReadingDataTextStats#data(): data doesn’t have a text node at ‘' + config.textNode + '’.')
      }
      let text = config.stripHTML ? STRIP(data[config.textNode]) : data[config.textNode]
      data[config.outNode] = {}
      if (config.wordcount) data[config.outNode].wordcount = COUNT(text)
      if (config.language) data[config.outNode].language = FRANC(text)
      return data
    }
  }
}())

module.exports = ReadingDataTextStats
