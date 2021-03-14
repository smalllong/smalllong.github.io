var fs = require('fs')
var lodash = require('lodash')
var stylus = require('stylus')

console.log('watching stylus file changes in "styl"')
fs.watch('styl', lodash.debounce((eventType, filename) => {
  if (eventType == 'change' && filename.endsWith('.styl')) {
    stylus.render(fs.readFileSync('styl/'+filename, 'utf8'), {filename: 'styl/'+filename}, function(err, css) {
      fs.writeFileSync('css/'+filename.replace(/\.styl$/, '.css'), css, 'utf8')
      console.log(filename + ' updated at ' + (new Date()).toLocaleTimeString())
    })
  }
}, 500))