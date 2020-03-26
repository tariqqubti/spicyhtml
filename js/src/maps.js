"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = function (cb, input) {
    var output = new Map();
    input.forEach(function (v, k) {
        var _a = cb(v, k), key = _a.key, val = _a.val;
        output.set(key, val);
    });
    return output;
};
exports.filter = function (cb, input) {
    var output = new Map();
    input.forEach(function (val, key) {
        if (cb(val, key) === true)
            output.set(key, val);
    });
    return output;
};
exports.clone = function (input) {
    return exports.map(function (val, key) { return ({ key: key, val: val }); }, input);
};
exports.merge = function () {
    var input = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        input[_i] = arguments[_i];
    }
    var merged = new Map();
    input.forEach(function (_map) {
        return _map.forEach(function (val, key) {
            return merged.set(key, val);
        });
    });
    return merged;
};
exports.reduce = function (cb, initial, input) {
    var output = initial;
    input.forEach(function (val, key) {
        output = cb(output, val, key);
    });
    return output;
};
exports.fromObj = function (obj) {
    var output = new Map();
    for (var key in obj) {
        if (!obj.hasOwnProperty(key))
            continue;
        output.set(key, obj[key]);
    }
    return output;
};
//# sourceMappingURL=maps.js.map