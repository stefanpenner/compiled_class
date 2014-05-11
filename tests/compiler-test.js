var assert = require('better-assert');
var astEqual = require('esprima-ast-equality');
var readFileSync = require('fs').readFileSync;

var compiler = require('./../compiler');

describe('foo', function() {
  it('is ok', function() {
    var actual = compiler.compile(readFileSync('./tests/fixtures/input.js'));
    var expected = readFileSync('./tests/fixtures/output.js');

    astEqual(actual, expected, 'expected input.js and output.js to match');
  });
});
