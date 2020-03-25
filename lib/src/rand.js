"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = function (from) {
    return from.charAt(Math.floor(Math.random() * from.length));
};
exports.str = function (len, alpha, numbers, special) {
    if (alpha === void 0) { alpha = true; }
    if (numbers === void 0) { numbers = true; }
    if (special === void 0) { special = false; }
    var output = '';
    var domain = '';
    if (alpha)
        domain += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (numbers)
        domain += '0123456789';
    if (special)
        domain += '!@#$%^&';
    for (var i = 0; i < len; i++)
        output += exports.pick(domain);
    return output;
};
//# sourceMappingURL=rand.js.map