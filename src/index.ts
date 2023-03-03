/// <reference types="node" />
import fs from 'node:fs'
const Module = require('node:module')
export default () => {
    const originalRequire = Module.prototype.require
    Module.prototype.require = function (name) {
        let isRequireTsFile = !!name.match(/.*\.ts$/)
        const isRequireJsFile = !!name.match(/.*\.js$/)
        if (isRequireJsFile) {
            const fullPathRequiredJsFile = Module._resolveFilename(name, this)
            const isJsFileExists = fs.existsSync(fullPathRequiredJsFile)
            if (isJsFileExists) {
                const replaceEntry = [/(.*)\.js$/, '$1.ts']
                const fullPathRequiredTsFile = fullPathRequiredJsFile.replace(
                    ...replaceEntry
                )
                const isTsFileExists = fs.existsSync(fullPathRequiredTsFile)
                if (isTsFileExists) {
                    isRequireTsFile = true
                    name = name.replace(...replaceEntry)
                }
            }
        }
        const requiredModule = originalRequire.call(this, name)

        if (isRequireTsFile) {
            return requiredModule.default
        }

        return requiredModule
    }
}
