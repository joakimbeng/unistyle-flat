'use strict';
var test = require('ava');
var flat = require('../src');

test('no nesting', function (assert) {
	assert.plan(1);
	var expected = {body: {marginTop: 0}};
	var actual = flat(expected);
	assert.same(actual, expected);
});

test('nested selectors', function (assert) {
	assert.plan(1);
	var actual = flat({ul: {li: {paddingLeft: 0}}});
	var expected = {'ul li': {paddingLeft: 0}};
	assert.same(actual, expected);
});

test('array', function (assert) {
	assert.plan(1);
	var actual = flat([{ul: {color: 'white'}}, {ul: {background: 'black'}}]);
	var expected = {ul: {color: 'white', background: 'black'}};
	assert.same(actual, expected);
});

test('nested selectors in multiple levels', function (assert) {
	assert.plan(1);
	var actual = flat({ul: {li: {span: {fontSize: '80%'}}}});
	var expected = {'ul li span': {fontSize: '80%'}};
	assert.same(actual, expected);
});

test('selectors with references', function (assert) {
	assert.plan(1);
	var actual = flat({ul: {'&.small': {fontSize: '50%'}}});
	var expected = {'ul.small': {fontSize: '50%'}};
	assert.same(actual, expected);
});

test('selectors in multiple levels with references', function (assert) {
	assert.plan(1);
	var actual = flat({div: {ul: {'&.small': {'& > li': {fontSize: '50%'}}}}});
	var expected = {'div ul.small > li': {fontSize: '50%'}};
	assert.same(actual, expected);
});

test('media queries', function (assert) {
	assert.plan(1);
	var actual = flat({'.item': {fontSize: '100%', '@media only screen and (max-width: 700px)': {fontSize: '50%'}}});
	var expected = {'.item': {fontSize: '100%'}, '@media only screen and (max-width: 700px)': {'.item': {fontSize: '50%'}}};
	assert.same(actual, expected);
});

test('psuedo selectors', function (assert) {
	assert.plan(1);
	var actual = flat({'.item': {':hover': {fontWeight: 'bold'}}});
	var expected = {'.item:hover': {fontWeight: 'bold'}};
	assert.same(actual, expected);
});

test('grouping of selectors', function (assert) {
	assert.plan(1);
	var actual = flat({'.item': {color: 'white'}, '.item2': {color: 'white', background: 'black'}});
	var expected = {'.item, .item2': {color: 'white'}, '.item2': {background: 'black'}};
	assert.same(actual, expected);
});

test('multiple selectors', function (assert) {
	assert.plan(1);
	var actual = flat({'.item, .item2': {':hover': {fontStyle: 'italic'}}});
	var expected = {'.item:hover, .item2:hover': {fontStyle: 'italic'}};
	assert.same(actual, expected);
});

test('@font-face', function (assert) {
	assert.plan(1);
	var actual = flat({'.item': {':hover': {fontStyle: 'italic', '@font-face': {fontFamily: 'verdana'}}}});
	var expected = {'.item:hover': {fontStyle: 'italic'}, '@font-face': {fontFamily: 'verdana'}};
	assert.same(actual, expected);
});

test('@font-faces', function (assert) {
	assert.plan(1);
	var actual = flat({'.item': {'@font-face': {fontFamily: 'verdana'}, 'color': 'white'}, '.item2': {'color': 'black', '@font-face': {fontFamily: 'tahoma'}}});
	var expected = {'@font-face': [{fontFamily: 'verdana'}, {fontFamily: 'tahoma'}], '.item': {color: 'white'}, '.item2': {color: 'black'}};
	assert.same(actual, expected);
});

test('@font-face array', function (assert) {
	assert.plan(1);
	var actual = flat({'@font-face': [{fontFamily: 'verdana'}, {fontFamily: 'tahoma'}]});
	var expected = {'@font-face': [{fontFamily: 'verdana'}, {fontFamily: 'tahoma'}]};
	assert.same(actual, expected);
});

test('array of @font-faces', function (assert) {
	assert.plan(1);
	var actual = flat([{'@font-face': {fontFamily: 'verdana'}}, {'@font-face': {fontFamily: 'tahoma'}}]);
	var expected = {'@font-face': [{fontFamily: 'verdana'}, {fontFamily: 'tahoma'}]};
	assert.same(actual, expected);
});

test('@keyframes', function (assert) {
	assert.plan(1);
	var actual = flat({'@keyframes': {test: {from: {background: 'white'}, to: {background: 'black'}}, test2: {from: {opacity: 0}, to: {opacity: 1}}}});
	var expected = {'@keyframes test': {from: {background: 'white'}, to: {background: 'black'}}, '@keyframes test2': {from: {opacity: 0}, to: {opacity: 1}}};
	assert.same(actual, expected);
});

test('nested at-rules', function (assert) {
	assert.plan(1);
	var actual = flat({'@supports (animation-name: blabla)': {'@keyframes': {test: {from: {background: 'white'}, to: {background: 'black'}}}}});
	var expected = {'@supports (animation-name: blabla)': {'@keyframes test': {from: {background: 'white'}, to: {background: 'black'}}}};
	assert.same(actual, expected);
});

test('selectors with commas but not as separator', function (assert) {
	assert.plan(1);
	var actual = flat({'div[data*=","]': {color: 'red'}});
	var expected = {'div[data*=","]': {color: 'red'}};
	assert.same(actual, expected);
});
