"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.any = "[\\s\\S]";
exports.capital = "[A-Z][a-zA-Z]*";
exports.space = "\\s+";
exports.newExp = function (exp, flags) {
    return new RegExp(exp, flags);
};
exports.globalize = function (exp) {
    return exp.global ? exports.newExp(exp) : exports.newExp(exp, 'g');
};
exports.esc = function (s) {
    return s.replace(/[-[\]{}()*+?.,\\^$|]/g, "\\$&");
};
exports.exec = function (exp, cb, str) {
    var _exp = exp;
    if (!_exp.global)
        _exp = exports.newExp(exp, 'g');
    var match;
    var i = 0;
    while ((match = _exp.exec(str)) !== null) {
        cb(match, i);
        i++;
    }
};
exports.map = function (exp, cb, str) {
    var output = [];
    exports.exec(exp, function (match, i) {
        output.push(cb(match, i));
    }, str);
    return output;
};
exports.matches = function (exp, str) {
    return exports.map(exp, function (m) { return m; }, str);
};
//# sourceMappingURL=re.js.map