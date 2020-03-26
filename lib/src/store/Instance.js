"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rand = require("../rand");
var exps_1 = require("../exps");
var Instance = /** @class */ (function () {
    function Instance(file, props) {
        var _this = this;
        this.file = file;
        this.literalsList = [];
        this.scriptsList = [];
        this.stylesList = [];
        this.src = file.content;
        this.src = this.src
            .replace(exps_1.default.slotExp, function (full, key) {
            return props.has(key) ? props.get(key) : full;
        });
        this.src = this.src
            .replace(exps_1.default.scriptExp, function (full, tag, inner) {
            if (exps_1.default.srcAttExp.test(full))
                return full;
            _this.scriptsList.push(inner);
            return '';
        });
        this.src = this.src
            .replace(exps_1.default.styleExp, function (full, tag, inner) {
            _this.stylesList.push(inner);
            return '';
        });
        this.src = this.src
            .replace(exps_1.default.literalExp, function (full, q, inner) {
            var marker = "__" + file.id + "-" + rand.str(13) + "__";
            _this.literalsList.push({ marker: marker, full: full, inner: inner });
            return marker;
        });
    }
    // Smelly onlyInner?
    Instance.prototype.applyLiterals = function (src, onlyInner) {
        if (onlyInner === void 0) { onlyInner = false; }
        return this.literalsList.reduce(function (acc, _a) {
            var marker = _a.marker, full = _a.full, inner = _a.inner;
            var exp = new RegExp(marker, 'g');
            if (!exp.test(acc))
                return acc;
            return acc.replace(exp, onlyInner ? inner : full);
        }, src);
    };
    Instance.prototype.applyLiteralsToAtts = function (atts) {
        var _this = this;
        var copy = new Map();
        atts.forEach(function (val, key) {
            return copy.set(key, _this.applyLiterals(val, true));
        });
        return copy;
    };
    Object.defineProperty(Instance.prototype, "scripts", {
        get: function () {
            return this.scriptsList.reduce(function (acc, script) {
                return acc + ("(function() {\n" + script + "\n})();\n");
            }, '');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Instance.prototype, "styles", {
        get: function () {
            return this.stylesList.reduce(function (acc, style) {
                return acc + style;
            }, '');
        },
        enumerable: true,
        configurable: true
    });
    return Instance;
}());
exports.default = Instance;
//# sourceMappingURL=Instance.js.map