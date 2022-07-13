"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.getAllSelectorFromCSS = exports.compileScss = exports.getAllClassNameFromHTML = void 0;
var path = require("path");
var fs = require("fs");
var glob = require("glob");
var sass = require("sass");
var jsdom_1 = require("jsdom");
var css_tree_1 = require("css-tree");
var getAllClassNameFromHTML = function (input) {
    var target = new jsdom_1.JSDOM(input);
    // TODO: 高級な API を用いず、直接 AST を探索する処理に変更
    var allQuery = Array.from(target.window.document.querySelectorAll('*'));
    var allClassList = new Set(allQuery.reduce(function (acc, cur) {
        return __spreadArray(__spreadArray([], __read(acc), false), __read(Array.from(cur.classList)), false);
    }, []));
    var result = __spreadArray([], __read(allClassList), false);
    return result;
};
exports.getAllClassNameFromHTML = getAllClassNameFromHTML;
var compileScss = function (target) {
    return sass.compileString(target).css;
};
exports.compileScss = compileScss;
// TODO: SCSS AST を直接解析する処理に変更
var getAllSelectorFromCSS = function (css) {
    var ast = (0, css_tree_1.parse)(css);
    // 必要な AST データのみに変換
    var parsedAST = JSON.parse(JSON.stringify(ast, ['children', 'type', 'prelude', 'name'])).children;
    // セレクタを保持した中間データを生成
    // TODO: DFS を用いた実装に変更
    var selectorWrapper = parsedAST
        .map(function (cur) {
        return cur.prelude.children[0].children;
    })
        .flat();
    // 重複なしのセレクタ配列を生成
    var selectors = __spreadArray([], __read(new Set(selectorWrapper.map(function (current) { return current.name; }))), false).sort();
    return selectors;
};
exports.getAllSelectorFromCSS = getAllSelectorFromCSS;
var main = function () {
    var _a = __read(process.argv, 4), firstArg = _a[2], secondArg = _a[3];
    if (!firstArg) {
        console.error('unknown input.');
        process.exit(1);
    }
    if (!secondArg) {
        console.error('unknown input.');
        process.exit(1);
    }
    if (secondArg.split('.')[-1] === 'scss') {
        console.error('unsupported format.');
        process.exit(1);
    }
    var htmlDir = firstArg;
    var scss = fs.readFileSync(secondArg, 'utf-8');
    var css = (0, exports.compileScss)(scss);
    var htmlFilesPath = glob.sync(path.resolve(htmlDir) + '/**/*.+' + '(html)');
    var htmlFiles = htmlFilesPath.map(function (path) { return fs.readFileSync(path, 'utf-8'); });
    var htmlSelectorList = htmlFiles.reduce(function (acc, cur) {
        return __spreadArray(__spreadArray([], __read(acc), false), __read((0, exports.getAllClassNameFromHTML)(cur)), false);
    }, []);
    var cssSelectorList = (0, exports.getAllSelectorFromCSS)(css);
    // CSS Selector のみに存在するデータの配列を生成
    var result = cssSelectorList.filter(function (index) { return htmlSelectorList.indexOf(index) === -1; });
    console.log(result);
};
main();
