"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertAt = function (insertion, src, start, end) {
    if (end === void 0) { end = start; }
    return src.substring(0, start) + insertion + src.substring(end);
};
//# sourceMappingURL=str.js.map