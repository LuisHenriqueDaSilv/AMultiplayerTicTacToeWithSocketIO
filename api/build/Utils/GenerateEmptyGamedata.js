"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateEmptyGamedata() {
    var newGamedata = [];
    for (var counter = 0; counter < 9; counter++) {
        newGamedata.push({
            id: counter,
            value: 'empty'
        });
    }
    return newGamedata;
}
exports.default = generateEmptyGamedata;
