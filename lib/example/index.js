"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var src_1 = require("../src");
var config = {
    root: 'example',
    entry: ['pages.index', 'pages.about'],
    props: {
        author: 'Tariq Qubti',
        primary: '#eee',
        secondary: '#f44',
    },
    /**
     * TODO: Check output dir is outside root
     * to prevent infinite loop
     */
    output: path.resolve('example_out'),
};
src_1.watch(config);
//# sourceMappingURL=index.js.map