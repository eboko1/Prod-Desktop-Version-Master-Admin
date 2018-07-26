/* eslint-disable */
const buildPuzzle = require("./build_puzzle");
const consoleTable = require("./console_table");

const maxRow0 = 16;
const data0 = [
    { position: 0, quantity: 5 },
    { position: 1, quantity: 3 },
    { position: 2, quantity: 4 },
    { position: 4, quantity: 2 },
    { position: 7, quantity: 2 },
    { position: 7, quantity: 2 },
    { position: 7, quantity: 2 },
    { position: 7, quantity: 2 },
];

const puzzledData = buildPuzzle(data0, maxRow0);
consoleTable(puzzledData);
console.log(puzzledData);

export default puzzledData;
