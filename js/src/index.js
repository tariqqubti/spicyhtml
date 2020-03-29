"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var watcher = require("./watcher");
var refs = require("./refs");
var maps = require("./maps");
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
exports.Config = Config;
exports.watch = function (_a) {
    var _b = _a === void 0 ? new Config : _a, root = _b.root, entry = _b.entry, props = _b.props, output = _b.output;
    watcher.start(root, function () { return exports.build({ root: root, entry: entry, props: props, output: output }); });
};
exports.build = function (_a) {
    var _b = _a === void 0 ? new Config : _a, root = _b.root, entry = _b.entry, props = _b.props, output = _b.output;
    store.clear();
    store.root = root;
    if (typeof entry === 'string')
        entry = [entry];
    var srcs = [];
    entry.forEach(function (id) {
        var src = finish(compile(id, maps.fromObj(props)));
        srcs.push({ id: id, src: src });
    });
    if (typeof output === 'string') {
        srcs.forEach(function (_a) {
            var id = _a.id, src = _a.src;
            var outputPath = path.resolve(output, id + '.html');
            fs.writeFileSync(outputPath, src);
        });
    }
    else if (typeof output === 'function') {
        output(srcs.length === 1 ? srcs[0] : srcs);
    }
    else {
        if (srcs.length === 1)
            return srcs[0];
        return srcs;
    }
};
var compile = function (id, props) {
    var file = store.put(id);
    var instance = file.apply(props);
    var output = instance.src;
    var ref = refs.first(output);
    while (ref) {
        var atts = instance.applyLiteralsToAtts(ref.atts);
        var inner = ref.inner(output);
        if (atts.has('inner') && inner)
            atts.delete('inner');
        var merged = maps.merge(props, atts);
        if (!atts.has('inner'))
            merged.set('inner', instance.applyLiterals(inner));
        var built = compile(ref.name, merged);
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