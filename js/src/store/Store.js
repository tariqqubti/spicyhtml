"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var File_1 = require("./File");
var Store = /** @class */ (function () {
    function Store() {
        this.files = [];
    }
    Store.prototype.clear = function () {
        this.files = [];
    };
    Store.prototype.put = function (id) {
        var file = this.files
            .find(function (f) { return f.id === id; });
        if (!file) {
            file = new File_1.default(this, id);
            this.files.push(file);
        }
        return file;
    };
    Store.prototype.applyLiterals = function (src) {
        return this.files.reduce(function (acc, file) {
            return file.applyLiterals(acc);
        }, src);
    };
    Object.defineProperty(Store.prototype, "scripts", {
        get: function () {
            return '<script>\n' + this.files.reduce(function (acc, file) {
                return acc + file.scripts;
            }, '') + '</script>\n';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "styles", {
        get: function () {
            return '<style>\n' + this.files.reduce(function (acc, file) {
                return acc + file.styles;
            }, '') + '</style>\n';
        },
        enumerable: true,
        configurable: true
    });
    return Store;
}());
exports.default = Store;
//# sourceMappingURL=Store.js.map