
/* eslint-disable */
const _ = require("lodash");
const { table } = require("table");

module.exports = blocks => {
    for (const block of blocks) {
        const {
            data: { maxBlocks, result, maxRows },
        } = block;
        const tableData = Array(maxRows)
            .fill(1)
            .map(() => Array(maxBlocks).fill(" "));
        _.each(result, ({ x, y, columns, rows }, index) => {
            for (let i = x; i < x + rows; i++) {
                for (let j = y; j < y + columns; j++) {
                    tableData[i][j] = index + 1;
                }
            }
        });

        console.log(tableData);
        const output = table(tableData);

        console.log(output);
    }
};
