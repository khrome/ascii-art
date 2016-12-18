/*
    author: sindresorhus@gmail.com
    url: https://github.com/chalk/chalk/blob/05f87e25e108726ee469aa56cc88fcc160a911ed/test.js
    license: MIT
    license_url: https://github.com/chalk/chalk/blob/cf7eb2d0c7ac20ad6864773451dd59210e7a4612/license
*/
'use strict';
var assert = require('assert');
var requireUncached = require('require-uncached');
var resolveFrom = require('resolve-from');
var semver = require('semver');
var chalk = require('../../kaolin');

describe('chalk', function () {
	it('should style string', function () {
		assert.equal(chalk.underline('foo'), '\u001b[4mfoo\u001b[24m');
		assert.equal(chalk.red('foo'), '\u001b[31mfoo\u001b[39m');
		assert.equal(chalk.bgRed('foo'), '\u001b[41mfoo\u001b[49m');
	});

	it('should support applying multiple styles at once', function () {
		assert.equal(chalk.red.bgGreen.underline('foo'), '\u001b[31m\u001b[42m\u001b[4mfoo\u001b[24m\u001b[49m\u001b[39m');
		assert.equal(chalk.underline.red.bgGreen('foo'), '\u001b[4m\u001b[31m\u001b[42mfoo\u001b[49m\u001b[39m\u001b[24m');
	});

	it('should support nesting styles', function () {
		assert.equal(
			chalk.red('foo' + chalk.underline.bgBlue('bar') + '!'),
			'\u001b[31mfoo\u001b[4m\u001b[44mbar\u001b[49m\u001b[24m!\u001b[39m'
		);
	});

	it('should support nesting styles of the same type (color, underline, bg)', function () {
		assert.equal(
			chalk.red('a' + chalk.yellow('b' + chalk.green('c') + 'b') + 'c'),
			'\u001b[31ma\u001b[33mb\u001b[32mc\u001b[33mb\u001b[31mc\u001b[39m'
		);
	});

	it('should reset all styles with `.reset()`', function () {
		assert.equal(chalk.reset(chalk.red.bgGreen.underline('foo') + 'foo'), '\u001b[0m\u001b[31m\u001b[42m\u001b[4mfoo\u001b[24m\u001b[49m\u001b[39mfoo\u001b[0m');
	});

	it('should be able to cache multiple styles', function () {
		var red = chalk.red;
		var green = chalk.green;
		var redBold = red.bold;
		var greenBold = green.bold;

		assert.notEqual(red('foo'), green('foo'));
		assert.notEqual(redBold('bar'), greenBold('bar'));
		assert.notEqual(green('baz'), greenBold('baz'));
	});

	it('should alias gray to grey', function () {
		assert.equal(chalk.grey('foo'), '\u001b[90mfoo\u001b[39m');
	});

	it('should support variable number of arguments', function () {
		assert.equal(chalk.red('foo', 'bar'), '\u001b[31mfoo bar\u001b[39m');
	});

	it('should support falsy values', function () {
		assert.equal(chalk.red(0), '\u001b[31m0\u001b[39m');
	});

	it('shouldn\'t output escape codes if the input is empty', function () {
		assert.equal(chalk.red(), '');
		assert.equal(chalk.red.blue.black(), '');
	});

	it('should keep Function.prototype methods', function () {
		assert.equal(chalk.grey.apply(null, ['foo']), '\u001b[90mfoo\u001b[39m');
		assert.equal(chalk.reset(chalk.red.bgGreen.underline.bind(null)('foo') + 'foo'), '\u001b[0m\u001b[31m\u001b[42m\u001b[4mfoo\u001b[24m\u001b[49m\u001b[39mfoo\u001b[0m');
		assert.equal(chalk.red.blue.black.call(null), '');
	});

	it('line breaks should open and close colors', function () {
		assert.equal(chalk.grey('hello\nworld'), '\u001b[90mhello\u001b[39m\n\u001b[90mworld\u001b[39m');
	});
});