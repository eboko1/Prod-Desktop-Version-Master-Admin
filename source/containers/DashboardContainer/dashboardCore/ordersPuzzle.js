// vendor
import { v4 } from 'uuid';
import _ from 'lodash';

const ordersPuzzle = (data, maxRow) => {
    function divideBoard(maxRow) {
        let blocks = []; // Local variable that stores puzzle configs

        return {
            getBlocks: () => {
                // Rows that blocks use
                const allBlockRows = _.flatten(
                    blocks.map(({ min, max }) =>
                        Array(max - min)
                            .fill(min)
                            .map((value, index) => value + index)),
                );
                // All rows
                const allRows = Array(maxRow)
                    .fill(0)
                    .map((value, index) => value + index);
                // Empty block configs
                const emptyRows = _.difference(
                    allRows,
                    allBlockRows,
                ).map(value => ({ min: value, max: value + 1, data: [] }));

                const newBlocks = [
                    ...blocks.map(block => ({
                        ...block,
                        data: block.data.map(item => ({
                            ...item,
                            position: item.position - block.min,
                        })),
                    })),
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
                        position >= min & position < max ||
                        min >= position & min < position + quantity,
                );

                if (areas.length) {
                    const maxPosition = position + quantity;
                    const area = {
                        data: [ ..._.flatten(_.map(areas, 'data')), { position, quantity, options }],
                        id:   v4(),
                        min:  Math.min(..._.map(areas, 'min'), position),
                        max:  Math.max(..._.map(areas, 'max'), maxPosition),
                    };

                    blocks.push(area);
                    // Exclude merged areas from blocks
                    blocks = blocks.filter(
                        ({ id }) => !_.map(areas, 'id').includes(id),
                    );
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

    function isPositionOccupiedByPuzzleItem(
        puzzleItems,
        requiredRows,
        requiredY,
    ) {
        for (const { x, y, rows, columns } of puzzleItems) {
            const allRows = Array(rows)
                .fill(x)
                .map((value, index) => value + index);
            const allColumns = Array(columns)
                .fill(y)
                .map((value, index) => value + index);

            if (
                allColumns.includes(requiredY) &&
                _.intersection(allRows, requiredRows).length
            ) {
                return true;
            }
        }

        return false;
    }

    function resizePuzzle({ result, maxBlocks, maxRows }) {
        _.each(result, item => {
            const { x, rows } = item;
            const allRows = Array(rows)
                .fill(x)
                .map((value, index) => value + index);
            while (
                item.columns + item.y < maxBlocks &&
                !isPositionOccupiedByPuzzleItem(
                    result,
                    allRows,
                    item.y + item.columns,
                )
            ) {
                ++item.columns;
            }
        });

        return { result, maxBlocks, maxRows };
    }

    function getPuzzle(data, min) {
        let maxBlocks = 1;
        let maxRows = 1;
        let result = [];

        const countOtherBlocks = (
            requestedX,
            requestedRows,
            requestedY,
            blocks,
            requestedColumns = 1,
        ) => {
            return blocks.filter(
                ({ x, rows, y, columns }) =>
                    !(requestedY >= y + columns) &&
                    !(requestedY + requestedColumns <= y) &&
                    !(requestedX >= x + rows) &&
                    !(requestedX + requestedRows <= x),
            ).length;
        };
        /* eslint-disable no-labels*/
        const sortedInputData = _.sortBy(data, [ 'position', 'quantity' ]);
        outer: for (const input of sortedInputData) {
            const { position, quantity, options } = input;
            maxRows = Math.max(maxRows, position + quantity);
            /* eslint-disable id-length */
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
                        options,
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
                options,
            });
        }

        result = resizePuzzle({ result, maxBlocks, maxRows }).result;

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

        result.sort(({ x: x1, y: y1 }, { x: x2, y: y2 }) => x1 - x2 || y1 - y2);

        return { result, maxBlocks, maxRows };
    }

    const blocksManagers = divideBoard(maxRow);
    data.forEach(blocksManagers.pushItem);
    const blocks = blocksManagers.getBlocks();

    return blocks.map(block => ({
        ...block,
        data: resizePuzzle(getPuzzle(block.data, block.min)),
    }));
};

export default ordersPuzzle;
