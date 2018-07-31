const {v4} = require('uuid');
const _ = require('lodash');

module.exports = (data, maxRow) => {
    function divideBoard(maxRow) {
        let blocks = []; // Local variable that stores puzzle configs

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
            pushItem: ({ position, quantity: initQuantity, options }) => {
                if (position >= maxRow) {
                    return;
                }
                const quantity =
                    position + initQuantity > maxRow
                        ? maxRow - position
                        : initQuantity;

                const areas = blocks.filter(
                    ({ min, max }) =>
                        ( position >= min & position < max ) ||
                        ( min >= position & min < position + quantity ),
                );

                if (areas.length) {
                    const area = {};
                    area.max = Math.max(..._.map(areas, 'max'), position + quantity);
                    area.min = Math.min(..._.map(areas, 'min'), position);
                    area.data = [];
                    area.id = v4();
                    area.data.push(..._.flatten(_.map(areas, 'data')));
                    area.data.push({ position, quantity, options });

                    blocks.push(area);
                    blocks = blocks.filter(({id}) => !_.map(areas, 'id').includes(id));
                } else {
                    blocks.push({
                        id:   v4(),
                        min:  position,
                        max:  position + quantity,
                        data: [{ position, quantity, options }],
                    });
                }
            },
        };
    }

    function getPuzzle(data, min) {
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
                        x:              position,
                        y:              i,
                        columns:        1,
                        rows:           quantity,
                        globalPosition: position + min,
                    });
                    continue outer;
                }
            }

            maxBlocks += 1;
            result.push({
                x:              position,
                y:              maxBlocks - 1,
                columns:        1,
                rows:           quantity,
                empty:          false,
                globalPosition: position + min,
            });
        }

        for (let y = 0; y < maxBlocks; y++) {
            for (let x = 0; x < maxRows; x++) {
                if (!countOtherBlocks(x, 1, y, result)) {
                    result.push({
                        x,
                        y,
                        columns:        1,
                        rows:           1,
                        empty:          true,
                        globalPosition: x + min,
                    });
                }
            }
        }

        return { result, maxBlocks, maxRows };
    }

    const blocksManagers = divideBoard(maxRow);
    data.forEach(blocksManagers.pushItem);
    const blocks = blocksManagers.getBlocks();

    // TODO normalize columns
    return blocks.map(block => ({
        ...block,
        data: getPuzzle(block.data, block.min),
    }));
};
