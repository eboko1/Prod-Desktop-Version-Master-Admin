const ROW_HEIGHT = 30;

const DragItemTypes = Object.freeze({
    EMPTY:    'empty',
    ORDER:    'order',
    DISABLED: 'disabled',
});

const ordersStatus = status => {
    switch (status) {
        case 'reserve':
            return 'var(--reserve)';
        case 'not_complete':
            return 'var(--required)';
        case 'required':
            return 'var(--required)';
        case 'approve':
            return 'var(--approve)';
        case 'progress':
            return 'var(--progress)';
        case 'success':
            return 'var(--success)';
        case 'cancel':
            return 'var(--cancel)';
        case 'invite':
            return 'var(--invite)';
        default:
            return '#ddd';
    }
};

export { ROW_HEIGHT, DragItemTypes, ordersStatus };
