import moment from 'moment';

export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function getDaterangeDates(daterange) {
    // eslint-disable-next-line
    let startDate;
    let endDate = moment()
        .add(-1, 'day')
        .endOf('day')
        .format('YYYY-MM-DD');

    switch (daterange) {
        case 'today':
        case 'day':
            startDate = moment()
                .add(-1, 'day')
                .startOf('day')
                .format('YYYY-MM-DD');
            break;
        case 'tomorrow':
            startDate = moment()
                .startOf('day')
                .format('YYYY-MM-DD');
            endDate = moment(+1, 'day')
                .endOf('day')
                .format('YYYY-MM-DD');
            break;

        case 'week':
            startDate = moment()
                .add(-7, 'day')
                .startOf('day')
                .format('YYYY-MM-DD');
            break;
        case 'month':
            startDate = moment()
                .add(-30, 'day')
                .startOf('day')
                .format('YYYY-MM-DD');
            break;
        case 'quarter':
            startDate = moment()
                .add(-3, 'month')
                .format('YYYY-MM-DD');
            break;
        case 'year':
            startDate = moment()
                .add(-1, 'year')
                .format('YYYY-MM-DD');
            break;
        default:
            startDate = moment()
                .add(-1, 'day')
                .startOf('day')
                .format('YYYY-MM-DD');
            break;
    }

    return {
        startDate,
        endDate,
    };
}
