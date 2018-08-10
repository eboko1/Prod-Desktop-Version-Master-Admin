const ROW_HEIGHT = 30;

const DragItemTypes = Object.freeze({
    EMPTY: 'empty',
    ORDER: 'order',
});

const findOrder = (orders, id) => {
    // const order = orders.map(
    //     order => order.filter(order => order.id === id)[ 0 ],
    // );

    return {
        order,
        index: orders.indexOf(order),
    };
};

const moveOrder = (id, atIndex) => {
    const { order, index } = findOrder(orders, id);
    // this.setState(
    //     update(this.state, {
    //         orders: {
    //             $splice: [[ index, 1 ], [ atIndex, 0, order ]],
    //         },
    //     }),
    // );
};

export { ROW_HEIGHT, DragItemTypes, findOrder };
