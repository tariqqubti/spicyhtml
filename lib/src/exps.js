"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    slotExp: /__(.+?)__/g,
    literalExp: /(["'])((?:[^\1\\]|\\.)*?)(\1)/g,
    scriptExp: /(<script[^>]*>)([\s\S]*?)(<\/script>)/g,
    srcAttExp: /\ssrc\s*=/,
    styleExp: /(<style[^>]*>)([\s\S]*?)(<\/style>)/g,
    refTagExp: /<(\/)?(\w+\.|[A-Z]\w*)([\s\S]*?)(\/)?>/g,
    refTagPartsExp: /<(?<close>\/)?(?<name>[a-zA-Z][a-zA-Z0-9\_\.\-]*)(?<atts>\s+[^\/>]*)?(?<self>\/)?>/,
};
//# sourceMappingURL=exps.js.map