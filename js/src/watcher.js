"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var chokidar = require("chokidar");
exports.start = function (root, fn) {
    console.log("Watching " + path.resolve(root) + "...");
    fn();
    var watcher = chokidar.watch(root, {
        awaitWriteFinish: {
            stabilityThreshold: 500,
            pollInterval: 100,
        }
    });
    var timeoutId;
    watcher.on('change', function (path) {
        if (!timeoutId)
            console.log('Rebuilding...');
        console.log(path + " changed");
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
            fn();
            timeoutId = null;
        }, 200);
    });
};
//# sourceMappingURL=watcher.js.map