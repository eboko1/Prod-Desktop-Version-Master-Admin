

const _ = require('lodash');

module.exports = (data, maxRow) => {
    function divideBoard(maxRow) {
        const blocks = []; // Local variable that stores puzzle configs

        return {
            getBlocks: () => {
                // Rows that blocks use
                const allBlockRows = _.flatten(
                    blocks.map(({ min, max }) =>
                        Array(max - min)
                            .fill(0)
                            .map((v, index) => min + index)),
                );
                // All rows
                const allRows = Array(maxRow)
                    .fill(null)
                    .map((v, index) => index);
                // Empty block configs
                const emptyRows = _.difference(allRows, allBlockRows).map(
                    value => ({ min: value, max: value + 1, data: [] }),
                );

                const newBlocks = [
                    ...blocks.map(block => {
                        return {
                            ...block,
                            data: block.data.map(item => ({
                                ...item,
                                position: item.position - block.min,
                            })),
                        };
                    }),
                    ...emptyRows,
                ];
                newBlocks.sort((first, second) => first.min - second.min);

                return newBlocks;
            },
            pushItem: ({ position, quantity: initQuantity }) => {
                if (position >= maxRow) {
                    return;
                }
                const quantity =
                    position + initQuantity > maxRow
                        ? maxRow - position
                        : initQuantity;

                const area = blocks.find(
                    ({ min, max }) => position >= min && position < max,
                );
                if (area) {
                    area.max = Math.max(position + quantity, area.max);
                    area.data.push({ position, quantity });
                } else {
                    blocks.push({
                        min:  position,
                        max:  position + quantity,
                        data: [{ position, quantity }],
                    });
                }
            },
        };
    }

    function getPuzzle(data) {
        let maxBlocks = 1;
        let maxRows = 1;
        const result = [];

        const countOtherBlocks = (position, quantity, requestedY, blocks) => {
            return blocks.filter(
                ({ x, rows, y }) =>
                    requestedY === y &&
                    !(position >= x + rows) &&
                    !(position + quantity <= x),
            ).length;
        };

        const sortedInputData = _.sortBy(data, [ 'position', 'quantity' ]);
        outer: for (const input of sortedInputData) {
            const { position, quantity } = input;
            maxRows = Math.max(maxRows, position + quantity);
            for (let i = 0; i < maxBlocks; i++) {
                const overlappingBlocks = countOtherBlocks(
                    position,
                    quantity,
                    i,
                    result,
                );
                if (!overlappingBlocks) {
                    result.push({
                        x:       position,
                        y:       i,
                        columns: 1,
                        rows:    quantity,
                    });
                    continue outer;
                }
            }

            maxBlocks += 1;
            result.push({
                x:       position,
                y:       maxBlocks - 1,
                columns: 1,
                rows:    quantity,
                empty:   false,
            });
        }

        for (let y = 0; y < maxBlocks; y++) {
            for (let x = 0; x < maxRows; x++) {
                if (!countOtherBlocks(x, 1, y, result)) {
                    result.push({ x, y, columns: 1, rows: 1, empty: true });
                }
            }
        }

        return { result, maxBlocks, maxRows };
    }

    const blocksManagers = divideBoard(maxRow);
    data.forEach(blocksManagers.pushItem);
    const blocks = blocksManagers.getBlocks();

    // TODO normalize columns
    return blocks.map(block => ({ ...block, data: getPuzzle(block.data) }));
};
