"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var src_1 = require("../src");
var config = {
    root: 'example',
    entry: ['pages.index', 'pages.about'],
    props: {
        author: 'Tariq Qubti',
        primary: '#333',
        secondary: '#e33',
    },
    output: path.resolve('example', '_out'),
};
src_1.build(config);
//# sourceMappingURL=index.js.map