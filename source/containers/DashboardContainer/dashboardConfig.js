const ROW_HEIGHT = 30;

const DragItemTypes = Object.freeze({
    EMPTY:    'empty',
    ORDER:    'order',
    DISABLED: 'disabled',
});

const ordersStatus = status => {
    switch (status) {
        case 'reserve':
            return 'var(--db_not_complete) ';
        case 'not_complete':
            return 'var(--db_reserve)';
        case 'required':
            return 'var(--db_required)';
        case 'approve':
            return 'var(--db_approve)';
        case 'progress':
            return 'var(--db_progress)';
        case 'success':
            return 'var(--db_success)';
        case 'cancel':
            return 'var(--db_cancel)';
        case 'invite':
            return 'var(--db_invite)';
        default:
            return '#ddd';
    }
};

export { ROW_HEIGHT, DragItemTypes, ordersStatus };
