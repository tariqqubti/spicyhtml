"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var arr = require("../arr");
var Instance_1 = require("./Instance");
var File = /** @class */ (function () {
    function File(store, id) {
        this.id = id;
        this.instances = [];
        var parts = id.split('.');
        var rel = parts.slice(0, -1);
        this.name = arr.last(parts) + '.html';
        this.path = path.resolve.apply(path, __spreadArrays([store.root], rel, [this.name]));
        if (!fs.existsSync(this.path))
            throw new Error("File " + this.path + " not found");
        this.content = fs.readFileSync(this.path, 'utf8');
    }
    File.prototype.apply = function (props) {
        var instance = new Instance_1.default(this, props);
        this.instances.push(instance);
        return instance;
    };
    File.prototype.applyLiterals = function (src) {
        return this.instances.reduce(function (acc, instance) {
            return instance.applyLiterals(acc);
        }, src);
    };
    Object.defineProperty(File.prototype, "scripts", {
        get: function () {
            var scripts = this.instances[0].scripts;
            if (!scripts)
                return '';
            return "/* " + this.id + " */\n" + scripts;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "styles", {
        get: function () {
            var styles = this.instances[0].styles;
            if (!styles)
                return '';
            return "/* " + this.id + " */\n" + styles;
        },
        enumerable: true,
        configurable: true
    });
    return File;
}());
exports.default = File;
//# sourceMappingURL=File.js.map