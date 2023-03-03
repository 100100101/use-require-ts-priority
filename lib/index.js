"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/// <reference types="node" />
const node_fs_1 = tslib_1.__importDefault(require("node:fs"));
const Module = require('node:module');
exports.default = () => {
    const originalRequire = Module.prototype.require;
    Module.prototype.require = function (name) {
        let isRequireTsFile = !!name.match(/.*\.ts$/);
        const isRequireJsFile = !!name.match(/.*\.js$/);
        if (isRequireJsFile) {
            const fullPathRequiredJsFile = Module._resolveFilename(name, this);
            const isJsFileExists = node_fs_1.default.existsSync(fullPathRequiredJsFile);
            if (isJsFileExists) {
                const replaceEntry = [/(.*)\.js$/, '$1.ts'];
                const fullPathRequiredTsFile = fullPathRequiredJsFile.replace(...replaceEntry);
                const isTsFileExists = node_fs_1.default.existsSync(fullPathRequiredTsFile);
                if (isTsFileExists) {
                    isRequireTsFile = true;
                    name = name.replace(...replaceEntry);
                }
            }
        }
        const requiredModule = originalRequire.call(this, name);
        if (isRequireTsFile) {
            return requiredModule.default;
        }
        return requiredModule;
    };
};
//# sourceMappingURL=index.js.map