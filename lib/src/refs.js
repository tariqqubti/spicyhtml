"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var re = require("./re");
var exps_1 = require("./exps");
var msgs_1 = require("./msgs");
var tokenize = function (src) {
    return re.map(exps_1.default.refTagExp, function (match) {
        var full = match[0];
        var index = match.index;
        var len = full.length;
        var parts = full.match(exps_1.default.refTagPartsExp);
        var _a = parts.groups, name = _a.name, atts = _a.atts, close = _a.close, self = _a.self;
        return { index: index, len: len, name: name, atts: atts, close: close, self: self };
    }, src);
};
var Ref = /** @class */ (function () {
    function Ref(open, close) {
        this.open = open;
        this.close = close;
    }
    Object.defineProperty(Ref.prototype, "name", {
        get: function () {
            return this.open.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ref.prototype, "start", {
        get: function () {
            return this.open.index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ref.prototype, "end", {
        get: function () {
            if (this.close)
                return this.close.index + this.close.len;
            return this.open.index + this.open.len;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ref.prototype, "atts", {
        get: function () {
            var atts = new Map();
            if (!this.open.atts)
                return atts;
            var clean = this.open.atts.trim()
                .replace(/\s+=\s+/g, '=')
                .replace(/\s+/g, ' ');
            if (!clean)
                return atts;
            clean.split(' ').forEach(function (arr) {
                var _a = arr.split('='), key = _a[0], val = _a[1];
                if (key === '')
                    return;
                atts.set(key, typeof val === undefined ? 'true' : val);
            });
            return atts;
        },
        enumerable: true,
        configurable: true
    });
    Ref.prototype.inner = function (src) {
        if (!this.close)
            return '';
        return src.substring(this.open.index + this.open.len, this.close.index);
    };
    return Ref;
}());
var parse = function (tags) {
    var refs = [];
    var stack = [];
    tags.forEach(function (tag) {
        if (tag.self) {
            refs.push(new Ref(tag, null));
        }
        else if (tag.close) {
            var open_1 = stack.pop();
            if (!open_1 || open_1.name !== tag.name)
                throw new Error(msgs_1.default.missingOpenTag(tag.name));
            refs.push(new Ref(open_1, tag));
        }
        else {
            stack.push(tag);
        }
    });
    return refs;
};
exports.sorted = function (src) {
    var refs = parse(tokenize(src));
    return refs.sort(function (a, b) {
        if (a.start < b.start)
            return -1;
        if (a.start > b.start)
            return 1;
        return 0;
    });
};
exports.first = function (src) {
    var refs = parse(tokenize(src));
    if (!refs || !refs.length)
        return null;
    return refs.reduce(function (min, ref) {
        return ref.start < min.start ? ref : min;
    });
};
//# sourceMappingURL=refs.js.map