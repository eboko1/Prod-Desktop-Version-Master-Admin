import moment from 'moment';

export const getDaterange = (daterange, iso = null) => {
    const setDaterangeDate = {
        yesterday:   { start: -1, end: -1 },
        today:       { start: 0, end: 0 },
        tomorrow:    { start: 0, end: 1 },
        prevWeek:    { srart: -7, end: 0 },
        nextWeek:    { start: 0, end: 7 },
        prevMonth:   { start: -30, end: -1 },
        nextMonth:   { start: 0, end: 30 },
        prevQuarter: { start: -90, end: 0 },
        nextQuarter: { start: 0, end: 90 },
        prevYear:    { start: -365, end: 0 },
        nextYear:    { start: 0, end: 365 },
    };

    const { start, end } = setDaterangeDate[ daterange ];
    const startDate = moment().add(start, 'day');
    const endDate = moment().add(end, 'day');

    return iso
        ? {
            startDate: startDate.startOf('day').toISOString(),
            endDate:   endDate.endOf('day').toISOString(),
        }
        : {
            startDate: startDate.format('YYYY-MM-DD'),
            endDate:   endDate.format('YYYY-MM-DD'),
        };
};

// eslint-disable-next-line
// let startDate;
// let startDate = moment()
//     .startOf('day')
//     .format('YYYY-MM-DD');
// let endDate = moment()
//     .add(-1, 'day')
//     .endOf('day')
//     .format('YYYY-MM-DD');

// switch (daterange) {
//     case 'yestarday':
//         startDate = moment()
//             .add(-1, 'day')
//             .startOf('day')
//             .format('YYYY-MM-DD');
//         break;
//     case 'today':
//     case 'day':
//         startDate = moment()
//             .startOf('day')
//             .format('YYYY-MM-DD');
//         endDate = moment()
//             .endOf('day')
//             .format('YYYY-MM-DD');
//         break;
//     case 'tomorrow':
//         startDate = moment()
//             .add(1, 'day')
//             .startOf('day')
//             .format('YYYY-MM-DD');
//         endDate = moment()
//             .add(1, 'day')
//             .endOf('day')
//             .format('YYYY-MM-DD');
//         break;
//     case 'prevWeek':
//         startDate = moment()
//             .add(-7, 'day')
//             .startOf('day')
//             .format('YYYY-MM-DD');
//         break;
//     case 'prevMonth':
//         startDate = moment()
//             .add(-30, 'day')
//             .startOf('day')
//             .format('YYYY-MM-DD');
//         break;
//     case 'prevQuarter':
//         startDate = moment()
//             .add(-3, 'month')
//             .format('YYYY-MM-DD');
//         break;
//     case 'prevYear':
//         startDate = moment()
//             .add(-1, 'year')
//             .format('YYYY-MM-DD');
//         break;
//     case 'nextWeek':
//         endDate = moment()
//             .add(7, 'day')
//             .startOf('day')
//             .format('YYYY-MM-DD');
//         break;
//     case 'nextMonth':
//         endDate = moment()
//             .add(30, 'day')
//             .startOf('day')
//             .format('YYYY-MM-DD');
//         break;
//     case 'nextQuarter':
//         endDate = moment()
//             .add(3, 'month')
//             .format('YYYY-MM-DD');
//         break;
//     case 'nextYear':
//         endDate = moment()
//             .add(1, 'year')
//             .format('YYYY-MM-DD');
//         break;
//     default:
//         endDate = moment()
//             .add(-1, 'day')
//             .startOf('day')
//             .format('YYYY-MM-DD');
//         break;
// }
//
// return {
//     startDate,
//     endDate,
// };
