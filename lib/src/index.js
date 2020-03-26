"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var watcher = require("./watcher");
var refs = require("./refs");
var maps = require("./maps");
var arr = require("./arr");
var str = require("./str");
var msgs_1 = require("./msgs");
var Store_1 = require("./store/Store");
// Singleton across builds, clears cache on watch
var store = new Store_1.default;
var Config = /** @class */ (function () {
    function Config() {
        this.root = 'src';
        this.entry = 'index';
        this.props = {};
        this.output = 'dist';
    }
    return Config;
}());
exports.watch = function (_a) {
    var root = _a.root, entry = _a.entry, props = _a.props, output = _a.output;
    watcher.start(root, function () { return exports.build({ root: root, entry: entry, props: props, output: output }); });
};
exports.build = function (_a) {
    var _b = _a === void 0 ? new Config : _a, root = _b.root, entry = _b.entry, props = _b.props, output = _b.output;
    store.clear();
    store.root = root;
    if (typeof entry === 'string')
        entry = [entry];
    entry.forEach(function (id) {
        var src = finish(compile(id, maps.fromObj(props)));
        var outputPath = path.resolve(output, arr.last(id.split('.')));
        fs.writeFileSync(outputPath + '.html', src);
    });
};
var compile = function (id, props) {
    var file = store.put(id);
    var instance = file.apply(props);
    var output = instance.src;
    var ref = refs.first(output);
    while (ref) {
        var atts = instance.applyLiteralsToAtts(ref.atts);
        var merged = maps.merge(props, atts);
        var built = compile(ref.name, merged);
        built = built.replace(/__inner__/g, ref.inner(output));
        output = str.insertAt(built, output, ref.start, ref.end);
        ref = refs.first(output);
    }
    return output;
};
var finish = function (src) {
    var output = src;
    var head = output.indexOf('</head');
    if (head === -1) {
        console.warn(msgs_1.default.noHeadTag);
        head = 0;
    }
    output = str.insertAt(store.styles, output, head);
    var body = output.indexOf('</body');
    if (body === -1) {
        console.warn(msgs_1.default.noBodyTag);
        body = output.length - 1;
    }
    output = str.insertAt(store.scripts, output, body);
    return store.applyLiterals(output);
};
//# sourceMappingURL=index.js.map