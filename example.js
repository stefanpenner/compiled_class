var compiler = require('./compiler');
var fs = require('fs');


//console.log(compiler.compile(fs.readFileSync('./tests/fixtures/input.js')));
console.log(compiler.compile(fs.readFileSync('./input.js')));
