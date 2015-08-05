var path = require('path'),
    unify = require('fayde-unify'),
    JsonFile = unify.JsonFile,
    Library = unify.Library;

module.exports = function (config) {
    config = config || {};
    config.basePath = config.basePath || "";
    if (config.unifyPath == null) {
        config.unifyPath = config.basePath;
        if (!config.unifyPath)
            config.unifyPath = path.join(process.cwd(), 'unify.json');
    }
    config.includeSelf = config.includeSelf !== false;
    config.includeDevSelf = config.includeDevSelf !== false;
    return getAllTypings(config);
};


function getAllTypings(config) {
    var unify = new JsonFile(config.unifyPath);
    var typings = getTypings(config.basePath, unify, !!config.includeSelf, !!config.includeDevSelf);

    var lib = new Library(unify);
    var bowerFile = lib.bower.file;
    if (!bowerFile.exists) {
        return typings;
    }

    var deps = unique(getAllDependencies(lib));
    var allTypings = deps
        .reduce(function (agg, cur) {
            return agg.concat(getTypings(config.basePath, cur.unify, true, false));
        }, typings);
    return allTypings;
}

function getTypings(basePath, unify, includeSelf, includeDev) {
    if (!unify.exists) {
        return [];
    }

    unify.loadSync();
    var typings = [];
    if (includeSelf)
        typings = typings.concat(unify.getValue('typings') || []);
    if (includeDev)
        typings = typings.concat(unify.getValue('devTypings') || []);
    var unifyDir = path.resolve(path.dirname(unify.path));
    var rv = typings.map(function (typing) {
        return path.relative(basePath, path.join(unifyDir, typing));
    });
    return rv;
}

function getAllDependencies(sourceLib, lib) {
    return (lib || sourceLib).dependencies.lib()
        .reduce(function (agg, cur) {
            var curlib = sourceLib.createDependent(cur);
            agg.push(curlib);
            return agg
                .concat([curlib])
                .concat(getAllDependencies(sourceLib, curlib));
        }, []);
}

function unique(arr) {
    return arr.reduce(function (agg, cur) {
        return (agg.some(function (check) {
            return check.name === cur.name;
        })) ? agg : agg.concat([cur]);
    }, []);
}