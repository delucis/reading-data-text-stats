# @delucis/reading-data-text-stats

[![Build Status](https://travis-ci.org/delucis/reading-data-text-stats.svg?branch=master)](https://travis-ci.org/delucis/reading-data-text-stats)
[![Coverage Status](https://coveralls.io/repos/github/delucis/reading-data-text-stats/badge.svg?branch=master)](https://coveralls.io/github/delucis/reading-data-text-stats?branch=master)
[![npm (scoped)](https://img.shields.io/npm/v/@delucis/reading-data-text-stats.svg)](https://www.npmjs.com/package/@delucis/reading-data-text-stats)

A plugin for [`@delucis/reading-data`](https://github.com/delucis/reading-data)
that processes a string of text returning statistics such as word count and
language.


## Installation

```sh
npm install --save @delucis/reading-data-text-stats
```


## Usage

```js
const RD = require('@delucis/reading-data')
const TEXT_STATS = require('@delucis/reading-data-text-stats')

RD.preloadData({
  myArticle: { text: 'This is a short article that needs analysing.' }
})

RD.use(TEXT_STATS, {
  scope: 'myArticle',
  textNode: 'text',     // where in the scope is the text to analyse
  outNode: 'stats'      // where in the scope should the output be saved
})

RD.run().then((res) => {
  console.log(res.data.myArticle.stats)
  // logs: { wordcount: 8, language: 'eng' }
})
```


## Options

name        | type               | default       | description
------------|--------------------|---------------|------------------------------
`hooks`     | `String`, `Object` | `'process'`   | The `reading-data` hook that should load the YAML file. Can be scoped by passing an object with scopes as keys, hooks as values.
`language`  | `Boolean`          | `true`        | Whether or not the plugin should return the language of the `textNode`.
`outNode`   | `String`           | `'stats'`     | The property to be added to the scope containing text statistics.
`scope`     | `String`, `Array`  | `'textStats'` | The scope under which `reading-data` will store this plugin’s data. Can be an array to return multiple filepaths/URLs, to multiple scopes.
`stripHTML` | `Boolean`          | `false`       | Whether or not the plugin should try to strip HTML tags from the `textNode`.
`textNode`  | `String`           | `'text'`      | The property in the `scope` that contains the string to be analysed.
`wordcount` | `Boolean`          | `true`        | Whether or not the plugin should return how many words are in the `textNode`.
