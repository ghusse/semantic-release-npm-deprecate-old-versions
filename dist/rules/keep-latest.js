"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keepLatest = void 0;
var rule_1 = require("../rule");
exports.keepLatest = function (version, allVersionsSortedLatestFirst) {
    if (version === allVersionsSortedLatestFirst[0]) {
        return { action: rule_1.Action.keep };
    }
    return { action: rule_1.Action.continue };
};
