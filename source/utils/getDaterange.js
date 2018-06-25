import moment from 'moment';

export const getDaterange = (daterange, iso = null) => {
    const setDaterangeDate = {
        yesterday:   { start: -1, end: -1 },
        today:       { start: 0, end: 0 },
        tomorrow:    { start: 1, end: 1 },
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
