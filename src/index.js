'use strict';
var splitSelectors = require('split-css-selector');
var assign = require('object-assign');

var PSUEDO_WITHOUT_SELECTOR = /(^|\s)(:{1,2})(\w)/g;
var REFERENCE_SELECTOR = /&/g;
var NESTABLE_AT_RULE = /@\S*\b(media|supports|keyframes)\b/;

module.exports = function flat(obj) {
	var rules = getRules(obj);

	var byPropVal = groupByPropertyAndValue(rules);

	return rebuildObject(byPropVal);
};

function rebuildObject(grouped) {
	return Object.keys(grouped).reduce(function (style, loc) {
		return Object.keys(grouped[loc]).reduce(function (style, propVal) {
			var rule = grouped[loc][propVal];
			var location = rule.location.concat(rule.selectors.join(', '));
			location.reduce(function (style, selector, i, arr) {
				if (!selector) {
					style[rule.property] = rule.value;
					return style;
				}
				var r = {};
				if (i === arr.length - 1) {
					r[rule.property] = rule.value;
				}
				style[selector] = assign({}, style[selector], r);
				return style[selector];
			}, style);
			return style;
		}, style);
	}, {});
}

function groupByPropertyAndValue(rules) {
	var byPropVal = {};
	for (var i = 0, len = rules.length; i < len; i++) {
		var rule = rules[i];
		if (!byPropVal[rule.location]) {
			byPropVal[rule.location] = {};
		}
		if (!byPropVal[rule.location][rule.property + rule.value]) {
			byPropVal[rule.location][rule.property + rule.value] = {
				location: rule.location,
				selectors: [rule.selector],
				property: rule.property,
				value: rule.value
			};
		} else {
			byPropVal[rule.location][rule.property + rule.value].selectors.push(rule.selector);
		}
	}
	return byPropVal;
}

function getRules(obj, parents, location) {
	parents = parents || [];
	location = location || [];
	return Object.keys(obj).reduce(function (result, selectors) {
		return splitSelectors(selectors).reduce(function (res, selector) {
			return res.concat(visit(selector, obj[selectors], parents.slice(), location.slice()));
		}, result);
	}, []);
}

function visit(selector, value, parents, location) {
	var next = selector;
	if (parents.length) {
		next = next.replace(PSUEDO_WITHOUT_SELECTOR, '$1&$2$3');
		if (hasReference(next)) {
			next = next.replace(REFERENCE_SELECTOR, parents.pop());
		}
	}
	if (typeof value === 'object' && !Array.isArray(value)) {
		var nestable = isNestable(selector);
		if (nestable) {
			location = location.concat(selector);
		} else if (isAtRule(selector)) {
			parents = [next];
			location = [];
		} else if (location.length && isNestable(location[location.length - 1]) && location[location.length - 1].indexOf(' ') === -1) {
			location[location.length - 1] += ' ' + selector;
		} else {
			parents = parents.concat(next);
		}
		return getRules(value, parents, location);
	}
	return {location: location, selector: parents.join(' '), property: selector, value: value};
}

function hasReference(selector) {
	return selector.indexOf('&') !== -1;
}

function isAtRule(selector) {
	return selector.indexOf('@') === 0;
}

function isNestable(selector) {
	return isAtRule(selector) && NESTABLE_AT_RULE.test(selector);
}
