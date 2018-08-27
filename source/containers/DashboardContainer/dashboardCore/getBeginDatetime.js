import moment from 'moment';

const getBeginDatetime = (day, time, beginHour) => {
    const orderHour = time + beginHour * 2;

    const timeString =
        orderHour % 2
            ? `${Math.floor(orderHour / 2)}:30`
            : `${orderHour / 2}:00`;

    return moment(`${day} ${timeString}`);
};

export default getBeginDatetime;
