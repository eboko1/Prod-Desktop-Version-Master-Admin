// const _ = require('lodash');
// const { table } = require('table');
//
// const data0 = [{ position: 0, quantity: 5 }, { position: 1, quantity: 3 }, { position: 2, quantity: 4 }, { position: 4, quantity: 2 }, { position: 6, quantity: 2 }, { position: 6, quantity: 2 }, { position: 6, quantity: 2 }, { position: 6, quantity: 2 }];
//
// let maxBlocks = 1;
// let maxRows = 1;
// const result = [];
//
// const countOtherBlocks = (position, quantity, requestedY, blocks) => {
//     return blocks.filter(
//         ({ x, rows, y }) =>
//             requestedY === y &&
//             !(position >= x + rows) &&
//             !(position + quantity <= x),
//     ).length;
// };
//
// const sortedInputData = _.sortBy(data0, [ 'position', 'quantity' ]);
// outer: for (let input of sortedInputData) {
//     const { position, quantity } = input;
//     maxRows = Math.max(maxRows, position + quantity);
//     for (let i = 0; i < maxBlocks; i++) {
//         const overlappingBlocks = countOtherBlocks(
//             position,
//             quantity,
//             i,
//             result,
//         );
//         if (!overlappingBlocks) {
//             result.push({ x: position, y: i, columns: 1, rows: quantity });
//             continue outer;
//         }
//     }
//
//     maxBlocks += 1;
//     result.push({ x: position, y: maxBlocks - 1, columns: 1, rows: quantity });
// }
//
// // TODO normalize columns
//
// console.log(result);
// const tableData = Array(maxRows)
//     .fill(1)
//     .map(() => Array(maxBlocks).fill(' '));
// _.each(result, ({ x, y, columns, rows }, index) => {
//     for (let i = x; i < x + rows; i++) {
//         for (let j = y; j < y + columns; j++) {
//             tableData[ i ][ j ] = index + 1;
//         }
//     }
// });
//
// console.log(tableData);
// const output = table(tableData);
//
// console.log(output);
